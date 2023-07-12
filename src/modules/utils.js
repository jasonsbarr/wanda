import { resolve } from "./resolve.js";

/**
 * Resolves arrays of required module import specifiers/specifier strings to file locations
 * @param {(string|import("../parser/ast.js").MemberExpression)[]} requires
 * @returns {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]}
 */
export const getModulePaths = (requires) =>
  requires.map((req) => ({ name: req.toString(), source: resolve(req) }));
