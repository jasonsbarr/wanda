import { makeWandaValue } from "./conversion.js";
import { addMetaField } from "./object.js";

export const makeFunction = (func) => {
  const fn = (...args) => makeWandaValue(func(...args));
  addMetaField(fn, "wanda", true);

  return fn;
};
