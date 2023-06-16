import { isNullish } from "../shared/utils.js";
/**
 * Checks if a value is falsy (false or nil)
 * @param {any} val
 * @returns {boolean}
 */
export const isFalsy = (val) => val === false || isNullish(val);

/**
 * Checks if a value is truthy (not false or nil)
 * @param {any} val
 * @returns {boolean}
 */
export const isTruthy = (val) => !isFalsy(val);

/**
 * Makes a string into a Wanda keyword
 * @param {string} str
 * @returns {symbol}
 */
export const makeKeyword = (str) => Symbol.for(`:${str}`);
