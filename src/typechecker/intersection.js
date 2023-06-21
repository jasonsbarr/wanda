import { never, unknown } from "./constructors.js";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType.js";
import { TypeTypes } from "./types";
import { distributeUnion, union } from "./union.js";
import {
  isIntersection,
  isNever,
  isObject,
  isSingleton,
  isUnion,
  isUnknown,
} from "./validators.js";

/**
 * Checks if type x overlaps with type y, i.e. intersection is not empty
 * @param {import("./types").Type} x
 * @param {import("./types").Type} y
 * @returns {boolean}
 */
const overlaps = (x, y) => {
  if (isNever(x) || isNever(y)) return false;
  if (isUnknown(x) || isUnknown(y)) return true;

  if (isUnion(x)) {
    return x.types.some((x) => overlaps(x, y));
  } else if (isUnion(y)) {
    return y.types.some((y) => overlaps(x, y));
  }

  if (isIntersection(x)) {
    return x.types.every((x) => overlaps(x, y));
  } else if (isIntersection(y)) {
    return y.types.every((y) => overlaps(x, y));
  }

  if (isSingleton(x) && isSingleton(y)) return x.value === y.value;
  if (isSingleton(x)) return x.base === y.kind;
  if (isSingleton(y)) return y.base === x.kind;

  if (isObject(x) && isObject(y)) {
    return x.properties.every(({ name, type: xType }) => {
      const yType = propType(y, name);
      if (!yType) return true;
      else return overlaps(xType, yType);
    });
  }

  return x.type === y.type;
};

/**
 * Flattens nested intersections
 * @param {import("./types").Type[]} ts
 * @returns {import("./types").Type}
 */
const collapseSupertypes = (ts) => {
  return ts.filter((t1, i1) =>
    ts.every(
      (t2, i2) =>
        i1 === i2 || !isSubtype(t2, t1) || (isSubtype(t1, t2) && i1 < i2)
    )
  );
};

const flatten = (ts) =>
  [].concat(...ts.map((t) => (isIntersection(t) ? t.types : t)));

const intersectionNoUnion = (ts) => {
  if (ts.some((t1, i1) => ts.some((t2, i2) => i1 < i2 && !overlaps(t1, t2)))) {
    return never;
  }

  ts = collapseSupertypes(ts);

  if (ts.length === 0) return unknown;
  if (ts.length === 1) return ts[0];

  return { type: TypeTypes.Intersection, types: ts };
};

export const intersection = (...ts) => {
  ts = flatten(ts);
  ts = distributeUnion(ts).map((ts) => intersectionNoUnion(ts));

  return union(...ts);
};
