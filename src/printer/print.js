import { printString } from "./printString.js";

/**
 * Writes a string to stdout without trailing newline
 * @param {string} str
 */
export const print = (str) => {
  process.stdout.write(printString(str, true));
};
