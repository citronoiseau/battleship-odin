import { registerPlayerHit } from "../modules/controller";
import { createGameBoard } from "./boardDOM";
import { createRestartGameButton } from "./createButtons";

const content = document.querySelector("#content");

export default function gameMenu() {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");

  content.appendChild(gameContainer);
  const playerBoard = createGameBoard("human", gameContainer);
  const computerBoard = createGameBoard("computer", gameContainer);

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

  const restartGameButtonContainer = document.createElement("div");
  createRestartGameButton(restartGameButtonContainer);

  gameContainer.appendChild(restartGameButtonContainer);
  return gameContainer;
}
