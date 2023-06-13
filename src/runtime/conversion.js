import { makeObject } from "./object.js";

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
