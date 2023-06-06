import vm from "vm";
import { EVAL } from "../../src/cli/eval.js";
import { build } from "../../src/cli/build.js";
import { makeGlobalNameMap } from "../../src/runtime/makeGlobals.js";
import { emitGlobalEnv } from "../../src/emitter/emitGlobalEnv.js";
import { compile } from "../../src/cli/compile.js";

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
  const code = `${emitGlobalEnv()}
  ${compile(input, "test-input", makeGlobalNameMap())}
  `;
  const built = build(code, "global.js");

  expect(vm.runInThisContext(built)).toEqual(undefined);
});
