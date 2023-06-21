import { hasDict, addMetaField, makeObject } from "./object.js";
import { makeKeyword } from "./utils.js";

addMetaField(Number.prototype, "type", "number");
addMetaField(String.prototype, "type", "string");
addMetaField(Boolean.prototype, "type", "boolean");
addMetaField(Array.prototype, "type", "vector");

/**
 * Converts a JS value into a Wanda value
 * @param {any} val
 * @returns {any}
 */
export const makeWandaValue = (val) => {
  switch (typeof val) {
    case "undefined":
      return null;
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
    case "object":
      if (val === null) {
        return null;
      }

      if (hasDict(val)) {
        return val[makeKeyword("dict")];
      }
    default:
      return val;
  }
};
