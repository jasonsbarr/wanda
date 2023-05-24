import { EVAL } from "../../src/cli/eval.js";

test("should evaluate an integer properly", () => {
  const input = "15";

  expect(EVAL(input)).toEqual(15);
});

test("should evaluate a floating point number properly", () => {
  const input = "3.1415";

  expect(EVAL(input)).toEqual(3.1415);
});

test("should evaluate a string properly", () => {
  const input = `"hello"`;

  expect(EVAL(input)).toEqual("hello");
});

test("should evaluate a boolean properly", () => {
  const input = "true";

  expect(EVAL(input)).toEqual(true);
});

test("should evaluate a keyword properly", () => {
  const input = ":hello";

  expect(EVAL(input)).toEqual(Symbol.for(":hello"));
});

test("should evaluate nil properly", () => {
  const input = "nil";

  expect(EVAL(input)).toEqual(null);
});
