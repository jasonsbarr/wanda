import { Type } from "../typechecker/Type.js";

export const makeFunction = (func) => {
  func.variadic = true;
  func.contract = Type.functionType([Type.any], Type.any, true);

  Object.defineProperty(func, "length", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: 1,
  });

  return func;
};
