const API_KEY = "AIzaSyApd6m7QSpcIQJVweNtUqfu_Qh3pEpu70U";

let player = null;
let isPlaying = false;
let currentVideoId = "";

/* =========================
   YouTube IFrame Player
========================= */

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
    },
    events: {
      onReady: function () {
        console.log("YouTube Player Ready");
      },
      onStateChange: function (event) {

        if (event.data === YT.PlayerState.PLAYING) {
          isPlaying = true;
          document.getElementById("playButton").textContent = "❚❚";
        }

        if (event.data === YT.PlayerState.PAUSED) {
          isPlaying = false;
          document.getElementById("playButton").textContent = "▶";
        }

        if (event.data === YT.PlayerState.ENDED) {
          isPlaying = false;
          document.getElementById("playButton").textContent = "▶";
        }
      }
    }
  });
}


/* =========================
   Search YouTube
========================= */

const searchInput = document.getElementById("searchInput");

let searchTimer;

searchInput.addEventListener("input", function () {

  const query = this.value.trim();

  clearTimeout(searchTimer);

  if (query.length < 2) {
    return;
  }

  searchTimer = setTimeout(() => {
    searchYouTube(query);
  }, 500);
});


async function searchYouTube(query) {

  const songGrid = document.getElementById("songGrid");

  songGrid.innerHTML = `
    <p style="padding:20px;">
      Searching YouTube...
    </p>
  `;

  try {

    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&q=" + encodeURIComponent(query) +
      "&type=video" +
      "&videoCategoryId=10" +
      "&videoEmbeddable=true" +
      "&maxResults=10" +
      "&regionCode=IN" +
      "&key=" + API_KEY;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      songGrid.innerHTML = `
        <p style="padding:20px;">
          YouTube API error.
        </p>
      `;

      return;
    }

    displayResults(data.items);

  } catch (error) {

    console.error(error);

    songGrid.innerHTML = `
      <p style="padding:20px;">
        Something went wrong.
      </p>
    `;
  }
}


/* =========================
   Display Results
========================= */

function displayResults(items) {

  const songGrid = document.getElementById("songGrid");

  songGrid.innerHTML = "";

  if (!items || items.length === 0) {

    songGrid.innerHTML = `
      <p style="padding:20px;">
        No songs found.
      </p>
    `;

    return;
  }

  items.forEach(item => {

    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const channel = item.snippet.channelTitle;
    const thumbnail = item.snippet.thumbnails.medium.url;

    const card = document.createElement("div");

    card.className = "song-card";

    card.innerHTML = `
      <img
        src="${thumbnail}"
        alt="${escapeHTML(title)}"
        style="
          width:100%;
          aspect-ratio:16/9;
          object-fit:cover;
          border-radius:10px;
        "
      >

      <h3>${escapeHTML(title)}</h3>

      <p>${escapeHTML(channel)}</p>
    `;

    card.addEventListener("click", () => {
      playSong(title, videoId, channel);
    });

    songGrid.appendChild(card);
  });
}


/* =========================
   Play Song
========================= */

function playSong(songName, videoId, artist = "YouTube") {

  document.getElementById("currentSong").textContent = songName;
  document.getElementById("currentArtist").textContent = artist;

  currentVideoId = videoId;

  if (player && videoId) {

    player.loadVideoById(videoId);

  } else {

    console.log("YouTube player not ready");

  }
}


/* =========================
   Play / Pause
========================= */

function togglePlay() {

  if (!player || !currentVideoId) {
    return;
  }

  if (isPlaying) {

    player.pauseVideo();

  } else {

    player.playVideo();

  }
}


/* =========================
   HTML Escape
========================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
