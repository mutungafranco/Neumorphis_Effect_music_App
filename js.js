const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector("img"),
  musicName = wrapper.querySelector(".name"),
  musicArtist = wrapper.querySelector(".artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar");

let musicIndex = Math.floor(Math.random() * allMusic.length); // Get a random song index
let isMusicPaused = true; // Variable to track play/pause status

// Load the first song when the page loads
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

// Function to load music based on the index
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb].name;
    musicArtist.innerText = allMusic[indexNumb].artist;
    musicImg.src = `assets/image/${allMusic[indexNumb].src}.jpg`; // Corrected string interpolation
    mainAudio.src = `assets/songs/${allMusic[indexNumb].src}.mp3`; // Corrected string interpolation
}

// Function to play the music
function playMusic() {
    wrapper.classList.add("paused");
    musicImg.classList.add('rotate');
    playPauseBtn.innerHTML = '<i class="fi fi-sr-pause"></i>'; // Play button changes to pause icon
    mainAudio.play();
    isMusicPaused = false;
}

// Function to pause the music
function pauseMusic() {
    wrapper.classList.remove("paused");
    musicImg.classList.remove('rotate');
    playPauseBtn.innerHTML = '<i class="fi fi-sr-play"></i>'; // Pause button changes to play icon
    mainAudio.pause();
    isMusicPaused = true;
}

// Function to go to previous song
function prevMusic() {
    musicIndex--;
    if (musicIndex < 0) musicIndex = allMusic.length - 1; // Wrap around to last song
    loadMusic(musicIndex);
    playMusic();
}

// Function to go to next song
function nextMusic() {
    musicIndex++;
    if (musicIndex >= allMusic.length) musicIndex = 0; // Wrap around to first song
    loadMusic(musicIndex);
    playMusic();
}

// Play/Pause button event listener
playPauseBtn.addEventListener("click", () => {
    if (isMusicPaused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

// Previous button event listener
prevBtn.addEventListener("click", () => {
    prevMusic();
});

// Next button event listener
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// Update progress bar as music plays
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progresswidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progresswidth}%`; // Corrected string interpolation

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

    // Update duration
    if (mainAudio.duration) {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`; // Corrected string interpolation
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`; // Corrected string interpolation
    }

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`; // Corrected string interpolation
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`; // Corrected string interpolation
});

// Progress bar click functionality to skip ahead
progressArea.addEventListener("click", (e) => {
    let progresswidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;  // Corrected to use `e.offsetX`
    let songDuration = mainAudio.duration;

    // Calculate new current time based on the clicked position
    mainAudio.currentTime = (clickedOffsetX / progresswidth) * songDuration;
    if (isMusicPaused) {
        playMusic(); // Automatically play the music if it was paused
    }
});

// Automatically go to next song when current song ends
mainAudio.addEventListener("ended", () => {
    nextMusic();
});
