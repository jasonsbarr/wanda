import { AST } from "../parser/ast.js";
import { Emitter } from "./Emitter.js";

/**
 * Emits code from the given AST
 * @param {AST} ast
 * @returns {string}
 */
export const emit = (ast) => Emitter.new(ast).emit();
