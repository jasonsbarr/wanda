import { makeFunction } from "./makeFunction.js";
import { isNil, isTruthy, isFalsy } from "./utils.js";

/**
 * @typedef Runtime
 * @prop {Function} makeFunction
 */
/**
 * Creates a Wanda runtime
 * @returns {Runtime}
 */
export const makeRuntime = () => {
  return {
    isFalsy,
    isNil,
    isTruthy,
    makeFunction,
  };
};
