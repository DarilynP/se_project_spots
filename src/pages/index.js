import { enableValidation, validationConfig } from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c1da3710-50e8-4d77-9af1-7ab507c7d59c",
    "Content-Type": "application/json",
  },
});

//destrucure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards]) => {
    console.log(cards);
    initialCards.forEach((item) => renderCard(item, "append"));

    //handle the user's information
    //-set the src of avatar image
    // - set the textcontent of both the text elements
  })

  .catch((err) => {
    console.log(err);
  });

//pass settings object to the vailidation functions that are called on this file

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileDescription = document.querySelector(".profile__description");
const profileName = document.querySelector(".profile__name");

//Form Elements
const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeButtons = document.querySelectorAll(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__button");
const cardModalCloseButton = cardModal.querySelector(".modal__close");
const descriptionInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//avatar form element //
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__button");
const avatarModalButon = document.querySelector(".profile__avatar-btn");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//delete form element
const deleteModal = document.querySelector("#deleteModal");

//select the modal
const previewModal = document.querySelector("#preview__modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function handleDeleteCard(evt) {
  evt.preventDefault();
  openModal(deleteModal);
  // evt.target.closest(".card").remove();
}

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardImageElement.addEventListener("click", () => {
    previewModalImageElement.src = data.link;
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.alt = data.name;
    openModal(previewModal);
  });

  deleteButton.addEventListener("click", handleDeleteCard);

  return cardElement;
}

function handleOverlayClick(evt) {
  // Ensure the click is on the overlay, not the modal content
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function handleEscape(evt) {
  console.log("called");
  console.log(evt.key);
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    console.log(activeModal);
    closeModal(activeModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");

  document.addEventListener("keyup", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keyup", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}

// const overlay = document.querySelector(".modal_opened");
// if (overlay && overlay.classList.contains("modal")) {
//   closeModal(overlay);
// }
// closeModal(overlay);

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({ name: editModalNameInput.value, about: descriptionInput })
    .then((data) => {})
    //TODO use data argument instead of the input values

    .catch(console.error);

  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  //TODO -make image appear when adding card
  console.log(descriptionInput.value);
  console.log(cardLinkInput.value);
  const inputValues = {
    name: descriptionInput.value,
    link: cardLinkInput.value,
  };
  renderCard(inputValues, "prepend");
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
  evt.target.reset();
}

function handleAvatarSubmit(evt) {
  evt.preventDefault(); // Prevent default form submission behavior

  console.log(avatarInput.value);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    }); // ✅ Properly closed .then() and added .catch()
}

profileEditButton.addEventListener("click", () => {
  console.log("I am clicked");
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  //optional!
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

closeButtons.forEach((button) => {
  // Find the closest popup only once
  const popup = button.closest(".modal");

  button.addEventListener("click", () => {
    closeModal(popup); // Define the closeModal function to handle hiding the modal
  });
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

cardForm.addEventListener("submit", handleAddCardSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

// Universal function for rendering a card
function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  // Use the specified method to add the card to the list
  cardsList[method](cardElement);
}

// Rendering initial cards using the universal function
initialCards.forEach((item) => renderCard(item, "append"));

enableValidation(validationConfig);
