export default function errorHandling(error: unknown) {
  // Handle the error if it's an normal error (etc: string, number)
  if (typeof error === "string" || typeof error === "number") {
    if(typeof error === "string") console.error(`Error: ${error}`);
    else switch(error) {
      case 403: // couldn't connect to the server
        console.error("Couldn't connect to the server");
        break;
    }
    return;
  }

  // Handle the error if it's an instance of Error
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  // Handle the error if it's an object with a message property
  if (typeof error === "object" && error !== null && "message" in error) {
    console.error(`Error: ${(error as { message: string }).message}`);
    return;
  }

  // If the error is of an unknown type, log it as is
  console.error("An unknown error occurred:", error);
}