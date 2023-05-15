import { AST, ASTTypes } from "../parser/ast.js";
import { SyntaxException } from "../shared/exceptions";

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
  emit(node) {
    switch (node.type) {
      case ASTTypes.Program:
        return this.emitProgram(node);
      case ASTTypes.NumberLiteral:
        return this.emitNumber(node);
      default:
        throw new SyntaxException(node.type, node.srcloc);
    }
  }

  /**
   * Generates code from a Number AST node
   * @param {AST & {value: string}}
   * @returns {string}
   */
  emitNumber(node) {
    return node.value;
  }

  /**
   * Generates code from a Program AST node
   * @param {AST & {body: AST[]}} node
   * @returns {string}
   */
  emitProgram(node) {
    let code = "";

    for (let n of node.body) {
      code += this.emit(n);
    }

    return code;
  }
}
