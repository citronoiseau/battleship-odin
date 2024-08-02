import {
  createRandomizeButton,
  createClearButton,
  createStartGameButton,
  createReturnToStartMenuButton,
} from "./createButtons";

import { createGameBoard, hideCells } from "./boardDOM";
import {
  placePlayerShip,
  removePlayerShip,
  checkFirstPlayerShips,
  checkSecondPlayerShips,
} from "../modules/controller";

import {
  placePlayerShipMultiplayer,
  removePlayerShipMultiplayer,
  getGameStatus,
} from "../modules/controllerMultiplayer";

let multiplayer;
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
  let placed;
  if (multiplayer) {
    placed = placePlayerShipMultiplayer(
      shipId,
      x,
      y,
      isHorizontal,
      shipLength,
      board.id,
    );
  } else {
    placed = placePlayerShip(shipId, x, y, isHorizontal, shipLength, board.id);
  }
  if (placed) {
    const placedShip = selectionBoard.querySelector(`[data-id="${shipId}"]`);
    placedShip.classList.add("hidden");
  }
}

function removeShip(cell) {
  const shipId = cell.dataset.id;
  const board = cell.closest(".gameboard");
  const gameboardContainer = board.closest(".gameboardContainer");
  const parentContainer = gameboardContainer.parentElement;
  const selectionBoard = parentContainer.querySelector(".selectionBoard");
  if (multiplayer) {
    removePlayerShipMultiplayer(shipId, board.id);
  } else {
    removePlayerShip(shipId, board.id);
  }

  const placedShip = selectionBoard.querySelector(`[data-id="${shipId}"]`);
  placedShip.classList.remove("hidden");
}

