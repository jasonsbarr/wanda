import { AST, ASTTypes } from "../parser/ast.js";
import { Exception, TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { isSubtype } from "./isSubtype.js";
import { getAliasBase } from "./utils.js";
import { fromTypeAnnotation } from "./fromTypeAnnotation.js";
import { unifyAll } from "./unify.js";
import { propType } from "./propType.js";

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
      return inferSymbol(ast, env);
    case ASTTypes.CallExpression:
      return inferCallExpression(ast, env);
    case ASTTypes.VariableDeclaration:
      return inferVariableDeclaration(ast, env);
    case ASTTypes.SetExpression:
      return inferSetExpression(ast, env);
    case ASTTypes.DoExpression:
      return inferDoExpression(ast, env);
    case ASTTypes.TypeAlias:
      return inferTypeAlias(ast, env);
    case ASTTypes.VectorLiteral:
      return inferVectorLiteral(ast, env);
    case ASTTypes.RecordLiteral:
      return inferRecordLiteral(ast, env);
    case ASTTypes.MemberExpression:
      return inferMemberExpression(ast, env);
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
  const namedType = env.get(name);
  const baseType = Type.isTypeAlias(namedType)
    ? getAliasBase(namedType.name)
    : namedType;

  if (!namedType) {
    throw new Exception(
      `Type not found in current environment for ${name} at ${node.srcloc.file} ${node.srcloc.col}:${node.srcloc.col}`
    );
  }

  return baseType;
};

/**
 * Infers a type from a CallExpression node
 * @param {import("../parser/ast").CallExpression} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferCallExpression = (node, env) => {
  const func = infer(node.func, env);

  if (Type.isAny(func)) {
    return Type.any;
  }

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

  if (env.checkingOn) {
    func.params.forEach((p, i, a) => {
      const argType = infer(node.args[i], env);
      if (!isSubtype(argType, p)) {
        const node = node.args[i];
        throw new TypeException(
          `${Type.toString(argType)} is not a subtype of ${Type.toString(p)}`,
          node.srcloc
        );
      }

      if (func.variadic && i === a.length - 1) {
        if (!p.vectorType) {
          throw new TypeException(
            `Rest parameter type must be vector; ${Type.toString(p)} given`,
            arg.srcloc
          );
        }
        p = p.vectorType;

        for (let arg of node.args.slice(i)) {
          const argType = infer(arg, env);

          if (!isSubtype(argType, p)) {
            const node = node.args[i];
            throw new TypeException(
              `${Type.toString(argType)} is not a subtype of ${Type.toString(
                p
              )}`,
              node.srcloc
            );
          }
        }
      }
    });
  }

  return func.ret;
};

/**
 * Infers a type from a VariableDeclaration node and sets it in the current env
 * @param {import("../parser/ast.js").VariableDeclaration} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferVariableDeclaration = (node, env) => {
  return infer(node.expression, env);
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

/**
 * Infers a type from a TypeAlias node
 * @param {import("../parser/ast.js").TypeAlias} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferTypeAlias = (node, env) => {
  return fromTypeAnnotation(node.type, env);
};

/**
 * Infer the type of a VectorLiteral node
 * @param {import("../parser/ast.js").VectorLiteral} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Vector}
 */
const inferVectorLiteral = (node, env) => {
  if (node.members.length === 0) {
    // change this to never when we add union types
    return Type.vector(Type.any);
  }

  const types = node.members.map((m) => infer(m, env));
  const unified = unifyAll(...types);

  if (unified === null && env.checkingOn) {
    throw new TypeException(
      `Incompatible types in Vector literal`,
      node.srcloc
    );
  } else if (unified === null) {
    return Type.any;
  }

  return Type.vector(unified);
};

/**
 * Infer the type of a RecordLiteral node
 * @param {import("../parser/ast.js").RecordLiteral} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Object}
 */
const inferRecordLiteral = (node, env) => {
  const properties = node.properties.map((prop) => ({
    kind: Type.Type.Property,
    name: prop.key.name,
    type: infer(prop.value, env),
  }));
  return Type.object(properties);
};

/**
 * Infer the type of a MemberExpression node
 * @param {import("../parser/ast.js").MemberExpression} node
 * @param {TypeEnvironment} env
 * @returns {import("./types").Type}
 */
const inferMemberExpression = (node, env) => {
  const prop = node.property;
  const object = infer(node.object, env);

  if (!Type.isObject(object)) {
    if (env.checkingOn) {
      throw new TypeException(
        `Member expression expects object type; ${Type.toString(object)} given`,
        node.srcloc
      );
    } else {
      return Type.any;
    }
  }

  const type = propType(object, prop.name);

  if (!type && env.checkingOn) {
    throw new TypeException(
      `Property ${prop.name} not found on object of type ${Type.toString(
        object
      )}`,
      node.srcloc
    );
  }

  return type ?? Type.any;
};
