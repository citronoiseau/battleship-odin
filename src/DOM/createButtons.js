import {
  initializeGame,
  gameParams,
  gameController,
  handlePlayers,
  randomizeShips,
  clearBoard,
  restartGame,
  checkPlacedShips,
} from "../modules/controller";

import {
  initializeGameMultiplayer,
  gameParamsMultiplayer,
  handlePlayersMultiplayer,
  randomizeShipsMultiplayer,
  clearBoardMultiplayer,
  getGameStatus,
  setBoard,
  setPlayerReady,
  resetGame,
} from "../modules/controllerMultiplayer";

import changeScreens from "./screenChanger";

import createWaitDialog from "./waitingDialog";

import { showToast } from "./playerMenu";

function createGeneralButton(id, parent, text) {
  const button = document.createElement("button");
  button.id = id;
  parent.appendChild(button);
  button.textContent = text;
  return button;
}

export function createInitializeGameButton(parent) {
  const initializeGameButton = createGeneralButton(
    "initializeGameButton",
    parent,
    "Start your game!",
  );

  initializeGameButton.addEventListener("click", () => {
    initializeGame();
    const mode = gameParams.getGameMode();
    if (mode === "playerVsPlayer") {
      changeScreens("selecting", true);
    } else {
      changeScreens("selecting");
    }
  });
  return initializeGameButton;
}

export function createGameModeChangeButton(parent) {
  let gameMode = gameParams.getGameMode();
  let textMessage;
  if (gameMode === "playerVsComputer") {
    textMessage = "Game mode: Player Vs Computer";
  } else {
    textMessage = "Game mode: Player Vs Player";
  }
  const gameModeChangeButton = createGeneralButton(
    "gameModeChangeButton",
    parent,
    textMessage,
  );

  gameModeChangeButton.addEventListener("click", () => {
    gameParams.changeGameMode();
    gameMode = gameParams.getGameMode();
    if (gameMode === "playerVsComputer") {
      gameModeChangeButton.textContent = "Game mode: Player Vs Computer";
    } else {
      gameModeChangeButton.textContent = "Game mode: Player Vs Player";
    }
  });
  return gameModeChangeButton;
}

export function createGameStyleChangeButton(parent, multiplayer) {
  let gameStyle;
  if (multiplayer) {
    gameStyle = gameParamsMultiplayer.getGameStyle();
  } else {
    gameStyle = gameParams.getGameStyle();
  }

  let textMessage;
  if (gameStyle === "untilMiss") {
    textMessage = "Game style: Until first miss";
  } else {
    textMessage = "Game style: One by one";
  }
  const gameStyleChangeButton = createGeneralButton(
    "gameStyleChangeButton",
    parent,
    textMessage,
  );

  gameStyleChangeButton.addEventListener("click", () => {
    if (multiplayer) {
      gameParamsMultiplayer.changeGameStyle();
      gameStyle = gameParamsMultiplayer.getGameStyle();
    } else {
      gameParams.changeGameStyle();
      gameStyle = gameParams.getGameStyle();
    }

    if (gameStyle === "untilMiss") {
      gameStyleChangeButton.textContent = "Game style: Until first miss";
    } else {
      gameStyleChangeButton.textContent = "Game style: One by one";
    }
  });
  return gameStyleChangeButton;
}

export function createStartGameButton(parent, gameId) {
  const startGameButton = createGeneralButton(
    "startGameButton",
    parent,
    "Start your game!",
  );
  if (gameId) {
    startGameButton.addEventListener("click", () => {
      const [firstPlayer] = handlePlayersMultiplayer.getPlayers();
      if (firstPlayer.board.ships.length !== 10) {
        showToast("Place your ships first!", true);
        return;
      }

      const gameStatus = getGameStatus(gameId);
      const gameBoard = firstPlayer.board.board;
      setBoard(gameId, firstPlayer.id, gameBoard);
      setTimeout(() => {
        setPlayerReady(true);
      }, "800");

      let status;
      gameStatus.then((response) => {
        status = response;
        const dialog = createWaitDialog(gameId, status);
        dialog.showModal();
        dialog.classList.add("active");
      });
    });
  } else {
    startGameButton.addEventListener("click", () => {
      const mode = gameParams.getGameMode();
      const shipsArePlaced = checkPlacedShips();
      if (shipsArePlaced) {
        if (mode === "playerVsPlayer") {
          changeScreens("playing", true);
        } else {
          changeScreens("playing");
        }

        gameController();
      }
    });
  }

  return startGameButton;
}

export function createCreateGameButton(parent) {
  const createGameButton = createGeneralButton(
    "createGameButton",
    parent,
    "Create your game!",
  );
  const spinner = document.querySelector(".spinner");

  createGameButton.addEventListener("click", () => {
    spinner.style.display = "block";
    initializeGameMultiplayer().then((response) => {
      spinner.style.display = "none";
      changeScreens("selecting", false, response.id);
    });
  });
  return createGameButton;
}

export function createRestartGameButton(parent, twoPlayers) {
  const restartGameButton = createGeneralButton(
    "restartGameButton",
    parent,
    "Restart game!",
  );

  restartGameButton.addEventListener("click", () => {
    restartGame();
    changeScreens("selecting", twoPlayers);
  });
  return restartGameButton;
}

export function createReturnToStartMenuButton(parent, fromMenu, multiplayer) {
  const returnButton = createGeneralButton(
    "returnButton",
    parent,
    "Return to starting menu",
  );

  returnButton.addEventListener("click", () => {
    if (multiplayer) {
      gameParamsMultiplayer.offInterval();
      resetGame();
    }
    if (!fromMenu && !multiplayer) {
      restartGame();
    }
    changeScreens("starting");
  });
  return returnButton;
}

function getPlayers(secondPlayer, multiplayer) {
  let first;
  let second;

  if (multiplayer) {
    [first, second] = handlePlayersMultiplayer.getPlayers();
  } else {
    [first, second] = handlePlayers.getPlayers();
  }

  const player = secondPlayer ? second : first;
  return player;
}

export function createRandomizeButton(
  parent,
  secondPlayer = false,
  multiplayer,
) {
  const randomizeButton = createGeneralButton(
    "randomizeButton",
    parent,
    "Randomize ships!",
  );

  randomizeButton.addEventListener("click", () => {
    const player = getPlayers(secondPlayer, multiplayer);
    if (multiplayer) {
      randomizeShipsMultiplayer(player.board, player.type);
    } else {
      randomizeShips(player.board, player.type);
    }
  });

  return randomizeButton;
}

export function createClearButton(parent, secondPlayer = false, multiplayer) {
  const clearButton = createGeneralButton(
    "clearButton",
    parent,
    "Clear board!",
  );

  clearButton.addEventListener("click", () => {
    const player = getPlayers(secondPlayer, multiplayer);
    if (multiplayer) {
      clearBoardMultiplayer(player.board, player.type);
    } else {
      clearBoard(player.board, player.type);
    }
    clearBoard(player.board, player.type);
  });
  return clearButton;
}

export function cancelGameButton(parent, dialog) {
  const cancelButton = createGeneralButton(
    "cancelGameButton",
    parent,
    "Not ready yet",
  );

  cancelButton.addEventListener("click", () => {
    setPlayerReady(false).then((response) => {
      if (!response.ready) {
        dialog.classList.remove("active");
        dialog.classList.add("fadeout");

        setTimeout(() => {
          dialog.close();
          dialog.classList.remove("fadeout");
        }, 250);
      } else {
        showToast("Game is starting already!", true);
      }
    });
  });

  return cancelGameButton;
}
