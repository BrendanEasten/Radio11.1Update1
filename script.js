const playButton = document.getElementById('play-btn');
const audioPlayer = document.getElementById('audio-player');
const volumeSlider = document.getElementById('volume-slider');
const cdImage = document.getElementById('cd');
const trackInfo = document.getElementById('track-info');
const trackTitle = document.getElementById('track-title');
const shuffleButton = document.getElementById('shuffle-btn');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');

// Set initial volume
audioPlayer.volume = volumeSlider.value;

// Update audio volume when the slider is adjusted
volumeSlider.addEventListener('input', (event) => {
    audioPlayer.volume = event.target.value;
});

// Playlist of MP3 files
const discCollection = [
    { img: "ChillWave/chillWaveDisc.webp", playlist: [
        { title: "Ambient Resonance by Lonely Lies", src: "ChillWave/song101.mp3" },
        { title: "Unconditional Love by Sideluv", src: "ChillWave/song1.mp3" },
        { title: "Lofi House by Clement クレム", src: "ChillWave/song3.mp3" },
        { title: "Dissociation by Indo Silver", src: "ChillWave/song5.mp3" },
        { title: "Universe in Flames (feat. Douze) by Yota", src: "ChillWave/song100.mp3" }
    ]},
    { img: "Pop/PopDisc.png", playlist: [
        { title: "Universe in Flames (feat. Douze) by Yota", src: "ChillWave/song100.mp3" },
    ]},
    { img: "EDM/edm.Disc.png", playlist: [
        { title: "Joytoy Fire by Lil Jammy", src: "EDM/song2.mp3" },
    ]},
    { img: "Slowed & Reverbed/slowedDisc.png", playlist: [
        { title: "Trevor Something - Wicked Game [slowed & reverb]", src: "Slowed & Reverbed/song102.mp3" },
    ]},
    { img: "Rap & Rnb/rapDisc.png", playlist: [
        { title: "Cilvia Demo by Isaiah Rashad", src: "Rap & Rnb/song103.mp3" },
    ]},
    
]

let isPlaying = false;
let isShuffle = false;
let shuffledPlaylist = [...discCollection];
let currentTrackIndex = Math.floor(Math.random() * shuffledPlaylist.length);
let rotationAngle = 0;

// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleArray(shuffledPlaylist);
    } else {
        shuffledPlaylist = [...playlist];
    }
    currentTrackIndex = Math.floor(Math.random() * shuffledPlaylist.length);
    loadTrack(currentTrackIndex);
}

// Load the first track
function loadTrack(index) {
    audioPlayer.src = shuffledPlaylist[index].src;
    trackTitle.textContent = shuffledPlaylist[index].title;
}

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        stopSpinning();
        playButton.textContent = 'Play';
        trackInfo.style.display = 'none';
        document.body.classList.remove('music-playing');
    } else {
        audioPlayer.play();
        startSpinning();
        playButton.textContent = 'Pause';
        trackInfo.style.display = 'block';
        document.body.classList.add('music-playing');
    }
    isPlaying = !isPlaying;
}

function startSpinning() {
    cdImage.style.animation = `spin 3s linear infinite`;
    document.querySelector('.cd-container').classList.add('playing');
}

function stopSpinning() {
    const computedStyle = window.getComputedStyle(cdImage);
    const matrix = computedStyle.transform;

    if (matrix !== 'none') {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        rotationAngle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }

    cdImage.style.animation = 'none';
    cdImage.style.transform = `rotate(${rotationAngle}deg)`;
    document.querySelector('.cd-container').classList.remove('playing');
}

function playNextTrack() {
    currentTrackIndex++;

    // If we reach the end of the playlist, loop back to the beginning
    if (currentTrackIndex >= shuffledPlaylist.length) {
        currentTrackIndex = 0;
    }

    loadTrack(currentTrackIndex);
    audioPlayer.play();
}

