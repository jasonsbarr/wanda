import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { Exception, SyntaxException } from "../shared/exceptions.js";
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
 * Reads a list form from the token stream
 * @param {Reader} reader
 * @returns {Form}
 */
const readList = (reader) => {
  // just selects the LParen and advances the token stream
  let tok = reader.next();

  // this should never happen
  if (tok.type !== TokenTypes.LParen) {
    throw new SyntaxException(tok.value, tok.srcloc);
  }

  tok = reader.peek();

  if (tok.type === TokenTypes.RParen) {
    // is empty list, which is nil
    reader.skip();
    return Token.new(TokenTypes.Nil, "nil", tok.srcloc);
  }

  let list = cons(readExpr(reader), null);

  let lastTok = tok;
  tok = reader.peek();

  while (tok?.type !== TokenTypes.RParen) {
    if (!tok) {
      // Whoops, we're past the end of the token stream without ending the list
      throw new Exception(
        `Expected ); got EOF at ${lastTok.srcloc.line}:${lastTok.srcloc.col}`
      );
    }

    list.append(readExpr(reader));
    lastTok = tok;
    tok = reader.peek();
  }

  // skip the closing RParen
  reader.skip();

  return list;
};

/**
 * Reads a form from the token stream
 * @param {Reader} reader
 * @returns {Form}
 */
const readForm = (reader) => {
  const tok = reader.peek();

  switch (tok.type) {
    case TokenTypes.RParen:
      // there shouldn't be an RParen here
      throw new SyntaxException(tok.value, tok.srcloc);
    case TokenTypes.LParen:
      return readList(reader);
    default:
      return readAtom(reader);
  }
};

/**
 * Reads expressions, including reader macros
 * @param {Reader} reader
 * @returns {Form}
 */
const readExpr = (reader) => {
  return readForm(reader);
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
    parseTree.append(readExpr(reader));
  }

  return parseTree;
};
