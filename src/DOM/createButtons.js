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

import changeScreens from "./screenChanger";

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

export function createGameStyleChangeButton(parent) {
  let gameStyle = gameParams.getGameStyle();
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
    gameParams.changeGameStyle();
    gameStyle = gameParams.getGameStyle();
    if (gameStyle === "untilMiss") {
      gameStyleChangeButton.textContent = "Game style: Until first miss";
    } else {
      gameStyleChangeButton.textContent = "Game style: One by one";
    }
  });
  return gameStyleChangeButton;
}

export function createStartGameButton(parent) {
  const startGameButton = createGeneralButton(
    "startGameButton",
    parent,
    "Start your game!",
  );

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
  return startGameButton;
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

export function createReturnToStartMenuButton(parent, fromMenu) {
  const returnButton = createGeneralButton(
    "returnButton",
    parent,
    "Return to starting menu",
  );

  returnButton.addEventListener("click", () => {
    if (!fromMenu) {
      restartGame();
    }
    changeScreens("starting");
  });
  return returnButton;
}

export function createRandomizeButton(parent, secondPlayer = false) {
  const randomizeButton = createGeneralButton(
    "randomizeButton",
    parent,
    "Randomize ships!",
  );
  const [first, second] = handlePlayers.getPlayers();
  const player = secondPlayer ? second : first;

  randomizeButton.addEventListener("click", () => {
    randomizeShips(player.board, player.type);
  });

  return randomizeButton;
}

export function createClearButton(parent, secondPlayer = false) {
  const clearButton = createGeneralButton(
    "clearButton",
    parent,
    "Clear board!",
  );
  const [first, second] = handlePlayers.getPlayers();
  const player = secondPlayer ? second : first;

  clearButton.addEventListener("click", () => {
    clearBoard(player.board, player.type);
  });
  return clearButton;
}
