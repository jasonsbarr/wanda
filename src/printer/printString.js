import { Cons } from "../shared/cons.js";
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
      } else if (value instanceof Cons) {
        return printList(value);
      }
    default:
      throw new Exception(`Invalid print value ${value}`);
  }
};

/**
 * Pretty prints a list
 * @param {Cons} list
 * @returns {string}
 */
const printList = (list) => {
  let prStr = "(";

  let i = 0;
  let length = [...list].length;
  for (let item of list) {
    if (i === length - 1) {
      prStr += printString(item);
    } else {
      prStr += `${printString(item)}, `;
    }
    i++;
  }

  prStr += ")";
  return prStr;
};
