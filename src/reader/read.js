import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { Exception, SyntaxException } from "../shared/exceptions.js";
import { Reader } from "./Reader.js";
import { Cons, cons } from "../shared/cons.js";
import { SrcLoc } from "../lexer/SrcLoc.js";
/**
 * @typedef VectorLiteral
 * @prop {"VectorLiteral"} type
 * @prop {Form[]} members
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef Property
 * @prop {"Property"} type
 * @prop {Token} key
 * @prop {Form} value
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef RecordLiteral
 * @prop {"RecordLiteral"} type
 * @prop {Property[]} properties
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef RecordPattern
 * @prop {"RecordPattern"} type
 * @prop {Token[]} properties
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef MemberExpression
 * @prop {"MemberExpression"} type
 * @prop {Form} object
 * @prop {Form} property
 * @prop {SrcLoc} srcloc
 */

/**
 * @typedef {VectorLiteral|RecordLiteral|RecordPattern|MemberExpression} ComplexForm
 */

/**
 * @typedef {Token|Cons|ComplexForm} Form
 */

const PREC = {
  [TokenTypes.Dot]: 90,
};

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
    case TokenTypes.Amp:
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
      throw new SyntaxException("EOF", lastTok.srcloc, ")");
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
const readVector = (reader) => {
  // Get srcloc info from opening bracket and skip it
  let tok = reader.next();
  const srcloc = tok.srcloc;
  let lastTok = tok;
  tok = reader.peek();
  /** @type {Form[]} */
  let members = [];

  while (tok?.type !== TokenTypes.RBrack) {
    if (!tok) {
      throw new SyntaxException("EOF", lastTok.srcloc, "]");
    }

    members.push(readExpr(reader));
    lastTok = tok;
    tok = reader.peek();
  }

  // skip closing bracket
  reader.skip();

  return {
    type: "VectorLiteral",
    members,
    srcloc,
  };
};

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
  reader.expect(TokenTypes.Symbol, tok.type);
  tok = reader.lookahead(1);

  if (tok.type === TokenTypes.Keyword && tok.value === ":") {
    // record literal = { prop : value, prop2: value2 }
    return readRecordLiteral(reader, srcloc);
  } else {
    // record pattern = { prop, prop2 }
    return readRecordPattern(reader, srcloc);
  }
};

/**
 * Reads a record property
 * @param {Reader} reader
 * @returns {Property}
 */
const readProperty = (reader) => {
  let tok = reader.peek();
  let srcloc = tok.srcloc;

  reader.expect(TokenTypes.Symbol, tok.type);

  const key = readExpr(reader);

  tok = reader.peek();
  reader.expect(":", tok.value);
  reader.skip();

  const value = readExpr(reader);

  return {
    type: "Property",
    key,
    value,
    srcloc,
  };
};

/**
 * Reads a record literal
 * @param {Reader} reader
 * @param {SrcLoc} srcloc
 * @returns {RecordLiteral}
 */
const readRecordLiteral = (reader, srcloc) => {
  let tok = reader.peek();
  /** @type {Property[]} */
  let properties = [];
  let lastTok = tok;

  while (tok?.type !== TokenTypes.RBrace) {
    if (!tok) {
      throw new SyntaxException("EOF", lastTok.srcloc, "}");
    }

    reader.expect(TokenTypes.Symbol, tok.type);
    properties.push(readProperty(reader));
    lastTok = tok;
    tok = reader.peek();
  }

  // skip closing brace
  reader.skip();

  return {
    type: "RecordLiteral",
    properties,
    srcloc,
  };
};

/**
 * Reads a record pattern
 * @param {Reader} reader
 * @param {SrcLoc} srcloc
 * @returns {RecordPattern}
 */
const readRecordPattern = (reader, srcloc) => {
  /** @type {Token[]} */
  let properties = [];
  let tok = reader.peek();
  let lastTok = tok;

  while (tok?.type !== TokenTypes.RBrace) {
    if (!tok) {
      if (!tok) {
        throw new SyntaxException("EOF", lastTok.srcloc, "}");
      }
    }

    tok = reader.peek();
    reader.expect(TokenTypes.Symbol, tok.type);
    properties.push(readExpr(reader));
    lastTok = tok;
    tok = reader.peek();
  }

  // skip closing brace
  reader.skip();

  return {
    type: "RecordPattern",
    properties,
    srcloc,
  };
};

/**
 * Reads a member expression
 * @param {Reader} reader
 * @param {Form} left
 * @returns {MemberExpression}
 */
const readMemberExpression = (reader, left) => {
  const tok = reader.next();
  reader.expect(TokenTypes.Dot, tok.type);
  const property = readExpr(reader);
  console.log(property);
  return {
    type: "MemberExpression",
    object: left,
    property,
    srcloc: left.srcloc,
  };
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

const getPrec = (token) => PREC[token?.type] ?? 0;

/**
 * Reads expressions, including reader macros
 * @param {Reader} reader
 * @returns {Form}
 */
const readExpr = (reader, bp = 0) => {
  let left = readForm(reader);
  let tok = reader.peek();
  let prec = getPrec(tok);

  while (bp < prec) {
    left = readMemberExpression(reader, left);
    tok = reader.peek();
    prec = getPrec(tok);
  }

  return left;
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
      : readExpr(reader);
  let parseTree = cons(form, null);

  while (!reader.eof()) {
    parseTree.append(readExpr(reader));
  }

  return parseTree;
};
