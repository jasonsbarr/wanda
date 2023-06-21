import { intersection } from "./intersection.js";
import { union } from "./union.js";
import { isIntersection, isUnion } from "./validators.js";
/**
 * @callback TypeMapper
 * @param {import("./types.js").Type} t
 * @returns {import("./types.js").Type}
 */
/**
 * Handle getting the result type of an operation on a union type. Depends on normalization, so t.types should contain no unions
 * @param {import("./types.js").Type} t
 * @param {TypeMapper} fn
 * @returns {import("./types.js").Type}
 */
export const map = (t, fn) => {
  if (isUnion(t)) {
    return union(...t.types.map((t) => map(t, fn)));
  } else if (isIntersection(t)) {
    /** @type {import("./types.js").Type[]} */
    let ts = [];
    let error = null;

    for (let tt of t.types) {
      try {
        ts.push(fn(tt));
      } catch (e) {
        if (!error) error = e;
      }
    }

    if (ts.length === 0) {
      throw error;
    } else {
      return intersection(...ts);
    }
  } else {
    return fn(t);
  }
};
