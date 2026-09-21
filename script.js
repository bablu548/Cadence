const API_KEY = "AIzaSyAH_D19PMvjRlyWYgT4JmP2midMbzDOovc";

let isPlaying = false;
let player;

// YouTube Player API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubePlayer", {
    height: "180",
    width: "320",
    videoId: "",
    playerVars: {
      playsinline: 1
    }
  });
}


// Play selected YouTube song
function playSong(songName, videoId) {

  document.getElementById("currentSong").textContent = songName;
  document.getElementById("currentArtist").textContent = "YouTube";

  if (player && videoId) {
    player.loadVideoById(videoId);
    player.playVideo();
  }

  isPlaying = true;
  document.getElementById("playButton").textContent = "❚❚";
}


// Play / Pause
function togglePlay() {

  if (!player) return;

  if (isPlaying) {
    player.pauseVideo();
    isPlaying = false;
    document.getElementById("playButton").textContent = "▶";
  } else {
    player.playVideo();
    isPlaying = true;
    document.getElementById("playButton").textContent = "❚❚";
  }
}


// Search YouTube
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async function () {

  const query = this.value.trim();

  if (query.length < 2) return;

  try {

    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet` +
      `&q=${encodeURIComponent(query)}` +
      `&type=video` +
      `&videoEmbeddable=true` +
      `&maxResults=10` +
      `&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return;
    }

    displaySearchResults(data.items);

  } catch (error) {
    console.error("Search error:", error);
  }

});


// Show YouTube results
function displaySearchResults(items) {

  const container = document.getElementById("searchResults");

  if (!container) return;

  container.innerHTML = "";

  items.forEach(item => {

    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const thumbnail = item.snippet.thumbnails.medium.url;

    const card = document.createElement("div");

    card.className = "youtube-song";

    card.innerHTML = `
      <img src="${thumbnail}" alt="">
      <div>
        <h3>${title}</h3>
        <p>${item.snippet.channelTitle}</p>
      </div>
    `;

    card.onclick = () => playSong(title, videoId);

    container.appendChild(card);

  });
}
