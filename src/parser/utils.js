import { AST, ASTTypes } from "./ast.js";

/**
 * Checks if an AST node is for a literal primitive
 * @param {AST} node
 * @returns {boolean}
 */
export const isPrimitive = (node) =>
  node.kind === ASTTypes.NumberLiteral ||
  node.kind === ASTTypes.StringLiteral ||
  node.kind === ASTTypes.BooleanLiteral ||
  node.kind === ASTTypes.KeywordLiteral ||
  node.kind === ASTTypes.NilLiteral;
