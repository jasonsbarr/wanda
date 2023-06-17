import { TypeTypes } from "./types.js";

/**
 * @type {import("./types").Any}
 */
export const any = { kind: TypeTypes.Any };

/**
 * @type {import("./types").Number}
 */
export const number = { kind: TypeTypes.Number };

/**
 * @type {import("./types").String}
 */
export const string = { kind: TypeTypes.String };

/**
 * @type {import("./types").Boolean}
 */
export const boolean = { kind: TypeTypes.Boolean };

/**
 * @type {import("./types").Keyword}
 */
export const keyword = { kind: TypeTypes.Keyword };

/**
 * @type {import("./types").Nil}
 */
export const nil = { kind: TypeTypes.Nil };

/**
 * Function type constructor
 * @param {import("./types.js").Type[]} params
 * @param {import("./types.js").Type} ret
 * @returns {import("./types.js").FunctionType}
 */
export const functionType = (params, ret, variadic = false) => {
  return { kind: TypeTypes.FunctionType, params, ret, variadic };
};

/**
 * Type Alias constructor
 * @param {string} name
 * @param {import("./types").Type} base
 * @returns {import("./types").TypeAlias}
 */
export const typeAlias = (name, base) => ({
  kind: TypeTypes.TypeAlias,
  name,
  base,
});

/**
 * List type constructor
 * @param {import("./types").Type} listType
 * @returns {import("./types").List}
 */
export const list = (listType) => ({ kind: TypeTypes.List, listType });

/**
 * Vector type constructor
 * @param {import("./types.js").Type} vectorType
 * @returns {import("./types.js").Vector}
 */
export const vector = (vectorType) => ({
  kind: TypeTypes.Vector,
  vectorType,
});

/**
 * Object type constructor
 * @param {import("./types.js").Property[]} properties
 * @returns {import("./types.js").Object}
 */
export const object = (properties) => ({ kind: TypeTypes.Object, properties });

/**
 * Undefined type constructor
 */
export const undefinedType = { kind: TypeTypes.Undefined };
