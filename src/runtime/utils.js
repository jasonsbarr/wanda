/**
 * Checks if a value is nil
 * @param {any} val
 * @returns {boolean}
 */
export const isNil = (val) => val == null;

/**
 * Checks if a value is falsy (false or nil)
 * @param {any} val
 * @returns {boolean}
 */
export const isFalsy = (val) => val === false || isNil(val);

/**
 * Checks if a value is truthy (not false or nil)
 * @param {any} val
 * @returns {boolean}
 */
export const isTruthy = (val) => !isFalsy(val);
