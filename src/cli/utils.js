import fs from "fs";
import { join } from "path";
import { ROOT_PATH } from "../../root.js";
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

export const inputFinished = (input) => countIndent(input) === 0;

export const getVersion = () => {
  const packageJson = JSON.parse(
    fs.readFileSync(join(ROOT_PATH, "./package.json"), {
      encoding: "utf-8",
    })
  );
  return packageJson.version;
};
