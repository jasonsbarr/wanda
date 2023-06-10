import { Type } from "../typechecker/Type.js";

export const makeFunction = (func) => {
  func.contract = Type.functionType([Type.any], Type.any, true);

  return func;
};
