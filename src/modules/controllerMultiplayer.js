/* eslint-disable no-plusplus */
import Player from "../classes/player";
import {
  renderBoard,
  renderMultiplayerBoard,
  toggleBoard,
} from "../DOM/boardDOM";
import { changeMessage } from "../DOM/gameMenu";
import {
  updatePlayerMessage,
  updateGameRulesMessage,
  showToast,
} from "../DOM/playerMenu";
import changeScreens from "../DOM/screenChanger";

const gameServerHost = "votrubac.pythonanywhere.com";

let currentGameStatus;
let statusInterval;
let turnInterval;

let readyplayers = 0;

let enemyStatus;

export const gameParamsMultiplayer = (function () {
  let gameStyle = "untilMiss";
  let gameId;
  let intervalActive = true;

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

  const getGameId = function () {
    return gameId;
  };

  const resetGameStatus = function () {
    currentGameStatus = null;
  };

  const isIntervalActive = function () {
    return intervalActive;
  };

  const offInterval = function () {
    intervalActive = false;
  };

  const onInterval = function () {
    intervalActive = true;
  };

  return {
    changeGameStyle,
    getGameStyle,
    updateGameId,
    getGameId,
    resetGameStatus,
    isIntervalActive,
    offInterval,
    onInterval,
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
  // if (!response.ok) {
  //   throw new Error(`HTTP error! Status: ${response.status}`);
  // }
  return response.json();
}

async function createGame(gameStyle) {
  const turnRule = gameStyle === "untilMiss" ? "TILL_MISS" : "ONE_BY_ONE";
  return apiCall(`https://${gameServerHost}/new_game?turn_rule=${turnRule}`);
}

function updatePlayerReady(readyPlayers, joinedPlayers) {
  const [player] = handlePlayersMultiplayer.getPlayers();
  if (player) {
    const enemyName = player.name === "Player 1" ? "Player 2" : "Player 1";
    if (readyPlayers.includes(enemyName)) {
      const newEnemyStatus = "READY";
      if (newEnemyStatus !== enemyStatus) {
        showToast(`${enemyName} is ready`);
        enemyStatus = newEnemyStatus;
      }
    } else if (joinedPlayers === 1) {
      showToast(`${enemyName} hasn't joined yet`);
    } else if (!readyPlayers.includes(enemyName)) {
      enemyStatus = "NOT_READY";
      if (readyPlayers.includes(player.name)) {
        showToast(`${enemyName} is not ready`);
      }
    }
    if (readyPlayers.length === 0) {
      enemyStatus = "NOT_READY";
    }
    readyplayers = readyPlayers.length;
  }
}

async function handleGameStatusChange(newStatus) {
  const [player] = handlePlayersMultiplayer.getPlayers();
  if (newStatus.state === "LOBBY") {
    updatePlayerMessage(player.name);
    updateGameRulesMessage(newStatus.turn_rule);
  }
  if (newStatus.state === "SETUP") {
    if (player.name === "Player 1") {
      showToast(`Player 2 has joined`);
    }
    updateGameRulesMessage(newStatus.turn_rule);
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
    const { winner } = newStatus;
    resetGame();
    gameParamsMultiplayer.offInterval();
    if (winner === player.name) {
      changeMessage(`You won!`);
    } else {
      changeMessage(`${winner} won!`);
    }
  }
}

export async function getGameStatus(gameId) {
  return apiCall(`https://${gameServerHost}/status/${gameId}`);
}

async function checkGameStatus(gameId, fromTurns) {
  try {
    const fullGameStatus = await getGameStatus(gameId);
    if (!gameParamsMultiplayer.isIntervalActive()) return;
    if (fullGameStatus.state !== currentGameStatus) {
      currentGameStatus = fullGameStatus.state;
      handleGameStatusChange(fullGameStatus);
    }
    if (readyplayers !== fullGameStatus.ready_players.length) {
      const players = fullGameStatus.ready_players;
      updatePlayerReady(players, fullGameStatus.joined_players.length);
    }

    if (!fromTurns) {
      statusInterval = setTimeout(() => checkGameStatus(gameId), 5000);
    }
    return fullGameStatus;
  } catch (error) {
    checkGameStatus(gameId);
  }
}

export async function joinGame(gameId) {
  resetGame();
  gameParamsMultiplayer.onInterval();
  try {
    const data = await apiCall(`https://${gameServerHost}/join_game/${gameId}`);
    handlePlayersMultiplayer.initializePlayer(data.player.id, data.player.name);
    checkGameStatus(gameId);
    gameParamsMultiplayer.updateGameId(data.id);
    return { ok: true, data };
  } catch (error) {
    return { ok: false };
  }
}

export function resetGame() {
  clearInterval(statusInterval);
  clearInterval(turnInterval);
  handlePlayersMultiplayer.resetPlayers();
  gameParamsMultiplayer.resetGameStatus();
  readyplayers = 0;
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
  if (!gameParamsMultiplayer.isIntervalActive()) return;
  const gameId = gameParamsMultiplayer.getGameId();
  const [player] = handlePlayersMultiplayer.getPlayers();
  const status = await checkGameStatus(gameId, true);
  if (player) {
    placeEnemyHit(status, player);
  }

  const activePlayer = status.players_order[status.current_player];

  if (!status.winner) {
    if (activePlayer === player.name) {
      toggleBoard(true);
      changeMessage(`Your turn!`);
      handlePlayersMultiplayer.setActivePlayer();
    } else {
      toggleBoard(false);
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
  resetGame();
  gameParamsMultiplayer.onInterval();
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
  if (!gameParamsMultiplayer.isIntervalActive()) {
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
