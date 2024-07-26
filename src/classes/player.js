import GameBoard from "./gameboard";

export default class Player {
  constructor(type, name, id) {
    this.type = type;
    this.board = new GameBoard();
    this.name = name;
    this.id = id;
  }
}
