import { Type } from "./Type.js";

/**
 * Checks if type1 is a subtype of type2
 * @param {import("./types").Type} type1
 * @param {import("./types").Type} type2
 * @returns {boolean}
 */
export const isSubtype = (type1, type2) => {
  if (Type.isNumber(type1) && Type.isNumber(type2)) return true;
  if (Type.isString(type1) && Type.isString(type2)) return true;
  if (Type.isBoolean(type1) && Type.isBoolean(type2)) return true;
  if (Type.isKeyword(type1) && Type.isKeyword(type2)) return true;
  if (Type.isNil(type1) && Type.isNil(type2)) return true;

  if (Type.isTypeAlias(type1) && Type.isTypeAlias(type2)) {
    return isSubtype(type1.base, type2.base);
  }

  if (Type.isTypeAlias(type1) && !Type.isTypeAlias(type2)) {
    return isSubtype(type1.base, type2);
  }

  if (Type.isTypeAlias(type2) && !Type.isTypeAlias(type1)) {
    return isSubtype(type1, type2.base);
  }

  if (Type.isList(type1) && Type.isList(type2)) {
    return isSubtype(type1.listType, type2.listType);
  }

  return false;
};
