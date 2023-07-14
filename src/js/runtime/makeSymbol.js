import objectHash from "object-hash";
import { createId } from "@paralleldrive/cuid2";

export const PREFIX = "$W_";

/**
 * Converts a Wanda identifier into a valid JavaScript identifier
 * @param {string} str
 * @returns {string}
 */
export const makeSymbol = (str) => PREFIX + objectHash(str);

/**
 * Generates a random valid JavaScript identifier
 * @returns {string}
 */
export const makeGenSym = () => PREFIX + createId();
