import { fail } from "../shared/fail.js";
import { makeFunction } from "./makeFunction.js";
import * as utils from "./utils.js";
import * as obj from "./object.js";
import { makeSymbol } from "./makeSymbol.js";
import { makeWandaValue } from "./conversion.js";

/**
 * @typedef Runtime
 * @prop {Function} makeFunction
 * @prop {Function} makeSymbol
 * @prop {Function} makeWandaValue
 * @prop {Function} isNil
 * @prop {Function} isFalsy
 * @prop {Function} isTruthy
 * @prop {Function} makeKeyword
 * @prop {Function} hasDict
 * @prop {Function} hasField
 * @prop {Function} hasMethod
 * @prop {Function} getField
 * @prop {Function} hasMetaField
 * @prop {Function} getMetaField
 * @prop {Function} addMetaField
 * @prop {Function} makeObject
 * @prop {Function} failRuntime
 * @prop {Function} fail
 */
/**
 * Creates a Wanda runtime
 * @returns {Runtime}
 */
export const makeRuntime = () => {
  return {
    ...utils,
    makeFunction,
    ...obj,
    makeSymbol,
    makeWandaValue,
    fail,
  };
};
