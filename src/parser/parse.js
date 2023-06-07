import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { ConsReader } from "./ConsReader.js";
import { Cons } from "../shared/cons.js";
import { AST } from "./ast.js";
import { SrcLoc } from "../lexer/SrcLoc.js";

/**
 * @typedef {import("./ast.js").AST} AST
 */
/**
 * @typedef {Cons & {srcloc: SrcLoc}} List
 */
/**
 * Parses a primitive value from the readTree
 * @param {Token} token
 * @returns {AST}
 */
const parsePrimitive = (token) => {
  switch (token.type) {
    case TokenTypes.Number:
      return AST.NumberLiteral(token);
    case TokenTypes.String:
      return AST.StringLiteral(token);
    case TokenTypes.Boolean:
      return AST.BooleanLiteral(token);
    case TokenTypes.Keyword:
      return AST.KeywordLiteral(token);
    case TokenTypes.Nil:
      return AST.NilLiteral(token);
    case TokenTypes.Symbol:
      return AST.Symbol(token);
    default:
      throw new SyntaxException(token.value, token.srcloc);
  }
};

/**
 * Parses a call expression
 * @param {List} callExpression
 * @returns {import("./ast.js").CallExpression}
 */
const parseCall = (callExpression) => {
  const [func, ...args] = callExpression;
  const srcloc = callExpression.srcloc;
  const parsedFunc = parseExpr(func);
  const parsedArgs = args.map(parseExpr);

  return AST.CallExpression(parsedFunc, parsedArgs, srcloc);
};

/**
 * Parses a variable declaration
 * @param {List} decl
 * @returns {import("./ast.js").VariableDeclaration}
 */
const parseVariableDeclaration = (decl) => {
  const [_, lhv, expression] = decl;
  const parsedLhv = parseExpr(lhv);
  const parsedExpression = parseExpr(expression);

  return AST.VariableDeclaration(parsedLhv, parsedExpression, decl.srcloc);
};

/**
 * Parses a set expression
 * @param {List} expr
 * @returns {import("./ast.js").SetExpression}
 */
const parseSetExpression = (expr) => {
  const [_, lhv, expression] = expr;
  const parsedLhv = parseExpr(lhv);
  const parsedExpression = parseExpr(expression);

  return AST.SetExpression(parsedLhv, parsedExpression, expr.srcloc);
};

/**
 * Parses a list form into AST
 * @param {List} form
 * @returns {AST}
 */
const parseList = (form) => {
  const [first] = form;

  switch (first.value) {
    case "var":
      return parseVariableDeclaration(form);
    case "set!":
      return parseSetExpression(form);
    default:
      return parseCall(form);
  }
};

/**
 * Parses an expression from the readTree
 * @param {import("./ConsReader.js").Form|List} form
 * @returns {AST}
 */
const parseExpr = (form) => {
  if (form instanceof Cons) {
    return parseList(form);
  }

  return parsePrimitive(form);
};

/**
 * Parses the reader-returned tree into a full AST
 * @param {Cons} readTree
 * @returns {import("./ast.js").Program}
 */
export const parse = (readTree) => {
  /** @type {AST[]} */
  let body = [];
  const reader = ConsReader.new(readTree);

  while (!reader.eof()) {
    body.push(parseExpr(reader.next()));
  }

  return AST.Program(body);
};