function rotateShip(ship) {
  const shipContainer = ship.parentElement;
  const playerType = ship.dataset.player;

  let board;
  if (playerType === "player1") {
    board = document.querySelector(".playerOneContainer");
  }
  if (playerType === "player2") {
    board = document.querySelector(".playerTwoContainer");
  }
  const shipsVertical = board.querySelector(".ships");

  const shipsHorizontal = board.querySelector(".shipsHorizontal");
  if (ship.classList.contains("rotated")) {
    ship.classList.remove("rotated");
    shipsVertical.appendChild(shipContainer);
    ship.dataset.isHorizontal = false;
  } else {
    ship.classList.add("rotated");
    shipsHorizontal.appendChild(shipContainer);
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
  let playerType;

  if (parent.classList.contains("ships")) {
    playerType = "player1";
  }
  if (parent.classList.contains("ships2")) {
    playerType = "player2";
  }

  ship.dataset.length = length;
  ship.dataset.isHorizontal = false;
  ship.dataset.id = id;
  ship.dataset.player = playerType;

  for (let i = 1; i <= length; i++) {
    const shipPart = document.createElement("div");
    shipPart.classList.add("shipPart");
    ship.appendChild(shipPart);
  }
  shipsArr.push(shipContainer);

  ship.setAttribute("draggable", true);
  ship.addEventListener("dragstart", handleDragStart);
  ship.addEventListener("click", handleRotation);

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
  const ships = container.querySelectorAll(".ship");
  ships.forEach((ship) => {
    ship.classList.add("hidden");
  });
}

export function updateGameStatus(status) {
  const message = document.querySelector("#gameStatusMessage");
  if (message) {
    message.textContent = `Your game status is ${status}`;
  }
}

export function updatePlayerMessage(name) {
  const message = document.querySelector("#playerMessage");
  if (message) {
    message.textContent = `You are ${name}`;
  }
}

export function updateGameRulesMessage(rule) {
  const message = document.querySelector("#gameRulesMessage");
  if (message) {
    if (rule === "untilMiss") {
      message.textContent = "Your game style is until miss";
    } else {
      message.textContent = "Your game style is one by one";
    }
  }
  console.log(message);
}

export function showToast(message, alert) {
  const toast = document.querySelector("#toast");
  if (toast) {
    toast.textContent = message;
    if (alert) {
      toast.className = "toast show alert";
    } else {
      toast.className = "toast show";
    }

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

export default function playerMenu(twoPlayers, gameId) {
  const selectMenuContainer = document.createElement("div");
  selectMenuContainer.classList.add("selectMenuContainer");
  content.appendChild(selectMenuContainer);

  if (!twoPlayers) {
    const screenControlsContainer = document.createElement("div");
    screenControlsContainer.classList.add("screenControlsContainer");
    selectMenuContainer.appendChild(screenControlsContainer);

    const returnToStartMenuContainer = document.createElement("div");
    createReturnToStartMenuButton(returnToStartMenuContainer, true, gameId);

    const startGameButtonContainer = document.createElement("div");
    createStartGameButton(startGameButtonContainer, gameId);

    screenControlsContainer.appendChild(returnToStartMenuContainer);
    screenControlsContainer.appendChild(startGameButtonContainer);
  }

  if (gameId) {
    multiplayer = true;

    const gameIdContainer = document.createElement("div");
    gameIdContainer.classList.add("gameIdContainer");
    selectMenuContainer.appendChild(gameIdContainer);

    const gameIdMessage = document.createElement("span");
    gameIdMessage.textContent = "Your game id: ";

    const id = document.createElement("span");
    id.classList.add("gameId");
    id.textContent = gameId;

    const toast = document.createElement("div");
    toast.id = "toast";
    selectMenuContainer.appendChild(toast);

    id.addEventListener("click", () => {
      const textToCopy = gameId;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast(`Game ID copied to clipboard: ${gameId}`);
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    });

    const tooltipText = document.createElement("span");
    tooltipText.classList.add("tooltiptext");
    tooltipText.textContent = "Left-click to copy";
    id.appendChild(tooltipText);

    gameIdContainer.appendChild(gameIdMessage);
    gameIdContainer.appendChild(id);

    const gameStatusMessage = document.createElement("div");
    gameStatusMessage.id = "gameStatusMessage";
    selectMenuContainer.appendChild(gameStatusMessage);

    const playerMessage = document.createElement("div");
    playerMessage.id = "playerMessage";
    selectMenuContainer.appendChild(playerMessage);

    const gameRulesMessage = document.createElement("div");
    gameRulesMessage.id = "gameRulesMessage";
    selectMenuContainer.appendChild(gameRulesMessage);
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

  const boardTextContainer = document.createElement("div");
  boardTextContainer.classList.add("boardTextContainer");
  selectionBoard.appendChild(boardTextContainer);

  const boardName = document.createElement("div");
  boardName.classList.add("boardName");
  boardName.textContent = "Your ships";
  boardTextContainer.appendChild(boardName);

  const helpingContainer = document.createElement("div");
  helpingContainer.classList.add("helpingContainer");
  boardTextContainer.appendChild(helpingContainer);

  const helpingMessage = document.createElement("div");
  helpingMessage.classList.add("helpingMessage");
  helpingMessage.textContent = "• To rotate a ship left click on it";
  helpingContainer.appendChild(helpingMessage);

  const additionalHelpingMessage = document.createElement("div");
  additionalHelpingMessage.classList.add("helpingMessage");
  additionalHelpingMessage.textContent =
    "• To remove a placed ship left click on the board";
  helpingContainer.appendChild(additionalHelpingMessage);

  const ships = document.createElement("div");
  ships.classList.add("ships");
  selectionBoard.appendChild(ships);
  createShips(ships);

  const shipsHorizontal = document.createElement("div");
  shipsHorizontal.classList.add("shipsHorizontal");
  selectionBoard.appendChild(shipsHorizontal);

  const playerBoard = createGameBoard("human", playerOneContainer);

  const boardControlsContainer = document.createElement("div");
  boardControlsContainer.classList.add("boardControlsContainer");
  playerOneContainer.appendChild(boardControlsContainer);

  const randomizeButtonContainer = document.createElement("div");
  let randomizeButton;
  if (gameId) {
    randomizeButton = createRandomizeButton(
      randomizeButtonContainer,
      false,
      true,
    );
  } else {
    randomizeButton = createRandomizeButton(
      randomizeButtonContainer,
      false,
      false,
    );
  }

  randomizeButton.addEventListener("click", () => hideShips(selectionBoard));

  const clearButtonContainer = document.createElement("div");
  const clearButton = createClearButton(clearButtonContainer, false, gameId);

  clearButton.addEventListener("click", () => {
    restartShips(ships);
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

    const boardTextContainer2 = document.createElement("div");
    boardTextContainer2.classList.add("boardTextContainer");
    selectionBoard2.appendChild(boardTextContainer2);

    const boardName2 = document.createElement("div");
    boardName2.classList.add("boardName");
    boardName2.textContent = "Your ships";
    boardTextContainer2.appendChild(boardName2);

    const helpingContainer2 = document.createElement("div");
    helpingContainer2.classList.add("helpingContainer");
    boardTextContainer2.appendChild(helpingContainer2);

    const helpingMessage2 = document.createElement("div");
    helpingMessage2.classList.add("helpingMessage");
    helpingMessage2.textContent = "• To rotate a ship left click on it";
    helpingContainer2.appendChild(helpingMessage2);

    const additionalHelpingMessage2 = document.createElement("div");
    additionalHelpingMessage2.classList.add("helpingMessage");
    additionalHelpingMessage2.textContent =
      "• To remove a placed ship left click on the board";
    helpingContainer2.appendChild(additionalHelpingMessage2);

    const ships2 = document.createElement("div");
    ships2.classList.add("ships2");
    selectionBoard2.appendChild(ships2);
    createShips(ships2);

    const shipsHorizontal2 = document.createElement("div");
    shipsHorizontal2.classList.add("shipsHorizontal");
    selectionBoard2.appendChild(shipsHorizontal2);

    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.classList.add("playerTwoContainer");

    const boardControlsContainer2 = document.createElement("div");
    boardControlsContainer2.classList.add("boardControlsContainer");
    boardControlsContainer2.classList.add("hidden");

    hideFirstPlayer.addEventListener("click", () => {
      if (checkFirstPlayerShips()) {
        hideCells("human");
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
      restartShips(ships2);
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
    cell.addEventListener("drop", handleDrop, gameId);

    cell.addEventListener("click", () => {
      if (cell.dataset.id) {
        removeShip(cell);
      }
    });
  });

  return selectMenuContainer;
}
