import {
  initializeGame,
  gameParams,
  gameController,
  handlePlayers,
  randomizeShips,
  clearBoard,
  restartGame,
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
    changeScreens("selecting");
  });
  return initializeGameButton;
}

export function createGameModeChangeButton(parent) {
  const gameModeChangeButton = createGeneralButton(
    "gameModeChangeButton",
    parent,
    "Game mode: Player Vs Computer",
  );

  gameModeChangeButton.addEventListener("click", () => {
    gameParams.changeGameMode();
    const gameMode = gameParams.getGameMode();
    if (gameMode === "playerVsComputer") {
      gameModeChangeButton.textContent = "Game mode: Player Vs Computer";
    } else {
      gameModeChangeButton.textContent = "Game mode: Player Vs Player";
    }
  });
  return gameModeChangeButton;
}

export function createGameStyleChangeButton(parent) {
  const gameStyleChangeButton = createGeneralButton(
    "gameStyleChangeButton",
    parent,
    "Game style: One by one",
  );

  gameStyleChangeButton.addEventListener("click", () => {
    gameParams.changeGameStyle();
    const gameStyle = gameParams.getGameStyle();
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
    changeScreens("playing");
    gameController();
  });
  return startGameButton;
}

export function createRestartGameButton(parent) {
  const restartGameButton = createGeneralButton(
    "restartGameButton",
    parent,
    "Restart game!",
  );

  restartGameButton.addEventListener("click", () => {
    restartGame();
    changeScreens("selecting");
  });
  return restartGameButton;
}

export function createReturnToStartMenuButton(parent) {
  const returnButton = createGeneralButton(
    "returnButton",
    parent,
    "Return to starting menu",
  );

  returnButton.addEventListener("click", () => {
    changeScreens("starting");
  });
  return returnButton;
}

export function createRandomizeButton(parent) {
  const randomizeButton = createGeneralButton(
    "randomizeButton",
    parent,
    "Randomize ships!",
  );

  const players = handlePlayers.getPlayers();
  const humanPlayer = players[0];
  randomizeButton.addEventListener("click", () => {
    randomizeShips(humanPlayer.board, humanPlayer.type);
  });

  return randomizeButton;
}

export function createClearButton(parent) {
  const clearButton = createGeneralButton(
    "clearButton",
    parent,
    "Clear board!",
  );

  const players = handlePlayers.getPlayers();
  const humanPlayer = players[0];

  clearButton.addEventListener("click", () => {
    clearBoard(humanPlayer.board, humanPlayer.type);
  });
  return clearButton;
}
