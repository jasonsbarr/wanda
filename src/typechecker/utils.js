import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { TypeTypes } from "./types.js";

/**
 * Gets the base type of a type alias
 * @param {string} name
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
export const getAliasBase = (name, env) => {
  let baseType = env.getType(name);

  while (Type.isTypeAlias(baseType)) {
    baseType = env.getType(baseType.name);
  }

  return baseType;
};

/**
 * If a type's value is known at compile time, check if truthy or falsy
 * @param {import("./types").Type} type
 * @returns {boolean|undefined}
 */
export const isTruthy = (type) => {
  switch (type.kind) {
    case TypeTypes.Nil:
      return false;
    case TypeTypes.Singleton:
      if (type.value === "false") {
        return false;
      }
      return true;
    default:
      if (type.kind !== TypeTypes.Boolean) {
        return true;
      }
  }
};

/**
 *
 * @param {import("./types").Type} type
 * @returns {boolean|undefined}
 */
export const isFalsy = (type) => {
  switch (type.kind) {
    case TypeTypes.Nil:
      return true;
    case TypeTypes.Singleton:
      if (type.value === "false") {
        return true;
      }
      return false;
    default:
      if (type.kind !== TypeTypes.Boolean) {
        return false;
      }
  }
};
