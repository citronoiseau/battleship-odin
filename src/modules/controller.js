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

  return { getPlayers, getActivePlayer, switchTurn, getWaitingPlayer };
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
  return { checkWin, registerWin };
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
  };
  const directions = ["up", "right", "down", "left"];

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
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    if (computerMemory.numberOfHits === 5) {
      restartComputerMemory();
      return randomizeCoords();
    }
    if (computerMemory.hitStack.length > 0 || computerMemory.initialX) {
      if (computerMemory.initialX && !computerMemory.isLastHit) {
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
        } else {
          restartComputerMemory();
          return randomizeCoords();
        }
        if (x < 0 || x > 9 || y < 0 || y > 9) {
          ({ x, y } = getAdjacentCell(
            computerMemory.initialX,
            computerMemory.initialY,
            computerMemory.direction,
          ));
        } else {
          ({ x, y } = getAdjacentCell(lastX, lastY, computerMemory.direction));
        }
      }
    } else {
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
        if (!computerMemory.initialX) {
          computerMemory.initialX = x;
          computerMemory.initialY = y;
        }
        computerMemory.numberOfHits += 1;
        computerMemory.isLastHit = true;
      } else {
        computerMemory.isLastHit = false;
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
  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();
  const humanPlayerBoard = humanPlayer.board;
  humanPlayerBoard.createShip(shipId, length);
  const placed = humanPlayerBoard.placeShip(shipId, x, y, isHorizontal);
  if (placed) {
    renderBoard(humanPlayerBoard, "human");
    return true;
  }
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
  smartComputer.restartComputerMemory(true);
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
