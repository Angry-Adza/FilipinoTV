import { STREAMS } from "./streams.js";

let hlsInstance = null;
let wasmPlayer = null;

const videoEl = document.getElementById("video");
const canvasEl = document.getElementById("wasmCanvas");
const currentTitleEl = document.getElementById("current-title");

const btnPlayPause = document.getElementById("btn-play-pause");
const btnSpeedDown = document.getElementById("btn-speed-down");
const btnSpeedNormal = document.getElementById("btn-speed-normal");
const btnSpeedUp = document.getElementById("btn-speed-up");
const qualitySelect = document.getElementById("quality-select");

let currentPlaybackRate = 1.0;

// --- PLAYER MODE DECISION ---

function useWasmFor(streamId) {
  const n = parseInt(streamId.replace("androstreamlive", ""), 10);
  return n >= 1 && n <= 40;
}

function resolveStream(streamId) {
  return STREAMS[streamId] || null;
}

// --- HYBRID PLAYER ---

async function playStream(title, streamId) {
  const url = resolveStream(streamId);
  if (!url) {
    alert("Stream not configured: " + streamId);
    return;
  }

  currentTitleEl.textContent = title;

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  if (wasmPlayer && wasmPlayer.stop) {
    wasmPlayer.stop();
    wasmPlayer = null;
  }

  currentPlaybackRate = 1.0;
  videoEl.playbackRate = currentPlaybackRate;

  if (useWasmFor(streamId)) {
    try {
      canvasEl.style.display = "block";
      videoEl.style.display = "none";

      wasmPlayer = await VideoPlayer.create({
        canvas: canvasEl,
        url: url,
        autoplay: true
      });
    } catch (err) {
      console.error("WASM failed, fallback to HLS:", err);
      canvasEl.style.display = "none";
      videoEl.style.display = "block";
      playWithHls(url);
    }
  } else {
    canvasEl.style.display = "none";
    videoEl.style.display = "block";
    playWithHls(url);
  }

  btnPlayPause.textContent = "Pause";
}

// --- HLS WITH AUTO-QUALITY + MANUAL LEVELS ---

function playWithHls(url) {
  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      autoStartLoad: true,
      startLevel: -1 // auto
    });

    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoEl);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoEl.play();
      videoEl.playbackRate = currentPlaybackRate;
      populateQualityLevels();
    });
  } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
    videoEl.src = url;
    videoEl.play();
    videoEl.playbackRate = currentPlaybackRate;
    qualitySelect.innerHTML = "<option value='auto'>Auto</option>";
  } else {
    alert("HLS not supported on this device.");
  }
}

function populateQualityLevels() {
  if (!hlsInstance) return;

  const levels = hlsInstance.levels || [];
  qualitySelect.innerHTML = "";

  const autoOpt = document.createElement("option");
  autoOpt.value = "auto";
  autoOpt.textContent = "Auto";
  qualitySelect.appendChild(autoOpt);

  levels.forEach((lvl, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    const height = lvl.height || "?";
    opt.textContent = `${height}p`;
    qualitySelect.appendChild(opt);
  });

  qualitySelect.value = "auto";
}

// --- TOUCH-OPTIMIZED CONTROLS ---

btnPlayPause.addEventListener("click", () => {
  if (videoEl.style.display !== "none") {
    if (videoEl.paused) {
      videoEl.play();
      btnPlayPause.textContent = "Pause";
    } else {
      videoEl.pause();
      btnPlayPause.textContent = "Play";
    }
  } else if (wasmPlayer && wasmPlayer.togglePause) {
    wasmPlayer.togglePause();
    // You can track state if WASM exposes it
  }
});

btnSpeedDown.addEventListener("click", () => {
  currentPlaybackRate = 0.5;
  videoEl.playbackRate = currentPlaybackRate;
});

btnSpeedNormal.addEventListener("click", () => {
  currentPlaybackRate = 1.0;
  videoEl.playbackRate = currentPlaybackRate;
});

btnSpeedUp.addEventListener("click", () => {
  currentPlaybackRate = 1.5;
  videoEl.playbackRate = currentPlaybackRate;
});

