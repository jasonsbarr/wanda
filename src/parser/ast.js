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
 * @typedef {ASTNode & {type: ASTTypes.Program; body: AST[]}} Program
 * @property {AST[]} body
 */
/**
 * @typedef {ASTNode & {type: ASTTypes.NumberLiteral; value: string}} NumberLiteral
 */
/**
 * @typedef {ASTNode & {type: ASTTypes.StringLiteral; value: string}} StringLiteral
 */
/**
 * @typedef {ASTNode & {type: ASTTypes.BooleanLiteral; value: string}} BooleanLiteral
 */
/**
 * @typedef {ASTNode & {type: ASTTypes.KeywordLiteral; value: string}} KeywordLiteral
 */
/**
 * @typedef {ASTNode & {type: ASTTypes.NilLiteral; value: string}} NilLiteral
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
  /**
   * Constructs a StringLiteral AST node
   * @param {Token} token
   * @returns {StringLiteral}
   */
  StringLiteral(token) {
    return {
      type: ASTTypes.StringLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  /**
   * Constructs a BooleanLiteral AST node`
   * @param {Token} token
   * @returns {BooleanLiteral}
   */
  BooleanLiteral(token) {
    return {
      type: ASTTypes.BooleanLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  /**
   * Constructs a KeywordLiteral AST node
   * @param {Token} token
   * @returns {KeywordLiteral}
   */
  KeywordLiteral(token) {
    return {
      type: ASTTypes.KeywordLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  /**
   * Constructs a NilLiteral AST node
   * @param {Token} token
   * @returns {NilLiteral}
   */
  NilLiteral(token) {
    return {
      type: ASTTypes.NilLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
};
