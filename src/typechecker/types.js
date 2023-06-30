/**
 * @enum {string}
 */
export const TypeTypes = {
  Any: "Any",
  Number: "Number",
  String: "String",
  Boolean: "Boolean",
  Keyword: "Keyword",
  Nil: "Nil",
  FunctionType: "FunctionType",
  TypeAlias: "TypeAlias",
  List: "List",
  Vector: "Vector",
  Property: "Property",
  Object: "Object",
  Undefined: "Undefined",
  Tuple: "Tuple",
  Singleton: "Singleton",
  Never: "Never",
  Union: "Union",
  Unknown: "Unknown",
  Intersection: "Intersection",
  Not: "Not",
};
/**
 * @typedef Any
 * @prop {TypeTypes.Any} kind
 */
/**
 * @typedef Number
 * @prop {TypeTypes.Number} kind
 */
/**
 * @typedef String
 * @prop {TypeTypes.String} kind
 */
/**
 * @typedef Boolean
 * @prop {TypeTypes.Boolean} kind
 */
/**
 * @typedef Keyword
 * @prop {TypeTypes.Keyword} kind
 */
/**
 * @typedef Nil
 * @prop {TypeTypes.Nil} kind
 */
/**
 * @typedef TypeAlias
 * @prop {TypeTypes.TypeAlias} kind
 * @prop {string} name
 * @prop {Type} base
 */
/**
 * @typedef FunctionType
 * @prop {TypeTypes.FunctionType} kind
 * @prop {Type[]} params
 * @prop {Type} ret
 * @prop {boolean} variadic
 */
/**
 * @typedef List
 * @prop {TypeTypes.List} kind
 * @prop {Type} listType
 * @prop {boolean} constant
 */
/**
 * @typedef Vector
 * @prop {TypeTypes.Vector} kind
 * @prop {Type} vectorType
 * @prop {boolean} constant
 */
/**
 * @typedef Property
 * @prop {TypeTypes.Property} kind
 * @prop {string} name
 * @prop {Type} type
 */
/**
 * @typedef Object
 * @prop {TypeTypes.Object} kind
 * @prop {Property[]} properties
 * @prop {boolean} constant
 */
/**
 * @typedef Undefined
 * @prop {TypeTypes.Undefined} kind
 */
/**
 * @typedef Tuple
 * @prop {TypeTypes.Tuple} kind
 * @prop  {Type[]} types
 * @prop {boolean} constant
 */
/**
 * @typedef Singleton
 * @prop {TypeTypes.Singleton} kind
 * @prop {"Number"|"String"|"Boolean"|"Keyword"} base
 * @prop {string} value
 * @prop {true} constant
 */
/**
 * @typedef Never
 * @prop {TypeTypes.Never} kind
 */
/**
 * @typedef Union
 * @prop {TypeTypes.Union} kind
 * @prop {Type[]} types
 */
/**
 * @typedef Unknown
 * @prop {TypeTypes.Unknown} kind
 */
/**
 * @typedef Intersection
 * @prop {TypeTypes.Intersection} kind
 * @prop {Type[]} types
 */
/**
 * @typedef Not
 * @prop {TypeTypes.Not} kind
 */
/**
 * @typedef {Number|String|Boolean|Keyword|Nil|Undefined} PrimitiveType
 */
/**
 * @typedef {Any|PrimitiveType|FunctionType|TypeAlias|List|Vector|Object|Tuple|Singleton|Never|Union|Unknown|Intersection|Not} Type
 */
