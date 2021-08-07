import Player from "./js/player.js";

const playerWrapperEl = document.querySelector(".wrapper_player");
const playerBottomEl = document.querySelector(".player_bottom");
const playerCloseEl = document.querySelector(".close");

const activeClass = "active";

const addActiveClassToPlayerWrapper = (e) => {
  const tagName = e.target.tagName;

  if (tagName !== "BUTTON") {
    playerWrapperEl.classList.add(activeClass);
  }
};

playerBottomEl.addEventListener("click", addActiveClassToPlayerWrapper);

playerCloseEl.addEventListener("click", () =>
  playerWrapperEl.classList.remove(activeClass)
);

console.log(Player);
Player.start();
