import objectHash from "object-hash";

export const PREFIX = "$W_";

export const makeSymbol = (str) => PREFIX + objectHash(str);
