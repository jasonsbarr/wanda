import { SrcLoc } from "../lexer/SrcLoc.js";
import { Token } from "../lexer/Token.js";

/**
 * @enum {string}
 */
export const ASTTypes = {
  Program: "Program",
  NumberLiteral: "NumberLiteral",
};

/**
 * @typedef AST
 * @property {ASTTypes} type
 */
export const AST = {
  /**
   * @typedef {AST & {body: AST[], srcloc: SrcLoc}} Program
   * @property {AST[]} body
   * @property {SrcLoc} srcloc
   */
  /**
   * Constructs a Program AST node
   * @param {AST[]} exprs
   * @returns {Program}
   */
  Program(exprs) {
    return {
      type: ASTTypes.Program,
      body: exprs,
      srcloc: exprs[0]?.srcloc ?? SrcLoc.new(0, 0, 0, "none"),
    };
  },

  /**
   * @typedef {AST & {value: string, srcloc: SrcLoc}} NumberLiteral
   */
  /**
   * Constructs a NumberLiteral AST node
   * @param {Token} token
   * @returns {NumberLiteral}
   */
  NumberLiteral(token) {
    return {
      type: ASTTypes.NumberLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
};