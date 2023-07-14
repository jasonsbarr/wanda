import { Exception } from "../shared/exceptions.js";
import { intersection } from "./intersection.js";
import { union } from "./union.js";
import { isIntersection, isUnion } from "./validators.js";
/**
 * @callback TypeMapper
 * @param {import("./types.js").Type} t
 * @returns {import("./types.js").Type}
 */
/**
 * @callback TypeMapper2
 * @param {import("./types.js").Type} t1
 * @param {import("./types.js").Type} t2
 * @returns {import("./types.js").Type}
 */
/**
 * Handles mapping when there are 2 types passed into map
 * @param {import("./types.js").Type} t1
 * @param {import("./types.js").Type} t2
 * @param {TypeMapper2}
 * @returns {import("./types.js").Type}
 */
export const map2 = (t1, t2, fn) => {
  if (isUnion(t1) || isUnion(t2)) {
    const t1s = isUnion(t1) ? t1.types : [t1];
    const t2s = isUnion(t2) ? t2.types : [t2];
    const ts = [];
    for (const t1 of t1s) {
      for (const t2 of t2s) {
        ts.push(map(t1, t2, fn));
      }
    }
    return union(...ts);
  } else if (isIntersection(t1) || isIntersection(t2)) {
    const t1s = isIntersection(t1) ? t1.types : [t1];
    const t2s = isIntersection(t2) ? t2.types : [t2];
    const ts = [];
    let error = undefined;
    for (const t1 of t1s) {
      for (const t2 of t2s) {
        try {
          ts.push(fn(t1, t2));
        } catch (e) {
          if (!error) error = e;
        }
      }
    }
    if (ts.length === 0) {
      throw error;
    } else {
      return intersection(...ts);
    }
  } else {
    return fn(t1, t2);
  }
};

/**
 * Handles mapping when there is 1 type passed into map
 * @param {import("./types.js").Type} t
 * @param {TypeMapper} fn
 * @returns {import("./types.js").Type}
 */
export const map1 = (t, fn) => {
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

/**
 * Handle getting the result type of an operation on a union type. Depends on normalization, so t.types should contain no unions
 * @param {...any} args
 * @returns {Type}
 */
export const map = (...args) => {
  switch (args.length) {
    case 2:
      return map1(args[0], args[1]);
    case 3:
      return map2(args[0], args[1], args[2]);
    default:
      throw new Exception(`Unexpected args length ${args.length}`);
  }
};
