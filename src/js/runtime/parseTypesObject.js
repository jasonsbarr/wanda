import { parseContract } from "./parseContract.js";

export const parseTypesObject = (types) => {
  types.__module__ = "string";

  const parsedTypes = Object.fromEntries(
    Object.entries(types).map(([k, v]) => [
      k,
      // if it's a string, it's a string type annotation - otherwise it's already a Type
      typeof v === "string" ? parseContract(v) : v,
    ])
  );

  types.kind = "Module";
  return parsedTypes;
};
