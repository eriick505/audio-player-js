import mockPlaylist from "./data.js";

const Player = {
  playlistUL: document.querySelector(".playlist"),
  togglePlayBTN: document.querySelectorAll(".togglePlay"),
  togglePlaySPAN: document.querySelectorAll(".togglePlay span"),

  isPlaying: false,
  currentSong: 0,
  data: mockPlaylist,

  createAudio(src) {
    this.audio = new Audio(src);
  },

  initPlayList() {
    const createTemplateLI = (item, index) => `
    <li class="song ${this.currentSong === index ? "active" : ""}">
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

  activeActions() {
    this.togglePlayBTN.forEach((btn) => {
      btn.addEventListener("click", () => this.togglePlayPause());
    });
  },

  start() {
    this.createAudio(this.data[this.currentSong].src);
    this.initPlayList();

    this.audio.onloadeddata = () => this.activeActions();
  },
};

export default Player;
