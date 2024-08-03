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
        cell.dataset.id = board.board[i][j].ship.id;
      } else {
        cell.classList.remove("ship");
        cell.removeAttribute("data-id");
      }

      if (board.board[i][j].hit) {
        cell.classList.add("hit");
      } else {
        cell.classList.remove("hit");
      }

      if (board.board[i][j].boardHit) {
        cell.classList.add("boardHit");
      } else {
        cell.classList.remove("boardHit");
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

export function showCells(typeOfPlayer) {
  const gameboard = document.getElementById(`${typeOfPlayer}`);
  const cells = gameboard.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.classList.remove("hidden");
  });
}

export function areCellsHidden(typeOfPlayer) {
  const gameboard = document.getElementById(`${typeOfPlayer}`);
  const hiddenCell = gameboard.querySelector(".cell.hidden");
  return hiddenCell !== null;
}

// multiplayer checkout

function isWithinBounds(x, y) {
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}

function checkoutNeighborCells(gameboard, cells) {
  cells.forEach(([x, y]) => {
    const neighborCells = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    neighborCells.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;

      if (isWithinBounds(newX, newY)) {
        const cell = gameboard.querySelector(
          `.cell[data-row="${newX}"][data-column="${newY}"]`,
        );

        if (
          cell &&
          !cell.classList.contains("hit") &&
          !cell.classList.contains("ship")
        ) {
          cell.classList.add("boardHit");
        }
      }
    });
  });
  renderBoard(gameboard, "human2");
}

export function renderMultiplayerBoard(x, y, result, cells) {
  const gameboard = document.getElementById("human2");
  const cell = gameboard.querySelector(`[data-row='${x}'][data-column='${y}']`);
  if (result === "HIT") {
    cell.classList.add("ship");
    cell.classList.add("hit");
  }
  if (result === "MISS") {
    cell.classList.add("hit");
  }
  if (result === "KILL") {
    cell.classList.add("ship");
    cell.classList.add("hit");
    checkoutNeighborCells(gameboard, cells);
  }
}
