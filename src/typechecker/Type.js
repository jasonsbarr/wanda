import { TypeTypes } from "./types.js";
import * as Validators from "./validators.js";
import * as Constructors from "./constructors.js";
import { fromTypeAnnotation } from "./fromTypeAnnotation.js";
import { typeToString } from "./typeToString.js";

export const Type = {
  Type: TypeTypes,
  ...Constructors,
  ...Validators,
  fromTypeAnnotation,
  toString: typeToString,
};
