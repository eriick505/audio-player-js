import mockPlaylist from "./data.js";
import { convertSecondsToMinutes } from "./utils.js";

const Player = {
  playlistUL: document.querySelector(".playlist"),
  togglePlayBTN: document.querySelectorAll(".togglePlay"),
  togglePlaySPAN: document.querySelectorAll(".togglePlay span"),

  titleEl: document.querySelector("#title"),
  bandEl: document.querySelector("#band"),
  titleBottomEl: document.querySelector("#titleBottom"),
  bandBottomEl: document.querySelector("#bandBottom"),

  currentDurationEl: document.querySelector(".initial_duration"),
  seekbarEl: document.querySelector("#seekbar"),
  totalDurationEl: document.querySelector(".total_duration"),

  prevBTN: document.querySelector("#prev"),
  nextBTN: document.querySelector("#next"),

  isPlaying: false,
  data: mockPlaylist,

  currentPlaying: 0,

  createAudio(src) {
    this.audio = new Audio(src);
  },

  initPlayList() {
    const createTemplateLI = (item, index) => `
    <li class="song ${this.currentPlaying === index ? "active" : ""}">
      <span class="order">${index + 1}</span>
      <div class="info">
        <h5>${item.title}</h5>
        <span>${item.band}</span>
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

    this.currentPlaying++;

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
    this.audio.src = "";
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
