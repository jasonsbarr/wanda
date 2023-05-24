import { SrcLoc } from "../lexer/SrcLoc.js";
import { Token } from "../lexer/Token.js";

/**
 * @enum {string}
 */
export const ASTTypes = {
  Program: "Program",
  NumberLiteral: "NumberLiteral",
  StringLiteral: "StringLiteral",
  BooleanLiteral: "BooleanLiteral",
  KeywordLiteral: "KeywordLiteral",
  NilLiteral: "NilLiteral",
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
/**
 * @typedef {AST & {value: string}} StringLiteral
 */
/**
 * @typedef {AST & {value: string}} BooleanLiteral
 */
/**
 * @typedef {AST & {value: string}} KeywordLiteral
 */
/**
 * @typedef {AST & {value: string}} NilLiteral
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
  StringLiteral(token) {
    return {
      type: ASTTypes.StringLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  BooleanLiteral(token) {
    return {
      type: ASTTypes.BooleanLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  KeywordLiteral(token) {
    return {
      type: ASTTypes.KeywordLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  NilLiteral(token) {
    return {
      type: ASTTypes.NilLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
};
