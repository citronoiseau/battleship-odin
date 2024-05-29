import { gameMenu } from "./gameMenu";
import playerMenu from "./playerMenu";

const content = document.querySelector("#content");

export default function changeScreens(screen) {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  if (screen === "playing") {
    const menu = gameMenu();
    content.appendChild(menu);
  } else {
    const menu = playerMenu();
    content.appendChild(menu);
  }
}
