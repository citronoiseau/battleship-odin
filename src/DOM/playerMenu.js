import { createRandomizeButton, createClearButton } from "./createButtons";
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

  const placed = placePlayerShip(shipId, x, y, isHorizontal, shipLength);
  if (placed) {
    const placedShip = document.querySelector(`[data-id="${shipId}"]`);
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

function createShips() {
  const selectionBoard = document.querySelector(".selectionBoard");
  while (selectionBoard.firstChild) {
    selectionBoard.removeChild(selectionBoard.firstChild);
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
    selectionBoard.appendChild(ship);
  });
}

function restartShips() {
  createShips();
}

export default function playerMenu() {
  const titleContainer = document.createElement("div");

  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = "PaperBoats";
  titleContainer.appendChild(title);

  content.appendChild(titleContainer);

  const choosingBoards = document.createElement("div");
  choosingBoards.classList.add("choosingBoards");
  content.appendChild(choosingBoards);

  const selectionBoard = document.createElement("div");
  selectionBoard.classList.add("selectionBoard");
  choosingBoards.appendChild(selectionBoard);
  createShips();

  const playerBoard = createGameBoard("human", choosingBoards);
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("dragleave", handleDragLeave);
    cell.addEventListener("drop", handleDrop);
  });

  choosingBoards.appendChild(playerBoard);

  const deleteButtonContainer = document.createElement("div");
  createRandomizeButton(deleteButtonContainer);

  const clearButtonContainer = document.createElement("div");
  const clearButton = createClearButton(clearButtonContainer);
  console.log(clearButton);
  clearButton.addEventListener("click", restartShips);

  choosingBoards.appendChild(deleteButtonContainer);
  choosingBoards.appendChild(clearButtonContainer);
}
