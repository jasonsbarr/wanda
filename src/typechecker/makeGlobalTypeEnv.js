import { theModule as Core } from "../../lib/js/core.js";
import { makeRuntime } from "../runtime/makeRuntime.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";

export const makeGlobalTypeEnv = () => {
  const mod = Core.module(makeRuntime());
  const typeEnv = TypeEnvironment.new(null, { name: "global" });

  for (let [k, v] of Object.entries(mod)) {
    typeEnv.set(k, v.contract ?? Type.any);
  }

  return typeEnv;
};
