import { curryN } from "ramda";
import { makeWandaValue } from "./conversion.js";
import { addMetaField } from "./object.js";

export const makeFunction = (func) => {
  let fn = curryN(func.length, (...args) => {
    const val = makeWandaValue(func(...args));

    if (typeof val === "function") {
      return makeFunction(val);
    }

    return val;
  });
  addMetaField(fn, "wanda", true);
  addMetaField(fn, "arity", func.length);

  return fn;
};
