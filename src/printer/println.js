import { printString } from "./printString.js";

export const println = (input, withQuotes = true, stdout = process.stdout) => {
  stdout.write(printString(input, withQuotes) + "\n");
};
