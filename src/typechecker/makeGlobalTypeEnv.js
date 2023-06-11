import { makeGlobal } from "../runtime/makeGlobals.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";

export const makeGlobalTypeEnv = () => {
  const globals = makeGlobal();
  const typeEnv = TypeEnvironment.new(null, { name: "global" });

  for (let [k, v] of globals) {
    typeEnv.set(k, v.contract ?? Type.any);
  }

  return typeEnv;
};
