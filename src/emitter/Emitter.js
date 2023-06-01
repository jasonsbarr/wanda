import { ASTTypes } from "../parser/ast.js";
import { SyntaxException } from "../shared/exceptions.js";

/**
 * @typedef {import("../parser/ast.js").AST} AST
 */

export class Emitter {
  /**
   * Constructs the emitter object
   * @param {AST} program
   */
  constructor(program) {
    this.program = program;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @returns {Emitter}
   */
  static new(program) {
    return new Emitter(program);
  }

  /**
   * Emitter dispatcher method
   * @param {AST} node
   * @returns {string}
   */
  emit(node = this.program) {
    switch (node.type) {
      case ASTTypes.Program:
        return this.emitProgram(node);
      case ASTTypes.NumberLiteral:
        return this.emitNumber(node);
      case ASTTypes.StringLiteral:
        return this.emitString(node);
      case ASTTypes.BooleanLiteral:
        return this.emitBoolean(node);
      case ASTTypes.KeywordLiteral:
        return this.emitKeyword(node);
      case ASTTypes.NilLiteral:
        return this.emitNil(node);
      default:
        throw new SyntaxException(node.type, node.srcloc);
    }
  }

  /**
   * Generates code from a Boolean AST node
   * @param {import("../parser/ast.js").BooleanLiteral} node
   * @returns {string}
   */
  emitBoolean(node) {
    return node.value;
  }

  /**
   * Generates code from a Keyword AST node
   * @param {import("../parser/ast.js").KeywordLiteral} node
   * @returns {string}
   */
  emitKeyword(node) {
    return `Symbol.for("${node.value}")`;
  }

  /**
   * Generates code from a Nil AST node
   * @param {import("../parser/ast.js").NilLiteral} node
   * @returns {string}
   */
  emitNil(node) {
    return "null";
  }

  /**
   * Generates code from a Number AST node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @returns {string}
   */
  emitNumber(node) {
    return node.value;
  }

  /**
   * Generates code from a Program AST node
   * @param {import("../parser/ast.js").Program} node
   * @returns {string}
   */
  emitProgram(node) {
    let code = "";

    for (let n of node.body) {
      code += this.emit(n);
    }

    return code;
  }

  /**
   * Generates code from a String AST node
   * @param {import("../parser/ast.js").StringLiteral} node
   * @returns {string}
   */
  emitString(node) {
    return "`" + node.value.slice(1, -1) + "`";
  }
}
