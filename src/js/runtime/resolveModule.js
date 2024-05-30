import { ASTTypes } from "../parser/ast.js";
import { ROOT_PATH } from "../../../root.js";

/**
 * Resolves a module import declaration to a file location
 * @param {import("../parser/ast").MemberExpression} moduleMemberExp
 * @returns {string}
 */
export const resolveModuleImport = (moduleMemberExp) => {
  const names = convertMemberExpressionToNamesArray(moduleMemberExp);

  // determine base location based on first member
  // Wanda - Global lib directory
  // Lib - Local lib directory
  // Other - Local directory and/or file

  // convert location array to path string

  // check if file exists in either js (JS file) or root directory (Wanda file)

  // add appropriate file extension and return
};

export const resolveModuleOutput = () => {};

const convertMemberExpressionToNamesArray = (memExp) => {
  // convert Member Expression to array of names
  const end = moduleMemberExp.property.name;
  /** @type {string[]} */
  let names = [];

  if (moduleMemberExp.object.kind === ASTTypes.MemberExpression) {
    let obj = moduleMemberExp.object;
    while (obj.kind === ASTTypes.MemberExpression) {
      /** @type {import("../parser/ast").Symbol} */
      const property = obj.property;
      const name = property.name;

      names.unshift(name);
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
