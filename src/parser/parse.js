import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { AST } from "./ast.js";

let pos = 0;
const eof = (readTree) => pos >= readTree.length;
const next = (readTree) => readTree[pos++];
const peek = (readTree) => readTree[pos];
const skip = () => pos++;

/**
 * Parses a primitive value from the readTree
 * @param {Token} token
 * @returns {AST}
 */
const parsePrimitive = (token) => {
  switch (token.type) {
    case TokenTypes.Number:
      skip();
      return AST.NumberLiteral(token);
    default:
      throw new SyntaxException(token.value, token.srcloc);
  }
};

const parseExpr = (form) => {
  return parsePrimitive(form);
};

/**
 * Parses an expression from the readTree
 * @param {import("../reader/read.js").Form} form
 * @returns {AST}
 */
const parseExpression = (form) => {
  return parseExpr(form);
};

/**
 * Parses the reader-returned tree into a full AST
 * @param {import("../reader/read.js").ReadTree} readTree
 * @returns {AST}
 */
export const parse = (readTree) => {
  /** @type {AST[]} */
  let body = [];

  while (!eof()) {
    let currentForm = peek(readTree);
    body.push(parseExpression(currentForm));
  }

  return AST.Program(body);
};
