import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";

export const buildAndCompile = (
  wandaCode,
  {
    fileName = "stdin",
    contextCreator = emitGlobalEnv,
    nsCreator = makeGlobalNameMap,
    outName = "main.js",
    moduleName = "main",
  } = {}
) => {
  const contextCode = contextCreator();
  const compiledCode = `${contextCode}
  ${moduleName}.result = ${compile(wandaCode, fileName, nsCreator())}`;

  return build(compiledCode, outName, moduleName);
};