qualitySelect.addEventListener("change", () => {
  if (!hlsInstance) return;
  const val = qualitySelect.value;
  if (val === "auto") {
    hlsInstance.currentLevel = -1; // auto
  } else {
    hlsInstance.currentLevel = parseInt(val, 10);
  }
});

// --- DYNAMIC RESIZE (keeps canvas/video fitting screen) ---

function resizePlayer() {
  const wrapper = document.querySelector(".player-wrapper");
  if (!wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  canvasEl.width = rect.width;
  canvasEl.height = rect.height;
}

window.addEventListener("resize", resizePlayer);
document.addEventListener("DOMContentLoaded", resizePlayer);


// --- LIVE NOW DETECTOR ---

function isLiveNow(matchTimeStr) {
  const [h, m] = matchTimeStr.split(":").map(Number);
  const now = new Date();
  const match = new Date();
  match.setHours(h, m, 0, 0);

  const diffMinutes = (now - match) / 60000;
  return diffMinutes > -60 && diffMinutes < 60;
}

// --- DATA GENERATORS ---

function generatePHSchedule() {
  const leagues = [
    { name: "PBA", channel: "OneSports" },
    { name: "UAAP", channel: "Cignal Play" },
    { name: "NCAA Philippines", channel: "GMA Sports" },
    { name: "PVL", channel: "OneSports" },
    { name: "MPBL", channel: "OnePH" },
    { name: "PFL", channel: "Pilipinas Live" },
    { name: "PH Boxing", channel: "TV5" }
  ];

  const teams = {
    "PBA": ["Ginebra", "San Miguel", "TNT", "Magnolia", "Rain or Shine", "Meralco"],
    "UAAP": ["Ateneo", "La Salle", "UP", "UST", "NU", "FEU"],
    "NCAA Philippines": ["San Beda", "Letran", "Mapua", "Perpetual", "JRU"],
    "PVL": ["Creamline", "Choco Mucho", "F2 Logistics", "PLDT"],
    "MPBL": ["San Juan Knights", "Davao Occidental", "Bataan Risers"],
    "PFL": ["Kaya FC", "Ceres-Negros", "Stallion Laguna"],
    "PH Boxing": ["Pacquiao Promotions", "ALA Boxing", "MP Promotions"]
  };

  const schedule = [];
  for (let i = 0; i < 15; i++) {
    const league = leagues[Math.floor(Math.random() * leagues.length)];
    const list = teams[league.name];
    const home = list[Math.floor(Math.random() * list.length)];
    let away = list[Math.floor(Math.random() * list.length)];
    while (away === home) {
      away = list[Math.floor(Math.random() * list.length)];
    }

    const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minute = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];

    schedule.push({
      title: `${home} vs ${away}`,
      league: league.name,
      time: `${hour}:${minute}`,
      channel: league.channel,
      streamId: `androstreamlive${String(i + 1).padStart(2, "0")}`
    });
  }
  return schedule;
}

function generateIntlSchedule() {
  const leagues = [
    { name: "NBA", channel: "NBA TV" },
    { name: "FIBA", channel: "FIBA TV" },
    { name: "UFC", channel: "UFC Fight Pass" },
    { name: "ONE Championship", channel: "ONE TV" },
    { name: "Premier League", channel: "Premier Football" },
    { name: "La Liga", channel: "La Liga TV" },
    { name: "UCL", channel: "Champions TV" },
    { name: "Formula 1", channel: "F1 TV" }
  ];

  const teams = {
    "NBA": ["Lakers", "Warriors", "Celtics", "Heat", "Bucks", "Nuggets"],
    "FIBA": ["Philippines", "USA", "Spain", "France", "Australia"],
    "UFC": ["Main Card", "Fight Night", "PPV Event"],
    "ONE Championship": ["ONE Manila", "ONE Singapore", "ONE Bangkok"],
    "Premier League": ["Liverpool", "Man City", "Arsenal", "Chelsea", "Spurs", "Man United"],
    "La Liga": ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
    "UCL": ["Real Madrid", "Bayern", "Man City", "PSG", "Barcelona"],
    "Formula 1": ["Grand Prix", "Sprint Race", "Qualifying"]
  };

  const schedule = [];
  for (let i = 0; i < 15; i++) {
    const league = leagues[Math.floor(Math.random() * leagues.length)];
    const list = teams[league.name];
    const home = list[Math.floor(Math.random() * list.length)];
    let away = list[Math.floor(Math.random() * list.length)];
    while (away === home) {
      away = list[Math.floor(Math.random() * list.length)];
    }

    const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minute = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];

    schedule.push({
      title: `${home} vs ${away}`,
      league: league.name,
      time: `${hour}:${minute}`,
      channel: league.channel,
      streamId: `androstreamlive${String(i + 21).padStart(2, "0")}`
    });
  }
  return schedule;
}

