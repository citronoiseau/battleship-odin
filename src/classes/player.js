import GameBoard from "./gameboard";

export default class Player {
  constructor(type) {
    this.type = type;
    this.board = new GameBoard();
  }
}
