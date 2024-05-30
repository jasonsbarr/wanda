import { fail } from "../shared/fail.js";
import { isNullish as isNil } from "../shared/utils.js";
import { makeFunction } from "./makeFunction.js";
import * as utils from "./utils.js";
import * as obj from "./object.js";
import { makeSymbol, makeGenSym } from "./makeSymbol.js";
import { makeWandaValue, makeJSValue } from "./conversion.js";
import { makeNumber } from "./number.js";
import { trampoline, recur } from "./trampoline.js";
import { parseTypesObject } from "./parseTypesObject.js";

/**
 * @typedef Runtime
 * @prop {Function} makeFunction
 * @prop {Function} makeSymbol
 * @prop {Function} makeGenSym
 * @prop {Function} makeWandaValue
 * @prop {Function} makeJSValue
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
 * @prop {Function} makeNumber
 * @prop {Function} failRuntime
 * @prop {Function} fail
 * @prop {Function} makeNumber
 * @prop {Function} isNil
 * @prop {Function} trampoline
 * @prop {Function} recur
 * @prop {Function} parseTypesObject
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
    makeGenSym,
    makeWandaValue,
    makeJSValue,
    fail,
    makeNumber,
    isNil,
    trampoline,
    recur,
    parseTypesObject,
  };
};
