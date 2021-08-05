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

const API_BASE = "http://localhost:8080";
const ENDPOINT_FILE_LIST = "api/v1/list-files";

console.log(`${API_BASE}/${ENDPOINT_FILE_LIST}`);
fetch(`${API_BASE}/${ENDPOINT_FILE_LIST}`)
  .then((r) => r.json())
  .then((json) => console.log(json));
