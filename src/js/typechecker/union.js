import { never } from "./constructors.js";
import { isSubtype } from "./isSubtype.js";
import { TypeTypes } from "./types.js";
import { isUnion } from "./validators.js";

/**
 * Collapse subtypes in a union type
 * @param {import("./types").Type[]} ts
 * @returns {import("./types").Type[]}
 */
const collapseSubtypes = (ts) => {
  /**
   * An arm is kept if for every arm (except itself) it's not a subtype of the
   * other arm or it's equivalent to the other arm and this is the first
   * equivalent arm.
   */
  return ts.filter((t1, i1) => {
    return ts.every(
      (t2, i2) =>
        i1 === i2 || !isSubtype(t1, t2) || (isSubtype(t2, t1) && i1 < i2)
    );
  });
};

/**
 * Flattens union arms to remove nested redundancies
 * @param {import("./types").Type[]} ts
 * @returns {import("./types").Type[]}
 */
const flatten = (ts) => {
  return [].concat(...ts.map((t) => (isUnion(t) ? t.types : t)));
};

/**
 * Union type constructor
 * @param  {...import("./types").Type} types
 * @returns {import("./types").Type}
 */
export const union = (...types) => {
  types = flatten(types);
  types = collapseSubtypes(types);

  if (types.length === 0) return never;
  if (types.length === 1) return types[0];
  return { kind: TypeTypes.Union, types };
};

/**
 * Distribute intersections over unions
 * @param {import("./types.js").Type} ts
 * @returns {import("./types.js").Type}
 */
export const distributeUnion = (ts) => {
  /** @type {import("./types.js").Type[]} */
  let accum = [];

  const dist = (ts, i) => {
    if (i === ts.length) {
      accum.push(ts);
    } else {
      const ti = ts[i];

      if (isUnion(ti)) {
        for (let t of ti.types) {
          const ts2 = ts.slice(0, i).concat(t, ts.slice(i + 1));
          dist(ts2, i + 1);
        }
      } else {
        dist(ts, i + 1);
      }
    }
  };

  dist(ts, 0);
  return accum;
};
