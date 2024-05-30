import { gameMenu } from "./gameMenu";
import playerMenu from "./playerMenu";
import startMenu from "./startMenu";

const content = document.querySelector("#content");

export default function changeScreens(screen) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  if (screen === "playing") {
    const menu = gameMenu();
    content.appendChild(menu);
  }
  if (screen === "selecting") {
    const menu = playerMenu();
    content.appendChild(menu);
  }
  if (screen === "starting") {
    const menu = startMenu();
    content.appendChild(menu);
  }
}
