import { tokenize } from "../lexer/tokenize.js";
import { read } from "../reader/read.js";
import { parse } from "../parser/parse.js";

/**
 * Parses a string like "Wanda.String" into a member expression
 * @param {string} importSignifier
 * @returns {import("../parser/ast").MemberExpression}
 */
export const parseModuleImport = (importSignifier) => {
  const parseResult = parse(read(tokenize(importSignifier, "parse-import")));
  return parseResult.body[0];
};
