import { parseContract } from "./parseContract.js";

export const parseTypesObject = (types) => {
  types.__module__ = "string";

  const parsedTypes = Object.fromEntries(
    Object.entries(types).map(([k, v]) => [k, parseContract(v)])
  );

  types.kind = "Module";
  return parsedTypes;
};
