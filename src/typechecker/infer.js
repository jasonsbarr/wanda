import { AST, ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { isSubtype } from "./isSubtype.js";

/**
 * Infers a type from an AST node
 * @param {AST} ast
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
export const infer = (ast, env) => {
  switch (ast.kind) {
    case ASTTypes.NumberLiteral:
      return inferNumber();
    case ASTTypes.StringLiteral:
      return inferString();
    case ASTTypes.BooleanLiteral:
      return inferBoolean();
    case ASTTypes.KeywordLiteral:
      return inferKeyword();
    case ASTTypes.NilLiteral:
      return inferNil();
    case ASTTypes.Symbol:
      return inferSymbol(node, env);
    case ASTTypes.CallExpression:
      return inferCallExpression(node, env);
    case ASTTypes.VariableDeclaration:
      return inferVariableDeclaration(node, env);
    case ASTTypes.SetExpression:
      return inferSetExpression(node, env);
    case ASTTypes.DoExpression:
      return inferDoExpression(node, env);
    default:
      throw new Exception(`No type inferred for AST node type ${ast.kind}`);
  }
};

// Infer types from literal nodes
const inferNumber = () => Type.number;
const inferString = () => Type.string;
const inferBoolean = () => Type.boolean;
const inferKeyword = () => Type.keyword;
const inferNil = () => Type.nil;

/**
 * Infers a type from a Symbol/Identifier
 * @param {import("../parser/ast").Symbol} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferSymbol = (node, env) => {
  const name = node.name;
  const type = env.getType(name);

  if (!type) {
    return Type.any;
  }

  return type;
};

/**
 * Infers a type from a CallExpression node
 * @param {import("../parser/ast").CallExpression} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferCallExpression = (node, env) => {
  const func = synth(node.func, env);

  if (
    node.args.length !== func.params.length ||
    (func.variadic && node.args.length >= func.params.length - 1)
  ) {
    throw new Exception(
      `Expected${func.variadic ? " at least " : " "}arguments; ${
        node.args.length
      } given at ${node.srcloc.file} ${node.srcloc.line}:${node.srcloc.col}`
    );
  }

  func.params.forEach((p, i) => {
    const argType = infer(node.args[i], env);
    if (!isSubtype(argType, p)) {
      const node = node.args[i];
      throw new Exception(
        `${Type.toString(argType)} is not a subtype of ${Type.toString(p)} at ${
          node.srcloc.file
        } ${node.srcloc.line}:${node.srcloc.col}`
      );
    }
  });

  return func.ret;
};

/**
 * Infers a type from a VariableDeclaration node and sets it in the current env
 * @param {import("../parser/ast.js").VariableDeclaration} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferVariableDeclaration = (node, env) => {
  const varType = infer(node.expression, env);

  env.setType(node.lhv.name, varType);
  return varType;
};

/**
 * Infers a type from a SetExpression node
 * @param {import("../parser/ast").SetExpression} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferSetExpression = (node, env) => {
  return infer(node.expression, env);
};

/**
 * Infers a type from a DoExpression node
 * @param {import("../parser/ast").DoExpression} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferDoExpression = (node, env) => {
  let doType = Type.any;
  const doEnv = env.extend("doExpression");

  for (let expr of node.body) {
    doType = infer(expr, doEnv);
  }

  return doType;
};
