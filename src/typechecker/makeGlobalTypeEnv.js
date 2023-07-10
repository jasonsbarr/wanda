import { theModule as Core } from "../../lib/js/core.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { parseContract } from "../runtime/parseContract.js";

export const makeGlobalTypeEnv = () => {
  const typeEnv = TypeEnvironment.new(null, { name: "global" });
  const values = Object.fromEntries(
    Object.entries(Core.values).map(([k, v]) => [k, parseContract(v)])
  );
  const types = Object.fromEntries(
    Object.entries(Core.types).map(([k, v]) => [k, parseContract(v)])
  );

  typeEnv.addMany(values);
  typeEnv.addManyTypes(types);

  return typeEnv;
};
