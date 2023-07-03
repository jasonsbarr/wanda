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

export const getHelp = (commands, application) => {
  console.log(`**** ${application} v${getVersion()} help info ****`);
  console.log("Usage: wanda <command> <args>");
  console.log();

  for (let [name, command] of Object.entries(commands)) {
    console.log(`wanda ${name}:`);
    console.log(`        Alias: wanda ${command.alias}`);
    console.log(`        Description: ${command.description}`);
    console.log(`        Usage: ${command.usage}`);
  }

  console.log();
  console.log(
    "Just running wanda with no command also starts an interactive session"
  );
};
