import { Exception } from "../shared/exceptions.js";

/**
 * Pretty prints a JavaScript value from evaluated Wanda code
 * @param {Any} value
 * @param {Boolean} withQuotes
 * @returns {string}
 */
export const printString = (value, withQuotes) => {
  switch (typeof value) {
    case "number":
      return String(value);
    case "string":
      return withQuotes ? `"${value}"` : value;
    case "symbol":
      return value.description;
    case "boolean":
      return String(value);
    case "undefined":
      return "nil";
    case "object":
      if (value === null) {
        return "nil";
      }
    default:
      throw new Exception(`Invalid print value ${value}`);
  }
};
