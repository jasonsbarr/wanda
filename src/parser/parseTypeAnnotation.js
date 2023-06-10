/**
 * @enum {string}
 */
export const TATypes = {
  NumberLiteral: "NumberLiteral",
  StringLiteral: "StringLiteral",
  BooleanLiteral: "BooleanLiteral",
  KeywordLiteral: "KeywordLiteral",
  NilLiteral: "NilLiteral",
  List: "List",
};
/**
 * @typedef Annotation
 * @prop {TATypes} kind
 */
/**
 * @typedef ListAnnotation
 * @prop {TATypes.List} kind
 * @prop {TypeAnnotation} type
 */
/**
 * @typedef {Annotation|ListAnnotation} TypeAnnotation
 */
