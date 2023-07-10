import { parseContract } from "./parseContract.js";

export const parseTypesObject = (types) =>
  Object.fromEntries(
    Object.entries(types).map(([k, v]) => [k, parseContract(v)])
  );
