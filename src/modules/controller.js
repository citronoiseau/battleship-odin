import Player from "../classes/player";
import { renderBoard } from "../DOM/boardDOM";
import changeScreens from "../DOM/screenChanger";

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

  const playComputerRound = function () {
    if (!isWin) {
      const waitingPlayer = handlePlayers.getWaitingPlayer();
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (!waitingPlayer.board.board[x][y].hit) {
        waitingPlayer.board.receiveAttack(x, y);
        renderBoard(waitingPlayer.board, "human");
        if (waitingPlayer.board.areAllShipsSunk()) {
          console.log("Computer win!");
          isWin = true;
        }
        handlePlayers.switchTurn();
      } else {
        playComputerRound();
      }
    }
  };

  const checkWin = function () {
    return isWin;
  };

  const registerWin = function () {
    isWin = true;
  };
  return { playComputerRound, checkWin, registerWin };
})();

export function registerPlayerHit(cell) {
  const computer = handlePlayers.getWaitingPlayer();
  const computerBoard = computer.board;
  if (!handleRounds.checkWin()) {
    const x = parseInt(cell.getAttribute("data-row"), 10);
    const y = parseInt(cell.getAttribute("data-column"), 10);
    computerBoard.receiveAttack(x, y);
    if (computerBoard.areAllShipsSunk()) {
      handleRounds.registerWin();
      console.log("Player won!");
    }
    handlePlayers.switchTurn();
    renderBoard(computerBoard, "computer");

    if (handlePlayers.getActivePlayer().type === "computer") {
      handleRounds.playComputerRound();
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
}

export const gameController = function () {
  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();
  const humanShips = humanPlayer.board.ships;
  console.log(humanShips);
  if (humanShips.length === 10) {
    changeScreens(true);
    randomizeShips(computerPlayer.board, "computer");
    renderBoard(humanPlayer.board, "human");
  }

  return {};
};
