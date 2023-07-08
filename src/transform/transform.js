import { AST } from "../parser/ast.js";
import { anf } from "./anf.js";
/**
 * Performs transformations and optimizations on the AST
 * @param {AST} program
 * @returns {AST}
 */
export const transform = (program) => {
  const transformed = anf(program);
  return transformed;
};
