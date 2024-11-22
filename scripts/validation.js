const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMsg, settings) => {
  const errorMsgID = `#${inputElement.id}-error`;
  const errorMsgElement = formElement.querySelector(errorMsgID);
  errorMsgElement.classList.add(settings.errorClass);
  errorMsgElement.textContent = errorMsg;
  inputElement.classList.add(settings.inputErrorClass);

  if (!errorMsgElement) {
    console.error(`Error message element not found for ${errorMsgID}`);
    return; // Stop further execution if the element is missing
  }
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorMsgID = `#${inputElement.id}-error`;
  const errorMsgElement = formElement.querySelector(errorMsgID);
  errorMsgElement.textContent = "";
  inputElement.classList.remove(settings.inputErrorClass);
  errorMsgElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// function enableValidation(config) {
//   const forms = document.querySelectorAll(config.formSelector);
//   forms.forEach((form) => {
//     setEventListeners(form, config); // Pass the config object to other functions
//   });
// }

function validateInput(form, input, config) {
  const errorElement = form.querySelector(`#${input.id}-error`);

  if (!input.validity.valid) {
    showInputError(input, errorElement, input.validationMessage, config);
  } else {
    hideInputError(input, errorElement, config);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
    buttonElement.disabled = true;
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
  //add a modifer clss to the button element to make it grey
  // dont forget css
};

//optional!
const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });
};


function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  toggleButtonState(inputs, submitButton, config);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });
}

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

enableValidation(settings);
