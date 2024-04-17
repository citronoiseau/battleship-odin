/* eslint-disable no-plusplus */
import {
  createPatrolBoats,
  createSubmarines,
  createCarrier,
  createBattleShips,
} from "../functions/createShips";

export default class GameBoard {
  constructor() {
    this.size = 10;
    this.board = [];
    this.initializeBoard();
    this.ships = this.initializeShips();
  }

  initializeBoard() {
    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  initializeShips() {
    const ships = [];
    ships.push(
      ...createPatrolBoats(),
      ...createSubmarines(),
      ...createBattleShips(),
      ...createCarrier(),
    );
    let id = 0;
    for (let i = 0; i < ships.length; i++) {
      ships[i].setId(id);
      id += 1;
    }

    return ships;
  }

  getShip(x, y) {
    if (this.board[x][y] !== 0) {
      const ship = this.board[x][y];
      return ship;
    }
    return false;
  }

  placeShipsRandomly() {
    this.ships.forEach((ship) => {
      let x;
      let y;
      let isHorizontal;
      do {
        x = Math.floor(Math.random() * this.size);
        y = Math.floor(Math.random() * this.size);
        isHorizontal = Math.random() < 0.5;
      } while (!this.placeShip(ship.getId(), x, y, isHorizontal));
    });
  }

  placeShip(shipId, x, y, isHorizontal) {
    const ship = this.ships.find((neededShip) => neededShip.getId() === shipId);
    const shipLength = ship.length;

    if (this.checkAvailability(shipId, x, y, isHorizontal)) {
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          this.board[x + i][y] = ship;
        }
        return `Your ship of length ${shipLength} is positioned at [${x}, ${y}] to [${x + shipLength - 1}, ${y}]`;
      }
      if (!isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          this.board[x][y + i] = ship;
        }
        return `Your ship of length ${shipLength} is positioned at [${x}, ${y}] to [${x}, ${y + shipLength - 1}]`;
      }
    } else {
      // return "Ship can't be placed";
      return false;
    }
  }

  isShipAlreadyPlaced(id) {
    return this.board.some((row) =>
      row.some((cell) => cell && cell.getId() === id),
    );
  }

  checkAvailability(id, x, y, isHorizontal) {
    const shipLength = this.ships[id].length;
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return false;
    } // check if exceeds the board

    if (isHorizontal) {
      if (x + shipLength - 1 >= this.size) {
        return false;
      }
    } else if (y + shipLength - 1 >= this.size) {
      return false;
    }

    if (this.isShipAlreadyPlaced(id)) return false;

    // check left, right, above, and below neighbors + if ship cells itself are occupied
    for (let i = 0; i < shipLength; i++) {
      if (x > 0 && this.board[x - 1][y] !== 0) return false; // left neighbor
      if (x < this.size - 1 && this.board[x + 1][y] !== 0) return false; // right neighbor
      if (y > 0 && this.board[x][y - 1] !== 0) return false; // above neighbor
      if (y < this.size - 1 && this.board[x][y + 1] !== 0) return false; // below neighbor

      if (isHorizontal) {
        x++;
      } else {
        y++;
      }
    }

    // Check diagonal placements
    if (
      ((x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1] !== 0) ||
        x - 1 < 0 ||
        y - 1 < 0) && // top-left
      ((x + 1 < this.size && y - 1 >= 0 && this.board[x + 1][y - 1] !== 0) ||
        x + 1 >= this.size ||
        y - 1 < 0) && // top-right
      ((x - 1 >= 0 && y + 1 < this.size && this.board[x - 1][y + 1] !== 0) ||
        x - 1 < 0 ||
        y + 1 >= this.size) && // bottom-left
      ((x + 1 < this.size &&
        y + 1 < this.size &&
        this.board[x + 1][y + 1] !== 0) ||
        x + 1 >= this.size ||
        y + 1 >= this.size) // bottom-right
    ) {
      return false;
    }

    return true;
  }
}
