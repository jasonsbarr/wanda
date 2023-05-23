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
 * @property {SrcLoc} srcloc
 */
/**
 * @typedef {AST & {body: AST[]}} Program
 * @property {AST[]} body
 */
/**
 * @typedef {AST & {value: string}} NumberLiteral
 */
export const AST = {
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
