import {
  isNever,
  isUnknown,
  isAny,
  isNumber,
  isString,
  isBoolean,
  isKeyword,
  isNil,
  isTypeAlias,
  isList,
  isVector,
  isObject,
  isUndefined,
  isFunctionType,
  isTuple,
  isSingleton,
  isUnion,
  isIntersection,
} from "./validators.js";
import { propType } from "./propType.js";

/**
 * Checks if type1 is a subtype of type2
 * @param {import("./types").Type} type1
 * @param {import("./types").Type} type2
 * @returns {boolean}
 */
export const isSubtype = (type1, type2) => {
  // never is bottom type, so is subtype of every type
  if (isNever(type1)) return true;

  // unknown is top type, so every type is its subtype
  if (isUnknown(type2)) return true;

  if (isAny(type1) || isAny(type2)) return true;
  if (isNumber(type1) && isNumber(type2)) return true;
  if (isString(type1) && isString(type2)) return true;
  if (isBoolean(type1) && isBoolean(type2)) return true;
  if (isKeyword(type1) && isKeyword(type2)) return true;
  if (isNil(type1) && isNil(type2)) return true;

  if (isTypeAlias(type1) && isTypeAlias(type2)) {
    return isSubtype(type1.base, type2.base);
  }

  if (isTypeAlias(type1) && !isTypeAlias(type2)) {
    return isSubtype(type1.base, type2);
  }

  if (isTypeAlias(type2) && !isTypeAlias(type1)) {
    return isSubtype(type1, type2.base);
  }

  if (isList(type1) && isList(type2)) {
    return isSubtype(type1.listType, type2.listType);
  }

  if (isVector(type1) && isVector(type2)) {
    return isSubtype(type1.vectorType, type2.vectorType);
  }

  if (isObject(type1) && isObject(type2)) {
    return type2.properties.every(({ name: type2name, type: type2type }) => {
      const type1type = propType(type1, type2name);
      if (!type1type) return false;
      else return isSubtype(type1type, type2type);
    });
  }

  // a type should only be undefined on the first pass through the checker
  if (isUndefined(type1) || isUndefined(type2)) return true;

  if (isFunctionType(type1) && isFunctionType(type2)) {
    return (
      type1.params.length === type2.params.length &&
      type1.params.every((a, i) => isSubtype(type2.params[i], a)) &&
      isSubtype(type1.ret, type2.ret)
    );
  }

  if (isTuple(type1) && isTuple(type2)) {
    return type1.types.every((a, i) => isSubtype(a, type2.types[i]));
  }

  if (isSingleton(type1)) {
    if (isSingleton(type2)) return type1.value === type2.value;
    else return isSubtype(type1.base, type2);
  }

  if (isUnion(type1)) {
    return type1.types.every((t1) => isSubtype(t1, type2));
  }

  if (isUnion(type2)) {
    return type2.types.some((t2) => isSubtype(type1, t2));
  }

  if (isIntersection(type1)) {
    return type1.types.some((a) => isSubtype(a, type2));
  }

  if (isIntersection(type2)) {
    return type2.types.every((b) => isSubtype(type1, b));
  }

  return false;
};
