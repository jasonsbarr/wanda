/**
 * @enum {string}
 */
export const TypeTypes = {
  Number: "Number",
  String: "String",
  Boolean: "Boolean",
  Keyword: "Keyword",
  Nil: "Nil",
  TypeAlias: "TypeAlias",
  List: "List",
};
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
 * @typedef List
 * @prop {TypeTypes.List} kind
 * @prop {Type} listType
 */
/**
 * @typedef {Number|String|Boolean|Keyword|Nil} PrimitiveTypes
 */
/**
 * @typedef {Number|String|Boolean|Keyword|Nil|TypeAlias|List} Type
 */
