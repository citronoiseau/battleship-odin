import pageLoader from "./pageLoader";
import { joinGame } from "./modules/controllerMultiplayer";
import playerMenu, { showToast } from "./DOM/playerMenu";

import "./style.css";

const pageLoaderDeepLink = async (gameId) => {
  const { ok, data } = await joinGame(gameId);

  if (ok) {
    console.log(`Successfully joined game with ID: ${gameId}`);
    playerMenu(false, gameId);
  } else {
    console.error(`Failed to join game with ID: ${gameId}`);
    showToast(
      "Failed to join the game. Please check the game ID and try again.",
    );
    pageLoader();
  }
};

const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const gameId = getQueryParam("gameId");

if (gameId) {
  pageLoaderDeepLink(gameId);
} else {
  pageLoader();
}
