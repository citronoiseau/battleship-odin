import Player from "../classes/player";
import { renderBoard } from "../DOM/boardDOM";
import changeScreens from "../DOM/screenChanger";
import { changeMessage } from "../DOM/gameMenu";

export const handlePlayers = (function () {
  let computerPlayer = null;
  let humanPlayer = null;
  let activePlayer = null;
  let waitingPlayer = null;

  const initializePlayers = function () {
    computerPlayer = new Player("computer");
    humanPlayer = new Player("human");
    activePlayer = humanPlayer;
    waitingPlayer = computerPlayer;
  };

  const getPlayers = () => [humanPlayer, computerPlayer];

  const getActivePlayer = () => activePlayer;

  const getWaitingPlayer = () => waitingPlayer;

  const switchTurn = function () {
    [activePlayer, waitingPlayer] = [waitingPlayer, activePlayer];
  };

  initializePlayers();

  return {
    getPlayers,
    getActivePlayer,
    switchTurn,
    getWaitingPlayer,
  };
})();

const handleRounds = (function () {
  let isWin = false;

  const checkWin = function () {
    if (isWin) {
      return true;
    }
    return false;
  };

  const registerWin = function () {
    isWin = true;
  };

  const restartRounds = function () {
    isWin = false;
  };
  return { checkWin, registerWin, restartRounds };
})();

const smartComputer = (function () {
  const computerMemory = {
    hitStack: [],
    direction: null,
    directionsTried: {},
    isShipHorizontal: false,
    initialX: null,
    initialY: null,
    isLastHit: false,
    numberOfHits: 0,
    neighborCells: new Set(),
    shipCounters: {
      5: 1,
      4: 2,
      3: 3,
      2: 4,
    },
  };

  const restartComputerMemory = function (fullRestart = false) {
    computerMemory.hitStack = [];
    computerMemory.direction = null;
    computerMemory.directionsTried = {};
    computerMemory.isShipHorizontal = false;
    computerMemory.initialX = null;
    computerMemory.initialY = null;
    computerMemory.isLastHit = false;
    computerMemory.numberOfHits = 0;
    if (fullRestart) {
      computerMemory.neighborCells = new Set();
      computerMemory.shipCounters = {
        5: 1,
        4: 2,
        3: 3,
        2: 4,
      };
    }
  };

  const getAdjacentCell = (x, y, direction) => {
    switch (direction) {
      case "up":
        return { x: x - 1, y };
      case "right":
        return { x, y: y + 1 };
      case "down":
        return { x: x + 1, y };
      case "left":
        return { x, y: y - 1 };
      default:
        return null;
    }
  };

  const isValidCell = (x, y) => x >= 0 && x < 10 && y >= 0 && y < 10;
  const directions = ["up", "right", "down", "left"];

  const getRandomDirection = function () {
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  };

  const checkDirections = function () {
    const lastDirection = computerMemory.direction;
    computerMemory.isShipHorizontal =
      lastDirection === "left" || lastDirection === "right";

    if (computerMemory.isShipHorizontal) {
      computerMemory.directionsTried = {
        up: true,
        down: true,
        left: false,
        right: false,
      };
    } else {
      computerMemory.directionsTried = {
        up: false,
        down: false,
        left: true,
        right: true,
      };
    }
  };

  const getNextDirection = function (currentDirection) {
    let index = directions.indexOf(currentDirection);
    let nextDirection;

    for (let i = 0; i < directions.length; i++) {
      index = (index + 1) % directions.length;
      nextDirection = directions[index];
      if (!computerMemory.directionsTried[nextDirection]) {
        return nextDirection;
      }
    }

    return false;
  };

  function updateShipCounter(shipLength) {
    if (computerMemory.shipCounters[shipLength] > 0) {
      computerMemory.shipCounters[shipLength] -= 1;
    }
  }
  function getNextLargestShipLength() {
    const shipLengths = Object.keys(computerMemory.shipCounters)
      .map(Number)
      .sort((a, b) => b - a);

    const nextLargestLength = shipLengths.find(
      (length) => computerMemory.shipCounters[length] > 0,
    );

    return nextLargestLength !== undefined ? nextLargestLength : null;
  }

  const randomizeCoords = function () {
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    if (!waitingPlayer.board.board[x][y].hit) {
      return [x, y];
    }
    return randomizeCoords();
  };

  const getCoords = function () {
    let x;
    let y;
    let lastX;
    let lastY;
    const maxShipLength = getNextLargestShipLength();
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    if (computerMemory.numberOfHits === maxShipLength) {
      updateShipCounter(maxShipLength);
      restartComputerMemory();
      return randomizeCoords();
    }
    if (
      computerMemory.hitStack.length > 0 ||
      computerMemory.initialX !== null
    ) {
      if (computerMemory.initialX !== null && !computerMemory.isLastHit) {
        lastX = computerMemory.initialX;
        lastY = computerMemory.initialY;
      } else {
        ({ x: lastX, y: lastY } = computerMemory.hitStack.pop());
      }
      if (!computerMemory.direction) {
        computerMemory.direction = getRandomDirection();
        computerMemory.directionsTried = {
          up: false,
          right: false,
          down: false,
          left: false,
        };
      }

      if (computerMemory.numberOfHits === 2 && computerMemory.isLastHit) {
        checkDirections();
      }

      ({ x, y } = getAdjacentCell(lastX, lastY, computerMemory.direction));

      while (
        !isValidCell(x, y) ||
        waitingPlayer.board.board[x][y].hit ||
        computerMemory.directionsTried[computerMemory.direction]
      ) {
        computerMemory.directionsTried[computerMemory.direction] = true;
        if (getNextDirection(computerMemory.direction)) {
          computerMemory.direction = getNextDirection(computerMemory.direction);

          ({ x, y } = getAdjacentCell(
            computerMemory.initialX,
            computerMemory.initialY,
            computerMemory.direction,
          ));
        } else {
          updateShipCounter(computerMemory.numberOfHits);
          restartComputerMemory();
          return randomizeCoords();
        }
      }
    } else {
      restartComputerMemory();
      [x, y] = randomizeCoords();
    }
    return [x, y];
  };

  const playSmartComputerRound = function () {
    if (!handleRounds.checkWin()) {
      const waitingPlayer = handlePlayers.getWaitingPlayer();

      const [x, y] = getCoords();

      waitingPlayer.board.receiveAttack(x, y);

      renderBoard(waitingPlayer.board, "human");

      if (waitingPlayer.board.board[x][y].ship) {
        computerMemory.hitStack.push({ x, y });
        if (computerMemory.initialX === null) {
          computerMemory.initialX = x;
          computerMemory.initialY = y;
        }
        computerMemory.numberOfHits += 1;
        computerMemory.isLastHit = true;
      } else {
        computerMemory.isLastHit = false;
        if (computerMemory.direction) {
          computerMemory.directionsTried[computerMemory.direction] = true;
        }
      }

      if (waitingPlayer.board.areAllShipsSunk()) {
        changeMessage(`${handlePlayers.getActivePlayer().type} won!`);
        handleRounds.registerWin();
      }

      handlePlayers.switchTurn();
    }
  };

  return { playSmartComputerRound, restartComputerMemory };
})();

