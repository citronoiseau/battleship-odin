/* eslint-disable no-plusplus */
import Player from "../classes/player";
import { renderBoard } from "../DOM/boardDOM";
import changeScreens from "../DOM/screenChanger";
import { changeMessage } from "../DOM/gameMenu";

export const gameParams = (function () {
  let gameMode = "playerVsComputer";
  let gameStyle = "oneByOne";

  const changeGameMode = function () {
    if (gameMode === "playerVsComputer") {
      gameMode = "playerVsPlayer";
    } else {
      gameMode = "playerVsComputer";
    }
  };

  const getGameMode = function () {
    return gameMode;
  };

  const changeGameStyle = function () {
    if (gameStyle === "oneByOne") {
      gameStyle = "untilMiss";
    } else {
      gameStyle = "oneByOne";
    }
  };

  const getGameStyle = function () {
    return gameStyle;
  };

  return { changeGameMode, changeGameStyle, getGameMode, getGameStyle };
})();

export const handlePlayers = (function () {
  const players = [];

  let activePlayer = null;
  let waitingPlayer = null;

  const initializePlayers = function (gameMode) {
    players.length = 0;
    if (gameMode === "playerVsComputer") {
      const humanPlayer = new Player("human");
      const computerPlayer = new Player("computer");

      activePlayer = humanPlayer;
      waitingPlayer = computerPlayer;
      players.push(humanPlayer);
      players.push(computerPlayer);
    } else {
      const humanPlayer = new Player("human");
      const humanPlayer2 = new Player("human2");
      activePlayer = humanPlayer;
      waitingPlayer = humanPlayer2;
      players.push(humanPlayer);
      players.push(humanPlayer2);
    }
  };

  const getPlayers = function () {
    return players;
  };

  const getActivePlayer = () => activePlayer;

  const getWaitingPlayer = () => waitingPlayer;

  const switchTurn = function () {
    [activePlayer, waitingPlayer] = [waitingPlayer, activePlayer];
  };

  return {
    getPlayers,
    getActivePlayer,
    switchTurn,
    getWaitingPlayer,
    initializePlayers,
  };
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

  // directions

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

  // reducing amount of unsuccessful hits

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

  function checkCell(x, y) {
    const key = `${x},${y}`;
    return computerMemory.neighborCells.has(key);
  }

  function addCell(x, y) {
    const key = `${x},${y}`;
    computerMemory.neighborCells.add(key);
  }

  function checkoutNeighbourCells(x, y, direction, shipLength) {
    if (direction === "right") {
      for (let i = -1; i <= 1; i++) {
        for (let j = 0; j <= shipLength + 1; j++) {
          const saveX = x + i;
          const saveY = y + j;
          addCell(saveX, saveY);
        }
      }
    }
    if (direction === "down") {
      for (let i = -1; i <= 1; i++) {
        for (let j = 0; j <= shipLength + 1; j++) {
          const saveX = x + j;
          const saveY = y + i;

          addCell(saveX, saveY);
        }
      }
    }
    console.log(computerMemory.neighborCells);
  }

  function findFirstShipCell(x, y, shipLength, isHorizontal) {
    const waitingPlayer = handlePlayers.getWaitingPlayer();

    if (isHorizontal) {
      for (let i = 1; i <= shipLength; i++) {
        const firstY = y - i;
        if (firstY < 0 || firstY > 9) {
          checkoutNeighbourCells(x, firstY, "right", shipLength);
          return;
        }
        if (!waitingPlayer.board.board[x][firstY].ship) {
          checkoutNeighbourCells(x, firstY, "right", shipLength);
          return;
        }
      }
    } else {
      for (let i = 1; i <= shipLength; i++) {
        const firstX = x - i;
        if (firstX < 0 || firstX > 9) {
          checkoutNeighbourCells(firstX, y, "down", shipLength);
          return;
        }
        if (!waitingPlayer.board.board[firstX][y].ship) {
          checkoutNeighbourCells(firstX, y, "down", shipLength);
          return;
        }
      }
    }
  }

  const randomizeCoords = function () {
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    if (!waitingPlayer.board.board[x][y].hit && !checkCell(x, y)) {
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
      ({ x: lastX, y: lastY } = computerMemory.hitStack.pop());

      updateShipCounter(maxShipLength);
      findFirstShipCell(
        lastX,
        lastY,
        computerMemory.numberOfHits,
        computerMemory.isShipHorizontal,
      );
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
        computerMemory.directionsTried[computerMemory.direction] ||
        checkCell(x, y)
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
          findFirstShipCell(
            lastX,
            lastY,
            computerMemory.numberOfHits,
            computerMemory.isShipHorizontal,
          );
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
    if (!handleRounds.getIsWin()) {
      const waitingPlayer = handlePlayers.getWaitingPlayer();

      const [x, y] = getCoords();

      waitingPlayer.board.receiveAttack(x, y);

      renderBoard(waitingPlayer.board, waitingPlayer.type);

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
      handleRounds.checkWin();

      handleRounds.switchTurn(x, y);
    }
  };

  return { playSmartComputerRound, restartComputerMemory };
})();

const handleRounds = (function () {
  let isWin = false;

  const getIsWin = function () {
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

  const checkWin = function () {
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    if (waitingPlayer.board.areAllShipsSunk()) {
      handleRounds.registerWin();
      renderBoard(waitingPlayer.board, waitingPlayer.type);
      changeMessage(`${handlePlayers.getActivePlayer().type} won!`);
      return true;
    }

    return false;
  };

  const switchTurn = function (x, y) {
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    const activePlayer = handlePlayers.getActivePlayer();
    const gameStyle = gameParams.getGameStyle();
    if (gameStyle === "oneByOne") {
      handlePlayers.switchTurn();
      renderBoard(waitingPlayer.board, waitingPlayer.type);
      if (waitingPlayer.type === "computer") {
        smartComputer.playSmartComputerRound();
      }
    }
    if (gameStyle === "untilMiss") {
      if (!waitingPlayer.board.board[x][y].ship) {
        handlePlayers.switchTurn();
        renderBoard(waitingPlayer.board, waitingPlayer.type);
        if (waitingPlayer.type === "computer") {
          smartComputer.playSmartComputerRound();
          renderBoard(waitingPlayer.board, waitingPlayer.type);
        }
      }
      if (waitingPlayer.board.board[x][y].ship) {
        if (activePlayer.type === "computer") {
          setTimeout(() => {
            smartComputer.playSmartComputerRound();
          }, 800);
          renderBoard(waitingPlayer.board, waitingPlayer.type);
        }
      }
    }
    renderBoard(waitingPlayer.board, waitingPlayer.type);
  };
  return { getIsWin, switchTurn, checkWin, registerWin, restartRounds };
})();

export function registerPlayerHit(cell) {
  if (
    handlePlayers.getActivePlayer().type === "computer" ||
    handleRounds.getIsWin()
  ) {
    return;
  }
  const waitingPlayer = handlePlayers.getWaitingPlayer();
  const waitingPlayerBoard = waitingPlayer.board;
  if (!handleRounds.getIsWin()) {
    const x = parseInt(cell.getAttribute("data-row"), 10);
    const y = parseInt(cell.getAttribute("data-column"), 10);
    waitingPlayerBoard.receiveAttack(x, y);
    handleRounds.checkWin();
    handleRounds.switchTurn(x, y);
  }
}

export function placePlayerShip(shipId, x, y, isHorizontal, length) {
  const [humanPlayer] = handlePlayers.getPlayers();
  const humanPlayerBoard = humanPlayer.board;
  humanPlayerBoard.createShip(shipId, length);
  const placed = humanPlayerBoard.placeShip(shipId, x, y, isHorizontal);
  if (placed) {
    renderBoard(humanPlayerBoard, humanPlayer.type);
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

export function initializeGame() {
  const gameMode = gameParams.getGameMode();
  const gameStyle = gameParams.getGameStyle();

  handlePlayers.initializePlayers(gameMode);
}

export function restartGame() {
  const [player1, player2] = handlePlayers.getPlayers();
  clearBoard(player1.board, player1.type);
  clearBoard(player2.board, player2.type);
  changeScreens("choosing");
  handleRounds.restartRounds();
  smartComputer.restartComputerMemory(true);
  if (handlePlayers.activePlayer === "computer") {
    handlePlayers.switchTurn();
  }
}

export const gameController = function () {
  const [player1, player2] = handlePlayers.getPlayers();
  const humanShips = player1.board.ships;
  if (humanShips.length === 10) {
    changeScreens("playing");
    randomizeShips(player2.board, player2.type);
    renderBoard(player1.board, player1.type);
  }

  return {};
};
