import { resolve } from "./resolve.js";

/**
 * Resolves arrays of required module import specifiers/specifier strings to file locations
 * @param {(string|import("../parser/ast.js").MemberExpression)[]} requires
 * @returns {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]}
 */
export const getModulePaths = (requires) =>
  requires.map((req) => ({ name: req.toString(), source: resolve(req) }));

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
