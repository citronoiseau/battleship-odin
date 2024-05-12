export default class Ship {
  constructor(length, id = null) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.id = id;
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
}
