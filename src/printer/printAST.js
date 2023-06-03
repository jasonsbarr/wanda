import { ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions.js";

/**
 * @typedef {import("./ast.js").AST} AST
 */

/**
 * @class ASTPrinter
 * @desc Pretty printer for AST
 * @prop {import("../parser/ast").Program} program
 */
class ASTPrinter {
  /**
   * Constructor for AST Printer
   * @param {import("../parser/ast").Program} program
   */
  constructor(program) {
    this.program = program;
  }

  /**
   * Static constructor for ASTPrinter
   * @param {import("../parser/ast").Program} program
   * @returns {ASTPrinter}
   */
  static new(program) {
    return new ASTPrinter(program);
  }

  /**
   * Dispatcher for printer visitor
   * @param {AST} node
   * @param {number} [indent=0]
   * @returns {string}
   */
  print(node = this.program, indent = 0) {
    switch (node.type) {
      case ASTTypes.Program:
        return this.printProgram(node, indent);
      case ASTTypes.NumberLiteral:
      case ASTTypes.StringLiteral:
      case ASTTypes.BooleanLiteral:
      case ASTTypes.KeywordLiteral:
      case ASTTypes.NilLiteral:
        return this.printPrimitive(node, indent);
      case ASTTypes.Symbol:
        return this.printSymbol(node, indent);
      default:
        throw new Exception(`Unknown AST type ${node.type} to print`);
    }
  }

  /**
   * Prints a primitive node
   * @param {import("../parser/ast.js").Primitive} node
   * @param {number} indent
   * @returns {string}
   */
  printPrimitive(node, indent) {
    return `${" ".repeat(indent)}${node.type}: ${
      node.type === "NilLiteral" ? "nil" : node.value
    }`;
  }

  /**
   * Prints Program node
   * @param {import("../parser/ast").Program} node
   * @param {number} indent
   * @returns {string}
   */
  printProgram(node, indent) {
    let pStr = "";

    for (let n of node.body) {
      pStr += this.print(n, indent);
      +"\n";
    }

    return pStr;
  }

  /**
   *
   * @param {import("../parser/ast").Symbol} node
   * @param {number} indent
   */
  printSymbol(node, indent) {
    return `${" ".repeat(indent)}Symbol: ${node.name}`;
  }
}

/**
 * Pretty prints an AST
 * @param {AST} ast
 * @returns {string}
 */
export const printAST = (ast) => ASTPrinter.new(ast).print();
