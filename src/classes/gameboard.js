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
    this.board = this.initializeBoard();
    this.ships = this.initializeShips();
    this.placedShips = new Set();
    this.missedHits = 0;
  }

  initializeBoard() {
    const board = [];
    for (let i = 0; i < this.size; i++) {
      board[i] = [];
      for (let j = 0; j < this.size; j++) {
        board[i][j] = {
          ship: null,
          hit: false,
        };
      }
    }
    return board;
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
    if (this.board[x][y].ship !== null) {
      const neededShip = this.board[x][y].ship;
      return neededShip;
    }
    return false;
  }

  placeShipsRandomly() {
    this.ships.forEach((ship) => {
      let successfulPlacing = false;
      let x;
      let y;
      let isHorizontal;
      do {
        x = Math.floor(Math.random() * this.size);
        y = Math.floor(Math.random() * this.size);
        isHorizontal = Math.random() < 0.5;
        if (!this.placeShip(ship.getId(), x, y, isHorizontal)) {
          successfulPlacing = true;
        }
      } while (!successfulPlacing);
      this.placedShips.add(ship.getId());
    });
  }

  placeShip(shipId, x, y, isHorizontal) {
    const newShip = this.ships.find(
      (neededShip) => neededShip.getId() === shipId,
    );
    const shipLength = newShip.length;

    if (this.checkAvailability(shipId, x, y, isHorizontal)) {
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          this.board[x + i][y].ship = newShip;
        }
        return `Your ship of length ${shipLength} is positioned at [${x}, ${y}] to [${x + shipLength - 1}, ${y}]`;
      }
      if (!isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          this.board[x][y + i].ship = newShip;
        }
        return `Your ship of length ${shipLength} is positioned at [${x}, ${y}] to [${x}, ${y + shipLength - 1}]`;
      }
      this.placedShips.add(shipId);
      return true;
    }
    return false;
  }

  removeShip(id) {
    const ship = this.ships.find((neededShip) => neededShip.getId() === id);
    if (!ship) return false;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].ship === ship) {
          this.board[i][j].ship = null;
        }
      }
    }

    this.placedShips.delete(id);
    return "Ship successfully deleted!";
  }

  isShipAlreadyPlaced(id) {
    return this.placedShips.has(id);
  }

  receiveAttack(x, y) {
    const ship = this.getShip(x, y);
    if (ship) {
      ship.hit();
      this.board[x][y].hit = true;
      const allSunk = this.areAllShipsSunk();
      if (allSunk) {
        return "All sunk!";
      }
      return "Hit!";
    }
    this.missedHits += 1;
    return "You missed!";
  }

  areAllShipsSunk() {
    const allSunk = this.ships.every((ship) => ship.isSunk());
    if (allSunk) {
      return true;
    }
    return false;
  }

  // placement functions

  checkAvailability(id, x, y, isHorizontal) {
    const shipLength = this.ships[id].length;
    if (!this.isWithinBoard(shipLength, x, y, isHorizontal)) return false;
    if (this.isShipAlreadyPlaced(id)) return false;
    if (!this.hasNeighbors(shipLength, x, y, isHorizontal)) return false;
    if (!this.hasDiagonalNeighbors(x, y)) return false;

    return true;
  }

  isWithinBoard(shipLength, x, y, isHorizontal) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return false;
    }

    if (isHorizontal) {
      if (x + shipLength - 1 >= this.size) {
        return false;
      }
    } else if (y + shipLength - 1 >= this.size) {
      return false;
    }
    return true;
  }

  hasNeighbors(shipLength, x, y, isHorizontal) {
    for (let i = 0; i < shipLength; i++) {
      if (x > 0 && this.board[x - 1][y].ship !== null) return false; // left neighbor
      if (x < this.size - 1 && this.board[x + 1][y].ship !== null) return false; // right neighbor
      if (y > 0 && this.board[x][y - 1].ship !== null) return false; // above neighbor
      if (y < this.size - 1 && this.board[x][y + 1].ship !== null) return false; // below neighbor

      if (isHorizontal) {
        x++;
      } else {
        y++;
      }
    }
    return true;
  }

  hasDiagonalNeighbors(x, y) {
    if (
      ((x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1].ship !== null) ||
        x - 1 < 0 ||
        y - 1 < 0) && // top-left
      ((x + 1 < this.size &&
        y - 1 >= 0 &&
        this.board[x + 1][y - 1].ship !== null) ||
        x + 1 >= this.size ||
        y - 1 < 0) && // top-right
      ((x - 1 >= 0 &&
        y + 1 < this.size &&
        this.board[x - 1][y + 1].ship !== null) ||
        x - 1 < 0 ||
        y + 1 >= this.size) && // bottom-left
      ((x + 1 < this.size &&
        y + 1 < this.size &&
        this.board[x + 1][y + 1].ship !== null) ||
        x + 1 >= this.size ||
        y + 1 >= this.size) // bottom-right
    ) {
      return false;
    }
    return true;
  }
}
