/**
 * Checks if null or undefined
 * @param {any} obj
 * @returns {boolean}
 */
export const isNullish = (obj) => obj != null;

/**
 * Checks if object has property prop
 * @param {Object} obj
 * @param {string|symbol} prop
 * @returns {boolean}
 */
export const hasProperty = (obj, prop) => !isNullish(obj?.[prop]);

/**
 * Checks if object has method methodName
 * @param {Object} obj
 * @param {string|symbol} methodName
 * @returns {boolean}
 */
export const hasMethod = (obj, methodName) =>
  hasProperty(obj, methodName) && typeof obj[methodName] === "function";
