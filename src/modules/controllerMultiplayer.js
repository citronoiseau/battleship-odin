/* eslint-disable no-plusplus */
import Player from "../classes/player";
import { renderBoard, renderMultiplayerBoard } from "../DOM/boardDOM";
import { changeMessage } from "../DOM/gameMenu";
import {
  updateGameStatus,
  updatePlayerMessage,
  showToast,
} from "../DOM/playerMenu";
import changeScreens from "../DOM/screenChanger";

const gameServerHost = "votrubac.pythonanywhere.com";

let currentGameStatus;
let statusInterval;
let turnInterval;
let readyplayers = 0;

export const gameParamsMultiplayer = (function () {
  let gameStyle = "untilMiss";
  let gameId;
  let isWin = false;

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

  const updateGameId = function (newGameId) {
    gameId = newGameId;
  };

  const setIsWin = function () {
    isWin = !isWin;
  };

  const checkIsWin = function () {
    return isWin;
  };

  const getGameId = function () {
    return gameId;
  };

  const clearIntervals = function () {
    clearInterval(statusInterval);
    clearInterval(turnInterval);
  };

  return {
    changeGameStyle,
    getGameStyle,
    updateGameId,
    getGameId,
    setIsWin,
    checkIsWin,
    clearIntervals,
  };
})();

export const handlePlayersMultiplayer = (function () {
  const players = [];

  let activePlayer = null;

  const initializePlayer = function (id, name) {
    const player = new Player("human", name, id);
    players.push(player);
  };

  const getPlayers = function () {
    return players;
  };

  const setActivePlayer = function () {
    [activePlayer] = players;
  };

  const resetActivePlayer = () => {
    activePlayer = null;
  };

  const getActivePlayer = () => activePlayer;

  const resetPlayers = function () {
    players.shift();
  };

  return {
    getPlayers,
    setActivePlayer,
    getActivePlayer,
    resetActivePlayer,
    initializePlayer,
    resetPlayers,
  };
})();

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

function updatePlayerReady(players) {
  const [player] = handlePlayersMultiplayer.getPlayers();
  const enemyName = player.name === "Player 1" ? "Player 2" : "Player 1";
  if (players.includes(enemyName)) {
    showToast(`${enemyName} is ready`);
  } else if (players.length === 1) {
    showToast(`${enemyName} is not ready`);
  } else if (players.length === 0) {
    showToast(`None of the players is ready`);
  }
  readyplayers = players.length;
}

async function handleGameStatusChange(newStatus) {
  const [player] = handlePlayersMultiplayer.getPlayers();
  if (newStatus.state === "LOBBY") {
    updateGameStatus(newStatus.state);
    updatePlayerMessage(player.name);
  }
  if (newStatus.state === "SETUP") {
    updateGameStatus(newStatus.state);
    if (player.name === "Player 1") {
      showToast(`Player 2 has joined`);
    }
    updatePlayerMessage(player.name);
  }
  if (newStatus.state === "TURN") {
    changeScreens("playing", false, true);
    renderBoard(player.board, player.type);
    passTurns();
    clearInterval(statusInterval);
  }

  if (newStatus.state === "FINISHED") {
    placeEnemyHit(newStatus, player);
    clearInterval(turnInterval);
    gameParamsMultiplayer.setIsWin();
    readyplayers = 0;
    const { winner } = newStatus;
    if (winner === player.name) {
      changeMessage(`You won!`);
    } else {
      changeMessage(`${winner} won!`);
    }
  }
  console.log("Game status updated to:", newStatus.state);
}

export async function getGameStatus(gameId) {
  return apiCall(`https://${gameServerHost}/status/${gameId}`);
}

async function checkGameStatus(gameId) {
  try {
    const fullGameStatus = await getGameStatus(gameId);

    if (fullGameStatus.state !== currentGameStatus) {
      currentGameStatus = fullGameStatus.state;
      handleGameStatusChange(fullGameStatus);
    }
    if (readyplayers !== fullGameStatus.ready_players.length) {
      const players = fullGameStatus.ready_players;
      updatePlayerReady(players);
    }

    statusInterval = setTimeout(() => checkGameStatus(gameId), 5000);
    console.log(fullGameStatus);
    return fullGameStatus;
  } catch (error) {
    console.error("Failed to fetch game status:", error);
    statusInterval = setTimeout(() => checkGameStatus(gameId), 5000);
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
    gameParamsMultiplayer.updateGameId(response.id);
  });
  return data;
}

