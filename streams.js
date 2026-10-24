// 🇵🇭 FilipinoTV — Cleaned & Categorized Streams
// Source: ph.m3u playlist (public/free-to-air) 

window.FILIPINO_CHANNELS = [
  // 🇵🇭 Philippines
  { name: "A2Z", url: "http://136.239.173.2/001/2/ch00000090990000001087/manifest.mpd", category: "Philippines" },
  { name: "DepEd TV", url: "http://136.239.158.10/001/2/ch00000090990000001340/manifest.mpd", category: "Philippines" },
  { name: "ALLTV", url: "http://136.239.158.10/001/2/ch00000090990000001179/manifest.mpd", category: "Philippines" },
  { name: "Jeepney TV", url: "http://161.49.17.2/001/2/ch00000090990000001250/manifest.mpd", category: "Philippines" },
  { name: "GMA", url: "http://136.158.97.2/001/2/ch00000090990000001093/manifest.mpd", category: "Philippines" },
  { name: "INCTV (Geo-blocked)", url: "http://136.239.159.18/001/2/ch00000090990000001092/manifest.mpd", category: "Philippines" },
  { name: "Mindanao Network TV", url: "https://streams.comclark.com/overlay/mindanow/playlist.m3u8", category: "Philippines" },
  { name: "CLTV 36", url: "https://live.cltv36.tv/LiveApp/streams/cltvlive.m3u8", category: "Philippines" },
  { name: "Bilyonaryo News Channel", url: "https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8", category: "Philippines" },
  { name: "Kapamilya Online Live", url: "https://manifest.googlevideo.com/api/manifest/hls_variant/...index.m3u8", category: "Philippines" },
  { name: "Kapamilya Channel", url: "http://202.57.43.60/live/5748aabe4c9d661afbd7f4068248f664/100.m3u8", category: "Philippines" },
  { name: "Wiggles", url: "https://iview.abc.net.au/show/ready-steady-wiggle/series/8/video/ZW4701A052S00", category: "Philippines" },

  // 🌍 International
  { name: "Arirang", url: "https://amdlive-ch03-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8", category: "International" },
  { name: "Bloomberg Asia", url: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8", category: "International" },
  { name: "BBC World News", url: "https://vs-hls-push-ww-live.akamaized.net/.../main.m3u8", category: "International" },
  { name: "Outdoor Channel", url: "https://cdn-apse1-prod.tsv2.amagi.tv/.../playlist.m3u8", category: "International" },
  { name: "Yahoo Finance", url: "https://yahoo-samsung.amagi.tv/playlist.m3u8", category: "International" },

  // 🎬 Movies
  { name: "Tagalized Movie Channel", url: "http://136.239.159.20/001/2/ch00000090990000001080/manifest.mpd", category: "Movies" },
  { name: "Thrillers", url: "https://amc-rushbyamc-1-us.vizio.wurl.tv/playlist.m3u8", category: "Movies" },
  { name: "MovieSphere", url: "https://moviesphereuk-samsunguk.amagi.tv/playlist.m3u8", category: "Movies" },

  // 📰 News
  { name: "BBC News Asia Pacific", url: "https://cdn4.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8", category: "News" },
  { name: "CGTN News", url: "http://136.239.173.26/001/2/ch00000090990000001146/manifest.mpd", category: "News" },
  { name: "CNN", url: "https://turnerlive.warnermediacdn.com/hls/live/.../cnn_slate/VIDEO_0_3564000.m3u8", category: "News" },
  { name: "DW News", url: "https://cdn3.wowza.com/1/QmVNUVhTNTZSS3Uz/.../playlist.m3u8", category: "News" },
  { name: "NHK World", url: "https://english-livebkali.cgtn.com/live/doccgtn_1.m3u8", category: "News" },
  { name: "CNA", url: "https://amdlive-ch03-ctnd-com.akamaized.net/arirang_1ch/...m3u8", category: "News" },
  { name: "Al Jazeera English", url: "https://amg01334-beinsportsllc-beinxtra-localnow-kcy6r.amagi.tv/playlist.m3u8", category: "News" },

  // 🧒 Kids
  { name: "Cartoonito", url: "http://161.49.17.2/001/2/ch00000090990000001125/manifest.mpd", category: "Kids" },
  { name: "Moonbug Kids", url: "https://moonbug-rokuus.amagi.tv/playlist.m3u8", category: "Kids" },
  { name: "3ABN Kids", url: "https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8", category: "Kids" },
  { name: "Japanim TV", url: "https://foxkidstv.be/stream/play.m3u8", category: "Kids" },
  { name: "Magic Kids", url: "https://magicstream.ddns.net/magicstream/stream.m3u8", category: "Kids" },
  { name: "ABC Kids Australia", url: "https://c.mjh.nz/abc-kids.m3u8", category: "Kids" },
  { name: "Mr. Bean Animated (UK)", url: "https://amg00627-amg00627c23-samsung-au-4110.playouts.now.amagi.tv/playlist.m3u8", category: "Kids" },

  // 🎵 Music
  { name: "Blues TV", url: "https://2-fss-2.streamhoster.com/pl_138/205510-3094608-1/playlist.m3u8", category: "Music" },

  // 📚 Documentary
  { name: "CGTN Documentary", url: "https://english-livebkali.cgtn.com/live/doccgtn_1.m3u8", category: "Documentary" },

  // ✝️ Religious
  { name: "TV Maria", url: "http://136.158.97.2/001/2/ch00000090990000001160/manifest.mpd", category: "Religious" },
  { name: "EWTN Asia-Pacific", url: "https://cdn3.wowza.com/1/QmVNUVhTNTZSS3Uz/.../playlist.m3u8", category: "Religious" }
];
