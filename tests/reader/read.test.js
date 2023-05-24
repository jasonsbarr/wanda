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
