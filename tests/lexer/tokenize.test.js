import { tokenize } from "../../src/lexer/tokenize.js";

test('should correctly tokenize an integer', () => {
  const input = "15";
  const tokens = tokenize(input);

  expect(tokens.reduce((_, tok) => tok.type, "")).toEqual("Number");
  expect(tokens.reduce((_, tok) => tok.value, "")).toEqual("15");
});

test("should correctly tokenize a decimal number", () => {
  const input = "3.14";
  const tokens = tokenize(input);

  expect(tokens.reduce((_, tok) => tok.type, "")).toEqual("Number");
  expect(tokens.reduce((_, tok) => tok.value, "")).toEqual("3.14");
});

test("should throw a SyntaxException on invalid numeric input", () => {
  const input = "3.13.14";

  expect(() => tokenize(input)).toThrow();
})
