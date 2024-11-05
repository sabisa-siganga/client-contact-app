import Client from "../models/client.model";

async function isClientCodeUnique(code: string) {
  const checkCode = await Client.findOne({
    where: {
      clientCode: code,
    },
  });

  return checkCode === null;
}

function incrementAlphaPadding(alphaPart: string) {
  let chars = alphaPart.split("");
  for (let i = chars.length - 1; i >= 0; i--) {
    if (chars[i] === "Z") {
      chars[i] = "A";
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      break;
    }
  }
  return chars.join("");
}

export async function generateClientCode(clientName: string) {
  const words = clientName.trim().toUpperCase().split(/\s+/);

  let alphaPart;
  if (words.length === 1 && words[0].length < 3) {
    alphaPart = words[0].padEnd(3, "A");
  } else if (words.length === 1) {
    alphaPart = words[0].slice(0, 3);
  } else {
    alphaPart = words
      .slice(0, 3)
      .map((word) => word[0])
      .join("");
    while (alphaPart.length < 3) {
      alphaPart += "A";
    }
  }

  let numericPart = 1;
  let clientCode;

  do {
    const numericString = String(numericPart).padStart(3, "0");
    clientCode = `${alphaPart}${numericString}`;
    numericPart++;

    if (numericPart > 999) {
      alphaPart = incrementAlphaPadding(alphaPart);
      numericPart = 1;
    }
  } while (!(await isClientCodeUnique(clientCode)));

  return clientCode;
}
