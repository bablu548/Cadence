// ==========================================
// CADENCE MUSIC - YOUTUBE PLAYER
// ==========================================

// Paste your YouTube Data API key here
const API_KEY = "YOUR_API_KEY";


// ==========================================
// VARIABLES
// ==========================================

let player = null;
let isPlaying = false;

let currentVideoId = "";
let currentSongName = "";


// ==========================================
// YOUTUBE IFRAME PLAYER
// ==========================================

function onYouTubeIframeAPIReady() {

  player = new YT.Player("youtubePlayer", {

    height: "180",
    width: "320",

    videoId: "",

    playerVars: {
      playsinline: 1,
      controls: 0,
      rel: 0
    },

    events: {

      onReady: function () {

        console.log("YouTube Player Ready");

        updateVolume();

      },

      onStateChange: function (event) {

        if (event.data === YT.PlayerState.PLAYING) {

          isPlaying = true;

          document.getElementById(
            "playButton"
          ).textContent = "❚❚";

        }

        else if (
          event.data === YT.PlayerState.PAUSED
        ) {

          isPlaying = false;

          document.getElementById(
            "playButton"
          ).textContent = "▶";

        }

        else if (
          event.data === YT.PlayerState.ENDED
        ) {

          isPlaying = false;

          document.getElementById(
            "playButton"
          ).textContent = "▶";

        }

      }

    }

  });

}


// ==========================================
// PLAY SONG
// ==========================================

function playSong(songName, videoId) {

  if (!videoId) {

    console.log("No YouTube video ID");

    return;

  }


  currentSongName = songName;
  currentVideoId = videoId;


  // Update bottom player

  document.getElementById(
    "currentSong"
  ).textContent = songName;


  document.getElementById(
    "currentArtist"
  ).textContent = "YouTube";


  // Play YouTube video

  if (player) {

    player.loadVideoById(videoId);

    player.playVideo();

    isPlaying = true;

    document.getElementById(
      "playButton"
    ).textContent = "❚❚";

  }

}


// ==========================================
// PLAY / PAUSE
// ==========================================

function togglePlay() {

  if (!player) {

    console.log("Player not ready");

    return;

  }


  if (!currentVideoId) {

    return;

  }


  if (isPlaying) {

    player.pauseVideo();

  } else {

    player.playVideo();

  }

}


// ==========================================
// VOLUME
// ==========================================

const volumeSlider =
  document.getElementById("volume");


if (volumeSlider) {

  volumeSlider.addEventListener(
    "input",
    updateVolume
  );

}


function updateVolume() {

  if (!player) return;

  const volume =
    document.getElementById(
      "volume"
    ).value;

  player.setVolume(
    Number(volume)
  );

}


// ==========================================
// PROGRESS BAR
// ==========================================

const progress =
  document.getElementById("progress");


setInterval(function () {

  if (!player) return;

  if (
    typeof player.getCurrentTime !==
    "function"
  ) {

    return;

  }


  if (!currentVideoId) return;


  const currentTime =
    player.getCurrentTime();


  const duration =
    player.getDuration();


  if (!duration) return;


  const percentage =
    (currentTime / duration) * 100;


  progress.value =
    percentage;


  document.getElementById(
    "currentTime"
  ).textContent =
    formatTime(currentTime);


  document.getElementById(
    "duration"
  ).textContent =
    formatTime(duration);


}, 500);


// ==========================================
// MOVE SONG USING PROGRESS BAR
// ==========================================

if (progress) {

  progress.addEventListener(
    "input",
    function () {

      if (!player) return;

      const duration =
        player.getDuration();

      if (!duration) return;


      const newTime =
        (this.value / 100) *
        duration;


      player.seekTo(
        newTime,
        true
      );

    }
  );

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

  if (!seconds || isNaN(seconds)) {

    return "0:00";

  }


  seconds =
    Math.floor(seconds);


  const minutes =
    Math.floor(seconds / 60);


  const remainingSeconds =
    seconds % 60;


  return (
    minutes +
    ":" +
    String(
      remainingSeconds
    ).padStart(2, "0")
  );

}


// ==========================================
// SEARCH YOUTUBE
// ==========================================

const searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        searchYouTube(
          this.value
        );

      }

    }
  );

}


// ==========================================
// YOUTUBE SEARCH FUNCTION
// ==========================================

async function searchYouTube(query) {

  if (!query.trim()) {

    return;

  }


  const resultsContainer =
    document.getElementById(
      "youtubeResults"
    );


  resultsContainer.innerHTML =
    "<p>Searching YouTube...</p>";


  try {

    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&q=" +
      encodeURIComponent(query) +
      "&type=video" +
      "&maxResults=10" +
      "&key=" +
      API_KEY;


    const response =
      await fetch(url);


    const data =
      await response.json();


    if (
      data.error
    ) {

      console.error(
        data.error
      );


      resultsContainer.innerHTML =
        "<p>YouTube API error. Check your API key.</p>";

      return;

    }


    displayYouTubeResults(
      data.items
    );

  }

  catch (error) {

    console.error(
      error
    );


    resultsContainer.innerHTML =
      "<p>Something went wrong.</p>";

  }

}


// ==========================================
// DISPLAY SEARCH RESULTS
// ==========================================

function displayYouTubeResults(
  videos
) {

  const container =
    document.getElementById(
      "youtubeResults"
    );


  container.innerHTML = "";


  if (
    !videos ||
    videos.length === 0
  ) {

    container.innerHTML =
      "<p>No songs found.</p>";

    return;

  }


  videos.forEach(
    function (video) {

      const videoId =
        video.id.videoId;


      const title =
        video.snippet.title;


      const channel =
        video.snippet.channelTitle;


      const thumbnail =
        video.snippet.thumbnails
          .medium.url;


      const card =
        document.createElement(
          "div"
        );


      card.className =
        "youtube-result";


      card.innerHTML = `

        <img
          src="${thumbnail}"
          alt=""
        >

        <div class="youtube-info">

          <h3>
            ${escapeHTML(title)}
          </h3>

          <p>
            ${escapeHTML(channel)}
          </p>

        </div>

        <button>
          ▶
        </button>

      `;


      card.addEventListener(
        "click",
        function () {

          playSong(
            title,
            videoId
          );

        }
      );


      container.appendChild(
        card
      );

    }
  );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text;

  return div.innerHTML;

}


// ==========================================
// QUICK PLAYLIST BUTTONS
// ==========================================

function playPlaylist(
  playlistName
) {

  let searchTerm = "";


  if (
    playlistName ===
    "Trending"
  ) {

    searchTerm =
      "trending music";

  }

  else if (
    playlistName ===
    "Liked Songs"
  ) {

    searchTerm =
      "popular songs";

  }

  else if (
    playlistName ===
    "Favorites"
  ) {

    searchTerm =
      "top songs";

  }


  if (searchTerm) {

    searchYouTube(
      searchTerm
    );

  }

}


// ==========================================
// PREVIOUS
// ==========================================

function previousSong() {

  console.log(
    "Previous song"
  );

}


// ==========================================
// NEXT
// ==========================================

function nextSong() {

  console.log(
    "Next song"
  );

}
