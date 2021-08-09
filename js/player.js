import mockPlaylist from "./data.js";
import { convertSecondsToMinutes } from "./utils.js";

const Player = {
  playlistUL: document.querySelector(".playlist"),
  togglePlayBTN: document.querySelectorAll(".togglePlay"),
  togglePlaySPAN: document.querySelectorAll(".togglePlay span"),
  shuffleBTN: document.querySelector("#shuffle"),

  titleEl: document.querySelector("#title"),
  bandEl: document.querySelector("#band"),
  titleBottomEl: document.querySelector("#titleBottom"),
  bandBottomEl: document.querySelector("#bandBottom"),

  currentDurationEl: document.querySelector(".initial_duration"),
  seekbarEl: document.querySelector("#seekbar"),
  totalDurationEl: document.querySelector(".total_duration"),
  currentSongEl: document.querySelector(".step_current_song"),

  prevBTN: document.querySelector("#prev"),
  nextBTN: document.querySelector("#next"),

  isPlaying: false,
  isShuffling: false,
  data: mockPlaylist,

  currentPlaying: 0,

  createAudio(src) {
    this.audio = new Audio(src);
  },

  initPlayList() {
    const createTemplateLI = ({ title, band }, index) => `
    <li
      data-song="${index}"
      class="song ${this.currentPlaying === index ? "active" : ""}"
    >
      <span class="order">${index + 1}</span>
      <div class="info">
        <h5>${title}</h5>
        <span>${band}</span>
      </div>
      <div class="menu">
        <button><span class="material-icons">more_vert</span></button>
      </div>
    </li>
  `;

    const li = this.data.map(createTemplateLI).join("");

    this.playlistUL.innerHTML = li;
  },

  updatePlayer() {
    const { title, band } = this.data[this.currentPlaying];

    this.titleEl.textContent = title;
    this.bandEl.textContent = band;
    this.titleBottomEl.textContent = title;
    this.bandBottomEl.textContent = band;
  },

  play() {
    this.isPlaying = true;
    this.audio.play();
  },

  pause() {
    this.isPlaying = false;
    this.audio.pause();
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }

    this.togglePlayPauseIcons();
  },

  togglePlayPauseIcons() {
    const changeIconToPlayArrow = (span) => (span.innerText = "play_arrow");
    const changeIconToPause = (span) => (span.innerText = "pause");

    if (!this.isPlaying) {
      this.togglePlaySPAN.forEach(changeIconToPlayArrow);
    } else {
      this.togglePlaySPAN.forEach(changeIconToPause);
    }
  },

  handlePlayPauseButtons() {
    const addEventOnClick = (btn) => {
      btn.onclick = () => this.togglePlayPause();
    };

    this.togglePlayBTN.forEach(addEventOnClick);
  },

  prev() {
    if (this.currentPlaying === 0) {
      return;
    }
    this.reset();

    this.currentPlaying--;

    this.start();
    this.play();
    this.togglePlayPauseIcons();
  },

  next() {
    this.reset();

    if (this.isShuffling) {
      this.currentPlaying = Math.floor(Math.random() * this.data.length);
    } else {
      this.currentPlaying++;
    }

    if (this.currentPlaying === this.data.length) {
      this.currentPlaying = 0;
    }

    this.start();
    this.play();
    this.togglePlayPauseIcons();
  },

  reset() {
    this.pause();
    this.audio.currentTime = 0;
  },

  setShuffle() {
    this.isShuffling = !this.isShuffling;
    this.shuffleBTN.classList.toggle("active");
  },

  onShuffle() {
    this.setShuffle();

    if (this.isShuffling && !this.isPlaying) {
      this.currentPlaying = Math.floor(Math.random() * this.data.length);

      console.log(this.currentPlaying, "onshuffle");

      this.start();
      this.play();
      this.togglePlayPauseIcons();
    }
  },

  updateTime() {
    this.changeSeekbarStyle();

    this.currentDurationEl.textContent = convertSecondsToMinutes(
      this.audio.currentTime
    );

    this.seekbarEl.value = this.audio.currentTime;
  },

  setSeekbar(value) {
    this.audio.currentTime = value;
  },

  changeSeekbarStyle() {
    const min = this.seekbarEl.min;
    const max = this.seekbarEl.max;
    const value = this.seekbarEl.value;

    this.seekbarEl.style.backgroundSize =
      ((value - min) * 100) / (max - min) + "% 100%";
  },

  changeSongOnClick(event) {
    const target = event.target;
    const targetSong = Number(target.dataset.song);
    const isButton = target.tagName === "BUTTON";
    const parentIsMenu = target.parentNode.classList.contains("menu");

    if (isButton && parentIsMenu) {
      return;
    }

    this.reset();
    this.currentPlaying = targetSong;
    this.start();

    this.onAudioLoadedData(() => {
      this.play();
      this.togglePlayPauseIcons();
    });
  },

  showCurrentSong() {
    this.currentSongEl.innerHTML = `${this.currentPlaying + 1}/${
      this.data.length
    }`;
  },

  activeActions() {
    this.handlePlayPauseButtons();

    this.prevBTN.onclick = () => this.prev();
    this.nextBTN.onclick = () => this.next();

    this.audio.ontimeupdate = () => this.updateTime();

    this.seekbarEl.max = this.audio.duration;
    this.seekbarEl.oninput = () => {
      this.setSeekbar(this.seekbarEl.value);
      this.changeSeekbarStyle();
    };

    this.totalDurationEl.innerText = convertSecondsToMinutes(
      this.audio.duration
    );

    this.showCurrentSong();

    this.playlistUL.onclick = (e) => this.changeSongOnClick(e);
    this.shuffleBTN.onclick = () => this.onShuffle();
  },

  onAudioLoadedData(callback) {
    this.audio.addEventListener("loadeddata", () => callback());
  },

  start() {
    this.createAudio(this.data[this.currentPlaying].src);
    this.initPlayList();
    this.updatePlayer();
    this.onAudioLoadedData(() => this.activeActions());
  },
};

export default Player;
