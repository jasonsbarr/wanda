import vm from "vm";
import { EVAL } from "../../src/cli/eval.js";
import { compileAndBuild } from "../../src/cli/compileAndBuild.js";
import { build } from "../../src/cli/build.js";
import { emitGlobalEnv } from "../../src/emitter/emitGlobalEnv.js";
import { compile } from "../../src/cli/compile.js";
import { makeGlobalTypeEnv } from "../../src/typechecker/makeGlobalTypeEnv.js";
import { makeGlobalNameMap } from "../../src/runtime/makeGlobals.js";

test("should evaluate an integer properly", () => {
  const input = "15";

  expect(EVAL(input, "test-input")).toEqual(15);
});

test("should evaluate a floating point number properly", () => {
  const input = "3.1415";

  expect(EVAL(input, "test-input")).toEqual(3.1415);
});

test("should evaluate a string properly", () => {
  const input = `"hello"`;

  expect(EVAL(input, "test-input")).toEqual("hello");
});

test("should evaluate a boolean properly", () => {
  const input = "true";

  expect(EVAL(input, "test-input")).toEqual(true);
});

test("should evaluate a keyword properly", () => {
  const input = ":hello";

  expect(EVAL(input, "test-input")).toEqual(Symbol.for(":hello"));
});

test("should evaluate nil properly", () => {
  const input = "nil";

  expect(EVAL(input, "test-input")).toEqual(null);
});

test("should evaluate an empty string properly", () => {
  const input = `""`;

  expect(EVAL(input, "test-input")).toEqual("");
});

test("should evaluate a call expression properly", () => {
  const input = "(+ 1 2)";
  const built = compileAndBuild(input, { fileName: "test-input" });

  expect(vm.runInThisContext(built)).toEqual(3);
});

test("should evaluate nested call expressions properly", () => {
  const input = "(* 2 (+ 1 3))";
  const built = compileAndBuild(input, { fileName: "test-input" });

  expect(vm.runInThisContext(built)).toEqual(8);
});

test("should return the value of the last expression in a program", () => {
  const input = `(+ 1 2)
(append "Hello, " "world")`;
  const globalCode = build(emitGlobalEnv());
  vm.runInThisContext(globalCode);
  const globalEnv = makeGlobalNameMap();
  const typeEnv = makeGlobalTypeEnv();
  const compiled = compile(input, "test-input", globalEnv, typeEnv);

  expect(vm.runInThisContext(compiled)).toEqual("Hello, world");
});
