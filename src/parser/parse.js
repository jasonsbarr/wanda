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
    case TokenTypes.String:
      reader.skip();
      return AST.StringLiteral(token);
    case TokenTypes.Boolean:
      reader.skip();
      return AST.BooleanLiteral(token);
    case TokenTypes.Keyword:
      reader.skip();
      return AST.KeywordLiteral(token);
    case TokenTypes.Nil:
      reader.skip();
      return AST.NilLiteral(token);
    default:
      throw new SyntaxException(token.value, token.srcloc);
  }
};

const parseExpr = (reader) => {
  return parsePrimitive(reader);
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
    body.push(parseExpr(reader));
  }

  return AST.Program(body);
};
