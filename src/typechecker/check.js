import { AST, ASTTypes } from "../parser/ast.js";
import { isPrimitive } from "../parser/utils.js";
import { TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { infer } from "./infer.js";
import { isSubtype } from "./isSubtype.js";
import { narrow } from "./narrow.js";
import { propType } from "./propType.js";

/**
 * Checks to see if the type of AST matches type
 * @param {AST} ast
 * @param {import("./types").Type} type
 * @param {TypeEnvironment} env
 */
export const check = (ast, type, env) => {
  if (Type.isIntersection(type)) {
    return type.types.forEach((t) => check(ast, t, env));
  }

  if (ast.kind === ASTTypes.RecordLiteral && Type.isObject(type)) {
    return checkObject(ast, type, env);
  }

  if (
    (ast.kind === ASTTypes.FunctionDeclaration ||
      ast.kind === ASTTypes.LambdaExpression) &&
    Type.isFunctionType(type)
  ) {
    return checkFunction(ast, type, env);
  }

  if (ast.kind === ASTTypes.VectorLiteral && Type.isTuple(type)) {
    return checkTuple(ast, type, env);
  }

  if (Type.isUnion(type)) {
    return checkUnion(ast, type, env);
  }

  if (Type.isSingleton(type) && isPrimitive(ast) && ast.value === type.value) {
    // primitive matches singleton type
    return;
  }

  if (ast.kind === ASTTypes.IfExpression) {
    return checkIfExpression(ast, type, env);
  }

  if (ast.kind === ASTTypes.CondExpression) {
    return checkCondExpression(ast, type, env);
  }

  const inferredType = infer(ast, env);

  if (!isSubtype(inferredType, type)) {
    throw new TypeException(
      `Type ${Type.toString(
        inferredType
      )} is not a valid subtype of ${Type.toString(type)}`,
      ast.srcloc
    );
  }
};

/**
 * Checks an object type
 * @param {import("../parser/ast.js").RecordLiteral} ast
 * @param {import("./types").Object} type
 * @param {TypeEnvironment} env
 */
const checkObject = (ast, type, env) => {
  const astProps = ast.properties.map((prop) => ({
    name: prop.key.name,
    expr: prop.value,
  }));

  type.properties.forEach(({ name }) => {
    const astProp = astProps.find(({ name: astName }) => astName === name);

    if (!astProp) {
      throw new TypeException(
        `Property ${name} not found on record literal`,
        ast.srcloc
      );
    }
  });

  astProps.forEach(({ name, expr }) => {
    const pType = propType(type, name);

    if (!pType) {
      throw new TypeException(
        `Property ${name} not found on object of type ${Type.toString(type)}`,
        ast.srcloc
      );
    }

    if (
      Type.isSingleton(pType) &&
      isPrimitive(expr) &&
      pType.value === expr.value
    ) {
      // continue
    } else {
      check(expr, pType, env);
    }
  });
};

/**
 * Checks a function type
 * @param {import("../parser/ast.js").FunctionDeclaration|import("../parser/ast.js").LambdaExpression} ast
 * @param {import("./types").FunctionType} type
 * @param {TypeEnvironment} env
 */
const checkFunction = (ast, type, env) => {
  if (type.params.length !== ast.params.length) {
    throw new TypeException(
      `Expected ${type.params.length} args; got ${ast.params.length}`,
      ast.srcloc
    );
  }

  const maybeType = env.get(ast.name?.name);
  const funcType = maybeType ? maybeType : infer(ast, env);

  type.params.forEach((p, i) => {
    const pType = funcType.params[i];
    if (!isSubtype(pType, p)) {
      throw new TypeException(
        `${Type.toString(pType)} is not a valid subtype of ${Type.toString(p)}`,
        ast.srcloc
      );
    }
  });

  if (!isSubtype(funcType.ret, type.ret)) {
    throw new TypeException(
      `${Type.toString(funcType.ret)} is not a valid subtype of ${Type.toString(
        type.ret
      )}`,
      ast.srcloc
    );
  }
};

/**
 * Checks a tuple type against a VectorLiteral node
 * @param {import("../parser/ast.js").VectorLiteral} ast
 * @param {import("./types").Tuple} type
 * @param {TypeEnvironment} env
 */
const checkTuple = (ast, type, env) => {
  let i = 0;
  for (let t of type.types) {
    check(ast.members[i], t, env);
    i++;
  }
};

/**
 * Checks a node against the various arms of a union
 * @param {AST} ast
 * @param {import("./types").Union} type
 * @param {TypeEnvironment} env
 */
const checkUnion = (ast, type, env) => {
  for (let t of type.types) {
    try {
      check(ast, t, env);
      return;
    } catch (_) {
      // do nothing
    }
  }
  // Nothing matched, so construct error message based on the whole union
  // See https://jaked.org/blog/2021-10-14-Reconstructing-TypeScript-part-4 for why this is necessary
  const inferredType = infer(ast, env);

  if (!isSubtype(inferredType, type)) {
    throw new TypeException(
      `Type ${Type.toString(
        inferredType
      )} is not a valid subtype of ${Type.toString(type)}`,
      ast.srcloc
    );
  }
};

/**
 * Checks an if expression against a type
 * @param {import("../parser/ast.js").IfExpression} ast
 * @param {import("./types").Type} type
 * @param {TypeEnvironment} env
 */
const checkIfExpression = (ast, type, env) => {
  const test = infer(ast.test, env);
  const consequent = () => check(ast.then, type, narrow(ast.test, env, true));
  const alternate = () => check(ast.else, type, narrow(ast.test, env, false));

  if (Type.isTruthy(test)) {
    consequent();
  } else if (Type.isFalsy(test)) {
    alternate();
  } else {
    consequent();
    alternate();
  }
};

/**
 * Checks a cond expression against a type
 * @param {import("../parser/ast.js").CondExpression} ast
 * @param {import("./types").Type} type
 * @param {TypeEnvironment} env
 */
const checkCondExpression = (ast, type, env) => {
  for (let clause of ast.clauses) {
    const test = infer(clause.test, env);
    check(clause.expression, type, narrow(ast.test, env, true));

    if (Type.isTruthy(test)) {
      // we can stop here if test is truthy
      return;
    }
  }

  check(ast.else, type, env);
};
