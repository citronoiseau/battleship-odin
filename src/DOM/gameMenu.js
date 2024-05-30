import { registerPlayerHit } from "../modules/controller";
import { createGameBoard } from "./boardDOM";
import {
  createRestartGameButton,
  createReturnToStartMenuButton,
} from "./createButtons";

const content = document.querySelector("#content");

export function changeMessage(text) {
  const message = document.querySelector(".turnMessage");
  message.textContent = text;
}

export function gameMenu(twoPlayers) {
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

  const playerBoard = createGameBoard("human", boardsContainer);
  if (twoPlayers) {
    const playerBoard2 = createGameBoard("human2", boardsContainer);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        registerPlayerHit(cell);
      });
    });
  } else {
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

  const restartGameButtonContainer = document.createElement("div");
  createRestartGameButton(restartGameButtonContainer);

  const returnToStartMenuContainer = document.createElement("div");
  createReturnToStartMenuButton(returnToStartMenuContainer);

  gameContainer.appendChild(restartGameButtonContainer);
  gameContainer.appendChild(returnToStartMenuContainer);
  return gameContainer;
}
