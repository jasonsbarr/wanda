import { Type } from "./Type.js";
import { isSubtype } from "./isSubtype.js";

/**
 * Unifies types by returning the common supertype
 * @param {import("./types.js").Type} type1
 * @param {import("./types.js").Type} type2
 * @returns {import("./types.js").Type|null}
 */
export const unify = (type1, type2) => {
  if (isSubtype(type1, type2)) {
    return type2;
  } else if (isSubtype(type2, type1)) {
    return type1;
  }

  return Type.unknown;
};

/**
 * Unifies an arbitrary number of types
 * @param  {...import("./types.js").Type} types
 * @returns {import("./types.js").Type|null}
 */
export const unifyAll = (...types) => {
  return types.reduce((unified, type) => {
    if (Type.isUnknown(unified) || Type.isAny(unified)) return unified;

    return unify(unified, type);
  });
};