export function registerPlayerHit(cell) {
  if (handlePlayers.getActivePlayer().type === "computer") {
    return;
  }
  const computer = handlePlayers.getWaitingPlayer();
  const computerBoard = computer.board;
  if (!handleRounds.checkWin()) {
    const x = parseInt(cell.getAttribute("data-row"), 10);
    const y = parseInt(cell.getAttribute("data-column"), 10);
    computerBoard.receiveAttack(x, y);
    if (computerBoard.areAllShipsSunk()) {
      handleRounds.registerWin();
      renderBoard(computerBoard, "computer");
      changeMessage(`${handlePlayers.getActivePlayer().type} won!`);
      return;
    }
    handlePlayers.switchTurn();
    renderBoard(computerBoard, "computer");

    if (handlePlayers.getActivePlayer().type === "computer") {
      smartComputer.playSmartComputerRound();
    }
  }
}

export function placePlayerShip(shipId, x, y, isHorizontal, length) {
  const [humanPlayer] = handlePlayers.getPlayers();
  const humanPlayerBoard = humanPlayer.board;
  humanPlayerBoard.createShip(shipId, length);
  const placed = humanPlayerBoard.placeShip(shipId, x, y, isHorizontal);
  if (placed) {
    renderBoard(humanPlayerBoard, "human");
    return true;
  }
  return false;
}

export function randomizeShips(board, typeOfPlayer) {
  board.placeShipsRandomly();
  renderBoard(board, typeOfPlayer);
}

export function clearBoard(board, typeOfPlayer) {
  board.restartBoard();
  renderBoard(board, typeOfPlayer);
}

export function restartGame() {
  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();
  clearBoard(humanPlayer.board, "human");
  clearBoard(computerPlayer.board, "computer");
  changeScreens(false);
  handleRounds.restartRounds();
  smartComputer.restartComputerMemory(true);
  if (handlePlayers.activePlayer === "computer") {
    handlePlayers.switchTurn();
  }
}

export const gameController = function () {
  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();
  const humanShips = humanPlayer.board.ships;
  if (humanShips.length === 10) {
    changeScreens(true);
    randomizeShips(computerPlayer.board, "computer");
    renderBoard(humanPlayer.board, "human");
  }

  return {};
};
