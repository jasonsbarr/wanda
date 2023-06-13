import { RuntimeException } from "../shared/exceptions.js";
import { hasProperty, hasMethod as hM } from "../shared/utils.js";
import { makeKeyword } from "./utils.js";

const DICT = makeKeyword("dict");

/**
 * Checks if object has :dict property (i.e. is Wanda object)
 * @param {Object} obj
 * @returns {boolean}
 */
export const hasDict = (obj) => hasProperty(obj, DICT);

/**
 * Checks if an object has a field
 * @param {Object} obj
 * @param {string|symbol} field
 * @returns {boolean}
 */
export const hasField = (obj, field) => {
  if (hasDict(obj)) {
    return hasProperty(obj[DICT], field);
  }

  return hasProperty(obj[field]);
};

/**
 * Checks if an object has a method
 * @param {Object} obj
 * @param {string|symbol} method
 * @returns {boolean}
 */
export const hasMethod = (obj, method) => {
  if (hasDict(obj)) {
    return hM(obj[DICT], method);
  }

  return hM(obj, method);
};

/**
 * Returns the value of field on obj or obj[:dict]
 * @param {Object} obj
 * @param {string|symbol} field
 * @returns {any}
 */
export const getField = (obj, field) => {
  const value = hasDict(obj) ? obj[DICT][field] : obj?.[field];

  if (value === undefined) {
    failRuntime(
      `Field ${
        typeof field === "symbol" ? field.description : field
      } not found on object`
    );
  }

  if (typeof value === "function") {
    return hasDict(obj) ? value.bind(obj[DICT]) : value.bind(obj);
  }

  return value;
};

/**
 * Checks if obj has metafield :{field}
 * @param {Object} obj
 * @param {string} field
 * @returns {boolean}
 */
export const hasMetaField = (obj, field) => {
  const kw = makeKeyword(field);
  return hasProperty(obj[kw]);
};

/**
 * Gets value of metafield
 * @param {Object} obj
 * @param {string} field
 * @returns {any}
 */
export const getMetaField = (obj, field) => {
  const kw = makeKeyword(field);
  const value = obj[kw];

  if (value === undefined) {
    failRuntime(
      `Field ${
        typeof field === "symbol" ? field.description : field
      } not found on object`
    );
  }

  return value;
};

/**
 * Adds a metafield to an object
 * @param {Object} obj
 * @param {string} field
 * @param {any} value
 */
export const addMetaField = (obj, field, value) => {
  const meta = makeKeyword(field);
  Object.defineProperty(obj, meta, {
    configurable: false,
    enumerable: false,
    writable: false,
    value,
  });
};

/**
 * Converts a JS object into a Wanda object
 * @param {Object} obj
 * @returns {Object}
 */
export const makeObject = (obj) => {
  let newObj = {};
  addMetaField(newObj, "dict", obj);
  addMetaField(newObj, "constructor", function (...args) {
    return new obj.constructor(...args);
  });

  Object.defineProperty(newObj[makeKeyword("constructor")], "name", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: obj.constructor?.name ?? "WandaObject",
  });

  return newObj;
};

/**
 * Throws a RuntimeException
 * @param {string} msg
 * @returns {never}
 */
export const failRuntime = (msg) => {
  throw new RuntimeException(msg);
};
