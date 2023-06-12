import { AST } from "../parser/ast.js";
import { TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { infer } from "./infer.js";
import { isSubtype } from "./isSubtype.js";

/**
 * Checks to see if the type of AST matches type
 * @param {AST} ast
 * @param {import("./types").Type} type
 * @param {TypeEnvironment} env
 */
export const check = (ast, type, env) => {
  const inferredType = infer(ast, env);

  if (!isSubtype(inferredType, type)) {
    throw new TypeException(
      `Type ${Type.toString(inferredType)} is not a subtype of ${Type.toString(
        type
      )}`,
      ast.srcloc
    );
  }
};
