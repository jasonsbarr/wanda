import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { AST } from "./ast.js";
import { Reader } from "../reader/Reader.js";

/**
 * Parses a primitive value from the readTree
 * @param {Reader} reader
 * @returns {AST}
 */
const parsePrimitive = (reader) => {
  const token = reader.peek();

  switch (token.type) {
    case TokenTypes.Number:
      reader.skip();
      return AST.NumberLiteral(token);
    default:
      throw new SyntaxException(token.value, token.srcloc);
  }
};

const parseExpr = (reader) => {
  return parsePrimitive(reader);
};

/**
 * Parses an expression from the readTree
 * @param {Reader} form
 * @returns {AST}
 */
const parseExpression = (reader) => {
  return parseExpr(reader);
};

/**
 * Parses the reader-returned tree into a full AST
 * @param {import("../reader/read.js").ReadTree} readTree
 * @returns {AST}
 */
export const parse = (readTree) => {
  /** @type {AST[]} */
  let body = [];
  const reader = Reader.new(readTree);

  while (!reader.eof()) {
    body.push(parseExpression(reader));
  }

  return AST.Program(body);
};
