import { AST, ASTTypes } from "../parser/ast";
import { Exception } from "../shared/exceptions";
import { Type } from "./Type";
import { TypeEnvironment } from "./TypeEnvironment";
import { infer } from "./infer";

/**
 * Narrows an expression so the type checker can assume type information about it
 * @param {AST} ast
 * @param {TypeEnvironment} env
 * @param {boolean} assume
 * @returns {TypeEnvironment}
 */
export const narrow = (ast, env, assume) => {
  switch (ast.kind) {
    case ASTTypes.UnaryExpression:
      return narrowUnary(ast, env, assume);
    case ASTTypes.LogicalExpression:
      return narrowLogical(ast, env, assume);
    default:
      return narrowPath(ast, env, assume ? Type.truthy : Type.falsy);
  }
};

/**
 * Narrows a unary expression
 * @param {import("../parser/ast").UnaryExpression} ast
 * @param {TypeEnvironment} env
 * @param {boolean} assume
 * @returns {TypeEnvironment}
 */
const narrowUnary = (ast, env, assume) => {
  switch (ast.op) {
    case "not":
      return narrow(ast.operand, env, !assume);

    case "typeof":
      return env;

    default:
      throw new Exception(`Unknown unary operator ${ast.op}`);
  }
};

/**
 * Narrows a logical expression
 * @param {import("../parser/ast").LogicalExpression} ast
 * @param {TypeEnvironment} env
 * @param {boolean} assume
 * @returns {TypeEnvironment}
 */
const narrowLogical = (ast, env, assume) => {
  switch (ast.op) {
    case "and":
      if (assume) {
        env = narrow(ast.left, env, true);
        return narrow(ast.right, env, true);
      } else {
        if (Type.isTruthy(infer(ast.left, env))) {
          return narrow(ast.right, env, false);
        } else if (Type.isTruthy(infer(ast.right, env))) {
          return narrow(ast.left, env, false);
        } else {
          return env;
        }
      }

    case "or":
      if (!assume) {
        env = narrow(ast.left, env, false);
        return narrow(ast.right, env, false);
      } else {
        if (Type.isFalsy(infer(ast.left, env))) {
          return narrow(ast.right, env, true);
        } else if (Type.isFalsy(infer(ast.right, env))) {
          return narrow(ast.left, env, true);
        } else {
          return env;
        }
      }

    default:
      throw new Exception(`Unknown logical operator ${ast.op}`);
  }
};

/**
 * Narrows any other expression
 * @param {AST} ast
 * @param {TypeEnvironment} env
 * @param {import("./types").Type} type
 * @returns {TypeEnvironment}
 */
const narrowPath = (ast, env, type) => {};