function getPHEntertainmentChannels() {
  return [
    { name: "PTV", category: "PH", streamId: "androstreamlive41" },
    { name: "CLTV36", category: "PH", streamId: "androstreamlive42" },
    { name: "Mindanao Network TV", category: "PH", streamId: "androstreamlive43" },
    { name: "INC TV", category: "PH", streamId: "androstreamlive44" },
    { name: "EWTN Asia-Pacific", category: "PH", streamId: "androstreamlive45" },
    { name: "Bilyonaryo News Channel", category: "PH", streamId: "androstreamlive46" },
    { name: "Radyo Pilipinas (Video)", category: "PH", streamId: "androstreamlive47" }
  ];
}

function getIntlEntertainmentChannels() {
  return [
    { name: "Arirang", category: "International", streamId: "androstreamlive51" },
    { name: "Bein Sports Extra", category: "International", streamId: "androstreamlive52" },
    { name: "DW News", category: "International", streamId: "androstreamlive53" },
    { name: "NHK World", category: "International", streamId: "androstreamlive54" },
    { name: "CNA (Channel News Asia)", category: "International", streamId: "androstreamlive55" },
    { name: "BBC News", category: "International", streamId: "androstreamlive56" },
    { name: "Bloomberg Asia", category: "International", streamId: "androstreamlive57" },
    { name: "Al Jazeera English", category: "International", streamId: "androstreamlive58" },
    { name: "CGTN News", category: "International", streamId: "androstreamlive59" },
    { name: "CGTN Documentary", category: "International", streamId: "androstreamlive60" },
    { name: "ABC Australia", category: "International", streamId: "androstreamlive61" },
	{ name: "Animal Planet", category: "International", streamId: "androstreamlive62" },
    { name: "Travel Cannel", category: "International", streamId: "androstreamlive63" }
  ];
}

function getEntertainmentVOD() {
  return [
    { title: "Thrillers", category: "Movies", className: "vod-movie", streamId: "androstreamlive71" },
    { title: "Movie Sphere", category: "Movies", className: "vod-movie", streamId: "androstreamlive72" },
    { title: "Empty...", category: "Movies", className: "vod-movie", streamId: "androstreamlive73" },

    { title: "Empty...", category: "Series", className: "vod-series", streamId: "androstreamlive74" },
    { title: "Empty...", category: "Series", className: "vod-series", streamId: "androstreamlive75" },
    { title: "Empty...", category: "Series", className: "vod-series", streamId: "androstreamlive76" },

    { title: "Empty...", category: "Kids", className: "vod-kids", streamId: "androstreamlive77" },
    { title: "Learning Fun", category: "Kids", className: "vod-kids", streamId: "androstreamlive78" },
    { title: "Junior (Persian)", category: "Kids", className: "vod-kids", streamId: "androstreamlive79" },

    { title: "Outdoor Channel", category: "Documentaries", className: "vod-docs", streamId: "androstreamlive80" },
    { title: "Empty...", category: "Documentaries", className: "vod-docs", streamId: "androstreamlive81" },
    { title: "Empty...", category: "Documentaries", className: "vod-docs", streamId: "androstreamlive82" },

    { title: "Empty...", category: "Music", className: "vod-music", streamId: "androstreamlive83" },
    { title: "Blues TV", category: "Music", className: "vod-music", streamId: "androstreamlive84" },
	{ title: "Empty...", category: "Music", className: "vod-music", streamId: "androstreamlive85" },
	
    { title: "EWTN (Asia/Pacific)", category: "Religious", className: "vod-music", streamId: "androstreamlive86" },
    { title: "EWTN (Europe)", category: "Religious", className: "vod-music", streamId: "androstreamlive87" }
  ];
}

