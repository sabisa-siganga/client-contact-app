import Client from "../models/client.model";

/**
 * Checks if a given client code is unique by searching the database.
 * @param code - The client code to check.
 * @returns {Promise<boolean>} - Returns true if the code is unique (not found), otherwise false.
 */
async function isClientCodeUnique(code: string) {
  const checkCode = await Client.findOne({
    where: {
      clientCode: code, // Searches for a client with the specified clientCode
    },
  });

  return checkCode === null; // Returns true if no matching client is found (indicating a unique code)
}

/**
 * Increments an alphabetical string by one letter, handling wrap-around from 'Z' to 'A'.
 * @param alphaPart - The string portion to increment, typically a 3-character uppercase string.
 * @returns {string} - The incremented alphabetical part.
 */
function incrementAlphaPadding(alphaPart: string) {
  let chars = alphaPart.split(""); // Split the string into an array of characters
  for (let i = chars.length - 1; i >= 0; i--) {
    if (chars[i] === "Z") {
      // If character is 'Z', wrap it around to 'A'
      chars[i] = "A";
    } else {
      // Increment the character by moving to the next ASCII code
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      break; // Stop once we've incremented a character without wrap-around
    }
  }
  return chars.join(""); // Join characters back into a string
}

/**
 * Generates a unique client code based on the client's name.
 * The format is a 3-letter alphabetical code derived from the client name,
 * followed by a 3-digit numeric code. The function ensures uniqueness by checking
 * the database and increments the alphabetical part if needed.
 * @param clientName - The client's name used to generate the initial alphabetical part.
 * @returns {Promise<string>} - Returns a unique client code.
 */
export async function generateClientCode(clientName: string) {
  const words = clientName.trim().toUpperCase().split(/\s+/); // Normalize the client name by trimming, converting to uppercase, and splitting by whitespace

  let alphaPart;
  // Generate the alphabetical part of the code based on the client name
  if (words.length === 1 && words[0].length < 3) {
    alphaPart = words[0].padEnd(3, "A"); // Pads short names to 3 characters
  } else if (words.length === 1) {
    alphaPart = words[0].slice(0, 3); // Takes the first 3 characters if a single word is longer than 3 letters
  } else {
    // Takes the first letter of each of the first three words, padding with 'A' if fewer than 3 letters
    alphaPart = words
      .slice(0, 3)
      .map((word) => word[0])
      .join("");
    while (alphaPart.length < 3) {
      alphaPart += "A";
    }
  }

  let numericPart = 1; // Start with numeric part as 001
  let clientCode;

  do {
    const numericString = String(numericPart).padStart(3, "0"); // Pad numeric part to 3 digits
    clientCode = `${alphaPart}${numericString}`; // Combine alpha and numeric parts to form the code
    numericPart++; // Increment the numeric part for the next iteration

    // If numeric part exceeds 999, reset to 001 and increment the alphabetical part
    if (numericPart > 999) {
      alphaPart = incrementAlphaPadding(alphaPart); // Increment alphabetical part
      numericPart = 1;
    }
  } while (!(await isClientCodeUnique(clientCode))); // Repeat until a unique code is generated

  return clientCode; // Return the generated unique client code
}
