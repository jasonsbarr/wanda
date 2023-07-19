/**
 * Checks if null or undefined
 * @param {any} obj
 * @returns {boolean}
 */
export const isNullish = (obj) => obj == null;

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

/**
 * Converts a kebab-case string to PascalCase
 * @param {string} str
 * @returns {string}
 */
export const kebabToPascalCase = (str) =>
  str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join("");

/**
 * Hacky version of converting a file URL to a path since ESBuild doesn't like using the one from Node.js
 * @param {string} fileURL
 * @returns {string}
 */
export const fileURLToPath = (fileURL) => fileURL.split("file://")[1] ?? "";
