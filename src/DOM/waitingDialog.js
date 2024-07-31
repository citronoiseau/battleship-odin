export default function createWaitDialog() {
  const menu = document.querySelector(".selectMenuContainer");

  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog");
  dialog.id = "joinGameDialog";
  menu.appendChild(dialog);

  const dialogTitle = document.createElement("div");
  dialogTitle.textContent = "Waiting for other player...";
  dialogTitle.classList.add("dialogTitle");
  dialog.appendChild(dialogTitle);

  return dialog;
}
