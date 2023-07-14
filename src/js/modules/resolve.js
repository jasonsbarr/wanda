import fs from "fs";
import { join } from "path";
import v from "voca";
import { ROOT_PATH } from "../../root.js";
import { Exception } from "../shared/exceptions.js";

/**
 * Resolves a module's file location as a string
 * @param {string|import("../parser/ast").MemberExpression|import("../parser/ast").Symbol} importSignifier
 * @param {boolean|undefined} native
 * @returns {string}
 */
export const resolve = (importSignifier) => {
  const parts = importSignifier.toString().split(".");
  const moduleKind = parts.length > 1 ? parts[0] : "";
  const filenameBase = v.kebabCase(parts[parts.length - 1]);
  let resolvedPath =
    "/" +
    parts
      .slice(1, -1)
      .map((s) => v.kebabCase(s))
      .join("/") +
    "/";
  let native = false;

  const cwd = process.cwd() + "/";
  if (moduleKind === "Wanda") {
    if (
      fs.existsSync(
        join(
          ROOT_PATH + "/src/wanda/lib/" + resolvedPath,
          `${filenameBase}.wanda`
        )
      )
    ) {
      resolvedPath = ROOT_PATH + "/build/lib/" + filenameBase + ".js";
      return resolvedPath;
    } else if (
      fs.existsSync(
        join(ROOT_PATH + "/src/js/lib/" + resolvedPath, `${filenameBase}.js`)
      )
    ) {
      resolvedPath = ROOT_PATH + "/src/js/lib/" + resolvedPath;
      native = true;
    } else {
      throw new Exception(
        `Could not resolve module ${resolvedPath}${filenameBase}.js`
      );
    }
  } else if (moduleKind === "Module") {
    // is in node_modules/ and we're enforcing use of scoped modules
    // if is Wanda module, should be already built and package.json
    // should have main pointing to built file so we can just import the module
    resolvedPath = "@" + resolvedPath.slice(1) + filenameBase;
    return resolvedPath;
  } else if (moduleKind === "Lib") {
    // assume cwd is the project root, module is in local lib/ directory
    // if it's a JS module it's in lib/js/, else it's in ./build/lib/

    if (
      fs.existsSync(join(cwd + "lib/js/" + resolvedPath, `${filenameBase}.js`))
    ) {
      resolvedPath = cwd + "lib/js/" + resolvedPath;
      native = true;
    } else if (
      fs.existsSync(join(cwd + "lib/" + resolvedPath, `${filenameBase}.wanda`))
    ) {
      resolvedPath = cwd + "lib/" + resolvedPath;
    } else {
      throw new Exception(
        `Could not resolve module ${resolvedPath}${filenameBase}`
      );
    }
  } else {
    // moduleKind is at the same level as the main program module
    const moduleName = v.kebabCase(moduleKind);
    resolvedPath = "./" + moduleName + resolvedPath;

    if (fs.existsSync(join(cwd, resolvedPath, `${filenameBase}.wanda`))) {
      // nothing more needs to be done
    } else if (
      fs.existsSync(join(cwd, resolvedPath, `js/${filenameBase}.js`))
    ) {
      resolvedPath += "js/";
      native = true;
    } else {
      throw new Exception(
        `Could not resolve module ${resolvedPath}${filenameBase}`
      );
    }

    resolvedPath = join(cwd, resolvedPath);
  }

  resolvedPath += `${filenameBase}.${native ? "js" : "wanda"}`;
  return resolvedPath;
};
