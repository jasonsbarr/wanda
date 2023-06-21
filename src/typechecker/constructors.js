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
 * @param {boolean} [constant=false]
 * @returns {import("./types").List}
 */
export const list = (listType, constant = false) => ({
  kind: TypeTypes.List,
  listType,
  constant,
});

/**
 * Vector type constructor
 * @param {import("./types.js").Type} vectorType
 * @param {boolean} [constant=false]
 * @returns {import("./types.js").Vector}
 */
export const vector = (vectorType, constant = false) => ({
  kind: TypeTypes.Vector,
  vectorType,
  constant,
});

/**
 * Object type constructor
 * @param {import("./types.js").Property[]} properties
 * @param {boolean} [constant=false]
 * @returns {import("./types.js").Object}
 */
export const object = (properties, constant = false) => ({
  kind: TypeTypes.Object,
  properties,
  constant,
});

/**
 * Undefined type constructor
 */
export const undefinedType = { kind: TypeTypes.Undefined };

/**
 * Tuple type constructor
 * @param {import("./types.js").Type[]} types
 * @param {boolean} [constant=false]
 * @returns {import("./types.js").Tuple}
 */
export const tuple = (types, constant = false) => ({
  kind: TypeTypes.Tuple,
  types,
  constant,
});

/**
 * Singleton type constructor
 * @param {import("./types.js").PrimitiveType} base
 * @param {"Number"|"String"|"Boolean"|"Keyword"} value
 * @returns {import("./types.js").Singleton}
 */
export const singleton = (base, value) => ({
  kind: TypeTypes.Singleton,
  base,
  value,
  constant: true,
});

export const never = { kind: TypeTypes.Never };

/**
 * Unknown type constructor
 */
export const unknown = { kind: TypeTypes.Unknown };
