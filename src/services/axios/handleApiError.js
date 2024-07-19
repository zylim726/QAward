import Error from "./errorMessage.js";

export function handleApiError(error) {
  let errorMessage = 'Unknown error occurred';
  if (error.response) {
    errorMessage = Error.getMessage(error.response.status) || error.message;
  } else if (error.request) {
    errorMessage = 'No response received from server';
  } else {
    errorMessage = error.message;
  }
  console.log('In api js',errorMessage); // Log the error to the console
  return errorMessage;
}
