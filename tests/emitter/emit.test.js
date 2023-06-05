import objectHash from "object-hash";
import { tokenize } from "../../src/lexer/tokenize.js";
import { read } from "../../src/reader/read.js";
import { expand } from "../../src/expander/expand.js";
import { parse } from "../../src/parser/parse.js";
import { desugar } from "../../src/desugarer/desugar.js";
import { emit } from "../../src/emitter/emit.js";
import { Namespace } from "../../src/runtime/Namespace.js";
import { PREFIX } from "../../src/emitter/Emitter.js";

const compile = (input) =>
  emit(desugar(parse(expand(read(tokenize(input, "test-input"))))));

const compileWithNS = (input, ns) =>
  emit(desugar(parse(expand(read(tokenize(input, "test-input"))))), ns);

test("should emit an integer for an integer input", () => {
  const input = "42";
  const code = compile(input);

  expect(code).toEqual("42");
});

test("should emit a float for a float number input", () => {
  const input = "17.123";
  const code = compile(input);

  expect(code).toEqual("17.123");
});

test("should emit a string for a string input", () => {
  const input = `"hello"`;
  const code = compile(input);

  expect(code).toEqual("`hello`");
});

test("should emit a boolean for a boolean input", () => {
  const input = "true";
  const code = compile(input);

  expect(code).toEqual("true");
});

test("should emit a symbol for a keyword input", () => {
  const input = ":hello";
  const code = compile(input);

  expect(code).toEqual(`Symbol.for(":hello")`);
});

test("should emit null for a nil input", () => {
  const input = "nil";
  const code = compile(input);

  expect(code).toEqual("null");
});

test("should emit an empty string", () => {
  const input = `""`;
  const code = compile(input);

  expect(code).toEqual("``");
});

test("should emit a symbol", () => {
  const ns = Namespace.new(null, { name: "test" });
  const input = "+";
  const hashedSym = PREFIX + objectHash(input);

  ns.set(input, hashedSym);
  const code = compileWithNS(input, ns);

  expect(code).toEqual(hashedSym);
});
