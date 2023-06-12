import { TokenTypes } from "../lexer/TokenTypes.js";
import { SyntaxException } from "../shared/exceptions.js";
import { ConsReader } from "./ConsReader.js";
import { Cons } from "../shared/cons.js";
import { AST, ASTTypes } from "./ast.js";
import { SrcLoc } from "../lexer/SrcLoc.js";
import { parseTypeAnnotation } from "./parseTypeAnnotation.js";
import { Token } from "../lexer/Token.js";

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
  let [_, lhv, expression] = decl;

  let parsedLhv,
    typeAnnotation = null;
  if (lhv instanceof Cons) {
    // has type annotation
    const realLhv = lhv.get(0);
    // convert to array and get rid of ":" when passing into parseTypeAnnotation
    typeAnnotation = parseTypeAnnotation([...lhv.cdr].slice(1));
    parsedLhv = parseExpr(realLhv);
  } else {
    parsedLhv = parseExpr(lhv);
  }

  if (parsedLhv.kind === ASTTypes.VectorLiteral) {
    parsedLhv = convertVectorLiteralToVectorPattern(parsedLhv);
  }

  const parsedExpression = parseExpr(expression);

  return AST.VariableDeclaration(
    parsedLhv,
    parsedExpression,
    decl.srcloc,
    typeAnnotation
  );
};

/**
 * Parses a set expression
 * @param {List} expr
 * @returns {import("./ast.js").SetExpression}
 */
const parseSetExpression = (expr) => {
  const [_, lhv, expression] = expr;
  const parsedLhv = parseExpr(lhv);

  if (parsedLhv.kind === ASTTypes.VectorLiteral) {
    parsedLhv = convertVectorLiteralToVectorPattern(parsedLhv);
  }

  const parsedExpression = parseExpr(expression);

  return AST.SetExpression(parsedLhv, parsedExpression, expr.srcloc);
};

const convertVectorLiteralToVectorPattern = (parsedLhv) => {
  for (let mem of parsedLhv.members) {
    if (mem.kind !== ASTTypes.Symbol) {
      throw new SyntaxException(mem.kind, mem.srcloc, ASTTypes.Symbol);
    }
  }
  parsedLhv.kind = ASTTypes.VectorPattern;
  return parsedLhv;
};

/**
 * Parses a do (block) expression
 * @param {List} expr
 * @returns {import("./ast.js").DoExpression}
 */
const parseDoExpression = (expr) => {
  const [_, ...exprs] = expr;
  let body = [];

  for (let ex of exprs) {
    body.push(parseExpr(ex));
  }

  return AST.DoExpression(body, expr.srcloc);
};

/**
 * Parses a type alias
 * @param {List} form
 * @returns {import("./parseTypeAnnotation.js").TypeAlias}
 */
const parseTypeAlias = (form) => {
  let [_, name, type] = form;
  name = name.value;
  const parsedType = parseTypeAnnotation(type);

  return AST.TypeAlias(name, parsedType, form.srcloc);
};

/**
 * Parses a complex form passed in from the reader
 * @param {import("../reader/read.js").ComplexForm} form
 * @returns {AST}
 */
const parseComplexForm = (form) => {
  switch (form.type) {
    case "VectorLiteral": {
      const members = form.members.map(parseExpr);
      return AST.VectorLiteral(members, form.srcloc);
    }
    case "RecordLiteral": {
      const properties = form.properties.map(parseProperty);
      return AST.RecordLiteral(properties, form.srcloc);
    }
    case "RecordPattern": {
      const properties = form.properties.map(parseExpr);
      return AST.RecordPattern(properties, form.srcloc);
    }
    case "MemberExpression": {
      const object = parseExpr(form.object);
      const property = parseExpr(form.property);
      return AST.MemberExpression(object, property, form.srcloc);
    }
    default:
      // this should never happen
      throw new SyntaxException(form.type, form.srcloc);
  }
};

/**
 * Parses an object property
 * @param {import("../reader/read.js").Property} form
 * @returns {import("./ast.js").Property}
 */
const parseProperty = (form) => {
  const key = parseExpr(form.key);
  const value = parseExpr(form.value);
  return AST.Property(key, value, form.srcloc);
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
    case "do":
      return parseDoExpression(form);
    case "type":
      return parseTypeAlias(form);
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

  if (form instanceof Token) {
    return parsePrimitive(form);
  }

  return parseComplexForm(form);
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
