export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMsg, config) => {
  const errorMsgID = `#${inputElement.id}-error`;
  const errorMsgElement = formElement.querySelector(errorMsgID);

  if (!errorMsgElement) {
    console.error(`Error message element not found for ${errorMsgID}`);
    return; // Stop further execution if the element is missing
  }
  errorMsgElement.classList.add(config.errorClass);
  errorMsgElement.textContent = errorMsg;
  inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorMsgID = `#${inputElement.id}-error`;
  const errorMsgElement = formElement.querySelector(errorMsgID);

  if (!errorMsgElement) {
    console.error(`Error message element not found for ${errorMsgID}`);
    return; // Stop further execution if the element is missing
  }

  errorMsgElement.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
  errorMsgElement.classList.remove(config.errorClass);
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

export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    setEventListeners(form, config); // Pass the config object to other functions
  });
}

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

const toggleButtonState = (inputList, buttonElement, config) => {
  console.log("setEventListeners is running...");
  console.log("buttonElement:", buttonElement);
  console.log("inputList:", inputList);

  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    console.log(buttonElement);
    buttonElement.classList.remove(config.inactiveButtonClass);
    // buttonElement.classList.remove('inactive'); // remove modifer class
  }
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
  // buttonElement.classList.add('inactive');
  //add a modifer clss to the button element to make it grey
};

//optional!
export const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });
};

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);
  console.log("Submit", submitButton);
  toggleButtonState(inputs, submitButton, config);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });
}

// enableValidation = (config) => {
//   const formList = document.querySelectorAll(config.formSelector);
//   formList.forEach((formElement) => {
//     setEventListeners(formElement, config);
//   });
// };

enableValidation(validationConfig);

console.log(validationConfig);
