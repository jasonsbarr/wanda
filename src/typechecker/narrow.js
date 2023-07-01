import { AST, ASTTypes } from "../parser/ast.js";
import { Exception, TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { infer } from "./infer.js";
import { isSubtype } from "./isSubtype.js";
import { propType } from "./propType.js";
import { TypeTypes } from "./types.js";

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

    case ASTTypes.BinaryExpression:
      return narrowBinary(ast, env, assume);

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
 * Narrows a binary expression
 * @param {import("../parser/ast").BinaryExpression} ast
 * @param {TypeEnvironment} env
 * @param {boolean} assume
 * @returns {TypeEnvironment}
 */
const narrowBinary = (ast, env, assume) => {
  const left = infer(ast.left, env);
  const right = infer(ast.right, env);

  if ((ast.op === "equal?" && assume) || (ast.op === "not-equal?" && !assume)) {
    env = narrowPath(ast.left, env, right);
    return narrowPath(ast.right, env, left);
  } else if (
    (ast.op === "not-equal?" && assume) ||
    (ast.op === "equal?" && !assume)
  ) {
    if (Type.isSingleton(right)) {
      env = narrowPath(ast.left, env, Type.not(right));
    }

    if (Type.isSingleton(left)) {
      env = narrowPath(ast.right, env, Type.not(left));
    }

    return env;
  } else {
    return env;
  }
};

/**
 * Narrows any other expression based on the assumption that ast has type "otherType"
 * @param {AST} ast
 * @param {TypeEnvironment} env
 * @param {import("./types").Type} type
 * @returns {TypeEnvironment}
 */
const narrowPath = (ast, env, type) => {
  switch (ast.kind) {
    case ASTTypes.Symbol:
      return narrowPathSymbol(ast, env, type);

    case ASTTypes.MemberExpression:
      return narrowPathMember(ast, env, type);

    case ASTTypes.UnaryExpression:
      return narrowPathUnary(ast, env, type);

    default:
      return env;
  }
};

/**
 * Narrows an identifier
 * @param {import("../parser/ast").Symbol} ast
 * @param {TypeEnvironment} env
 * @param {import("./types").Type} type
 * @returns {TypeEnvironment}
 */
const narrowPathSymbol = (ast, env, type) => {
  const idType = env.get(ast.name);

  if (!idType) {
    throw new TypeException(
      `Expected bound identifier, got undefined`,
      ast.srcloc
    );
  }

  env.set(ast.name, narrowType(idType, type));
  return env;
};

/**
 * Narrows a member expression
 * @param {import("../parser/ast").MemberExpression} ast
 * @param {TypeEnvironment} env
 * @param {import("./types").Type} type
 * @returns {TypeEnvironment}
 */
const narrowPathMember = (ast, env, type) => {
  return narrowPath(
    ast.object,
    env,
    Type.object([{ name: ast.property.name, type: type }])
  );
};

/**
 * Narrows a unary expression
 * @param {import("../parser/ast").UnaryExpression} ast
 * @param {TypeEnvironment} env
 * @param {import("./types").Type} type
 * @returns {TypeEnvironment}
 */
const narrowPathUnary = (ast, env, type) => {
  switch (ast.op) {
    case "not":
      return env;

    case "typeof":
      if (Type.isSingleton(type)) {
        switch (type.base) {
          case "Boolean":
            return narrowPath(ast.operand, env, Type.boolean);

          case "Number":
            return narrowPath(ast.operand, env, Type.number);

          case "String":
            return narrowPath(ast.operand, env, Type.string);

          case "Keyword":
            return narrowPath(ast.operand, env, Type.keyword);

          default:
            return env;
        }
      } else if (Type.isNot(type) && Type.isSingleton(type.base)) {
        switch (type.base.base) {
          case "Boolean":
            return narrowPath(ast.operand, env, Type.boolean);

          case "Number":
            return narrowPath(ast.operand, env, Type.number);

          case "String":
            return narrowPath(ast.operand, env, Type.string);

          case "Keyword":
            return narrowPath(ast.operand, env, Type.keyword);

          default:
            return env;
        }
      } else {
        return env;
      }

    default:
      throw new Exception(`Unknown unary operator ${ast.op}`);
  }
};

/**
 * Narrows the env and removes not-types so the rest of the checker doesn't have to worry about them
 * @param {import("./types").Type} x
 * @param {import("./types").Type} y
 * @returns {import("./types").Type}
 */
export const narrowType = (x, y) => {
  if (Type.isAny(x) || Type.isAny(y)) return Type.any;
  if (Type.isUndefined(x) && Type.isUndefined(y)) return Type.undefinedType;
  if (Type.isUndefined(x)) return widenNots(y);
  if (Type.isUndefined(y)) return x;
  if (Type.isNever(x) || Type.isNever(y)) return Type.never;
  if (Type.isUnknown(x)) return widenNots(y);
  if (Type.isUnknown(y)) return x;

  if (Type.isUnion(x)) {
    return Type.union(...x.types.map((a) => narrowType(a, y)));
  }

  if (Type.isUnion(y)) {
    return Type.union(...y.types.map((b) => narrowType(x, b)));
  }

  if (Type.isIntersection(x)) {
    return Type.intersection(...x.types.map((a) => narrowType(a, y)));
  }

  if (Type.isIntersection(y)) {
    return Type.intersection(...y.types.map((b) => narrowType(x, b)));
  }

  if (Type.isNot(y)) {
    if (isSubtype(x, y.base)) {
      return Type.never;
    } else if (
      Type.isBoolean(x) &&
      Type.isSingleton(y.base) &&
      Type.isBoolean(y.base.base)
    ) {
      return Type.singleton(
        "Boolean",
        y.base.value === "true" ? "false" : "true"
      );
    } else {
      return x;
    }
  }

  if (Type.isSingleton(x) && Type.isSingleton(y)) {
    return x.value === y.value ? x : Type.never;
  }

  if (Type.isSingleton(x)) {
    return x.base === y.kind ? x : Type.never;
  }

  if (Type.isSingleton(y)) {
    return y.base === x.kind ? y : Type.never;
  }

  if (Type.isObject(x) && Type.isObject(y)) {
    const properties = x.properties.map(({ name, type: xType }) => {
      const yType = propType(y, name);
      const type = yType ? narrowType(xType, yType) : xType;
      return { name, type };
    });

    if (properties.some(({ type }) => Type.isNever(type))) {
      return Type.never;
    } else {
      return Type.object(properties);
    }
  }

  return Type.intersection(x, y);
};

/**
 * Expands not types
 * @param {import("./types").Type} type
 * @returns {import("./types").Type}
 */
const widenNots = (type) => {
  switch (type.kind) {
    case TypeTypes.Not:
      return Type.unknown;

    case TypeTypes.Union:
      return Type.union(...type.types.map(widenNots));

    case TypeTypes.Object:
      return Type.object(
        type.properties.map(({ name, type }) => ({
          name,
          type: widenNots(type),
        }))
      );

    default:
      return type;
  }
};
