import { resolve } from "./resolve.js";

/**
 * Resolves arrays of required module import specifiers/specifier strings to file locations
 * @param {string[]} requires
 * @returns {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]}
 */
export const getModulePaths = (requires) =>
  requires.map((req) => ({ name: req, source: resolve(req) }));
