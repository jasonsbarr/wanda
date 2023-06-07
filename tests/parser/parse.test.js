import { tokenize } from "../../src/lexer/tokenize.js";
import { read } from "../../src/reader/read.js";
import { expand } from "../../src/expander/expand.js";
import { parse as p } from "../../src/parser/parse.js";
import { ASTTypes } from "../../src/parser/ast.js";

const parse = (input) => p(expand(read(tokenize(input, "test-input"))));

test("should parse a Program node from the readTree", () => {
  const input = "16";
  const ast = parse(input);

  expect(ast.type).toEqual(ASTTypes.Program);
});

test("should parse a NumericLiteral node from a number token", () => {
  const input = "17.234";
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.NumberLiteral);
  expect(node.value).toEqual("17.234");
});

test("should parse a StringLiteral node from a string token", () => {
  const input = `"hello"`;
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.StringLiteral);
  expect(node.value).toEqual(`"hello"`);
});

test("should parse a BooleanLiteral node from a boolean token", () => {
  const input = "true";
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.BooleanLiteral);
  expect(node.value).toEqual("true");
});

test("should parse a KeywordLiteral node from a keyword token", () => {
  const input = ":hello";
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.KeywordLiteral);
  expect(node.value).toEqual(":hello");
});

test("should parse a NilLiteral node from a nil token", () => {
  const input = "nil";
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.NilLiteral);
});

test("should parse an empty string", () => {
  const input = `""`;
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.StringLiteral);
  expect(node.value).toEqual(`""`);
});

test("should parse a call expression", () => {
  const input = "(+ 1 2)";
  const ast = parse(input);
  const node = ast.body[0];

  expect(node.type).toEqual(ASTTypes.CallExpression);
  expect(node.func.type).toEqual(ASTTypes.Symbol);
  expect(node.args.map((a) => ({ type: a.type }))).toEqual([
    { type: ASTTypes.NumberLiteral },
    { type: ASTTypes.NumberLiteral },
  ]);
});
