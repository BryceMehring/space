export const showError = (error: string): void => {
  const errorMessage = document.querySelector('#error #message');
  if (errorMessage) {
    errorMessage.textContent = error;
    document.querySelector('#error')?.classList.remove('hide');
  }
};
