import { printString } from "./printString.js";

export const println = (input, withQuotes = true) =>
  console.log(printString(input, withQuotes));
