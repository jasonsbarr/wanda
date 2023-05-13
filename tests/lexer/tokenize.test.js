import { tokenize } from "../../src/lexer/tokenize.js";

test('should correctly tokenize an integer', () => {
  const input = "15";
  const tokens = tokenize(input);

  expect(tokens.reduce((output, tok) => tok.value !== "EOF" ? tok.type : output, "")).toEqual("Number");
  expect(tokens.reduce((output, tok) => tok.value !== "EOF" ? tok.value : output, "")).toEqual("15");
});

test("should correctly tokenize a decimal number", () => {
  const input = "3.14";
  const tokens = tokenize(input);

  expect(tokens.reduce((output, tok) => tok.value !== "EOF" ? tok.type : output, "")).toEqual("Number");
  expect(tokens.reduce((output, tok) => tok.value !== "EOF" ? tok.value : output, "")).toEqual("3.14");
});

test("should throw a SyntaxException on invalid numeric input", () => {
  const input = "3.13.14";

  expect(() => tokenize(input)).toThrow();
})
