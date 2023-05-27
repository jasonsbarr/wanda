import { AST, ASTTypes } from "../parser/ast.js";

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
    }
  }

  /**
   * Prints a NumberLiteral node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @returns {string}
   */
  printPrimitive(node, indent) {
    return `${" ".repeat(indent)}${node.type}: ${node.type === "NilLiteral" ? "nil" : node.value}`
  }

  /**
   * Prints Program node
   * @param {import("../parser/ast").Program} node
   * @returns {string}
   */
  printProgram(node, indent) {
    let pStr = "";

    for (let n of node.body) {
      pStr += this.print(n, indent);
    }

    return pStr;
  }
}

/**
 * Pretty prints an AST
 * @param {AST} ast
 * @returns {string}
 */
export const printAST = (ast) => ASTPrinter.new(ast).print();
