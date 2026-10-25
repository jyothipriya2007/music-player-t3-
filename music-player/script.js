
const audio = document.getElementById("audio");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumArt = document.getElementById("albumArt");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const muteBtn = document.getElementById("muteBtn");
const playlist = document.getElementById("playlist");
const autoplay = document.getElementById("autoplay");
const repeatBtn = document.getElementById("repeatBtn");
const status = document.getElementById("status");

const songs = [
    {
        title: "How You Like That",
        artist: "BLACKPINK",
        file: "songs/how-you-like-that.mp3",
        color: "linear-gradient(135deg, #7028e4, #f02b9c)"
    },
    {
        title: "Kill This Love",
        artist: "BLACKPINK",
        file: "songs/kill-this-love.mp3",
        color: "linear-gradient(135deg, #f02b9c, #2525a8)"
    },
    {
        title: "Summertime Sadness",
        artist: "Lana Del Rey",
        file: "songs/summertime-sadness.mp3",
        color: "linear-gradient(135deg, #322080, #bd4cbb)"
    },
    {
        title: "Young and Beautiful",
        artist: "Lana Del Rey",
        file: "songs/young-and-beautiful.mp3",
        color: "linear-gradient(135deg, #171044, #6544b9)"
    },
    {
        title: "Sorry",
        artist: "Justin Bieber",
        file: "songs/sorry.mp3",
        color: "linear-gradient(135deg, #173d91, #7d39d9)"
    },
    {
        title: "Love Yourself",
        artist: "Justin Bieber",
        file: "songs/love-yourself.mp3",
        color: "linear-gradient(135deg, #1646ad, #b63ed3)"
    },
    {
        title: "Jai Ho",
        artist: "A. R. Rahman",
        file: "songs/jai-ho.mp3",
        color: "linear-gradient(135deg, #bd288b, #323ac7)"
    },
    {
        title: "Kun Faya Kun",
        artist: "A. R. Rahman",
        file: "songs/kun-faya-kun.mp3",
        color: "linear-gradient(135deg, #5427ad, #1767bd)"
    }
];

let currentSong = 0;
let isRepeat = false;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
}

function updatePlaylist() {
    const items = playlist.querySelectorAll(".song-item");

    items.forEach((item, index) => {
        item.classList.toggle("active", index === currentSong);
        item.querySelector(".song-number").textContent =
            index === currentSong && !audio.paused
                ? "♫"
                : String(index + 1).padStart(2, "0");
    });

    document.getElementById("songCount").textContent =
        `${songs.length} tracks`;
}

function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("button");
        item.className = "song-item";
        item.type = "button";

        item.innerHTML = `
            <span class="song-number"></span>
            <span class="song-details">
                <strong></strong>
                <span></span>
            </span>
            <span class="song-duration">--:--</span>
        `;

        item.querySelector("strong").textContent = song.title;
        item.querySelector(".song-details span").textContent =
            song.artist;

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(item);
    });

    updatePlaylist();
}

function loadSong(index) {
    currentSong = (index + songs.length) % songs.length;
    const song = songs[currentSong];

    audio.pause();
    audio.src = song.file;
    audio.load();

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.style.background = song.color;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");

    status.textContent = "Loading song...";
    updatePlaylist();
}

async function playSong() {
    if (!audio.src) {
        loadSong(currentSong);
    }

    status.textContent = "Loading audio...";

    try {
        await audio.play();
        playBtn.textContent = "❚❚";
        playBtn.setAttribute("aria-label", "Pause");
        status.textContent = "Now playing";
        updatePlaylist();
    } catch (error) {
        playBtn.textContent = "▶";
        updatePlaylist();

        if (audio.error) {
            status.textContent =
                "Cannot load audio. Check the MP3 filename and path.";
        } else {
            status.textContent =
                "Playback failed. Check the audio file and try again.";
        }

        console.error("Playback error:", error);
        console.log("Audio file:", audio.currentSrc);
    }
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");
    status.textContent = "Paused";
    updatePlaylist();
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

nextBtn.addEventListener("click", () => {
    loadSong(currentSong + 1);
    playSong();
});

prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        loadSong(currentSong - 1);
        playSong();
    }
});

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);

    const item = playlist.querySelectorAll(".song-duration")[currentSong];
    if (item) {
        item.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progress.value) / 100) * audio.duration;
    }
});

audio.volume = Number(volume.value);

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = false;
    volumeValue.textContent =
        `${Math.round(audio.volume * 100)}%`;
    muteBtn.textContent = "♫";
});

muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "×" : "♫";
});

audio.addEventListener("play", updatePlaylist);
audio.addEventListener("pause", updatePlaylist);

audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else if (autoplay.checked) {
        loadSong(currentSong + 1);
        playSong();
    } else {
        status.textContent = "Song finished";
        updatePlaylist();
    }
});

repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.textContent =
        isRepeat ? "↻ Repeat: On" : "↻ Repeat: Off";
    repeatBtn.setAttribute("aria-pressed", String(isRepeat));
});

audio.addEventListener("error", () => {
    playBtn.textContent = "▶";
    updatePlaylist();
    status.textContent =
        "Audio file not found or unsupported. Check the songs folder.";
    console.error("Audio loading error:", audio.error?.code);
    console.error("Requested file:", audio.currentSrc);
});

renderPlaylist();
loadSong(0);
