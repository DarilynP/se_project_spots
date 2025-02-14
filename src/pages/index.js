import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import { disableButton } from '../scripts/validation.js';


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
  .then(([userInfo, cards]) => {
    console.log(cards);

    // render card
    cards.forEach((card) => renderCard(card, "append"));
    // initialCards.forEach((item) => renderCard(item, "append"));

    const avatarElement = document.querySelector(".profile__avatar");
    const nameElement = document.querySelector(".profile__name");
    const aboutElement = document.querySelector(".profile__about");

    if (userInfo) {
      avatarElement.src = userInfo.avatar; // Set avatar image
      nameElement.textContent = userInfo.name; // Set user's name
      aboutElement.textContent = userInfo.about; // Set user's bio/description
    }
  })

  .catch((err) => {
    console.log("error fetching data:", err);
  });

//pass settings object to the vailidation functions that are called on this file

// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-button");
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
const settings = {
  inactiveButtonClass: "button--disabled", // Ensure this class exists in your CSS
};

const editAvatarForm = document.getElementById("edit-avatar-form");
const saveButton = document.querySelector(".modal__button_save");
console.log("SaveButton:", saveButton);

//avatar form element //
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__button");
console.log();
const avatarModalCloseButton = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatarContainer = document.querySelector(
  ".profile__avatar-container"
);
const avatarImage = document.querySelector(".profile__avatar");

// delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteform = deleteModal.querySelector(".modal__form");
const modalCancelButton = document.querySelector(".modal__button_cancel"); // Cancel button
const modalDeleteButton = document.querySelector(".modal__button_delete");

//select the modal
const previewModal = document.querySelector("#preview__modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  console.log("deleting card with ID", selectedCardId);
  evt.preventDefault();
  setButtonText(modalDeleteButton, true, "Delete", "Deleting...");

  api
  .deleteCard(selectedCardId)
  .then(() => {
    selectedCard.remove();
    closeModal(deleteModal);
  })
  .catch(console.error) // Corrected the catch syntax
  .finally(() => {
    // Ensure the button text is reset to the default, regardless of success or failure
    setButtonText(modalDeleteButton, false, "Delete");
  });
}


function handleDeleteCard(evt, cardElement, cardId) {
  evt.preventDefault();

  selectedCard = cardElement;
  selectedCardId = cardId;

  console.log(cardId);
  openModal(deleteModal);
}

function handleLike(evt, id) {
  // 1. Check if the card is currently liked or not
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  console.log(id);
  // 2. Call the changeLikeStatus method passing the appropriate arguments
  api
    .changeLikeStatus(id, !isLiked) // Pass the opposite of the current state
    .then((data) => {
      console.log(data);
      // 3. Handle the response: toggle the 'liked' class based on the updated status
      evt.target.classList.toggle("card__like-button_liked", data.isLiked);
    })
    .catch(console.error); // 4. Handle any errors in the catch block
}

function getCardElement(data) {
  console.log(cardTemplate);
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

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", () => {
    console.log("Card ID before liking:", data._id);
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardImageElement.addEventListener("click", () => {
    previewModalImageElement.src = data.link;
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.alt = data.name;
    openModal(previewModal);
  });
  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  deleteButton.addEventListener("click", (evt) => {
    handleDeleteCard(evt, cardElement, data._id);
  });

  modalCancelButton.addEventListener("click", () => {
    console.log("delete cancelled");
    closeModal(deleteModal);
  });

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
  modal.classList.add("modal_opened");

  document.addEventListener("keyup", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keyup", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}


function handleEditFormSubmit(evt) {
  evt.preventDefault();
  console.log("handleEditFormSubmit triggered!");

  // Change button text to "Saving..."
  const profileSubmitButton = evt.submitter;

  setButtonText(profileSubmitButton, true);

  // Make API call to edit user info
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      console.log("Profile updated successfully!", data);

      // Update the profile name and description on the page
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;

      // Close the modal
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Error editing profile", err);
    })
    .finally(() => {
      // Reset button text after API call completes
      setButtonText(profileSubmitButton, false);
    });
}

disableButton(cardSubmitButton, settings);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(descriptionInput.value);
  console.log(cardLinkInput.value);

  const inputValues = {
    name: descriptionInput.value,
    link: cardLinkInput.value,
  };

  const cardModalButton = evt.submitter; // Ensure correct button reference

  // Change button text to "Saving..."
  setButtonText(cardModalButton, true);

  api
    .addNewCard(inputValues)
    .then((data) => {
      renderCard(data, "prepend"); // Use API response instead of inputValues

      // Reset form inputs
      evt.target.reset();

      // Disable submit button after submission
      disableButton(cardSubmitButton, settings);

      // Close the modal
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      // Reset button text after API call completes
      setButtonText(cardModalButton, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault(); // Prevent default form submission behavior

  console.log("avatarInput.value", avatarInput.value);
  setButtonText(avatarSubmitButton, true);

  api
    .editAvatarInfo(avatarInput.value) // wrapping the object
    .then((data) => {
      console.log("data.avatar", data.avatar);
      avatarImage.src = data.avatar;
      setButtonText(avatarSubmitButton, false);
      closeModal(avatarModal);
      // closing the modal
      // resetting validation, disabling the button, etc.
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    }); //  Properly closed .then() and added .catch()
}

// All EventListeners
profileEditButton.addEventListener("click", () => {
  console.log("I am clicked");
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
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

// SaveButton.addEventListener("click", function(evt){
// console.log("Event listener attached to SaveButton");
// });

// handleEditFormSubmit(evt);
// });

// editAvatarForm.addEventListener("submit", handleEditFormSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);

cardForm.addEventListener("submit", handleAddCardSubmit);

profileAvatarContainer.addEventListener("click", () => {
  console.log(profileAvatarContainer);
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteform.addEventListener("submit", handleDeleteSubmit);

// Universal function for rendering a card
function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  // Use the specified method to add the card to the list
  cardsList[method](cardElement);
}

// Rendering initial cards using the universal function
// initialCards.forEach((item) => renderCard(item, "append"));

enableValidation(validationConfig);
