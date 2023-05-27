import { tokenize } from "../lexer/tokenize.js";
import { read } from "../reader/read.js";
import { expand } from "../expander/expand.js";
import { parse } from "../parser/parse.js";
import { desugar } from "../desugarer/desugar.js";
import { printAST } from "../printer/printAST.js";

export const pprintDesugaredAST = (input, file = "stdlib") =>
  printAST(desugar(parse(expand(read(tokenize(input, file))))));

export const pprintAST = (input, file = "stdlib") =>
  printAST(parse(expand(read(tokenize(input, file)))));
