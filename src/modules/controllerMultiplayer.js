/* eslint-disable no-plusplus */
import Player from "../classes/player";
import { renderBoard } from "../DOM/boardDOM";
import { changeMessage } from "../DOM/gameMenu";
import { updateGameStatus } from "../DOM/playerMenu";

export const gameParamsMultiplayer = (function () {
  let gameStyle = "oneByOne";

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

  return { changeGameStyle, getGameStyle };
})();

export const handlePlayersMultiplayer = (function () {
  const players = [];

  let activePlayer = null;
  let waitingPlayer = null;

  const initializePlayer = function (id, name) {
    const player = new Player("human", name, id);
    players.push(player);
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
    initializePlayer,
  };
})();

const gameServerHost = "votrubac.pythonanywhere.com";
let currentGameStatus = "LOBBY";

async function apiCall(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

async function createGame(gameStyle) {
  const turnRule = gameStyle === "untilMiss" ? "TILL_MISS" : "ONE_BY_ONE";
  return apiCall(`https://${gameServerHost}/new_game?turn_rule=${turnRule}`);
}

function handleGameStatusChange(newStatus) {
  if (newStatus === "SETUP") {
    const [first] = handlePlayersMultiplayer.getPlayers();
    if (first.name === "Player 1") {
      handlePlayersMultiplayer.initializePlayer(1, "Player 2");
    } else {
      handlePlayersMultiplayer.initializePlayer(0, "Player 1");
    }
  }

  console.log("Game status updated to:", newStatus);
  updateGameStatus(newStatus);
  const players = handlePlayersMultiplayer.getPlayers();
  console.log(players);
}

export async function getGameStatus(gameId) {
  const response = await apiCall(`https://${gameServerHost}/status/${gameId}`);
  const status = response.state;
  return status;
}

async function checkGameStatus(gameId) {
  try {
    const gameStatus = await getGameStatus(gameId);

    if (gameStatus !== currentGameStatus) {
      currentGameStatus = gameStatus;
      handleGameStatusChange(gameStatus);
    }

    setTimeout(() => checkGameStatus(gameId), 5000);
  } catch (error) {
    console.error("Failed to fetch game status:", error);
    setTimeout(() => checkGameStatus(gameId), 5000);
  }
}

export async function joinGame(gameId) {
  const data = apiCall(`https://${gameServerHost}/join_game/${gameId}`);
  data.then((response) => {
    handlePlayersMultiplayer.initializePlayer(
      response.player.id,
      response.player.name,
    );
    checkGameStatus(gameId);
  });
  return data;
}

export async function initializeGameMultiplayer() {
  try {
    const data = createGame(gameParamsMultiplayer.getGameStyle());
    data.then((response) => {
      handlePlayersMultiplayer.initializePlayer(
        response.player.id,
        response.player.name,
      );
      checkGameStatus(response.id);
    });
    console.log(data);

    return data;
  } catch (error) {
    console.error("There was an error with the fetch operation:", error);
  }
}

export const gameControllerMultiplayer = function () {
  const [player1, player2] = handlePlayersMultiplayer.getPlayers();
  renderBoard(player1.board, player1.type);
  changeMessage(`${handlePlayersMultiplayer.getActivePlayer().name} turn!`);

  return {};
};

// placement

export function placePlayerShipMultiplayer(
  shipId,
  x,
  y,
  isHorizontal,
  length,
  type,
) {
  const [player1, player2] = handlePlayersMultiplayer.getPlayers();
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

export function removePlayerShipMultiplayer(shipId, type) {
  const id = Number(shipId);
  const [player1, player2] = handlePlayersMultiplayer.getPlayers();
  const neededPlayer = [player1, player2].find(
    (player) => player.type === type,
  );
  const playerBoard = neededPlayer.board;
  playerBoard.removeShip(id);
  renderBoard(playerBoard, neededPlayer.type);
}

export function randomizeShipsMultiplayer(board, typeOfPlayer) {
  board.placeShipsRandomly();
  renderBoard(board, typeOfPlayer);
}

export function clearBoardMultiplayer(board, typeOfPlayer) {
  board.restartBoard();
  renderBoard(board, typeOfPlayer);
}
