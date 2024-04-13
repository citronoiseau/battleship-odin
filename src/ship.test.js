/* eslint-disable no-undef */
import Ship from "./ship";

const testingShip = new Ship(3);

test("Two hits to the ship", () => {
  testingShip.hit();
  testingShip.hit();
  expect(testingShip.hits).toBe(2);
});

test("is Ship sunk after two hits", () => {
  expect(testingShip.sunk).toBeFalsy();
});

test("Third hit to the ship => ship is sunk", () => {
  testingShip.hit();
  expect(testingShip.sunk).toBeTruthy();
});
