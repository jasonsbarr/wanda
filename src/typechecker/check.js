import { AST } from "../parser/ast.js";
import { Exception } from "../shared/exceptions";
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
    throw new Exception(
      `Type ${Type.toString(inferredType)} is not a subtype of ${Type.toString(
        type
      )} at ${ast.srcloc.file} ${ast.srcloc.line}:${ast.srcloc.col}`
    );
  }
};