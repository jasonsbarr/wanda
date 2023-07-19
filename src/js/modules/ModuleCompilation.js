import { TypeEnvironment } from "../typechecker/TypeEnvironment.js";
import { resolveOutPath, getImportsWithSource } from "./utils.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} name
   * @param {import("../parser/ast.js").Program} ast AST for the module's contents
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {import("./visitModule.js").ImportSpecifier[]} [opts.dependencies=[]]
   * @param {string[]} opts.provides
   * @param {TypeEnvironment} opts.env
   */
  constructor(
    name,
    ast,
    sourcePath,
    { dependencies = [], provides = [], env = {} } = {}
  ) {
    this.name = name;
    this.ast = ast;
    this.sourcePath = sourcePath;
    this.dependencies = getImportsWithSource(dependencies);
    this.provides = provides;
    this.env = env;
    this.outPath = resolveOutPath(sourcePath, global);
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {import("../parser/ast.js").Program} ast
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {import("./visitModule.js").ImportSpecifier[]} [opts.dependencies=[]]
   * @param {string[]} opts.provides
   * @param {TypeEnvironment} opts.env
   * @returns {ModuleCompilation}
   */
  static new(
    name,
    ast,
    sourcePath,
    { outPath = "", dependencies = [], provides = [], env = {} } = {}
  ) {
    return new ModuleCompilation(name, ast, sourcePath, {
      outPath,
      global,
      dependencies,
      provides,
      env,
    });
  }
}
