import { hasDict, makeObject } from "./object.js";
import { makeKeyword } from "./utils.js";
import { jsToWandaNumber, wandaToJsNumber } from "./number.js";

/**
 * Converts a JS value into a Wanda value
 * @param {any} val
 * @returns {any}
 */
export const makeWandaValue = (val) => {
  switch (typeof val) {
    case "undefined":
      return null;
    case "number":
      return jsToWandaNumber(val);
    case "object":
      if (val === null) {
        return null;
      }

      if (Array.isArray(val)) {
        return val;
      }

      if (val.constructor?.name === "Cons") {
        return val;
      }

      return makeObject(val);
    default:
      return val;
  }
};

export const makeJSValue = (val) => {
  if (val === null) {
    return null;
  }

  switch (typeof val) {
    case "number":
      return wandaToJsNumber(val);
    case "object":
      if (hasDict(val)) {
        return val[makeKeyword("dict")];
      }
    default:
      return val;
  }
};
