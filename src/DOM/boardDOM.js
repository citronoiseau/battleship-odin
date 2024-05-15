/* eslint-disable no-plusplus */
export function createGameBoard(typeofPlayer, parent) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.id = `${typeofPlayer}BoardContainer`;
  gameboardContainer.classList.add("gameboardContainer");
  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  gameboard.id = `${typeofPlayer}board`;
  gameboardContainer.appendChild(gameboard);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.textContent = "";
      cell.dataset.row = i;
      cell.dataset.column = j;
      gameboard.appendChild(cell);
      cell.classList.add("cell");
      cell.classList.add(`${typeofPlayer}`);
    }
  }
  parent.appendChild(gameboardContainer);
  return gameboardContainer;
}

export function renderBoard(board, typeOfPlayer) {
  const gameboard = document.getElementById(`${typeOfPlayer}board`);

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
