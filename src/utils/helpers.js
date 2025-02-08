export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."

) {
  if (isLoading) {
    //set the loading text
    console.log("setting text to ${loadingText}");
  } else {
    //set not loading text
  }
}

