import Ship from "../classes/ship";

export function createPatrolBoats() {
  const patrolBoats = [];
  for (let i = 0; i < 4; i++) {
    const patrolBoat = new Ship(2);
    patrolBoats.push(patrolBoat);
  }
  return patrolBoats;
}

export function createSubmarines() {
  const submarines = [];
  for (let i = 0; i < 3; i++) {
    const submarine = new Ship(3);
    submarines.push(submarine);
  }
  return submarines;
}

export function createBattleShips() {
  const battleShips = [];
  for (let i = 0; i < 2; i++) {
    const battleShip = new Ship(4);
    battleShips.push(battleShip);
  }
  return battleShips;
}

export function createCarrier() {
  const carriers = [];
  const carrier = new Ship(5);
  carriers.push(carrier);
  return carriers;
}
