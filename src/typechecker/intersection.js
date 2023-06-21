import { propType } from "./propType.js";
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
