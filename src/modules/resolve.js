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
  let moduleKind = "";
  let resolvedPath = "";
  let filenameBase = "";
  let native = false;

  if (memExp.object.kind === ASTTypes.MemberExpression) {
    let moduleIdentifier = memExp.object;

    while (moduleIdentifier.kind === ASTTypes.MemberExpression) {
      resolvedPath =
        "/" + v.kebabCase(moduleIdentifier.property.name) + resolvedPath;
      // the Symbol node that terminates this loop will have a name property, undefined until then
      moduleKind = moduleIdentifier.object.name;
      moduleIdentifier = moduleIdentifier.object;
    }
    resolvedPath += "/";

    // moduleIdentifier is Symbol node
    filenameBase = v.kebabCase(memExp.property.name);
  } else {
    // is a Symbol node, which means it's the file
    moduleKind = memExp.object.name;
    filenameBase = v.kebabCase(memExp.property.name);
  }

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
    resolvedPath = "@" + resolvedPath + filenameBase;
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
    throw new Exception(`Unknown module kind ${moduleKind}`);
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
export const resolveOutPathLocal = (sourcePath, global = false) => {
  if (sourcePath.endsWith(".js")) {
    return sourcePath;
  }

  const parts = sourcePath.split("/");
  const filename = parts[parts.length - 1].split(".")[0] + ".js";
  const sliced = sourcePath.slice(0, sourcePath.indexOf("/lib/")) + "/";

  if (global) {
    return sliced + "/lib/build/" + filename;
  }

  return sliced + "/build/lib/" + filename;
};
