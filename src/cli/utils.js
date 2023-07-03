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

export const getHelp = (commands, application, postscript = "") => {
  console.log(`**** ${application} v${getVersion()} help info ****`);
  console.log();

  for (let [name, command] of Object.entries(commands)) {
    console.log(`${name}`);
    command.alias && console.log(`        Alias: wanda ${command.alias}`);
    console.log(`        ${command.description}`);
    command.usage && console.log(`        Usage: ${command.usage}`);
  }

  console.log();
  postscript && console.log(postscript);
};
