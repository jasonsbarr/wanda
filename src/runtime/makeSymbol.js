import objectHash from "object-hash";

export const PREFIX = "$W_";

/**
 * Converts a Wanda identifier into a valid JavaScript identifier
 * @param {string} str
 * @returns {string}
 */
export const makeSymbol = (str) => PREFIX + objectHash(str);
