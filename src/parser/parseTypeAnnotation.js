import { TokenTypes } from "../lexer/TokenTypes.js";
import { Cons } from "../shared/cons.js";
import { Exception } from "../shared/exceptions.js";

/**
 * @enum {string}
 */
export const TATypes = {
  AnyLiteral: "AnyLiteral",
  NumberLiteral: "NumberLiteral",
  StringLiteral: "StringLiteral",
  BooleanLiteral: "BooleanLiteral",
  KeywordLiteral: "KeywordLiteral",
  NilLiteral: "NilLiteral",
  Symbol: "Symbol",
  List: "List",
  Vector: "Vector",
  Object: "Object",
  Function: "Function",
};
/**
 * @typedef AnyAnnotation
 * @prop {TATypes.AnyLiteral} kind
 */
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
 * @typedef VectorAnn
 * @prop {TATypes.Vector} kind
 * @prop {TypeAnnotation} vectorType
 */
/**
 * @typedef PropertyAnn
 * @prop {string} name
 * @prop {TypeAnnotation} propType
 */
/**
 * @typedef ObjectAnn
 * @prop {TATypes.Object} kind
 * @prop {PropertyAnn[]} properties
 */
/**
 * @typedef FunctionAnn
 * @prop {TypeAnnotation[]} params
 * @prop {TypeAnnotation} retType
 * @prop {boolean} variadic
 */
/**
 * @typedef {NumberAnnotation|StringAnnotation|BooleanAnnotation|KeywordAnnotation|NilAnnotation} PrimitiveAnn
 */
/**
 * @typedef {AnyAnnotation|PrimitiveAnn|SymbolAnnotation|ListAnn|VectorAnn|ObjectAnn|FunctionAnn} TypeAnnotation
 */
/**
 * Parse the listType for a list type annotation
 * @returns {ListAnn}
 */
const parseListAnnotation = (type) => {
  const listType = parseTypeAnnotation(type);
  return { kind: TATypes.List, listType };
};

/**
 * Parse the vectorType for a vector type annotation
 * @returns {VectorAnn}
 */
const parseVectorAnnotation = (type) => {
  const vectorType = parseTypeAnnotation(type);
  return { kind: TATypes.Vector, vectorType };
};

/**
 * Parse the ObjectType for an object type annotation
 * @param {import("./ast.js").RecordLiteral}
 * @returns {ObjectAnn}
 */
const parseObjectAnnotation = (annot) => {
  /** @type {PropertyAnn[]} */
  let properties = [];
  for (let prop of annot.properties) {
    const name = prop.key.value;
    const propType = parseTypeAnnotation(prop.value);
    properties.push({ name, propType });
  }

  return { kind: TATypes.Object, properties };
};

/**
 * Parses type annotation from the token stream
 * @param {Cons} annotation
 * @returns {TypeAnnotation}
 */
export const parseTypeAnnotation = (annotation) => {
  if (annotation instanceof Cons) {
    // is function or generic annotation
    // flatten Cons to array
    annotation = [...annotation];

    // if it has an arrow, it's a function annotation
    const hasArrow = annotation.reduce((hasArrow, item) => {
      if (item.type === TokenTypes.Symbol && item.value === "->") {
        return true;
      }
      return hasArrow;
    }, false);

    if (hasArrow) {
      // is function annotation
      // filter out arrow
      annotation = annotation.filter((item) => item.value !== "->");

      // get return type
      const retType = parseTypeAnnotation(annotation.pop());
      // get param types and if it's variadic
      let params = [];
      let variadic = false;

      for (let item of annotation) {
        if (item.type === TokenTypes.Amp) {
          variadic = true;
          continue;
        } else {
          params.push(parseTypeAnnotation(item));
        }
      }

      return { kind: TATypes.Function, params, retType, variadic };
    }
  }

  let annot;
  if (Array.isArray(annotation)) {
    // is generic annotation
    // get container type
    annot = annotation[0];
  } else {
    // is simple annotation
    annot = annotation;
  }

  if (annot.type === "RecordLiteral") {
    return parseObjectAnnotation(annot);
  }

  if (annot.type === TokenTypes.Nil) {
    return { kind: TATypes.NilLiteral };
  }

  if (annot.type === TokenTypes.Symbol) {
    switch (annot.value) {
      case "any":
        return { kind: TATypes.AnyLiteral };
      case "number":
        return { kind: TATypes.NumberLiteral };
      case "string":
        return { kind: TATypes.StringLiteral };
      case "boolean":
        return { kind: TATypes.BooleanLiteral };
      case "keyword":
        return { kind: TATypes.KeywordLiteral };
      case "list":
        // annotation is array with listType as 2nd member
        return parseListAnnotation(annotation[1]);
      case "vector":
        return parseVectorAnnotation(annotation[1]);
      default:
        // must be a named type
        return { kind: TATypes.Symbol, name: annot.value };
    }
  }

  throw new Exception(
    `Unknown type annotation kind ${JSON.stringify(annot, null, 2)}`
  );
};
