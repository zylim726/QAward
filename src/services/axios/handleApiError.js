import Error from "./errorMessage.js";

export function handleApiError(error) {
  let errorMessage = 'Unknown error occurred';
  if (error.response) {
    const status = error.response.status;
    const messageDetail = status === 403 ? error.response.data?.message : null;
    errorMessage = Error.getMessage(status, messageDetail) || error.message;
  } else if (error.request) {
    errorMessage = 'No response received from server';
  } else {
    errorMessage = error.message;
  }
  return errorMessage;
}
