import { hasDict, makeObject } from "./object.js";
import { makeKeyword } from "./utils.js";

/**
 * Converts a JS value into a Wanda value
 * @param {any} val
 * @returns {any}
 */
export const makeWandaValue = (val) => {
  switch (typeof val) {
    case "object":
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
  switch (typeof val) {
    case "object":
      if (hasDict(val)) {
        return val[makeKeyword("dict")];
      }
    default:
      return val;
  }
};
