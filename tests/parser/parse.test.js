import { tokenize } from "../../src/lexer/tokenize.js";
import { read } from "../../src/reader/read.js";
import { expand } from "../../src/expander/expand.js";
import { parse } from "../../src/parser/parse.js";
import { ASTTypes } from "../../src/parser/ast.js";

test("should parse a Program node from the readTree", () => {
  const input = "16";
  const ast = parse(expand(read(tokenize(input))));

  expect(ast.type).toEqual(ASTTypes.Program);
});

test("should parse a NumericLiteral node from a number token", () => {
  const input = "17.234";
  const ast = parse(expand(read(tokenize(input))));
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.NumberLiteral);
  expect(node.value).toEqual("17.234");
});
