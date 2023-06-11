import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { Exception, SyntaxException } from "../shared/exceptions.js";
import { Reader } from "./Reader.js";
import { Cons, cons } from "../shared/cons.js";
import { SrcLoc } from "../lexer/SrcLoc.js";
/**
 * @typedef VectorLiteral
 * @prop {"VectorLiteral"} kind
 * @prop {Form[]} members
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef Property
 * @prop {"Property"} kind
 * @prop {Token} name
 * @prop {Form} value
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef RecordLiteral
 * @prop {"RecordLiteral"} kind
 * @prop {Property[]} properties
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef RecordPattern
 * @prop {"RecordPattern"} kind
 * @prop {Token[]} properties
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef {VectorLiteral|RecordLiteral|RecordPattern} ComplexForm
 */

/**
 * @typedef {Token|Cons|ComplexForm} Form
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
  let srcloc = tok.srcloc;

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
  list.srcloc = srcloc;

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
 * Reads a vector literal
 * @param {Reader} reader
 * @returns {VectorLiteral}
 */
const readVector = (reader) => {};

/**
 * Reads either a record literal or a record pattern
 * @param {Reader} reader
 * @returns {RecordLiteral|RecordPattern}
 */
const readMaybeRecord = (reader) => {
  let tok = reader.next();
  const srcloc = tok.srcloc;
  // First token after brace should always be a symbol
  tok = reader.peek();

  if (tok.type !== TokenTypes.Symbol) {
    throw new SyntaxException(tok.value, tok.srcloc);
  }

  tok = reader.lookahead(1);

  if (tok.type === TokenTypes.Keyword && tok.value === ":") {
    return readRecordLiteral(reader, srcloc);
  } else {
    return readRecordPattern(reader, srcloc);
  }
};

/**
 * Reads a record literal
 * @param {Reader} reader
 * @param {SrcLoc} srcloc
 * @returns {RecordLiteral}
 */
const readRecordLiteral = (reader, srcloc) => {};

/**
 * Reads a record pattern
 * @param {Reader} reader
 * @param {SrcLoc} srcloc
 * @returns {RecordPattern}
 */
const readRecordPattern = (reader, srcloc) => {};

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
    case TokenTypes.RBrack:
      // there shouln't be an RBrack here
      throw new SyntaxException(tok.value, tok.srcloc);
    case TokenTypes.RBrace:
      // there shouldn't be an RBrace here
      throw new SyntaxException(tok.value, tok.srcloc);
    case TokenTypes.LParen:
      return readList(reader);
    case TokenTypes.LBrack:
      return readVector(reader);
    case TokenTypes.LBrace:
      return readMaybeRecord(reader);
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

  const form =
    reader.length === 0
      ? Token.new(TokenTypes.Nil, "nil", SrcLoc.new(0, 1, 1, "reader"))
      : readForm(reader);
  let parseTree = cons(form, null);

  while (!reader.eof()) {
    parseTree.append(readExpr(reader));
  }

  return parseTree;
};
