import objectHash from "object-hash";
import { curryN } from "ramda";
import { makeWandaValue } from "./conversion.js";
import { addMetaField } from "./object.js";
import { parseContract } from "./parseContract.js";

export const makeFunction = (func, { contract = "" } = {}) => {
  let fn = curryN(func.length, (...args) => {
    const val = makeWandaValue(func(...args));

    if (typeof val === "function") {
      return makeFunction(val);
    }

    return val;
  });
  const hash = objectHash(fn);

  addMetaField(fn, "wanda", true);
  addMetaField(fn, "arity", func.length);
  addMetaField(fn, "name", hash);

  if (contract !== "") {
    Object.defineProperty(fn, "contract", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: parseContract(contract),
    });
  }

  Object.defineProperty(fn, "name", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: hash,
  });

  return fn;
};
