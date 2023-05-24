import { Token } from "../../src/lexer/Token.js";
import { tokenize as t } from "../../src/lexer/tokenize.js";
import { read } from "../../src/reader/read.js";

const tokenize = (input) => t(input, "test-input");

test("should read input as a ReadTree list (array)", () => {
  const input = "100";
  const readResult = read(tokenize(input));

  expect(Array.isArray(readResult)).toBe(true);
});

test("should read an integer from the token stream as a number token", () => {
  const input = "23";
  const readResult = read(tokenize(input))[0];

  expect(readResult instanceof Token).toBe(true);
  expect(readResult.type).toBe("Number");
  expect(readResult.value).toBe("23");
});

test("should read a float from the token stream as a number token", () => {
  const input = "6.28";
  const readResult = read(tokenize(input))[0];

  expect(readResult.type).toBe("Number");
  expect(readResult.value).toBe("6.28");
});

test("should read a boolean from the token stream as a boolean token", () => {
  const input1 = "true";
  const input2 = "false";
  const readResult1 = read(tokenize(input1))[0];
  const readResult2 = read(tokenize(input2))[0];

  expect(readResult1.type).toBe("Boolean");
  expect(readResult2.type).toBe("Boolean");
  expect(readResult1.value).toBe("true");
  expect(readResult2.value).toBe("false");
});

test("should read a keyword from the token stream as a keyword token", () => {
  const input = ":hello";
  const readResult = read(tokenize(input))[0];

  expect(readResult.type).toBe("Keyword");
  expect(readResult.value).toBe(":hello");
});

test("should read a nil literal from the token stream as a nil token", () => {
  const input = "nil";
  const readResult = read(tokenize(input))[0];

  expect(readResult.type).toBe("Nil");
  expect(readResult.value).toBe("nil");
});
