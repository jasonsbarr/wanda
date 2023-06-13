import path from "path";
import { ROOT_PATH } from "../../root.js";
import { makeGlobal } from "../runtime/makeGlobals.js";

export const emitGlobalEnv = () => {
  const globalEnv = makeGlobal();
  let code = `import { makeGlobal } from "${path.join(
    ROOT_PATH,
    "./src/runtime/makeGlobals.js"
  )}";
import { makeRuntime } from "${path.join(
    ROOT_PATH,
    "./src/runtime/makeRuntime.js"
  )}";

const globalEnv = makeGlobal();
rt = makeRuntime();
`;

  for (let [k] of globalEnv) {
    code += `${k} = globalEnv.get("${k}");\n`;
  }

  return code;
};
