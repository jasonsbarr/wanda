import { printString } from "./printString.js";

export const println = (input, withQuotes = true) =>
  process.stdout.write(printString(input, withQuotes) + "\n");
