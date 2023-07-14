import { tokenize } from "../lexer/tokenize.js";
import { read } from "../reader/read.js";
import { parseTypeAnnotation } from "../parser/parseTypeAnnotation.js";
import { fromTypeAnnotation } from "../typechecker/fromTypeAnnotation.js";

export const parseContract = (code) =>
  fromTypeAnnotation(parseTypeAnnotation(read(tokenize(code)).car));
