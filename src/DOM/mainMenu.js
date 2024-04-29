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

function clearBoard(board) {
  const cells = board.querySelectorAll(".cell");
  cells.forEach((cell) => {
    if (cell.classList.contains("ship")) {
      cell.classList.remove("ship");
    }
  });
}

export function renderBoard(board, typeOfPlayer) {
  const domBoard = document.getElementById(`${typeOfPlayer}board`);
  clearBoard(domBoard);
  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      const cell = domBoard.querySelector(
        `[data-row='${i}'][data-column='${j}']`,
      );
      if (board.board[i][j].ship) {
        cell.classList.add("ship");
      }
      if (board.board[i][j].hit) {
        cell.classList.add("hit");
      }
    }
  }
}

export function mainMenu() {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");

  content.appendChild(gameContainer);
  createGameBoard("player", gameContainer);
  createGameBoard("computer", gameContainer);
  const playerBoardContainer = document.getElementById("playerBoardContainer");
  const randomizeButton = document.createElement("button");
  randomizeButton.id = "randomButton";
  playerBoardContainer.appendChild(randomizeButton);
  randomizeButton.textContent = "Randomize ships!";
}
