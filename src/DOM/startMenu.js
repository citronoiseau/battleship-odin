import { createInitializeGameButton } from "./createButtons";

const content = document.querySelector("#content");

export default function startMenu() {
  const startMenuContainer = document.createElement("div");
  content.appendChild(startMenuContainer);

  const titleContainer = document.createElement("div");

  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = "PaperBoats";
  titleContainer.appendChild(title);

  startMenuContainer.appendChild(titleContainer);

  const startGameButtonContainer = document.createElement("div");
  createInitializeGameButton(startGameButtonContainer);

  startMenuContainer.appendChild(startGameButtonContainer);
}
