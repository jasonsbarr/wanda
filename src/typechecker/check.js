import { AST, ASTTypes } from "../parser/ast.js";
import { TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { infer } from "./infer.js";
import { isSubtype } from "./isSubtype.js";
import { propType } from "./propType.js";

/**
 * Checks to see if the type of AST matches type
 * @param {AST} ast
 * @param {import("./types").Type} type
 * @param {TypeEnvironment} env
 */
export const check = (ast, type, env) => {
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

    check(expr, pType, env);
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

  const funcType = infer(ast, env);

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
