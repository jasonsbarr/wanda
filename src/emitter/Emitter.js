import { ASTTypes } from "../parser/ast.js";
import { SyntaxException } from "../shared/exceptions.js";
import { Namespace } from "../runtime/Namespace.js";

/**
 * @typedef {import("../parser/ast.js").AST} AST
 */

const PREFIX = "$W_";

export class Emitter {
  /**
   * Constructs the emitter object
   * @param {AST} program
   */
  constructor(program, ns) {
    this.program = program;
    this.ns = ns;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @returns {Emitter}
   */
  static new(program, ns = new Namespace()) {
    return new Emitter(program, ns);
  }

  /**
   * Emitter dispatcher method
   * @param {AST} node
   * @returns {string}
   */
  emit(node = this.program, ns = this.ns) {
    switch (node.type) {
      case ASTTypes.Program:
        return this.emitProgram(node, ns);
      case ASTTypes.NumberLiteral:
        return this.emitNumber(node, ns);
      case ASTTypes.StringLiteral:
        return this.emitString(node, ns);
      case ASTTypes.BooleanLiteral:
        return this.emitBoolean(node, ns);
      case ASTTypes.KeywordLiteral:
        return this.emitKeyword(node, ns);
      case ASTTypes.NilLiteral:
        return this.emitNil(node, ns);
      default:
        throw new SyntaxException(node.type, node.srcloc);
    }
  }

  /**
   * Generates code from a Boolean AST node
   * @param {import("../parser/ast.js").BooleanLiteral} node
   * @returns {string}
   */
  emitBoolean(node, ns) {
    return node.value;
  }

  /**
   * Generates code from a Keyword AST node
   * @param {import("../parser/ast.js").KeywordLiteral} node
   * @returns {string}
   */
  emitKeyword(node, ns) {
    return `Symbol.for("${node.value}")`;
  }

  /**
   * Generates code from a Nil AST node
   * @param {import("../parser/ast.js").NilLiteral} node
   * @returns {string}
   */
  emitNil(node, ns) {
    return "null";
  }

  /**
   * Generates code from a Number AST node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @returns {string}
   */
  emitNumber(node, ns) {
    return node.value;
  }

  /**
   * Generates code from a Program AST node
   * @param {import("../parser/ast.js").Program} node
   * @returns {string}
   */
  emitProgram(node, ns) {
    let code = "";

    for (let n of node.body) {
      code += this.emit(n);
    }

    return code;
  }

  /**
   * Generates code from a String AST node
   * @param {import("../parser/ast.js").StringLiteral} node
   * @returnsimport { Namespace } from '../runtime/Namespace';
 {string}
   */
  emitString(node, ns) {
    return "`" + node.value.slice(1, -1) + "`";
  }
}
