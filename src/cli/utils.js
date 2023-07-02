/**
 * Returns the number of spaces to indent based on open parens/braces/brackets
 * @param {string} str source code input
 * @returns {number}
 */
export const countIndent = (str) => {
  let indentCount = 0;

  for (let char of str) {
    if (char === "(" || char === "[" || char === "{") {
      indentCount++;
    } else if (char === ")" || char === "]" || char === "}") {
      indentCount--;
    }
  }

  return indentCount;
};

export const inputFinished = (input) => countIndent(input) <= 0;
