import { TokenTypes } from "../lexer/TokenTypes.js";
import { Cons } from "../shared/cons.js";
import { SyntaxException } from "../shared/exceptions.js";

/**
 * @enum {string}
 */
export const TATypes = {
  NumberLiteral: "NumberLiteral",
  StringLiteral: "StringLiteral",
  BooleanLiteral: "BooleanLiteral",
  KeywordLiteral: "KeywordLiteral",
  NilLiteral: "NilLiteral",
  Symbol: "Symbol",
  Alias: "Alias",
  List: "List",
};
/**
 * @typedef NumberAnnotation
 * @prop {TATypes.NumberLiteral} kind
 */
/**
 * @typedef StringAnnotation
 * @prop {TATypes.StringLiteral} kind
 */
/**
 * @typedef BooleanAnnotation
 * @prop {TATypes.BooleanLiteral} kind
 */
/**
 * @typedef KeywordAnnotation
 * @prop {TATypes.KeywordLiteral} kind
 */
/**
 * @typedef NilAnnotation
 * @prop {TATypes.NilLiteral} kind
 */
/**
 * @typedef SymbolAnnotation
 * @prop {TATypes.Symbol} kind
 * @prop {string} name
 */
/**
 * @typedef ListAnn
 * @prop {TATypes.List} kind
 * @prop {TypeAnnotation} listType
 */
/**
 * @typedef {NumberAnnotation|StringAnnotation|BooleanAnnotation|KeywordAnnotation|NilAnnotation} PrimitiveAnn
 */
/**
 * @typedef {PrimitiveAnn|SymbolAnnotation|ListAnn} TypeAnnotation
 */
/**
 * Parse the listType for a list type annotation
 */
const parseListAnnotation = (type) => {
  const listType = parseTypeAnnotation(type);
  return { kind: TATypes.List, listType };
};

/**
 * Parses type annotation from the token stream
 * @param {Cons} annotation
 * @returns {TypeAnnotation}
 */
export const parseTypeAnnotation = (annotation) => {
  let annot;

  if (annotation instanceof Cons) {
    annotation = [...annotation];
  }

  if (Array.isArray(annotation)) {
    annot = annotation[0];
  } else {
    annot = annotation;
  }

  if (annot.type === TokenTypes.Symbol) {
    switch (annot.value) {
      case "number":
        return { kind: TATypes.NumberLiteral };
      case "string":
        return { kind: TATypes.StringLiteral };
      case "boolean":
        return { kind: TATypes.BooleanLiteral };
      case "keyword":
        return { kind: TATypes.KeywordLiteral };
      case "nil":
        return { kind: TATypes.NilLiteral };
      case "list":
        // annotation is array with listType as 2nd member
        return parseListAnnotation(annotation[1]);
      default:
        // must be a type alias
        return { kind: TATypes.Symbol, name: annot.value };
    }
  }
};
