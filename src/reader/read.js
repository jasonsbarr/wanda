import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { Reader } from "./Reader.js";
import { Cons, cons } from "../shared/cons.js";

/**
 * @typedef {Token | Cons} Form
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
    case TokenTypes.String:
      reader.skip();
      return tok;
    case TokenTypes.Boolean:
      reader.skip();
      return tok;
    case TokenTypes.Keyword:
      reader.skip();
      return tok;
    case TokenTypes.Nil:
      reader.skip();
      return tok;
    case TokenTypes.Symbol:
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
 * @returns {Cons}
 */
export const read = (tokens) => {
  const reader = Reader.new(tokens);
  let parseTree = cons(readForm(reader), null);

  while (!reader.eof()) {
    parseTree.append(readForm(reader));
  }

  return parseTree;
};
