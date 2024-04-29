import Player from "../classes/player";
import { renderBoard } from "../DOM/mainMenu";

function randomizeShips(board, typeOfPlayer) {
  board.placeShipsRandomly();
  renderBoard(board, typeOfPlayer);
}

function registerHit(cell, board, typeOfPlayer) {
  const x = parseInt(cell.getAttribute("data-row"), 10);
  const y = parseInt(cell.getAttribute("data-column"), 10);
  board.receiveAttack(x, y);
  if (board.areAllShipsSunk()) {
    console.log("You won!");
  }
  renderBoard(board, typeOfPlayer);
}

export default function setUpNewGame() {
  const computerPlayer = new Player("computer");
  const humanPlayer = new Player("human");

  randomizeShips(humanPlayer.board, "player");
  randomizeShips(computerPlayer.board, "computer");

  const randomButton = document.getElementById("randomButton");
  randomButton.addEventListener("click", () => {
    randomizeShips(humanPlayer.board, "player");
  });

  const computerCells = document.querySelectorAll(".cell.computer");
  computerCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!cell.classList.contains("hit")) {
        registerHit(cell, computerPlayer.board, "computer");
      }
    });
  });
}
