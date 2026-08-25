// Simple channel rendering + search + player

let allChannels = [];
const channelListEl = document.getElementById("channel-list");
const searchInputEl = document.getElementById("search-input");
const videoPlayerEl = document.getElementById("video-player");
const nowPlayingEl = document.getElementById("now-playing");
const loadingScreenEl = document.getElementById("loading-screen");

function hideLoading() {
  if (loadingScreenEl) {
    loadingScreenEl.style.opacity = "0";
    setTimeout(() => {
      loadingScreenEl.style.display = "none";
    }, 300);
  }
}

function renderChannels(channels) {
  channelListEl.innerHTML = "";

  channels.forEach((ch) => {
    const card = document.createElement("div");
    card.className = "channel-card";

    const name = document.createElement("div");
    name.className = "channel-name";
    name.textContent = ch.name;

    const category = document.createElement("div");
    category.className = "channel-category";
    category.textContent = ch.category || "Channel";

    card.appendChild(name);
    card.appendChild(category);

    card.addEventListener("click", () => {
      playChannel(ch);
    });

    channelListEl.appendChild(card);
  });
}

function playChannel(channel) {
  nowPlayingEl.textContent = `Now Playing: ${channel.name}`;
  videoPlayerEl.src = channel.url;
  videoPlayerEl.play().catch(() => {});
}

function filterChannels(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderChannels(allChannels);
    return;
  }

  const filtered = allChannels.filter((ch) => {
    return (
      ch.name.toLowerCase().includes(q) ||
      (ch.category && ch.category.toLowerCase().includes(q))
    );
  });

  renderChannels(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  // streams.js should define window.FILIPINO_CHANNELS
  allChannels = Array.isArray(window.FILIPINO_CHANNELS)
    ? window.FILIPINO_CHANNELS
    : [];

  renderChannels(allChannels);
  hideLoading();

  searchInputEl.addEventListener("input", (e) => {
    filterChannels(e.target.value);
  });
});
