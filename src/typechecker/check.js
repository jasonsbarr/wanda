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
 *
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
