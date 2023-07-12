import fs from "fs";
import { join } from "path";
import v from "voca";
import { ROOT_PATH } from "../../root.js";
import { parseModuleImport } from "./parseModuleImport.js";
import { ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions.js";

/**
 * Resolves a module's file location as a string
 * @param {string|import("../parser/ast").MemberExpression} importSignifier
 * @param {boolean|undefined} native
 * @returns {string}
 */
export const resolve = (importSignifier) => {
  const memExp =
    typeof importSignifier === "string"
      ? parseModuleImport(importSignifier)
      : importSignifier;
  let native = false;

  const parts = memExp.toString().split(".");
  const moduleKind = parts[0];
  const filenameBase = v.kebabCase(parts[parts.length - 1]);
  let resolvedPath =
    "/" +
    parts
      .slice(1, -1)
      .map((s) => v.kebabCase(s))
      .join("/") +
    "/";

  if (moduleKind === "Wanda") {
    resolvedPath = ROOT_PATH + "/lib/" + resolvedPath;

    if (fs.existsSync(join(resolvedPath, `${filenameBase}.wanda`))) {
      resolvedPath += "build/" + filenameBase + ".js";
      return resolvedPath;
    } else if (
      fs.existsSync(join(resolvedPath + "js/", `${filenameBase}.js`))
    ) {
      resolvedPath += "js/";
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
    const cwd = process.cwd() + "/";
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
    resolvedPath = "./" + v.kebabCase(moduleKind) + resolvedPath;

    if (fs.existsSync(join(resolvedPath, `${filenameBase}.wanda`))) {
      // nothing more needs to be done
    } else if (fs.existsSync(join(resolvedPath, `js/${filenameBase}.js`))) {
      resolvedPath += "js/";
      native = true;
    } else {
      throw new Exception(
        `Could not resolve module ${resolvedPath}${filenameBase}`
      );
    }
  }

  resolvedPath += `${filenameBase}.${native ? "js" : "wanda"}`;
  return resolvedPath;
};

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

  if (sourcePath.indexOf("/lib/") >= 0) {
    const sliced = sourcePath.slice(0, sourcePath.indexOf("/lib/")) + "/";
    return sliced + "/build/lib/" + filename;
  }

  return parts.slice(0, -1).join("/") + `/${filename}`;
};
