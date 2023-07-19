import path from "path";
import { ROOT_PATH } from "../../../root.js";
import { makeGlobal } from "../runtime/makeGlobals.js";

export const emitGlobalEnv = (useVar = false) => {
  const globalEnv = makeGlobal();
  let code = `import { makeGlobal } from "${path.join(
    ROOT_PATH,
    "./src/js/runtime/makeGlobals.js"
  )}";
import { makeRuntime } from "${path.join(
    ROOT_PATH,
    "./src/js/runtime/makeRuntime.js"
  )}";

const globalEnv = makeGlobal();
${useVar ? "var " : ""}rt = makeRuntime();
`;

  for (let [k] of globalEnv) {
    code += `${useVar ? "var " : ""}${k} = globalEnv.get("${k}");\n`;
  }

  return code;
};
