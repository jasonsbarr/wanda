import { TypeChecker } from "./TypeChecker.js";

export const typecheck = (ast, env = undefined) =>
  TypeChecker.new(ast, env).check();
