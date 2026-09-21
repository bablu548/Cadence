const API_KEY = "AIzaSyApd6m7QSpcIQJVweNtUqfu_Qh3pEpu70U";

let player = null;
let isPlaying = false;
let currentVideoId = null;


// Load YouTube Player API
const tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";

document.head.appendChild(tag);


// YouTube API ready
function onYouTubeIframeAPIReady() {

  player = new YT.Player("youtubePlayer", {

    height: "200",
    width: "100%",

    videoId: "",

    playerVars: {
      playsinline: 1
    },

    events: {

      onStateChange: onPlayerStateChange

    }

  });

}


// Player state
function onPlayerStateChange(event) {

  if (event.data === YT.PlayerState.PLAYING) {

    isPlaying = true;

    document.getElementById("playButton").textContent = "❚❚";

  }

  if (event.data === YT.PlayerState.PAUSED) {

    isPlaying = false;

    document.getElementById("playButton").textContent = "▶";

  }

}


// Search YouTube
async function searchYouTube(query) {

  try {

    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      "?part=snippet" +
      "&q=" + encodeURIComponent(query) +
      "&type=video" +
      "&videoEmbeddable=true" +
      "&maxResults=10" +
      "&key=" + API_KEY;


    const response = await fetch(url);

    const data = await response.json();


    if (data.error) {

      console.error(data.error);

      alert("YouTube API error. Check your API key.");

      return [];

    }


    return data.items || [];

  }

  catch (error) {

    console.error(error);

    return [];

  }

}


// Play song by searching YouTube
async function playSong(songName) {

  document.getElementById("currentSong").textContent = songName;

  document.getElementById("currentArtist").textContent =
    "Searching YouTube...";


  const results = await searchYouTube(songName);


  if (results.length === 0) {

    document.getElementById("currentArtist").textContent =
      "Song not found";

    return;

  }


  const video = results[0];

  const videoId = video.id.videoId;

  currentVideoId = videoId;


  document.getElementById("currentSong").textContent =
    video.snippet.title;

  document.getElementById("currentArtist").textContent =
    video.snippet.channelTitle;


  if (player) {

    player.loadVideoById(videoId);

    player.playVideo();

    isPlaying = true;

  }

}


// Play / pause
function togglePlay() {

  if (!player) return;


  if (isPlaying) {

    player.pauseVideo();

  } else {

    player.playVideo();

  }

}


// Search box
const searchInput =
  document.getElementById("searchInput");


searchInput.addEventListener(
  "input",
  async function () {

    const query = this.value.trim();


    if (query.length < 2) {

      document.getElementById("searchResults").innerHTML = "";

      return;

    }


    const results =
      await searchYouTube(query);


    displaySearchResults(results);

  }
);


// Display search results
function displaySearchResults(items) {

  const container =
    document.getElementById("searchResults");


  container.innerHTML = "";


  items.forEach(item => {

    const videoId = item.id.videoId;

    const title = item.snippet.title;

    const channel =
      item.snippet.channelTitle;

    const thumbnail =
      item.snippet.thumbnails.medium.url;


    const card =
      document.createElement("div");


    card.className = "song-card";


    card.innerHTML = `

      <img
        src="${thumbnail}"
        style="width:100%; border-radius:10px;"
      >

      <h3>${title}</h3>

      <p>${channel}</p>

    `;


    card.onclick = function () {

      playYouTubeVideo(
        title,
        channel,
        videoId
      );

    };


    container.appendChild(card);

  });

}


// Play selected search result
function playYouTubeVideo(
  title,
  channel,
  videoId
) {

  document.getElementById("currentSong")
    .textContent = title;


  document.getElementById("currentArtist")
    .textContent = channel;


  currentVideoId = videoId;


  if (player) {

    player.loadVideoById(videoId);

    player.playVideo();

  }

}


// Previous button
function previousSong() {

  console.log("Previous song");

}


// Next button
function nextSong() {

  console.log("Next song");

}
