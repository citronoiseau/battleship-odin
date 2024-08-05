import { cancelGameButton } from "./createButtons";

export default function createWaitDialog() {
  const menu = document.querySelector(".selectMenuContainer");

  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog");
  dialog.id = "waitDialog";
  menu.appendChild(dialog);

  const dialogTitle = document.createElement("div");
  dialogTitle.textContent = "Waiting for other player...";
  dialogTitle.classList.add("dialogTitle");
  dialog.appendChild(dialogTitle);

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.classList.add("small");
  spinner.style.display = "block";
  dialog.appendChild(spinner);

  const buttonContainer = document.createElement("div");
  dialog.appendChild(buttonContainer);
  const button = cancelGameButton(buttonContainer, dialog);

  return dialog;
}
