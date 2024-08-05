import closeIcon from "../icons/close.svg";
import { joinGame } from "../modules/controllerMultiplayer";
import changeScreens from "./screenChanger";
import { showToast } from "./playerMenu";

export default function createJoinGameDialog() {
  const menu = document.querySelector(".startMenuContainer");

  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog");
  dialog.id = "joinGameDialog";
  menu.appendChild(dialog);

  const closeButtonContainer = document.createElement("div");
  closeButtonContainer.classList.add("closeButtonContainer");
  dialog.appendChild(closeButtonContainer);

  const closeButton = document.createElement("button");
  closeButton.id = "closeButton";
  closeButtonContainer.appendChild(closeButton);

  const icon = document.createElement("img");
  icon.src = closeIcon;
  closeButton.appendChild(icon);

  closeButton.addEventListener("click", () => {
    dialog.classList.remove("active");
    dialog.classList.add("fadeout");

    setTimeout(() => {
      dialog.close();
      dialog.classList.remove("fadeout");
    }, 250);
  });

  const dialogTitle = document.createElement("div");
  dialogTitle.textContent = "Enter game id";
  dialogTitle.classList.add("dialogTitle");
  dialog.appendChild(dialogTitle);

  const dialogForm = document.createElement("form");
  dialogForm.id = "gameIdForm";
  dialogForm.method = "get";

  const formElement = document.createElement("div");
  formElement.className = "form-element";

  const label = document.createElement("label");
  label.setAttribute("for", "gameId");
  label.textContent = "Game id";

  const input = document.createElement("input");
  input.id = "gameId";
  input.name = "gameId";
  input.type = "text";
  input.placeholder = "aaa-aaa-aaaa";
  input.required = true;

  formElement.appendChild(label);
  formElement.appendChild(input);

  const confirmIdButton = document.createElement("button");
  confirmIdButton.type = "submit";
  confirmIdButton.id = "confirmIdButton";
  confirmIdButton.textContent = "Join game";

  dialogForm.appendChild(formElement);
  dialogForm.appendChild(confirmIdButton);

  dialogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const gameId = document.getElementById("gameId").value;
    try {
      const response = await joinGame(gameId);
      if (response.ok) {
        changeScreens("selecting", false, gameId);
      } else {
        showToast("Invalid game id", true);
      }
    } catch (error) {
      showToast("An error occurred", true);
    }
  });

  dialog.appendChild(dialogForm);

  return dialog;
}
