import closeIcon from "../icons/close.svg";

function listCreator(text, parent) {
  const listItem = document.createElement("li");
  listItem.textContent = text;
  parent.appendChild(listItem);
}

function createFirstParagraph(parent) {
  const firstParagraph = listCreator(
    "On PC, players can manually place their ships by dragging and dropping them onto their board, or they can opt for a randomized placement. To rotate a ship, simply right-click on it.",
    parent,
  );

  const secondParagraph = listCreator(
    "On phones, ship placement is limited to randomization. Players cannot manually position their ships and must rely on the randomized placement feature.",
    parent,
  );
  const thirdParagraph = listCreator(
    "In a two-player game, the first player clicks 'Pass selecting to other player' after placing their ships. The second player places their ships and clicks 'Finish selecting'. Finally, the first player clicks 'Start your game' to begin.",
    parent,
  );
}

function createSecondParagraph(parent) {
  const firstParagraph = listCreator(
    "In the 'One by One' style, each player takes turns to make a single attempt to hit the enemy's board.",
    parent,
  );
  const secondParagraph = listCreator(
    "In the 'Until Miss' style, a player can continue to make multiple attempts to hit the enemy's board within a single turn until they miss.",
    parent,
  );
}

export default function createDialog() {
  const menu = document.querySelector(".startMenuContainer");

  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog");
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
    setTimeout(() => {
      dialog.close();
    }, 300);
  });

  const dialogTitle = document.createElement("div");
  dialogTitle.textContent = "Help menu";
  dialogTitle.classList.add("dialogTitle");
  dialog.appendChild(dialogTitle);

  const firstParagraphTitle = document.createElement("div");
  firstParagraphTitle.textContent = "How to place ships?";
  firstParagraphTitle.classList.add("paragraphTitle");
  dialog.appendChild(firstParagraphTitle);

  const firstParagraph = document.createElement("ul");
  firstParagraph.classList.add("dialogParagraph");
  dialog.appendChild(firstParagraph);

  createFirstParagraph(firstParagraph);

  const secondParagraphTitle = document.createElement("div");
  secondParagraphTitle.textContent =
    "What is the difference between game styles?";
  secondParagraphTitle.classList.add("paragraphTitle");
  dialog.appendChild(secondParagraphTitle);

  const secondParagraph = document.createElement("ul");
  secondParagraph.classList.add("dialogParagraph");
  dialog.appendChild(secondParagraph);

  createSecondParagraph(secondParagraph);

  const confirmButtonContainer = document.createElement("div");
  confirmButtonContainer.classList.add("confirmButtonContainer");
  dialog.appendChild(confirmButtonContainer);

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.id = "confirmButton";
  confirmButtonContainer.appendChild(confirmButton);

  confirmButton.addEventListener("click", () => {
    dialog.classList.remove("active");
    setTimeout(() => {
      dialog.close();
    }, 300);
  });

  return dialog;
}
