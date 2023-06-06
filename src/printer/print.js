/**
 * Writes a string to stdout without trailing newline
 * @param {string} str
 */
export const print = (str) => {
  process.stdout.write(str);
};
