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
 * @typedef ASTNode
 * @property {ASTTypes} type
 * @property {SrcLoc} srcloc
 */
/**
 * @typedef {ASTNode & {body: AST[]}} Program
 * @property {AST[]} body
 */
/**
 * @typedef {ASTNode & {value: string}} NumberLiteral
 */
/**
 * @typedef {ASTNode & {value: string}} StringLiteral
 */
/**
 * @typedef {ASTNode & {value: string}} BooleanLiteral
 */
/**
 * @typedef {ASTNode & {value: string}} KeywordLiteral
 */
/**
 * @typedef {ASTNode & {value: string}} NilLiteral
 */
/**
 * @typedef {Program|NumberLiteral|StringLiteral|BooleanLiteral|KeywordLiteral|NilLiteral} AST
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
