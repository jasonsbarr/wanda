import { union } from "./union.js";
import { isUnion } from "./validators.js";
/**
 * @callback TypeMapper
 * @param {import("./types").Type} t
 * @returns {import("./types").Type}
 */
/**
 *
 * @param {import("./types").Type} t
 * @param {TypeMapper} fn
 * @returns {import("./types").Type}
 */
export const unionMap = (t, fn) =>
  isUnion(t) ? union(...t.types.map(fn)) : fn(t);
