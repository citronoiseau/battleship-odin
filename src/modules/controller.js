import Player from "../classes/player";
import { renderBoard } from "../DOM/mainMenu";

export function randomizeShips(board, typeOfPlayer) {
  board.placeShipsRandomly();
  renderBoard(board, typeOfPlayer);
}

const handlePlayers = (function () {
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
      console.log(waitingPlayer);
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

export function registerHit(cell, board, typeOfPlayer) {
  if (!handleRounds.checkWin()) {
    const x = parseInt(cell.getAttribute("data-row"), 10);
    const y = parseInt(cell.getAttribute("data-column"), 10);
    board.receiveAttack(x, y);
    if (board.areAllShipsSunk()) {
      handleRounds.registerWin();
      console.log("Player won!");
    }
    handlePlayers.switchTurn();
    renderBoard(board, typeOfPlayer);

    if (handlePlayers.getActivePlayer().type === "computer") {
      handleRounds.playComputerRound();
    }
  }
}

export const gameController = function () {
  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();
  randomizeShips(humanPlayer.board, "human");
  randomizeShips(computerPlayer.board, "computer");

  return {};
};
