import { makeFunction } from "./makeFunction.js";

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
    makeFunction,
  };
};
