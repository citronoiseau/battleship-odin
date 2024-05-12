import { handlePlayers, randomizeShips } from "../modules/controller";

export default function createRandomizeButton(parent) {
  const randomizeButton = document.createElement("button");
  randomizeButton.id = "randomizeButton";
  parent.appendChild(randomizeButton);
  randomizeButton.textContent = "Randomize ships!";

  const [humanPlayer, computerPlayer] = handlePlayers.getPlayers();

  randomizeButton.addEventListener("click", () => {
    randomizeShips(humanPlayer.board, "human");
  });
}
