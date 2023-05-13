import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { Reader } from "./Reader.js";

/**
 * @typedef {Token} Form
 */
/**
 * @typedef {Form | Form[]} ParseTree
 */

/**
 * @param {Reader} reader
 * @returns {Token}
 */
const readAtom = (reader) => {
  const tok = reader.peek();

  switch (tok.type) {
    case TokenTypes.Number:
      reader.skip();
      return tok;
    case TokenTypes.EOF:
      return tok;
    default:
      throw new SyntaxException(tok.value, tok.srcloc);
  }
};

/**
 * Reads a form from the token stream
 * @param {Reader} reader
 * @returns {ParseTree}
 */
const readForm = (reader) => {
  return readAtom(reader);
};

/**
 * Reads an expression, which can be made up of multiple forms
 * @param {Reader} reader
 * @returns {ParseTree}
 */
const readExpression = (reader) => {
  return readForm(reader);
};

/**
 * Reads the token stream into a parse tree (s-expression)
 * @param {Token[]} tokens
 * @returns {ParseTree}
 */
export const read = (tokens) => {
  const reader = Reader.new(tokens);
  /** @type {ParseTree} */
  let parseTree = [];

  while (!reader.eof()) {
    parseTree.push(readExpression(reader));
  }

  return parseTree;
};
