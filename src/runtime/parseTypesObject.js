import { parseContract } from "./parseContract.js";

export const parseTypesObject = (types) => {
  const types = Object.fromEntries(
    Object.entries(types).map(([k, v]) => [k, parseContract(v)])
  );

  types.kind = "Module";
  return types;
};
