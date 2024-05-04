import pageLoader from "./pageLoader";
import { gameController } from "./modules/controller";
import "./style.css";

pageLoader();
export const controller = gameController();
