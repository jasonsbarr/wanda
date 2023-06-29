import { hasDict } from "../runtime/object.js";
import { Cons, isList } from "../shared/cons.js";
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
      return value.description.startsWith(":")
        ? value.description
        : `'${value.description}`;
    case "boolean":
      return String(value);
    case "undefined":
      return "nil";
    case "function":
      return `Function: ${value.name || "lambda"}`;
    case "object":
      if (value === null) {
        return "nil";
      } else if (value.constructor?.name === "Cons") {
        return printList(value);
      } else if (Array.isArray(value)) {
        return `[${value.map(printString).join(", ")}]`;
      }

      return hasDict(value)
        ? JSON.stringify(value[Symbol.for(":dict")], null, 2)
        : JSON.stringify(value, null, 2);
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
  const printListElems = (next, str = "") => {
    if (next == null) {
      return str;
    } else if (next.constructor?.name === "Cons") {
      return printListElems(next.cdr, str + printString(next.car) + " ");
    } else {
      return str + ". " + printString(next);
    }
  };

  let prStr = printListElems(list);
  prStr = isList(list) ? prStr.slice(0, -1) : prStr;
  return "(" + prStr + ")";
};
