import GameBoard from "./gameboard";

export default class Player {
  constructor(type, name) {
    this.type = type;
    this.board = new GameBoard();
    this.name = name;
  }
}