function placeEnemyHit(status, player) {
  const enemyName = player.name === "Player 1" ? "Player 2" : "Player 1";
  const enemyTurns = status.turns[enemyName];
  const { length } = enemyTurns;
  if (length !== 0) {
    for (let i = 0; i < length; i++) {
      const { x, y } = enemyTurns[i];
      player.board.receiveAttack(x, y);
    }
    renderBoard(player.board, player.type);
  }
}

async function passTurns() {
  const gameId = gameParamsMultiplayer.getGameId();
  const [player] = handlePlayersMultiplayer.getPlayers();
  const status = await checkGameStatus(gameId);
  if (player) {
    placeEnemyHit(status, player);
  }

  const activePlayer = status.players_order[status.current_player];

  if (!status.winner) {
    if (activePlayer === player.name) {
      changeMessage(`Your turn!`);
      handlePlayersMultiplayer.setActivePlayer();
    } else {
      handlePlayersMultiplayer.resetActivePlayer();
      changeMessage(`${activePlayer} turn!`);
    }

    turnInterval = setTimeout(() => passTurns(), 1000);
  }
}

export async function setPlayerReady(isReady) {
  const gameId = gameParamsMultiplayer.getGameId();
  const [player] = handlePlayersMultiplayer.getPlayers();
  const playerId = player.id;
  const playerStatus = isReady ? "True" : "False";
  return apiCall(
    `https://${gameServerHost}/player_ready/${gameId}?player_id=${playerId}&ready=${playerStatus}`,
  );
}

function convertBoard(board) {
  const boardArray = [[], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 10; ++i) {
    for (let j = 0; j < 10; ++j) {
      if (board[i][j].ship !== null) {
        const { ship } = board[i][j];
        boardArray[ship.id - 1].push([i, j]);
      }
    }
  }
  return boardArray;
}

export async function setBoard(gameId, playerId, board) {
  const boardArray = convertBoard(board);
  const JSONBoard = JSON.stringify(boardArray);
  const url = `https://${gameServerHost}/set_board/${gameId}?player_id=${playerId}&ships=${JSONBoard}`;
  apiCall(url);
}

export async function initializeGameMultiplayer() {
  gameParamsMultiplayer.clearIntervals();
  try {
    const data = createGame(gameParamsMultiplayer.getGameStyle());
    data.then((response) => {
      handlePlayersMultiplayer.initializePlayer(
        response.player.id,
        response.player.name,
      );
      checkGameStatus(response.id);
      gameParamsMultiplayer.updateGameId(response.id);
    });
    return data;
  } catch (error) {
    console.error("There was an error with the fetch operation:", error);
  }
}

function checkIfValidHit() {
  if (handlePlayersMultiplayer.getActivePlayer() === null) {
    return false;
  }
  if (gameParamsMultiplayer.checkIsWin()) {
    return false;
  }
  return true;
}

async function sendHit(gameId, playerId, x, y) {
  return apiCall(
    `https://${gameServerHost}/turn/${gameId}?player_id=${playerId}&x=${x}&y=${y}`,
  );
}

export function registerPlayerHitMultiplayer(cell) {
  if (checkIfValidHit()) {
    const x = cell.getAttribute("data-row");
    const y = cell.getAttribute("data-column");

    const [player] = handlePlayersMultiplayer.getPlayers();
    const gameId = gameParamsMultiplayer.getGameId();
    const result = sendHit(gameId, player.id, x, y);
    result.then((response) => {
      console.log(response);
      renderMultiplayerBoard(x, y, response.result, response.cells);
    });
  }
}

// placement

export function placePlayerShipMultiplayer(shipId, x, y, isHorizontal, length) {
  const [player1] = handlePlayersMultiplayer.getPlayers();

  const playerBoard = player1.board;
  const id = Number(shipId);
  playerBoard.createShip(id, length);
  const placed = playerBoard.placeShip(id, x, y, isHorizontal);
  if (placed) {
    renderBoard(playerBoard, player1.type);
    return true;
  }
  return false;
}

export function removePlayerShipMultiplayer(shipId, type) {
  const id = Number(shipId);
  const [player1] = handlePlayersMultiplayer.getPlayers();
  player1.board.removeShip(id);
  renderBoard(player1.board, player1.type);
}

export function randomizeShipsMultiplayer(board, typeOfPlayer) {
  board.placeShipsRandomly();
  renderBoard(board, typeOfPlayer);
}

export function clearBoardMultiplayer(board, typeOfPlayer) {
  board.restartBoard();
  renderBoard(board, typeOfPlayer);
}
