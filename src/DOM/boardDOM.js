/* eslint-disable no-plusplus */
export function createGameBoard(typeofPlayer, parent) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.id = `${typeofPlayer}BoardContainer`;
  gameboardContainer.classList.add("gameboardContainer");
  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  gameboard.id = `${typeofPlayer}`;
  gameboardContainer.appendChild(gameboard);

  const numberContainerX = document.createElement("div");
  numberContainerX.classList.add("numberContainerX");
  gameboard.appendChild(numberContainerX);
  for (let i = 0; i < 10; i++) {
    const numberCell = document.createElement("div");
    numberCell.textContent = i;
    numberCell.classList.add("number-cell");
    numberContainerX.appendChild(numberCell);
  }

  const numberContainerY = document.createElement("div");
  numberContainerY.classList.add("numberContainerY");
  gameboard.appendChild(numberContainerY);
  for (let i = 0; i < 10; i++) {
    const numberCell = document.createElement("div");
    numberCell.textContent = i;
    numberCell.classList.add("number-cell");
    numberContainerY.appendChild(numberCell);
  }

  const cells = document.createElement("div");
  cells.classList.add("cells");
  gameboard.appendChild(cells);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.textContent = "";
      cell.dataset.row = i;
      cell.dataset.column = j;
      cells.appendChild(cell);
      cell.classList.add("cell");
      cell.classList.add(`${typeofPlayer}`);
    }
  }

  parent.appendChild(gameboardContainer);
  return gameboardContainer;
}

export function renderBoard(board, typeOfPlayer) {
  const gameboard = document.getElementById(`${typeOfPlayer}`);

  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      const cell = gameboard.querySelector(
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
    }
  }
}

export function hideCells(typeOfPlayer) {
  const gameboard = document.getElementById(`${typeOfPlayer}`);
  const cells = gameboard.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.classList.add("hidden");
  });
}
