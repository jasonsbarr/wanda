import { union } from "./union.js";
import { isUnion } from "./validators.js";
/**
 * @callback TypeMapper
 * @param {import("./types").Type} t
 * @returns {import("./types").Type}
 */
/**
 * Handle getting the result type of an operation on a union type. Depends on normalization, so t.types should contain no unions
 * @param {import("./types").Type} t
 * @param {TypeMapper} fn
 * @returns {import("./types").Type}
 */
export const unionMap = (t, fn) =>
  isUnion(t) ? union(...t.types.map(fn)) : fn(t);
