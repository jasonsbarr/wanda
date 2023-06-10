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
  Symbol: "Symbol",
  CallExpression: "CallExpression",
  VariableDeclaration: "VariableDeclaration",
  SetExpression: "SetExpression",
  DoExpression: "DoExpression",
  TypeAlias: "TypeAlias",
};

/**
 * @typedef ASTNode
 * @property {ASTTypes} kind
 * @property {SrcLoc} srcloc
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.Program; body: AST[]}} Program
 * @property {AST[]} body
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.NumberLiteral; value: string}} NumberLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.StringLiteral; value: string}} StringLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.BooleanLiteral; value: string}} BooleanLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.KeywordLiteral; value: string}} KeywordLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.NilLiteral; value: string}} NilLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.Symbol; name: string}} Symbol
 */
/**
 * @typedef {ASTNode & {func: AST, args: AST[]}} CallExpression
 */
/**
 * @typedef {ASTNode & {lhv: AST, expression: AST, typeAnnotation?: null | import("./parseTypeAnnotation.js").TypeAnnotation}} VariableDeclaration
 */
/**
 * @typedef {ASTNode & {lhv: AST, expression: AST}} SetExpression
 */
/**
 * @typedef {ASTNode & {body: AST[]}} DoExpression
 */
/**
 * @typedef {ASTNode & {type: import("./parseTypeAnnotation.js").TypeAnnotation}} TypeAlias
 */
/**
 * @typedef {NumberLiteral|StringLiteral|BooleanLiteral|KeywordLiteral|NilLiteral} Primitive
 */
/**
 * @typedef {Program|NumberLiteral|StringLiteral|BooleanLiteral|KeywordLiteral|NilLiteral|Symbol|CallExpression|VariableDeclaration|SetExpression|DoExpression} AST
 */
export const AST = {
  /**
   * Constructs a Program AST node
   * @param {AST[]} exprs
   * @returns {Program}
   */
  Program(exprs) {
    return {
      kind: ASTTypes.Program,
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
      kind: ASTTypes.NumberLiteral,
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
      kind: ASTTypes.StringLiteral,
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
      kind: ASTTypes.BooleanLiteral,
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
      kind: ASTTypes.KeywordLiteral,
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
      kind: ASTTypes.NilLiteral,
      value: token.value,
      srcloc: token.srcloc,
    };
  },
  /**
   * Constructs a Symbol AST node
   * @param {Token} token
   * @returns {Symbol}
   */
  Symbol(token) {
    return {
      kind: ASTTypes.Symbol,
      name: token.value,
      srcloc: token.srcloc,
    };
  },
  /**
   * Constructs a CallExpression AST node
   * @param {AST} func
   * @param {AST[]} args
   * @param {SrcLoc} srcloc
   * @returns {CallExpression}
   */
  CallExpression(func, args, srcloc) {
    return {
      kind: ASTTypes.CallExpression,
      func,
      args,
      srcloc,
    };
  },
  /**
   * Constructs a VariableDeclaration AST node
   * @param {AST} lhv
   * @param {AST} expression
   * @param {SrcLoc} srcloc
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation|null} typeAnnotation
   * @returns {VariableDeclaration}
   */
  VariableDeclaration(lhv, expression, srcloc, typeAnnotation = null) {
    return {
      kind: ASTTypes.VariableDeclaration,
      lhv,
      expression,
      srcloc,
      typeAnnotation,
    };
  },
  /**
   * Constructs a SetExpression AST node
   * @param {AST} lhv
   * @param {AST} expression
   * @param {SrcLoc} srcloc
   * @returns {SetExpression}
   */
  SetExpression(lhv, expression, srcloc) {
    return {
      kind: ASTTypes.SetExpression,
      lhv,
      expression,
      srcloc,
    };
  },
  /**
   * Constructs a DoExpression AST node
   * @param {AST[]} body
   * @param {SrcLoc} srcloc
   * @returns {DoExpression}
   */
  DoExpression(body, srcloc) {
    return {
      kind: ASTTypes.DoExpression,
      body,
      srcloc,
    };
  },
  /**
   * Constructs a TypeAlias AST node
   * @param {AST} name
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation} type
   * @param {SrcLoc} srcloc
   * @returns {TypeAlias}
   */
  TypeAlias(name, type, srcloc) {
    return {
      kind: ASTTypes.TypeAlias,
      name,
      type,
      srcloc,
    };
  },
};
