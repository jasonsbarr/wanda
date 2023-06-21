import { TypeTypes } from "./types.js";
import * as Validators from "./validators.js";
import * as Constructors from "./constructors.js";
import { typeToString } from "./typeToString.js";
import { union } from "./union.js";
import { map as map } from "./map.js";
import { intersection } from "./intersection.js";

export const Type = {
  Type: TypeTypes,
  ...Constructors,
  ...Validators,
  toString: typeToString,
  union,
  map,
  intersection,
};
