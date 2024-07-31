import { registerPlayerHit, passTurn, readyToHit } from "../modules/controller";
import { createGameBoard } from "./boardDOM";
import {
  createRestartGameButton,
  createReturnToStartMenuButton,
} from "./createButtons";

import { registerPlayerHitMultiplayer } from "../modules/controllerMultiplayer";

const content = document.querySelector("#content");

export function changeMessage(text) {
  const message = document.querySelector(".turnMessage");
  if (message) {
    message.textContent = text;
  }
}

export function gameMenu(twoPlayers, multiplayer) {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");
  content.appendChild(gameContainer);

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("infoContainer");
  gameContainer.appendChild(infoContainer);

  const message = document.createElement("div");
  message.classList.add("turnMessage");
  infoContainer.appendChild(message);

  const boardsContainer = document.createElement("div");
  boardsContainer.classList.add("boardsContainer");
  gameContainer.appendChild(boardsContainer);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttonsContainer");
  gameContainer.appendChild(buttonsContainer);

  const playerBoard = createGameBoard("human", boardsContainer);
  if (twoPlayers) {
    message.classList.remove("hidden");
    const controlButtonsContainer = document.createElement("div");
    buttonsContainer.appendChild(controlButtonsContainer);

    const passTurnButton = document.createElement("button");
    passTurnButton.textContent = "Pass turn";

    const readyToHitButton = document.createElement("button");
    readyToHitButton.textContent = "Ready!";
    readyToHitButton.style.display = "none";

    passTurnButton.addEventListener("click", () => {
      passTurn();
      passTurnButton.style.display = "none";
      readyToHitButton.style.display = "block";
    });

    readyToHitButton.addEventListener("click", () => {
      readyToHit();
      passTurnButton.style.display = "block";
      readyToHitButton.style.display = "none";
    });
    controlButtonsContainer.appendChild(passTurnButton);
    controlButtonsContainer.appendChild(readyToHitButton);

    const playerBoard2 = createGameBoard("human2", boardsContainer);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        registerPlayerHit(cell);
      });
    });
  }
  if (multiplayer) {
    const playerBoard2 = createGameBoard("human2", boardsContainer);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (
          !cell.classList.contains("hit") &&
          !cell.classList.contains("human")
        ) {
          registerPlayerHitMultiplayer(cell);
        }
      });
    });
  }
  if (!twoPlayers && !multiplayer) {
    const computerBoard = createGameBoard("computer", boardsContainer);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (
          !cell.classList.contains("hit") &&
          !cell.classList.contains("human")
        ) {
          registerPlayerHit(cell);
        }
      });
    });
  }
  if (!multiplayer) {
    const restartGameButtonContainer = document.createElement("div");
    createRestartGameButton(restartGameButtonContainer, twoPlayers);
    buttonsContainer.appendChild(restartGameButtonContainer);
  }

  const returnToStartMenuContainer = document.createElement("div");
  createReturnToStartMenuButton(returnToStartMenuContainer, false, multiplayer);

  buttonsContainer.appendChild(returnToStartMenuContainer);
  return gameContainer;
}
