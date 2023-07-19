import { Emitter } from "./Emitter.js";

/**
 * @typedef {import("../parser/ast.js").AST} AST
 */
/**
 * Emits code from the given AST
 * @param {AST} ast
 * @returns {string}
 */
export const emit = (ast, ns = undefined) => Emitter.new(ast, ns).emit();
