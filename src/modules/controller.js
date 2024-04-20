import Player from "../classes/player";

export default function setUpNewGame() {
  const computerPlayer = new Player("computer");
  const humanPlayer = new Player("human");

  computerPlayer.board.placeShipsRandomly();
  humanPlayer.board.placeShipsRandomly();
}
