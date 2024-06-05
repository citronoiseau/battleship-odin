import {
  createGameModeChangeButton,
  createInitializeGameButton,
  createGameStyleChangeButton,
} from "./createButtons";

import createDialog from "./helpMenu";

const content = document.querySelector("#content");

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

  const startGameButtonContainer = document.createElement("div");
  createInitializeGameButton(startGameButtonContainer);

  const gameModeButtonContainer = document.createElement("div");
  createGameModeChangeButton(gameModeButtonContainer);

  const gameStyleButtonContainer = document.createElement("div");
  createGameStyleChangeButton(gameStyleButtonContainer);

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

  buttonContainer.appendChild(startGameButtonContainer);
  buttonContainer.appendChild(gameModeButtonContainer);
  buttonContainer.appendChild(gameStyleButtonContainer);
  buttonContainer.appendChild(helpButtonContainer);
  startMenuContainer.appendChild(message);

  const dialog = createDialog();
  helpButton.addEventListener("click", () => {
    dialog.showModal();
    dialog.classList.add("active");
  });

  return startMenuContainer;
}
