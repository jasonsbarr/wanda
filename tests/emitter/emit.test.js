import { tokenize } from "../../src/lexer/tokenize.js";
import { read } from "../../src/reader/read.js";
import { expand } from "../../src/expander/expand.js";
import { parse } from "../../src/parser/parse.js";
import { desugar } from "../../src/desugarer/desugar.js";
import { emit } from "../../src/emitter/emit.js";

const compile = (input) =>
  emit(desugar(parse(expand(read(tokenize(input, "test-input"))))));

test("should emit an integer for an integer input", () => {
  const input = "42";
  const code = compile(input);

  expect(code).toEqual("42");
  expect(eval(code)).toEqual(42);
});

test("should emit a float for a float number input", () => {
  const input = "17.123";
  const code = compile(input);

  expect(code).toEqual("17.123");
  expect(eval(code)).toEqual(17.123);
});
