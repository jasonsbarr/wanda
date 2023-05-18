import { tokenize } from "../lexer/tokenize.js";
import { read } from "../reader/read.js";
import { expand } from "../expander/expand.js";
import { parse } from "../parser/parse.js";
import { desugar } from "../desugarer/desugar.js";
import { emit } from "../emitter/emit.js";

export const compile = (input, file = "stdin") =>
  emit(desugar(parse(expand(read(tokenize(input, file))))));
