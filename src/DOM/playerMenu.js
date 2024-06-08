import {
  createRandomizeButton,
  createClearButton,
  createStartGameButton,
  createReturnToStartMenuButton,
} from "./createButtons";

import { createGameBoard, hideCells } from "./boardDOM";
import {
  placePlayerShip,
  checkFirstPlayerShips,
  checkSecondPlayerShips,
} from "../modules/controller";

const content = document.querySelector("#content");
function handleDragStart(event) {
  event.dataTransfer.setDragImage(event.target, 20, 20);
  const ship = event.currentTarget.dataset;
  const shipData = JSON.stringify(ship);
  event.dataTransfer.setData("text/plain", shipData);
}

function handleDragOver(event) {
  event.preventDefault();
  const cell = event.target;
  cell.classList.add("highlighted");
}

function handleDragLeave(event) {
  const cell = event.target;
  cell.classList.remove("highlighted");
}

function handleDrop(event) {
  event.preventDefault();
  const cell = event.target;
  cell.classList.remove("highlighted");
  const shipData = event.dataTransfer.getData("text/plain");
  const ship = JSON.parse(shipData);
  const shipId = ship.id;
  const isHorizontal = ship.isHorizontal === "true";
  const shipLength = parseInt(ship.length, 10);

  const x = parseInt(cell.getAttribute("data-row"), 10);
  const y = parseInt(cell.getAttribute("data-column"), 10);
  const board = cell.closest(".gameboard");
  const gameboardContainer = board.closest(".gameboardContainer");
  const parentContainer = gameboardContainer.parentElement;

  const selectionBoard = parentContainer.querySelector(".selectionBoard");

  const placed = placePlayerShip(
    shipId,
    x,
    y,
    isHorizontal,
    shipLength,
    board.id,
  );
  if (placed) {
    const placedShip = selectionBoard.querySelector(`[data-id="${shipId}"]`);
    placedShip.classList.add("hidden");
  }
}

function rotateShip(ship) {
  if (ship.classList.contains("rotated")) {
    ship.classList.remove("rotated");
    ship.dataset.isHorizontal = false;
  } else {
    ship.classList.add("rotated");
    ship.dataset.isHorizontal = true;
  }
}

function handleRotation(event) {
  event.preventDefault();
  rotateShip(event.currentTarget);
}

function createDOMShip(id, length, shipsArr, parent) {
  const shipContainer = document.createElement("div");
  shipContainer.classList.add("shipContainer");
  const ship = document.createElement("div");
  ship.classList.add("ship");
  shipContainer.appendChild(ship);

  ship.dataset.length = length;
  ship.dataset.isHorizontal = false;
  ship.dataset.id = id;

  for (let i = 1; i <= length; i++) {
    const shipPart = document.createElement("div");
    shipPart.classList.add("shipPart");
    ship.appendChild(shipPart);
  }
  shipsArr.push(shipContainer);

  ship.setAttribute("draggable", true);
  ship.addEventListener("dragstart", handleDragStart);
  ship.addEventListener("contextmenu", handleRotation);

  parent.appendChild(shipContainer);
}

function createShips(selectionBoard) {
  const board = selectionBoard || document.querySelector(".selectionBoard");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  const ships = [];
  createDOMShip(1, 2, ships, board);
  createDOMShip(2, 2, ships, board);
  createDOMShip(3, 2, ships, board);
  createDOMShip(4, 2, ships, board);

  createDOMShip(5, 3, ships, board);
  createDOMShip(6, 3, ships, board);
  createDOMShip(7, 3, ships, board);

  createDOMShip(8, 4, ships, board);
  createDOMShip(9, 4, ships, board);

  createDOMShip(10, 5, ships, board);
}

function restartShips(selectionBoard) {
  createShips(selectionBoard);
}

function hideShips(container) {
  container.classList.add("hidden");
}

