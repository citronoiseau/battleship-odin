import {
  gameController,
  handlePlayers,
  randomizeShips,
  clearBoard,
  restartGame,
} from "../modules/controller";

export function createRandomizeButton(parent) {
  const randomizeButton = document.createElement("button");
  randomizeButton.id = "randomizeButton";
  parent.appendChild(randomizeButton);
  randomizeButton.textContent = "Randomize ships!";

  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();

  randomizeButton.addEventListener("click", () => {
    randomizeShips(humanPlayer.board, "human");
  });

  return randomizeButton;
}

export function createClearButton(parent) {
  const clearButton = document.createElement("button");
  clearButton.id = "clearButton";
  parent.appendChild(clearButton);
  clearButton.textContent = "Clear board!";

  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();

  clearButton.addEventListener("click", () => {
    clearBoard(humanPlayer.board, "human");
  });
  return clearButton;
}

export function createStartGameButton(parent) {
  const startGameButton = document.createElement("button");
  startGameButton.id = "startGameButton";
  parent.appendChild(startGameButton);
  startGameButton.textContent = "Start your game!";

  startGameButton.addEventListener("click", () => {
    gameController();
  });
  return startGameButton;
}

export function createRestartGameButton(parent) {
  const restartGameButton = document.createElement("button");
  restartGameButton.id = "restartGameButton";
  parent.appendChild(restartGameButton);
  restartGameButton.textContent = "Restart game!";

  restartGameButton.addEventListener("click", () => {
    restartGame();
  });
  return restartGameButton;
}
