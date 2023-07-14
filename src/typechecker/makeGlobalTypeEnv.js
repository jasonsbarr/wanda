import { theModule as Core } from "../lib/core.js";
import { TypeEnvironment } from "./TypeEnvironment.js";

export const makeGlobalTypeEnv = () => {
  const typeEnv = TypeEnvironment.new(null, { name: "global" });

  typeEnv.addMany(Core.values);
  typeEnv.addManyTypes(Core.types);

  return typeEnv;
};
