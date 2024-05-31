import path from "path";
import fs from "fs";
import v from "voca";
import { ASTTypes } from "../parser/ast.js";
import { ROOT_PATH } from "../../../root.js";
import { ReferenceException } from "../shared/exceptions.js";
import { parse } from "../parser/parse.js";
import { read } from "../reader/read.js";
import { tokenize } from "../lexer/tokenize.js";

/**
 * Resolves a module import declaration to a file location
 * @param {import("../parser/ast").MemberExpression || import("../parser/ast").Symbol} moduleImport
 * @returns {string}
 */
export const resolveModuleImport = (moduleImport) => {
  const names =
    moduleImport.kind === ASTTypes.Symbol
      ? [moduleImport.name]
      : convertMemberExpressionToNamesArray(moduleImport);

  // determine base location based on first member
  // Wanda - Global lib directory
  // Modules - Project-local node_modules
  // Other - Local directory and/or file
  const baseName = names.length > 1 ? names.shift() : "";

  const basePath =
    baseName.toLowerCase() === "wanda"
      ? path.join(ROOT_PATH, "src", "lib")
      : baseName.toLowerCase() === "modules"
      ? path.join(
          process.cwd(),
          "node_modules",
          v.kebabCase(names.shift()),
          "src"
        )
      : path.join(process.cwd(), "src");

  // convert location array to path string
  let restPath =
    baseName.toLowerCase() !== "wanda" && baseName.toLowerCase() !== "modules"
      ? baseName
      : baseName.toLowerCase() === "modules" && names.length === 1 // module folder name was only name after Modules signifier
      ? names.shift() // filename will be same as module name
      : "";

  for (let name of names) {
    restPath = path.join(restPath, v.kebabCase(name));
  }

  // check if file exists in either js (JS file) or root directory (Wanda file)
  let fullPath = "";
  const jsPath = path.join(basePath, "js", restPath) + ".js";
  const wandaPath = path.join(basePath, restPath) + ".wanda";

  // check for JS
  if (fs.existsSync(jsPath)) {
    fullPath = jsPath;
  } else if (fs.existsSync(wandaPath)) {
    fullPath = wandaPath;
  } else {
    throw new ReferenceException(
      `No module ${names[names.length - 1]}`,
      moduleImport.srcloc
    );
  }

  return fullPath;
};

/**
 * Converts a module's path to its compiled output path
 * @param {string} modulePath
 * @returns {string}
 */
export const resolveModuleOutput = (modulePath) => {
  if (modulePath.endsWith(".js")) {
    return modulePath;
  }

  return modulePath
    .replace("src", path.join("build", "js"))
    .replace(".wanda", ".js");
};

/**
 * Converts the string of a require in a native module to an AST node for the require
 * @param {string} require
 * @returns {import("../parser/ast").MemberExpression || import("../parser/ast").Symbol}
 */
export const convertNativeRequireToNode = (require) => {
  return parse(read(tokenize(require, "Import"))).body[0];
};

const convertMemberExpressionToNamesArray = (memExp) => {
  // convert Member Expression to array of names
  const end = memExp.property.name;
  /** @type {string[]} */
  let names = [];

  let obj = memExp.object;
  if (obj.kind === ASTTypes.MemberExpression) {
    while (obj.kind === ASTTypes.MemberExpression) {
      /** @type {import("../parser/ast").Symbol} */
      const property = obj.property;
      const name = property.name;

      names.unshift(name);
      obj = obj.object;
    }

    // now obj must be Symbol
    names.unshift(obj.name);
  } else {
    // MemberExpression object property is Symbol
    names.unshift(obj.name);
  }

  // add end property to names array
  names.push(end);

  return names;
};
