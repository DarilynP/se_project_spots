export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!button) {
    console.error("Button element not provided!");
    return;
  }

  if (isLoading) {
    button.textContent = loadingText;
    console.log(`Setting text to: ${loadingText}`);
  } else {
    button.textContent = defaultText;
    console.log(`Setting text to: ${defaultText}`);
  }
}

