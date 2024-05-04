import { registerHit } from "../modules/controller";

const content = document.querySelector("#content");

function handleClick(row, column) {
  console.log(`Clicked cell at row ${row}, column ${column}`);
}

function createGameBoard(typeofPlayer, parent) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.id = `${typeofPlayer}BoardContainer`;
  gameboardContainer.classList.add("gameboardContainer");
  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  gameboard.id = `${typeofPlayer}board`;
  gameboardContainer.appendChild(gameboard);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("button");
      cell.textContent = "";
      cell.dataset.row = i;
      cell.dataset.column = j;
      gameboard.appendChild(cell);
      cell.classList.add("cell");
      cell.classList.add(`${typeofPlayer}`);
      cell.addEventListener("click", () => handleClick(i, j));
    }
  }

  parent.appendChild(gameboardContainer);
}

export function renderBoard(board, typeOfPlayer) {
  const domBoard = document.getElementById(`${typeOfPlayer}board`);

  const cells = domBoard.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });

  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      const cell = domBoard.querySelector(
        `[data-row='${i}'][data-column='${j}']`,
      );
      if (board.board[i][j].ship) {
        cell.classList.add("ship");
      } else {
        cell.classList.remove("ship");
      }
      if (board.board[i][j].hit) {
        cell.classList.add("hit");
      } else {
        cell.classList.remove("hit");
      }
      cell.addEventListener("click", () => {
        if (
          !cell.classList.contains("hit") &&
          !cell.classList.contains("human")
        ) {
          registerHit(cell, board, typeOfPlayer);
        }
      });
    }
  }
}

export function mainMenu() {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");

  content.appendChild(gameContainer);
  createGameBoard("human", gameContainer);
  createGameBoard("computer", gameContainer);
  const humanBoardContainer = document.getElementById("humanBoardContainer");
  const randomizeButton = document.createElement("button");
  randomizeButton.id = "randomButton";
  humanBoardContainer.appendChild(randomizeButton);
  randomizeButton.textContent = "Randomize ships!";
  // randomizeButton.addEventListener("click", () => {
  //   randomizeShips(controller.players[1].board, "human");
  // });
}
