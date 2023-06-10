import { TypeTypes } from "./types";

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const number = (type) => {
  return type.kind === TypeTypes.Number;
};

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const string = (type) => {
  return type.kind === TypeTypes.String;
};

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const boolean = (type) => {
  return type.kind === TypeTypes.Boolean;
};

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const keyword = (type) => {
  return type.kind === TypeTypes.Keyword;
};

/**
 * Checks if current type is a Number
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const nil = (type) => {
  return type.kind === TypeTypes.Nil;
};

/**
 * Checks if current type is a type alias
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const typeAlias = (type) => {
  return type.kind === TypeTypes.TypeAlias;
};

/**
 * Checks if current type is a list
 * @param {import("./types").Type} type
 * @returns {boolean}
 */
export const list = (type) => {
  return type.kind === TypeTypes.List;
};
