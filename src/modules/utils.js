import { resolve } from "./resolve.js";

/**
 * Resolves arrays of required module import specifiers/specifier strings to file locations
 * @param {string[]} requires
 * @returns {string[]}
 */
export const getModulePaths = (requires) => {
  return requires.map((req) =>
    req.startsWith("//") || /^[a-zA-Z]:\\\\/.test(req) ? req : resolve(req)
  );
};
