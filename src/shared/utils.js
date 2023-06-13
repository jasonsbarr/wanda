/**
 * Checks if null or undefined
 * @param {any} obj
 * @returns {boolean}
 */
export const isNullish = (obj) => obj != null;

/**
 * Checks if object has property prop
 * @param {Object} obj
 * @param {string} prop
 * @returns {boolean}
 */
export const hasProperty = (obj, prop) => !isNullish(obj?.[prop]);

export const hasMethod = (obj, methodName) =>
  hasProperty(obj, methodName) && typeof obj[methodName] === "function";
