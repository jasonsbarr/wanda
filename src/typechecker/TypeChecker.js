import { AST, ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { infer } from "./infer.js";

/**
 * @typedef {AST & {type: import("./types").Type}} TypedAST
 */
/**
 * @class TypeChecker
 * @desc Type checker for Wanda programming language (gradual types)
 */
export class TypeChecker {
  /**
   *
   * @param {AST} program
   * @param {TypeEnvironment} env
   */
  constructor(program, env) {
    this.program = program;
    this.env = env;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @param {TypeEnvironment} env
   * @returns {TypeChecker}
   */
  new(program, env = TypeEnvironment.new()) {
    return new TypeChecker(program, env);
  }

  /**
   * Type checks an AST node
   * @param {AST} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  check(node = this.program, env = this.env) {
    switch (node.kind) {
      case ASTTypes.NumberLiteral:
        return this.checkNumber(node, env);
      case ASTTypes.StringLiteral:
        return this.checkString(node, env);
      case ASTTypes.BooleanLiteral:
        return this.checkBoolean(node, env);
      case ASTTypes.KeywordLiteral:
        return this.checkKeyword(node, env);
      case ASTTypes.NilLiteral:
        return this.checkKeyword(node, env);
      case ASTTypes.Symbol:
        return this.checkSymbol(node, env);
      default:
        throw new Exception(`Type checking not implemented for ${node.kind}`);
    }
  }

  /**
   * Type checks a boolean literal
   * @param {import("../parser/ast").BooleanLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkBoolean(node, env) {
    return infer(node, env);
  }

  /**
   * Type checks a call expression
   * @param {import("../parser/ast.js").CallExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkCallExpression(node, env) {
    // infer handles checking for argument types
    return infer(node, env);
  }

  /**
   * Type checks a keyword literal
   * @param {import("../parser/ast").KeywordLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkKeyword(node, env) {
    return infer(node, env);
  }

  /**
   * Type checks a nil literal
   * @param {import("../parser/ast").NilLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkNil(node, env) {
    return infer(node, env);
  }

  /**
   * Type checks a number literal
   * @param {import("../parser/ast").NumberLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkNumber(node, env) {
    return infer(node, env);
  }

  /**
   * Type checks a string literal
   * @param {import("../parser/ast").StringLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkString(node, env) {
    return infer(node, env);
  }

  /**
   * Type checks a symbol
   * @param {import("../parser/ast").Symbol} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkSymbol(node, env) {
    return infer(node, env);
  }
}
