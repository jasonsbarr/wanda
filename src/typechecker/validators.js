import { TypeTypes } from "./types.js";

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isAny = (type) => {
  return type.kind === TypeTypes.Any;
};

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isNumber = (type) => {
  return type.kind === TypeTypes.Number;
};

/**
 * Checks if current type is a String
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isString = (type) => {
  return type.kind === TypeTypes.String;
};

/**
 * Checks if current type is a Boolean
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isBoolean = (type) => {
  return type.kind === TypeTypes.Boolean;
};

/**
 * Checks if current type is a Keyword
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isKeyword = (type) => {
  return type.kind === TypeTypes.Keyword;
};

/**
 * Checks if current type is a Nil
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isNil = (type) => {
  return type.kind === TypeTypes.Nil;
};

/**
 * Checks if current type is a function type
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isFunctionType = (type) => {
  return type.kind === TypeTypes.FunctionType;
};

/**
 * Checks if current type is a type alias
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isTypeAlias = (type) => {
  return type.kind === TypeTypes.TypeAlias;
};

/**
 * Checks if current type is a list
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isList = (type) => {
  return type.kind === TypeTypes.List;
};

/**
 * Checks if current type is a vector
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const isVector = (type) => {
  return type.kind === TypeTypes.Vector;
};

/**
 * Checks if current type is an object
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isObject = (type) => {
  return type.kind === TypeTypes.Object;
};

/**
 * Checks if current type is undefined
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isUndefined = (type) => {
  return type.kind === TypeTypes.Undefined;
};

/**
 * Checks if current type is a tuple
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isTuple = (type) => {
  return type.kind === TypeTypes.Tuple;
};

/**
 * Checks if current type is a singleton
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isSingleton = (type) => {
  return type.kind === TypeTypes.Singleton;
};

/**
 * Checks if current type is a never
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isNever = (type) => {
  return type.kind === TypeTypes.Never;
};

/**
 * Checks if current type is a union
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isUnion = (type) => {
  return type.kind === TypeTypes.Union;
};

/**
 * Checks if current type is unknown
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isUnknown = (type) => {
  return type.kind === TypeTypes.Unknown;
};

/**
 * Checks if current type is an intersection
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isIntersection = (type) => {
  return type.kind === TypeTypes.Intersection;
};

/**
 * Checks if current type is a negation type
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isNot = (type) => {
  return type.kind === TypeTypes.Not;
};

/**
 * Checks if current type is a module type
 * @param {import("./types.js").Type} type
 * @returns {boolean}
 */
export const isModule = (type) => {
  return type.kind === TypeTypes.Module;
};
