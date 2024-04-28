import Player from "../classes/player";
import { renderBoard } from "../DOM/mainMenu";

export default function setUpNewGame() {
  const computerPlayer = new Player("computer");
  const humanPlayer = new Player("human");

  humanPlayer.board.placeShipsRandomly();
  renderBoard(humanPlayer.board, "player");
  // computerPlayer.board.placeShipsRandomly();
}
