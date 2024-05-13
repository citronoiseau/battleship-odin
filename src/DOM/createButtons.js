import {
  handlePlayers,
  randomizeShips,
  clearBoard,
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
