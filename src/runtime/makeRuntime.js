import { makeFunction } from "./makeFunction.js";
import * as utils from "./utils.js";
import * as obj from "./object.js";
import { makeSymbol } from "./makeSymbol.js";

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
    ...utils,
    makeFunction,
    ...obj,
    makeSymbol,
  };
};
