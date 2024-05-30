import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";

/**
 * @typedef Options
 * @prop {string} fileName the file being compiled
 * @prop {Function} contextCreator the function to create the surrounding environment
 * @prop {Function} nsCreator the function to create the namespace for compilation
 * @prop {string} outName the out name of the temporary build file
 * @prop {string} moduleName the variable name for the compiled module output
 * @prop {Function} typeEnvCreator the function to create the type environment
 */
/**
 * Compiles a module of Wanda code and builds it with its surrounding environment
 * @param {string} wandaCode
 * @param {Options} opts
 * @returns {string}
 */
export const compileAndBuild = (
  wandaCode,
  {
    fileName = "stdin",
    contextCreator = emitGlobalEnv,
    nsCreator = makeGlobalNameMap,
    outName = "main.js",
    moduleName = "main",
    typeEnvCreator = makeGlobalTypeEnv,
  } = {}
) => {
  const contextCode = contextCreator();
  const compiledCode = `${contextCode}
  ${moduleName}.result = ${compile(
    wandaCode,
    fileName,
    nsCreator(),
    typeEnvCreator()
  )}`;

  return build(compiledCode, outName, moduleName);
};
