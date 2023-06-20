import { TypeTypes } from "./types.js";
import * as Validators from "./validators.js";
import * as Constructors from "./constructors.js";
import { typeToString } from "./typeToString.js";
import { union } from "./union.js";

export const Type = {
  Type: TypeTypes,
  ...Constructors,
  ...Validators,
  toString: typeToString,
  union,
};
