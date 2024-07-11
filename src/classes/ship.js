export default class Ship {
  constructor(length, id = null, x = null, y = null) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.id = id;
    this.isHorizontal = true;
    this.x = x;
    this.y = y;
  }

  hit() {
    if (this.hits < this.length) {
      this.hits += 1;
    }
    this.isSunk();
  }

  isSunk() {
    if (this.hits === this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getLength() {
    return this.length;
  }

  setIsHorizontal(isHorizontal) {
    this.isHorizontal = isHorizontal;
  }

  getIsHorizontal() {
    return this.isHorizontal;
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}
