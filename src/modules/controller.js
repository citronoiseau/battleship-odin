/* eslint-disable no-plusplus */
import Player from "../classes/player";
import {
  renderBoard,
  hideCells,
  showCells,
  areCellsHidden,
} from "../DOM/boardDOM";
import { changeMessage } from "../DOM/gameMenu";

export const gameParams = (function () {
  let gameMode = "playerVsComputer";
  let gameStyle = "untilMiss";

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
      const humanPlayer = new Player("human", "Player 1");
      const computerPlayer = new Player("computer", "Computer");

      activePlayer = humanPlayer;
      waitingPlayer = computerPlayer;
      players.push(humanPlayer);
      players.push(computerPlayer);
    } else {
      const humanPlayer = new Player("human", "Player 1");
      const humanPlayer2 = new Player("human2", "Player 2");
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
      ({ x: lastX, y: lastY } = computerMemory.hitStack.pop());

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

      handleRounds.switchTurn(x, y);
    }
  };

  return { playSmartComputerRound, restartComputerMemory };
})();

const handleRounds = (function () {
  let isWin = false;
  let shipsAreHidden = false;

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
      changeMessage(`${handlePlayers.getActivePlayer().name} won!`);
      return true;
    }

    return false;
  };

  const switchTurn = function (x, y) {
    const waitingPlayer = handlePlayers.getWaitingPlayer();
    const activePlayer = handlePlayers.getActivePlayer();
    const gameStyle = gameParams.getGameStyle();
    const gameMode = gameParams.getGameMode();

    if (handleRounds.checkWin()) {
      changeMessage(`${handlePlayers.getActivePlayer().name} won!`);
    } else {
      if (gameStyle === "oneByOne") {
        handlePlayers.switchTurn();
        changeMessage(`${handlePlayers.getActivePlayer().name} turn!`);
        renderBoard(waitingPlayer.board, waitingPlayer.type);
        if (waitingPlayer.type === "computer") {
          setTimeout(() => {
            smartComputer.playSmartComputerRound();
          }, 600);
        }
      }
      if (gameStyle === "untilMiss") {
        if (!waitingPlayer.board.board[x][y].ship) {
          handlePlayers.switchTurn();

          changeMessage(`${handlePlayers.getActivePlayer().name} turn!`);

          renderBoard(waitingPlayer.board, waitingPlayer.type);
          if (waitingPlayer.type === "computer") {
            setTimeout(() => {
              smartComputer.playSmartComputerRound();
            }, 600);
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
    }

    renderBoard(waitingPlayer.board, waitingPlayer.type);
  };

  const areShipsHidden = function () {
    return shipsAreHidden;
  };

  const changeShips = function () {
    shipsAreHidden = !shipsAreHidden;
  };

  return {
    getIsWin,
    switchTurn,
    checkWin,
    registerWin,
    restartRounds,
    areShipsHidden,
    changeShips,
  };
})();

function checkIfValidHit(cell) {
  const gameMode = gameParams.getGameMode();
  const shipsHidden = handleRounds.areShipsHidden();
  const waitingPlayer = handlePlayers.getWaitingPlayer();
  const humanClass = Array.from(cell.classList).find((cls) =>
    cls.startsWith("human"),
  );

  if (gameMode === "playerVsComputer") {
    if (
      handlePlayers.getActivePlayer().type === "computer" ||
      handleRounds.getIsWin()
    ) {
      return false;
    }
  }
  if (gameMode === "playerVsPlayer") {
    if (
      handleRounds.getIsWin() ||
      handlePlayers.getActivePlayer().type === humanClass ||
      shipsHidden ||
      !areCellsHidden(waitingPlayer.type)
    ) {
      return false;
    }
  }
  return true;
}

export function registerPlayerHit(cell) {
  const waitingPlayer = handlePlayers.getWaitingPlayer();
  if (checkIfValidHit(cell)) {
    const waitingPlayerBoard = waitingPlayer.board;
    if (!handleRounds.getIsWin()) {
      const x = parseInt(cell.getAttribute("data-row"), 10);
      const y = parseInt(cell.getAttribute("data-column"), 10);
      waitingPlayerBoard.receiveAttack(x, y);
      handleRounds.switchTurn(x, y);
    }
  } else {
    return false;
  }
}

export function placePlayerShip(shipId, x, y, isHorizontal, length, type) {
  const [player1, player2] = handlePlayers.getPlayers();
  const neededPlayer = [player1, player2].find(
    (player) => player.type === type,
  );

  const playerBoard = neededPlayer.board;
  const id = Number(shipId);
  playerBoard.createShip(id, length);
  const placed = playerBoard.placeShip(id, x, y, isHorizontal);
  if (placed) {
    renderBoard(playerBoard, neededPlayer.type);
    return true;
  }
  return false;
}

export function removePlayerShip(shipId, type) {
  const id = Number(shipId);
  const [player1, player2] = handlePlayers.getPlayers();
  const neededPlayer = [player1, player2].find(
    (player) => player.type === type,
  );
  const playerBoard = neededPlayer.board;
  playerBoard.removeShip(id);
  renderBoard(playerBoard, neededPlayer.type);
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
  handleRounds.restartRounds();
  smartComputer.restartComputerMemory(true);
  if (
    handlePlayers.getActivePlayer().type === "computer" ||
    handlePlayers.getActivePlayer().type === "human2"
  ) {
    handlePlayers.switchTurn();
  }
}

export function checkFirstPlayerShips() {
  const [player1, player2] = handlePlayers.getPlayers();
  const ships1 = player1.board.ships;
  if (ships1.length === 10) {
    return true;
  }
  return false;
}
export function checkSecondPlayerShips() {
  const [player1, player2] = handlePlayers.getPlayers();
  const ships2 = player2.board.ships;
  if (ships2.length === 10) {
    return true;
  }
  return false;
}

export function checkPlacedShips() {
  const [player1, player2] = handlePlayers.getPlayers();

  if (player2.type === "computer") {
    if (checkFirstPlayerShips()) {
      return true;
    }
  }
  if (player2.type === "human2") {
    if (checkFirstPlayerShips() && checkSecondPlayerShips()) {
      return true;
    }
  }
  return false;
}

export function passTurn() {
  const [player1, player2] = handlePlayers.getPlayers();
  hideCells(player1.type);
  hideCells(player2.type);
  handleRounds.changeShips();
  changeMessage(`${handlePlayers.getActivePlayer().name} turn!`);
}

export function readyToHit() {
  const player = handlePlayers.getActivePlayer();
  showCells(player.type);
  handleRounds.changeShips();
}

export const gameController = function () {
  const [player1, player2] = handlePlayers.getPlayers();

  if (player2.type === "computer") {
    randomizeShips(player2.board, player2.type);
    renderBoard(player1.board, player1.type);
    changeMessage(`${handlePlayers.getActivePlayer().name} turn!`);
  }
  if (player2.type === "human2") {
    renderBoard(player1.board, player1.type);
    renderBoard(player2.board, player2.type);
    hideCells(player2.type);
    changeMessage(`${handlePlayers.getActivePlayer().name} turn!`);
  }
  return {};
};
