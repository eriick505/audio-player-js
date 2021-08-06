import mockPlaylist from "./data.js";

const Player = {
  playlistUL: document.querySelector(".playlist"),
  togglePlayBTN: document.querySelectorAll(".togglePlay"),
  togglePlaySPAN: document.querySelectorAll(".togglePlay span"),
  nextBTN: document.querySelector("#next"),

  isPlaying: false,
  data: mockPlaylist,

  currentPlaying: 0,
  currentSong: {},

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

  next() {
    this.reset();

    this.currentPlaying++;

    if (this.currentPlaying === this.data.length) {
      return;
    }

    this.createAudio(this.data[this.currentPlaying].src);
    this.initPlayList();
    this.play();
  },

  reset() {
    this.audio.currentTime = 0;
    this.audio.src = "";
    this.pause();
  },

  activeActions() {
    this.togglePlayBTN.forEach((btn) => {
      btn.addEventListener("click", () => this.togglePlayPause());
    });

    this.nextBTN.onclick = () => {
      this.next();
    };
  },

  start() {
    this.createAudio(this.data[this.currentPlaying].src);
    this.initPlayList();

    this.audio.onloadeddata = () => this.activeActions();
  },
};

export default Player;
