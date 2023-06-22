import { SrcLoc } from "../lexer/SrcLoc.js";
import { Token } from "../lexer/Token.js";
import { TypeEnvironment } from "../typechecker/TypeEnvironment.js";

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
  VectorLiteral: "VectorLiteral",
  VectorPattern: "VectorPattern",
  Property: "Property",
  RecordLiteral: "RecordLiteral",
  RecordPattern: "RecordPattern",
  MemberExpression: "MemberExpression",
  Param: "Param",
  FunctionDeclaration: "FunctionDeclaration",
  LambdaExpression: "LambdaExpression",
  AsExpression: "AsExpression",
  ConstantDeclaration: "ConstantDeclaration",
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
 * @typedef {ASTNode & {kind: ASTTypes.CallExpression; func: AST, args: AST[]}} CallExpression
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.VariableDeclaration; lhv: AST, expression: AST, typeAnnotation: null | import("./parseTypeAnnotation.js").TypeAnnotation}} VariableDeclaration
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.SetExpression; lhv: LHV, expression: AST}} SetExpression
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.DoExpression; body: AST[], env?: TypeEnvironment}} DoExpression
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.TypeAlias; name: string; type: import("./parseTypeAnnotation.js").TypeAnnotation}} TypeAlias
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.VectorLiteral; members: AST[]}} VectorLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.VectorPattern; members: (Symbol|VectorPattern|RecordPattern)[]; rest: boolean}} VectorPattern
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.Property; key: Symbol; value: AST}} Property
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.RecordLiteral; properties: Property[]}} RecordLiteral
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.RecordPattern; properties: (Symbol|VectorPattern|RecordPattern)[]; rest: boolean}} RecordPattern
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.MemberExpression; object: AST; property: Symbol}} MemberExpression
 */
/**
 * @typedef Param
 * @prop {ASTTypes.Param} kind
 * @prop {Symbol} name
 * @prop {import("./parseTypeAnnotation.js").TypeAnnotation|null} typeAnnotation
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.FunctionDeclaration; name: Symbol; params: Param[]; body: AST[]; variadic: boolean; retType: import("./parseTypeAnnotation.js").TypeAnnotation|null; env?: TypeEnvironment}} FunctionDeclaration
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.LambdaExpression; params: Param[]; body: AST[]; variadic: boolean; retType: import("./parseTypeAnnotation.js").TypeAnnotation|null; env?: TypeEnvironment}} LambdaExpression
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.ConstantDeclaration; lhv: LHV; expression: AST; typeAnnotation: null | import("./parseTypeAnnotation.js").TypeAnnotation}} ConstantDeclaration
 */
/**
 * @typedef {ASTNode & {kind: ASTTypes.AsExpression; expression: AST; type: import("./parseTypeAnnotation.js").TypeAnnotation;}} AsExpression
 */
/**
 * @typedef {Symbol|VectorPattern|RecordPattern} LHV
 */
/**
 * @typedef {NumberLiteral|StringLiteral|BooleanLiteral|KeywordLiteral|NilLiteral} Primitive
 */
/**
 * @typedef {Program|Primitive|Symbol|CallExpression|VariableDeclaration|SetExpression|DoExpression|TypeAlias|RecordLiteral|RecordPattern|VectorLiteral|VectorPattern|MemberExpression|FunctionDeclaration|LambdaExpression} AST
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
   * @param {LHV} lhv
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
   * @param {Symbol} lhv
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
   * @param {string} name
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
  /**
   * Constructs a VectorPattern AST node
   * @param {Symbol[]} members
   * @param {SrcLoc} srcloc
   * @param {boolean} [rest=false]
   * @returns {VectorPattern}
   */
  VectorPattern(members, srcloc, rest = false) {
    return {
      kind: ASTTypes.VectorPattern,
      members,
      srcloc,
      rest,
    };
  },
  /**
   * Constructs a VectorLiteral AST node
   * @param {AST[]} members
   * @param {SrcLoc} srcloc
   * @returns {VectorLiteral}
   */
  VectorLiteral(members, srcloc) {
    return {
      kind: ASTTypes.VectorLiteral,
      members,
      srcloc,
    };
  },
  /**
   * Constructs a Property AST node
   * @param {Symbol} key
   * @param {AST} value
   * @param {SrcLoc} srcloc
   * @returns {Property}
   */
  Property(key, value, srcloc) {
    return {
      kind: ASTTypes.Property,
      key,
      value,
      srcloc,
    };
  },
  /**
   * Constructs a RecordPattern AST node
   * @param {Symbol[]} properties
   * @param {SrcLoc} srcloc
   * @param {boolean} [rest=false]
   * @returns {RecordPattern}
   */
  RecordPattern(properties, srcloc, rest = false) {
    return {
      kind: ASTTypes.RecordPattern,
      properties,
      srcloc,
      rest,
    };
  },
  /**
   * Constructs a RecordLiteral AST node
   * @param {Property[]} properties
   * @param {SrcLoc} srcloc
   * @returns {RecordLiteral}
   */
  RecordLiteral(properties, srcloc) {
    return {
      kind: ASTTypes.RecordLiteral,
      properties,
      srcloc,
    };
  },
  /**
   * Constructs a MemberExpression AST node
   * @param {AST} object
   * @param {AST} property
   * @param {SrcLoc} srcloc
   * @returns {MemberExpression}
   */
  MemberExpression(object, property, srcloc) {
    return {
      kind: ASTTypes.MemberExpression,
      object,
      property,
      srcloc,
    };
  },
  /**
   * Constructs a FunctionDeclaration AST node
   * @param {Symbol} name
   * @param {Symbol[]} params
   * @param {AST[]} body
   * @param {boolean} variadic
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation|null} retType
   * @param {SrcLoc}
   * @returns {FunctionDeclaration}
   */
  FunctionDeclaration(name, params, body, variadic, retType, srcloc) {
    return {
      kind: ASTTypes.FunctionDeclaration,
      name,
      params,
      body,
      variadic,
      retType,
      srcloc,
    };
  },

  /**
   * Constructs a LambdaExpression AST node
   * @param {Symbol[]} params
   * @param {AST[]} body
   * @param {boolean} variadic
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation|null} retType
   * @param {SrcLoc} srcloc
   * @returns {LambdaExpression}
   */
  LambdaExpression(params, body, variadic, retType, srcloc) {
    return {
      kind: ASTTypes.LambdaExpression,
      params,
      body,
      variadic,
      retType,
      srcloc,
    };
  },
  /**
   *
   * @param {AST} expression
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation} type
   * @param {SrcLoc} srcloc
   */
  AsExpression(expression, type, srcloc) {
    return {
      kind: ASTTypes.AsExpression,
      expression,
      type,
      srcloc,
    };
  },
  /**
   * Constructs a ConstantDeclaration AST node
   * @param {LHV} lhv
   * @param {AST} expression
   * @param {SrcLoc} srcloc
   * @param {import("./parseTypeAnnotation.js").TypeAnnotation|null} typeAnnotation
   * @returns {ConstantDeclaration}
   */
  ConstantDeclaration(lhv, expression, srcloc, typeAnnotation = null) {
    return {
      kind: ASTTypes.ConstantDeclaration,
      lhv,
      expression,
      srcloc,
      typeAnnotation,
    };
  },
};
