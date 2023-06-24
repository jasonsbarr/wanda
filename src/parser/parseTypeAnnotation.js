import { Token } from "../lexer/Token.js";
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
  Tuple: "Tuple",
  Singleton: "Singleton",
  Intersection: "Intersection",
  Union: "Union",
  Never: "Never",
  Unknown: "Unknown",
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
 * @prop {TATypes.Function} kind
 * @prop {TypeAnnotation[]} params
 * @prop {TypeAnnotation} retType
 * @prop {boolean} variadic
 */
/**
 * @typedef TupleAnn
 * @prop {TATypes.Tuple} kind
 * @prop {TypeAnnotation[]} types
 */
/**
 * @typedef SingletonAnn
 * @prop {TATypes.Singleton} kind
 * @prop {Token} token
 */
/**
 * @typedef IntersectionAnn
 * @prop {TATypes.Intersection} kind
 * @prop {TypeAnnotation[]} types
 */
/**
 * @typedef UnionAnn
 * @prop {TATypes.Union} kind
 * @prop {TypeAnnotation[]} types
 */
/**
 * @typedef NeverAnn
 * @prop {TATypes.Never} kind
 */
/**
 * @typedef UnknownAnn
 * @prop {TATypes.Unknown} kind
 */
/**
 * @typedef {NumberAnnotation|StringAnnotation|BooleanAnnotation|KeywordAnnotation|NilAnnotation} PrimitiveAnn
 */
/**
 * @typedef {AnyAnnotation|PrimitiveAnn|SymbolAnnotation|ListAnn|VectorAnn|ObjectAnn|FunctionAnn|TupleAnn|SingletonAnn|UnionAnn|IntersectionAnn|NeverAnn} TypeAnnotation
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
 * @param {import("../reader/read.js").RecordLiteral}
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
 * Parse the TupleType for a tuple type annotation
 * @param {import("../reader/read.js").VectorLiteral} annot
 * @returns {TupleAnn}
 */
const parseTupleAnnotation = (annot) => {
  /** @type {TypeAnnotation[]} */
  let types = [];

  for (let mem of annot.members) {
    types.push(parseTypeAnnotation(mem));
  }

  return { kind: TATypes.Tuple, types };
};

/**
 * Parses a singleton type annotation
 * @param {Token} annot
 * @returns {SingletonAnn}
 */
const parseSingletonAnnotation = (annot) => ({
  kind: TATypes.Singleton,
  token: annot,
});

/**
 * Parses a function type annotation
 * @param {Array} annotation
 * @returns {FunctionAnn}
 */
const parseFunctionAnnotation = (annotation) => {
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
};

/**
 * Parses type annotation from the token stream
 * @param {Cons|Token} annotation
 * @returns {TypeAnnotation}
 */
const parseTypePrimitive = (annotation) => {
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
      return parseFunctionAnnotation(annotation);
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

  if (annot.type === "VectorLiteral") {
    return parseTupleAnnotation(annot);
  }

  if (annot.type === TokenTypes.Nil) {
    return { kind: TATypes.NilLiteral };
  }

  if (
    annot.type === TokenTypes.Number ||
    annot.type === TokenTypes.String ||
    annot.type === TokenTypes.Boolean ||
    annot.type === TokenTypes.String
  ) {
    return parseSingletonAnnotation(annot);
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
      case "never":
        return { kind: TATypes.Never };
      case "unknown":
        return { kind: TATypes.Unknown };
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

/**
 *
 * @param {Cons|Token} annotation
 * @returns
 */
export const parseTypeAnnotation = (annotation) => {
  const annot = annotation instanceof Cons ? [...annotation] : null;

  const isCompound =
    Array.isArray(annot) &&
    annot.reduce((isCompound, item) => {
      if (
        (item.type === TokenTypes.Symbol && item.value === "||") ||
        item.type === TokenTypes.AmpAmp
      ) {
        return true;
      }
      return isCompound;
    }, false);

  if (isCompound) {
    /** @type {TypeAnnotation} */
    const first = parseTypeAnnotation(annot[0]);
    /** @type {Token} */
    let sep = annot[1];
    const kind =
      sep.type === TokenTypes.AmpAmp ? TATypes.Intersection : TATypes.Union;
    const types = [first];

    let i = 2;
    while (sep) {
      types.push(parseTypeAnnotation(annot[i]));
      i++;
      sep = annot[i];
    }

    return { kind, types };
  }

  return parseTypePrimitive(annotation);
};
