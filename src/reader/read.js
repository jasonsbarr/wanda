import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { Reader } from "./Reader.js";

/**
 * @typedef {Token | Token[]} Form
 */
/**
 * @typedef {Form[]} ReadTree
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
    default:
      throw new SyntaxException(tok.value, tok.srcloc);
  }
};

/**
 * Reads a form from the token stream
 * @param {Reader} reader
 * @returns {Form}
 */
const readForm = (reader) => {
  return readAtom(reader);
};

/**
 * Reads the token stream into a parse tree (s-expression)
 * @param {Token[]} tokens
 * @returns {ReadTree}
 */
export const read = (tokens) => {
  const reader = Reader.new(tokens);
  /** @type {ReadTree} */
  let parseTree = [];

  while (!reader.eof()) {
    parseTree.push(readForm(reader));
  }

  return parseTree;
};
