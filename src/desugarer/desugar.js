import { Desugarer } from "./Desugarer.js";

/**
 * Desugars the AST into an AST that contains only core forms
 * @param {import("../typechecker/TypeChecker.js").TypedAST} ast
 * @returns {import("../typechecker/TypeChecker.js").TypedAST}
 */
export const desugar = (ast) => Desugarer.new().visit(ast);
