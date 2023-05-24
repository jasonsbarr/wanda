import { EVAL } from "../../src/cli/eval.js";

test("should evaluate an integer properly", () => {
  const input = "15";

  expect(EVAL(input)).toEqual(15);
});

test("should evaluate a floating point number properly", () => {
  const input = "3.1415";

  expect(EVAL(input)).toEqual(3.1415);
});
