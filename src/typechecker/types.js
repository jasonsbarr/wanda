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
 */
/**
 * @typedef Vector
 * @prop {TypeTypes.Vector} kind
 * @prop {Type} vectorType
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
 */
/**
 * @typedef {Number|String|Boolean|Keyword|Nil} PrimitiveTypes
 */
/**
 * @typedef {Any|PrimitiveTypes|FunctionType|TypeAlias|List|Vector|Object} Type
 */
