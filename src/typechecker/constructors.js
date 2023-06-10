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
export const listType = (listType) => ({ kind: TypeTypes.List, listType });
