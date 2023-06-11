import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";

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
