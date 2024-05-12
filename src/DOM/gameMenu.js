import { registerPlayerHit } from "../modules/controller";
import { createGameBoard } from "./boardDOM";

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
        console.log(computerBoard);
        registerPlayerHit(cell);
      }
    });
  });
}
