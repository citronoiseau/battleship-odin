import { gameMenu } from "./gameMenu";
import playerMenu from "./playerMenu";
import startMenu from "./startMenu";

const content = document.querySelector("#content");

export default function changeScreens(screen, twoPlayers = false, gameId) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  if (screen === "playing") {
    const menu = gameMenu(twoPlayers);
    content.appendChild(menu);
  }
  if (screen === "selecting") {
    const menu = playerMenu(twoPlayers, gameId);
    content.appendChild(menu);
  }
  if (screen === "starting") {
    const menu = startMenu();
    content.appendChild(menu);
  }
}
