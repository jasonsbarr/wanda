import path from "path";
import { snakeCase } from "@chopinlang/string-utils";
import v from "voca";
import { ASTTypes } from "../parser/ast.js";
import { ROOT_PATH } from "../../../root.js";

/**
 * Resolves a module import declaration to a file location
 * @param {import("../parser/ast").MemberExpression || import("../parser/ast").Symbol} moduleImport
 * @returns {string}
 */
export const resolveModuleImport = (moduleImport) => {
  const names =
    moduleImport.kind === ASTTypes.Symbol
      ? [moduleImport.name]
      : convertMemberExpressionToNamesArray(moduleImport);

  // determine base location based on first member
  // Wanda - Global lib directory
  // Other - Local directory and/or file
  const baseName = names.shift();
  const basePath =
    baseName.toLowerCase() === "wanda"
      ? path.join(ROOT_PATH, "src", "js", "lib")
      : path.join(process.cwd(), v.kebabCase(baseName));
  // convert location array to path string

  // check if file exists in either js (JS file) or root directory (Wanda file)

  // add appropriate file extension and return
};

export const resolveModuleOutput = () => {};

const convertMemberExpressionToNamesArray = (memExp) => {
  // convert Member Expression to array of names
  const end = memExp.property.name;
  /** @type {string[]} */
  let names = [];

  if (memExp.object.kind === ASTTypes.MemberExpression) {
    let obj = memExp.object;
    while (obj.kind === ASTTypes.MemberExpression) {
      /** @type {import("../parser/ast").Symbol} */
      const property = obj.property;
      const name = property.name;

      names.unshift(name);
      obj = obj.object;
    }

    // now obj must be Symbol
    names.unshift(obj.name);
  } else {
    // MemberExpression object property is Symbol
    names.unshift(obj.name);
  }

  // add end property to names array
  names.push(end);

  return names;
};
