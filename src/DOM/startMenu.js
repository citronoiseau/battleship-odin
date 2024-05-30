import {
  createGameModeChangeButton,
  createInitializeGameButton,
  createGameStyleChangeButton,
} from "./createButtons";

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

  const gameModeButtonContainer = document.createElement("div");
  createGameModeChangeButton(gameModeButtonContainer);

  const gameStyleButtonContainer = document.createElement("div");
  createGameStyleChangeButton(gameStyleButtonContainer);

  startMenuContainer.appendChild(startGameButtonContainer);
  startMenuContainer.appendChild(gameModeButtonContainer);
  startMenuContainer.appendChild(gameStyleButtonContainer);

  return startMenuContainer;
}