// Play previous track
function playPreviousTrack() {
    currentTrackIndex--;

    // If we go before the first track, loop to the last track
    if (currentTrackIndex < 0) {
        currentTrackIndex = shuffledPlaylist.length - 1;
    }

    loadTrack(currentTrackIndex);
    audioPlayer.play();
}

// Ensure the next song plays when the current one ends
audioPlayer.addEventListener('ended', playNextTrack);

// Initial setup
shuffleArray(shuffledPlaylist);
currentTrackIndex = Math.floor(Math.random() * shuffledPlaylist.length);
loadTrack(currentTrackIndex);
trackInfo.style.display = 'none';



let currentDiscIndex = 0;
let currentSongTime = 0; // Time position of the current song

function changeDisc(direction) {
    const cdContainer = document.querySelector('.cd-container');
    const oldCdImage = document.getElementById('cd');
    const genreTitle = document.getElementById('genre-title'); // Reference genre title

    // Save the current song title and playback position
    const previousTrackTitle = trackTitle.textContent;
    currentSongTime = audioPlayer.currentTime;

    if (direction === 'next') {
        currentDiscIndex = (currentDiscIndex + 1) % discCollection.length;
    } else {
        currentDiscIndex = (currentDiscIndex - 1 + discCollection.length) % discCollection.length;
    }

    const newDisc = discCollection[currentDiscIndex];

    // Update genre title (extract from folder name)
    genreTitle.textContent = newDisc.img.split('/')[0];

    // Start with the genre title faded out
    genreTitle.style.opacity = '0';
    genreTitle.style.transition = 'opacity 0.5s ease-in-out'; // Apply fade-in transition

    // Transition for disc change
    const newCdImage = document.createElement('img');
    newCdImage.src = newDisc.img;
    newCdImage.classList.add('cd', 'slide-in');
    newCdImage.style.position = 'absolute';
    newCdImage.style.opacity = '0';
    newCdImage.style.transform = `translateX(${direction === 'next' ? '100%' : '-100%'})`;

    cdContainer.appendChild(newCdImage);

    setTimeout(() => {
        newCdImage.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s';
        newCdImage.style.transform = 'translateX(0)';
        newCdImage.style.opacity = '1';
        oldCdImage.style.opacity = '0';
        
        // Fade in the genre title
        genreTitle.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        oldCdImage.src = newCdImage.src;
        oldCdImage.style.opacity = '1';
        cdContainer.removeChild(newCdImage);

        // Load the new playlist while keeping track of the current song
        loadNewPlaylist(newDisc.playlist, previousTrackTitle);
    }, 600);
}   
// Update loadNewPlaylist to retain the current song if possible
function loadNewPlaylist(newPlaylist, previousTrackTitle) {
    shuffledPlaylist = [...newPlaylist];

    // Try to find the previous song in the new playlist
    let foundIndex = shuffledPlaylist.findIndex(track => track.title === previousTrackTitle);
    if (foundIndex === -1) {
        foundIndex = 0; // If not found, start from the first track
    }

    currentTrackIndex = foundIndex;
    loadTrack(currentTrackIndex);

    // Resume playback at the saved time
    audioPlayer.currentTime = currentSongTime;
    if (isPlaying) {
        audioPlayer.play();
    }
}
function loadNewPlaylist(newPlaylist, previousTrackTitle) {
    shuffledPlaylist = [...newPlaylist];

    // Find the same track in the new playlist
    let foundIndex = shuffledPlaylist.findIndex(track => track.title === previousTrackTitle);
    if (foundIndex === -1) {
        foundIndex = 0; // If not found, start from the first track
    }

    currentTrackIndex = foundIndex;
    loadTrack(currentTrackIndex);

    // Resume playback at the saved time
    audioPlayer.currentTime = currentSongTime;
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Event Listeners for Buttons
document.getElementById('next-btn').addEventListener('click', () => changeDisc('next'));
document.getElementById('prev-btn').addEventListener('click', () => changeDisc('prev'));
playButton.addEventListener('click', togglePlay);
audioPlayer.addEventListener('ended', playNextTrack);
shuffleButton.addEventListener('click', toggleShuffle);
nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPreviousTrack);