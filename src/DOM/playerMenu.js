import {
  createRandomizeButton,
  createClearButton,
  createStartGameButton,
  createReturnToStartMenuButton,
} from "./createButtons";

import { createGameBoard } from "./boardDOM";
import { placePlayerShip } from "../modules/controller";

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

function createDOMShip(id, length, shipsArr) {
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
}

function createShips(selectionBoard) {
  const board = selectionBoard || document.querySelector(".selectionBoard");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  const ships = [];
  createDOMShip(1, 2, ships);
  createDOMShip(2, 2, ships);
  createDOMShip(3, 2, ships);
  createDOMShip(4, 2, ships);

  createDOMShip(5, 3, ships);
  createDOMShip(6, 3, ships);
  createDOMShip(7, 3, ships);

  createDOMShip(8, 4, ships);
  createDOMShip(9, 4, ships);

  createDOMShip(10, 5, ships);

  ships.forEach((ship) => {
    board.appendChild(ship);
  });
}

function restartShips(selectionBoard) {
  createShips(selectionBoard);
}

function hideShips(container) {
  const ships = container.querySelectorAll(".ship");
  ships.forEach((ship) => {
    ship.classList.add("hidden");
  });
}

export default function playerMenu(twoPlayers) {
  const playerMenuContainer = document.createElement("div");
  content.appendChild(playerMenuContainer);

  const choosingBoards = document.createElement("div");
  choosingBoards.classList.add("choosingBoards");
  playerMenuContainer.appendChild(choosingBoards);

  const playerOneContainer = document.createElement("div");
  playerOneContainer.classList.add("playerOneContainer");
  choosingBoards.appendChild(playerOneContainer);

  const selectionBoard = document.createElement("div");
  selectionBoard.classList.add("selectionBoard");
  playerOneContainer.appendChild(selectionBoard);
  createShips(selectionBoard);

  const playerBoard = createGameBoard("human", playerOneContainer);

  const randomizeButtonContainer = document.createElement("div");
  const randomizeButton = createRandomizeButton(randomizeButtonContainer);
  randomizeButton.addEventListener("click", () => hideShips(selectionBoard));

  const clearButtonContainer = document.createElement("div");
  const clearButton = createClearButton(clearButtonContainer);
  clearButton.addEventListener("click", () => restartShips(selectionBoard));

  playerOneContainer.appendChild(randomizeButtonContainer);
  playerOneContainer.appendChild(clearButtonContainer);

  if (twoPlayers) {
    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.classList.add("playerTwoContainer");
    choosingBoards.appendChild(playerTwoContainer);

    const selectionBoard2 = document.createElement("div");
    selectionBoard2.classList.add("selectionBoard");
    playerTwoContainer.appendChild(selectionBoard2);
    createShips(selectionBoard2);

    const playerBoard2 = createGameBoard("human2", playerTwoContainer);

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
    clearButton2.addEventListener("click", () => restartShips(selectionBoard2));

    playerTwoContainer.appendChild(randomizeButtonContainer2);
    playerTwoContainer.appendChild(clearButtonContainer2);
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

  const startGameButtonContainer = document.createElement("div");
  createStartGameButton(startGameButtonContainer);

  const returnToStartMenuContainer = document.createElement("div");
  createReturnToStartMenuButton(returnToStartMenuContainer);

  choosingBoards.appendChild(startGameButtonContainer);
  choosingBoards.appendChild(returnToStartMenuContainer);

  return playerMenuContainer;
}
