let isPlaying = false;

function playSong(songName) {

  document.getElementById("currentSong").textContent = songName;
  document.getElementById("currentArtist").textContent = "Cadence Artist";

  isPlaying = true;

  document.getElementById("playButton").textContent = "❚❚";

  console.log("Playing:", songName);
}


function togglePlay() {

  const button = document.getElementById("playButton");

  if (!document.getElementById("currentSong").textContent ||
      document.getElementById("currentSong").textContent === "Select a song") {
    return;
  }

  isPlaying = !isPlaying;

  button.textContent = isPlaying ? "❚❚" : "▶";
}


/* Search */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

  const query = this.value.toLowerCase();

  const songs = document.querySelectorAll(".song-card");

  songs.forEach(song => {

    const title = song.querySelector("h3")
      .textContent
      .toLowerCase();

    song.style.display = title.includes(query)
      ? "block"
      : "none";

  });

});
