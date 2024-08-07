/* eslint-disable no-plusplus */
import {
  createPatrolBoats,
  createSubmarines,
  createCarrier,
  createBattleShips,
} from "../functions/createShips";
import shuffleArray from "../functions/shuffleArr";
import Ship from "./ship";

export default class GameBoard {
  constructor() {
    this.size = 10;
    this.board = this.initializeBoard();
    this.ships = [];
    this.placedShips = new Set();
  }

  initializeBoard() {
    const board = [];
    for (let i = 0; i < this.size; i++) {
      board[i] = [];
      for (let j = 0; j < this.size; j++) {
        board[i][j] = {
          ship: null,
          hit: false,
          boardHit: false,
          shipKill: false,
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
    let id = 1;
    for (let i = 0; i < ships.length; i++) {
      ships[i].setId(id);
      id += 1;
    }

    return ships;
  }

  restartBoard() {
    this.board = this.initializeBoard();
    this.ships = [];
    this.placedShips = new Set();
    this.missedHits = 0;
  }

  createShip(shipId, length) {
    if (!this.ships.find((neededShip) => neededShip.getId() === shipId)) {
      const newShip = new Ship(length, shipId);
      this.ships.push(newShip);
    }
  }

  getShip(x, y) {
    if (this.board[x][y].ship !== null) {
      const neededShip = this.board[x][y].ship;
      return neededShip;
    }
    return false;
  }

  placeShipsRandomly() {
    this.restartBoard();
    this.ships = this.initializeShips();
    const randomizedShips = shuffleArray(this.ships);
    randomizedShips.forEach((ship) => {
      let successfulPlacing = false;
      let x;
      let y;
      let isHorizontal;
      let attemptCount = 0;
      const maxAttempts = 100;
      while (!successfulPlacing && attemptCount < maxAttempts) {
        isHorizontal = Math.random() < 0.5;
        if (isHorizontal) {
          y = Math.floor(Math.random() * (this.size - ship.length + 1));
          x = Math.floor(Math.random() * this.size);
        } else {
          y = Math.floor(Math.random() * this.size);
          x = Math.floor(Math.random() * (this.size - ship.length + 1));
        }
        if (this.placeShip(ship.getId(), x, y, isHorizontal)) {
          successfulPlacing = true;
        }
        attemptCount++;
      }
      if (!successfulPlacing) {
        this.placeShipsRandomly();
      }
      ship.setIsHorizontal(isHorizontal);
      ship.setXY(x, y);
      this.placedShips.add(ship.getId());
    });
  }

  placeShip(shipId, x, y, isHorizontal) {
    const newShip = this.ships.find(
      (neededShip) => neededShip.getId() === shipId,
    );
    const shipLength = newShip.length;

    if (this.checkAvailability(shipId, shipLength, x, y, isHorizontal)) {
      if (isHorizontal) {
        for (let i = 0; i <= shipLength - 1; i++) {
          this.board[x][y + i].ship = newShip;
        }
      }
      if (!isHorizontal) {
        for (let i = 0; i <= shipLength - 1; i++) {
          this.board[x + i][y].ship = newShip;
        }
      }
      this.placedShips.add(shipId);
      newShip.setIsHorizontal(isHorizontal);
      newShip.setXY(x, y);
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
    if (this.board[x][y].hit || this.board[x][y].boardHit) {
      return;
    }
    const ship = this.getShip(x, y);
    if (ship) {
      ship.hit();
      this.board[x][y].hit = true;

      if (ship.isSunk()) {
        const shipLength = ship.getLength();
        const shipDirection = ship.getIsHorizontal();
        const shipX = ship.getX();
        const shipY = ship.getY();
        this.hitNeighborCells(shipX, shipY, shipDirection, shipLength);
      }
      return;
    }

    this.board[x][y].hit = true;
  }

  areAllShipsSunk() {
    const allSunk = this.ships.every((ship) => ship.isSunk());
    if (allSunk) {
      return true;
    }
    return false;
  }

  hitNeighborCells(x, y, direction, shipLength) {
    if (direction) {
      const startY = y - 1;
      for (let i = -1; i <= 1; i++) {
        for (let j = 0; j <= shipLength + 1; j++) {
          const hitX = x + i;
          const hitY = startY + j;

          if (hitX >= 0 && hitX < 10 && hitY >= 0 && hitY < 10) {
            if (!this.board[hitX][hitY].hit && !this.board[hitX][hitY].ship) {
              this.board[hitX][hitY].boardHit = true;
            }
            if (this.board[hitX][hitY].ship) {
              this.board[hitX][hitY].shipKill = true;
            }
          }
        }
      }
    } else {
      const startX = x - 1;
      for (let i = -1; i <= 1; i++) {
        for (let j = 0; j <= shipLength + 1; j++) {
          const hitX = startX + j;
          const hitY = y + i;

          if (hitX >= 0 && hitX < 10 && hitY >= 0 && hitY < 10) {
            if (!this.board[hitX][hitY].hit && !this.board[hitX][hitY].ship) {
              this.board[hitX][hitY].boardHit = true;
            }
            if (this.board[hitX][hitY].ship) {
              this.board[hitX][hitY].shipKill = true;
            }
          }
        }
      }
    }
  }

  // placement functions

  checkAvailability(id, shipLength, x, y, isHorizontal) {
    if (!this.isWithinBoard(shipLength, x, y, isHorizontal)) return false;
    if (this.isShipAlreadyPlaced(id)) return false;
    if (!this.shipCellsAreEmpty(shipLength, x, y, isHorizontal)) return false;
    if (this.hasNeighbors(shipLength, x, y, isHorizontal)) return false;
    if (this.hasDiagonalNeighbors(shipLength, x, y, isHorizontal)) return false;

    return true;
  }

  isWithinBoard(shipLength, x, y, isHorizontal) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      return false;
    }

    if (isHorizontal) {
      if (y + shipLength - 1 >= this.size) {
        return false;
      }
    }
    if (!isHorizontal) {
      if (x + shipLength - 1 >= this.size) {
        return false;
      }
    }

    return true;
  }

  shipCellsAreEmpty(shipLength, x, y, isHorizontal) {
    if (isHorizontal) {
      for (let i = 0; i < shipLength; i++) {
        if (this.board[x][y + i].ship !== null) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        if (this.board[x + i][y].ship !== null) {
          return false;
        }
      }
    }
    return true;
  }

  hasNeighbors(shipLength, x, y, isHorizontal) {
    if (isHorizontal) {
      if (y !== 0 && this.board[x][y - 1].ship !== null) return true; // check left neighbor
      if (
        y + shipLength - 1 !== this.size - 1 &&
        this.board[x][y + shipLength].ship !== null
      )
        return true; // check right neighbor
      if (x !== 0) {
        for (let i = 0; i < shipLength; i++) {
          if (this.board[x - 1][y + i].ship !== null) return true;
        }
      } // check top neighbors
      if (x !== this.size - 1) {
        for (let i = 0; i < shipLength; i++) {
          if (this.board[x + 1][y + i].ship !== null) return true;
        }
      } // check bottom neighbors x
    } else {
      if (y !== 0) {
        for (let i = 0; i < shipLength; i++) {
          if (this.board[x + i][y - 1].ship !== null) return true;
        }
      } // check left neighbor
      if (y !== this.size - 1) {
        for (let i = 0; i < shipLength; i++) {
          if (this.board[x + i][y + 1].ship !== null) return true;
        }
      } // check right neighbor
      if (x !== 0 && this.board[x - 1][y].ship !== null) return true; // check top neighbor
      if (
        x + shipLength - 1 !== this.size - 1 &&
        this.board[x + shipLength][y].ship !== null
      )
        return true; // check bottom neighbor
    }
    return false;
  }

  hasDiagonalNeighbors(shipLength, x, y, isHorizontal) {
    if (x > 0 && y > 0 && this.board[x - 1][y - 1].ship !== null) return true; // top left diagonal
    if (!isHorizontal) {
      if (
        y > 0 &&
        x + shipLength - 1 < 9 &&
        this.board[x + shipLength][y - 1].ship !== null
      )
        return true; // bottom left diagonal
      if (x > 0 && y < 9 && this.board[x - 1][y + 1].ship !== null) return true; // top right diagonal
      if (
        x + shipLength - 1 < 9 &&
        y < 9 &&
        this.board[x + shipLength][y + 1].ship !== null
      )
        return true; // bottom right diagonal
    }
    if (isHorizontal) {
      if (y > 0 && x < 9 && this.board[x + 1][y - 1].ship !== null) return true; // bottom left diagonal
      if (
        x > 0 &&
        y + shipLength - 1 < 9 &&
        this.board[x - 1][y + shipLength].ship !== null
      )
        return true; // top right diagonal
      if (
        x < 9 &&
        y + shipLength - 1 < 9 &&
        this.board[x + 1][y + shipLength].ship !== null
      )
        return true; // bottom right diagonal
    }
    return false;
  }
}
