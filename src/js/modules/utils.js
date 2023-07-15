import { resolve } from "./resolve.js";

/**
 * @typedef {import("./visitModule.js").ImportSpecifier & {sourcePath: string}} ImportWithSource
 */

/**
 * Resolves arrays of required module import specifiers/specifier strings to file locations
 * @param {import("./visitModule.js").ImportSpecifier[]} requires
 * @returns {ImportWithSource[]}[]}
 */
export const getImportsWithSource = (requires) =>
  requires.map((req) => ({
    ...req,
    sourcePath: resolve(req.import),
  }));

/**
 * Resolves the outpath for a local module's already-resolved sourcepath
 * @param {string} sourcePath
 * @param {boolean} [global=false]
 * @returns {string}
 */
export const resolveOutPath = (sourcePath) => {
  if (sourcePath.endsWith(".js")) {
    return sourcePath;
  }

  const parts = sourcePath.split("/");
  const filename = parts[parts.length - 1].split(".")[0] + ".js";

  return parts.slice(0, -1).join("/").replace("/src/", "/build/") + filename;
};

/**
 * Filters out duplicate modules
 * @param {ImportWithSource[]} modules
 * @returns {ImportWithSource[]}
 */
export const getUniqueModules = (modules) => {
  let filtered = [];

  for (let mod of modules) {
    if (!filtered.find((m) => mod.sourcePath === m.sourcePath)) {
      filtered.push(mod);
    }
  }

  return filtered;
};