export default function playerMenu(twoPlayers) {
  const selectMenuContainer = document.createElement("div");
  selectMenuContainer.classList.add("selectMenuContainer");
  content.appendChild(selectMenuContainer);

  if (!twoPlayers) {
    const screenControlsContainer = document.createElement("div");
    screenControlsContainer.classList.add("screenControlsContainer");
    selectMenuContainer.appendChild(screenControlsContainer);

    const returnToStartMenuContainer = document.createElement("div");
    createReturnToStartMenuButton(returnToStartMenuContainer, true);

    const startGameButtonContainer = document.createElement("div");
    createStartGameButton(startGameButtonContainer);

    screenControlsContainer.appendChild(returnToStartMenuContainer);
    screenControlsContainer.appendChild(startGameButtonContainer);
  }

  const choosingContainer = document.createElement("div");
  choosingContainer.classList.add("choosingContainer");
  selectMenuContainer.appendChild(choosingContainer);

  const playerOneContainer = document.createElement("div");
  playerOneContainer.classList.add("playerOneContainer");
  choosingContainer.appendChild(playerOneContainer);

  const selectionBoard = document.createElement("div");
  selectionBoard.classList.add("selectionBoard");
  playerOneContainer.appendChild(selectionBoard);
  createShips(selectionBoard);

  const playerBoard = createGameBoard("human", playerOneContainer);

  const boardControlsContainer = document.createElement("div");
  boardControlsContainer.classList.add("boardControlsContainer");
  playerOneContainer.appendChild(boardControlsContainer);

  const randomizeButtonContainer = document.createElement("div");
  const randomizeButton = createRandomizeButton(randomizeButtonContainer);
  randomizeButton.addEventListener("click", () => hideShips(selectionBoard));

  const clearButtonContainer = document.createElement("div");
  const clearButton = createClearButton(clearButtonContainer);
  clearButton.addEventListener("click", () => {
    selectionBoard.classList.remove("hidden");
    restartShips(selectionBoard);
  });
  boardControlsContainer.appendChild(randomizeButtonContainer);
  boardControlsContainer.appendChild(clearButtonContainer);

  if (twoPlayers) {
    const controlButtonsContainer = document.createElement("div");
    controlButtonsContainer.classList.add("controlButtonsContainer");
    choosingContainer.appendChild(controlButtonsContainer);

    const returnToStartMenuContainer = document.createElement("div");
    createReturnToStartMenuButton(returnToStartMenuContainer, true);

    const startGameButtonContainer = document.createElement("div");
    createStartGameButton(startGameButtonContainer);

    controlButtonsContainer.appendChild(startGameButtonContainer);
    controlButtonsContainer.appendChild(returnToStartMenuContainer);

    const hideFirstPlayer = document.createElement("button");
    hideFirstPlayer.id = "hideFirstPlayer";
    hideFirstPlayer.textContent = "Pass selecting to other player";

    const hideSecondPlayer = document.createElement("button");
    hideSecondPlayer.id = "hideSecondPlayer";
    hideSecondPlayer.textContent = "Finish selecting";
    hideSecondPlayer.style.display = "none";

    const selectionBoard2 = document.createElement("div");
    selectionBoard2.classList.add("selectionBoard");
    selectionBoard2.classList.add("hidden");

    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.classList.add("playerTwoContainer");

    const boardControlsContainer2 = document.createElement("div");
    boardControlsContainer2.classList.add("boardControlsContainer");
    boardControlsContainer2.classList.add("hidden");

    hideFirstPlayer.addEventListener("click", () => {
      if (checkFirstPlayerShips()) {
        hideCells("human");
        selectionBoard2.classList.remove("hidden");
        boardControlsContainer2.classList.remove("hidden");
        boardControlsContainer.classList.add("hidden");
        hideFirstPlayer.style.display = "none";
        hideSecondPlayer.style.display = "block";
      }
    });

    hideSecondPlayer.addEventListener("click", () => {
      if (checkSecondPlayerShips()) {
        hideCells("human2");
        boardControlsContainer2.classList.add("hidden");
        hideSecondPlayer.classList.add("hidden");
      }
    });

    controlButtonsContainer.appendChild(hideFirstPlayer);
    controlButtonsContainer.appendChild(hideSecondPlayer);

    choosingContainer.appendChild(playerTwoContainer);

    playerTwoContainer.appendChild(selectionBoard2);
    createShips(selectionBoard2);

    const playerBoard2 = createGameBoard("human2", playerTwoContainer);

    playerTwoContainer.appendChild(boardControlsContainer2);

    const randomizeButtonContainer2 = document.createElement("div");
    const randomizeButton2 = createRandomizeButton(
      randomizeButtonContainer2,
      true,
    );
    randomizeButton2.addEventListener("click", () =>
      hideShips(selectionBoard2),
    );

    const clearButtonContainer2 = document.createElement("div");
    const clearButton2 = createClearButton(clearButtonContainer2, true);
    clearButton2.addEventListener("click", () => {
      selectionBoard2.classList.remove("hidden");
      restartShips(selectionBoard2);
    });

    boardControlsContainer2.appendChild(randomizeButtonContainer2);
    boardControlsContainer2.appendChild(clearButtonContainer2);
  } else {
    playerOneContainer.classList.add("oneLayout");
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("dragleave", handleDragLeave);
    cell.addEventListener("drop", handleDrop);
  });

  return selectMenuContainer;
}
