import { TypeTypes } from "./types.js";
import * as Validators from "./validators.js";
import * as Constructors from "./constructors.js";

export const Type = {
  Type: TypeTypes,
  ...Constructors,
  ...Validators,
};
