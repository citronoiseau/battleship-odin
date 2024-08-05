import {
  createGameModeChangeButton,
  createInitializeGameButton,
  createGameStyleChangeButton,
  createCreateGameButton,
} from "./createButtons";

import createDialog from "./helpMenu";
import createJoinGameDialog from "./joinGameDialog";

const content = document.querySelector("#content");

function choosingModeButtons() {
  const buttonContainer = document.querySelector(".buttonContainer");
  while (buttonContainer.firstChild) {
    buttonContainer.removeChild(buttonContainer.firstChild);
  }
  const singleplayerButton = document.createElement("button");
  singleplayerButton.textContent = "Single player";
  buttonContainer.appendChild(singleplayerButton);

  const multiplayerButton = document.createElement("button");
  multiplayerButton.textContent = "Multiplayer";
  buttonContainer.appendChild(multiplayerButton);

  multiplayerButton.addEventListener("click", multiplayer);
  singleplayerButton.addEventListener("click", singleplayer);
}

function singleplayer() {
  const buttonContainer = document.querySelector(".buttonContainer");
  while (buttonContainer.firstChild) {
    buttonContainer.removeChild(buttonContainer.firstChild);
  }

  const startGameButtonContainer = document.createElement("div");
  createInitializeGameButton(startGameButtonContainer);

  const gameModeButtonContainer = document.createElement("div");
  createGameModeChangeButton(gameModeButtonContainer);

  const gameStyleButtonContainer = document.createElement("div");
  createGameStyleChangeButton(gameStyleButtonContainer);

  const goBackButton = document.createElement("button");
  goBackButton.textContent = "Go back!";
  goBackButton.classList.add("goBackButton");

  goBackButton.addEventListener("click", choosingModeButtons);

  buttonContainer.appendChild(startGameButtonContainer);
  buttonContainer.appendChild(gameModeButtonContainer);
  buttonContainer.appendChild(gameStyleButtonContainer);
  buttonContainer.appendChild(goBackButton);
}

function multiplayer() {
  const buttonContainer = document.querySelector(".buttonContainer");
  while (buttonContainer.firstChild) {
    buttonContainer.removeChild(buttonContainer.firstChild);
  }
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.style.display = "none";
  buttonContainer.appendChild(spinner);

  createCreateGameButton(buttonContainer);

  const joinGameButton = document.createElement("button");
  joinGameButton.textContent = "Join game";

  const joinGameDialog = createJoinGameDialog();

  joinGameButton.addEventListener("click", () => {
    joinGameDialog.showModal();
    joinGameDialog.classList.add("active");
  });

  createGameStyleChangeButton(buttonContainer, true);

  const goBackButton = document.createElement("button");
  goBackButton.textContent = "Go back!";
  goBackButton.classList.add("goBackButton");

  goBackButton.addEventListener("click", choosingModeButtons);

  buttonContainer.appendChild(joinGameButton);
  buttonContainer.appendChild(goBackButton);
}

export default function startMenu() {
  const startMenuContainer = document.createElement("div");
  startMenuContainer.classList.add("startMenuContainer");
  content.appendChild(startMenuContainer);

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("titleContainer");
  const title = document.createElement("h1");
  title.classList.add("title");
  title.textContent = "Battleship";
  titleContainer.appendChild(title);

  startMenuContainer.appendChild(titleContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  startMenuContainer.appendChild(buttonContainer);
  choosingModeButtons();

  const helpButtonContainer = document.createElement("div");
  const helpButton = document.createElement("button");
  helpButton.textContent = "Help";

  helpButtonContainer.appendChild(helpButton);

  const message = document.createElement("div");
  message.textContent = "by ";
  message.classList.add("authorMessage");
  const authorLink = document.createElement("a");
  authorLink.textContent = "Anastasiia";
  authorLink.href = "https://github.com/citronoiseau/odin-battleship";
  authorLink.target = "_blank";

  message.appendChild(authorLink);

  startMenuContainer.appendChild(helpButtonContainer);
  startMenuContainer.appendChild(message);

  const dialog = createDialog();
  helpButton.addEventListener("click", () => {
    dialog.showModal();
    dialog.classList.add("active");
  });

  const toast = document.createElement("div");
  toast.id = "toast";
  startMenuContainer.appendChild(toast);

  return startMenuContainer;
}
