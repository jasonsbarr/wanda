import { Exception } from "./exceptions.js";
/**
 * Throws an error in expression position
 * @param {string} msg
 * @throws {Exception}
 */
export const fail = (msg, exn = Exception) => {
  throw new exn(msg);
};
