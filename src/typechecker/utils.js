import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { TypeTypes } from "./types";

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
    case TypeTypes.Object:
    case TypeTypes.Vector:
    case TypeTypes.Tuple:
    case TypeTypes.String:
    case TypeTypes.Number:
    case TypeTypes.Keyword:
    case TypeTypes.FunctionType:
      return true;
    case TypeTypes.Nil:
      return false;
    case TypeTypes.Singleton:
      if (type.value === "false") {
        return false;
      }
      return true;
  }
};

/**
 *
 * @param {import("./types").Type} type
 * @returns {boolean|undefined}
 */
export const isFalsy = (type) => {
  switch (type.kind) {
    case TypeTypes.Object:
    case TypeTypes.Vector:
    case TypeTypes.Tuple:
    case TypeTypes.String:
    case TypeTypes.Number:
    case TypeTypes.Keyword:
    case TypeTypes.FunctionType:
      return false;
    case TypeTypes.Nil:
      return true;
    case TypeTypes.Singleton:
      if (type.value === "false") {
        return true;
      }
      return false;
  }
};