// --- RENDERERS ---

function renderSchedule(containerId, schedule) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  schedule.forEach(item => {
    const div = document.createElement("div");
    div.className = "match-item";

    const meta = document.createElement("div");
    meta.className = "match-meta";

    const titleRow = document.createElement("div");
    titleRow.textContent = item.title;

    if (isLiveNow(item.time)) {
      const liveBadge = document.createElement("span");
      liveBadge.textContent = "LIVE NOW";
      liveBadge.style.marginLeft = "8px";
      liveBadge.style.fontSize = "0.7rem";
      liveBadge.style.color = "#ff5252";
      liveBadge.style.fontWeight = "700";
      titleRow.appendChild(liveBadge);
    }

    const league = document.createElement("div");
    league.className = "match-league";
    league.textContent = `${item.league} • ${item.time} • ${item.channel}`;

    meta.appendChild(titleRow);
    meta.appendChild(league);

    const btn = document.createElement("button");
    btn.className = "play-button";
    btn.textContent = "Play";
    btn.addEventListener("click", () => {
      playStream(item.title, item.streamId);
    });

    div.appendChild(meta);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function renderPHEntertainment() {
  const container = document.getElementById("ent-ph");
  container.innerHTML = "";
  const channels = getPHEntertainmentChannels();
  channels.forEach(ch => {
    const div = document.createElement("div");
    div.className = "channel-item";

    const meta = document.createElement("div");
    meta.className = "channel-meta";
    const name = document.createElement("div");
    name.textContent = ch.name;
    const cat = document.createElement("div");
    cat.className = "channel-category";
    cat.textContent = "Philippines";

    meta.appendChild(name);
    meta.appendChild(cat);

    const btn = document.createElement("button");
    btn.className = "play-button";
    btn.textContent = "Play";
    btn.addEventListener("click", () => {
      playStream(ch.name, ch.streamId);
    });

    div.appendChild(meta);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function renderIntlEntertainment() {
  const container = document.getElementById("ent-intl");
  container.innerHTML = "";
  const channels = getIntlEntertainmentChannels();
  channels.forEach(ch => {
    const div = document.createElement("div");
    div.className = "channel-item";

    const meta = document.createElement("div");
    meta.className = "channel-meta";
    const name = document.createElement("div");
    name.textContent = ch.name;
    const cat = document.createElement("div");
    cat.className = "channel-category";
    cat.textContent = ch.category;

    meta.appendChild(name);
    meta.appendChild(cat);

    const btn = document.createElement("button");
    btn.className = "play-button";
    btn.textContent = "Play";
    btn.addEventListener("click", () => {
      playStream(ch.name, ch.streamId);
    });

    div.appendChild(meta);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function renderVOD() {
  const container = document.getElementById("ent-vod");
  container.innerHTML = "";
  const vodItems = getEntertainmentVOD();
  vodItems.forEach(item => {
    const div = document.createElement("div");
    div.className = `vod-item ${item.className}`;

    const title = document.createElement("div");
    title.className = "vod-item-title";
    title.textContent = item.title;

    const cat = document.createElement("div");
    cat.className = "vod-item-category";
    cat.textContent = item.category;

    const tag = document.createElement("div");
    tag.className = "vod-item-tag";
    tag.textContent = "Tap to play";

    div.appendChild(title);
    div.appendChild(cat);
    div.appendChild(tag);

    div.addEventListener("click", () => {
      playStream(`${item.category}: ${item.title}`, item.streamId);
    });

    container.appendChild(div);
  });
}

// --- TABS ---

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `tab-${target}`);
    });
  });
});

// --- INIT ---

document.addEventListener("DOMContentLoaded", () => {
  const phSchedule = generatePHSchedule();
  const intlSchedule = generateIntlSchedule();

  renderSchedule("ph-schedule", phSchedule);
  renderSchedule("intl-schedule", intlSchedule);
  renderPHEntertainment();
  renderIntlEntertainment();
  renderVOD();

  // ⭐ Make Entertainment the default tab
  document.querySelector('[data-tab="ent"]').click();
});

