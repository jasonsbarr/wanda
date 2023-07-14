import { resolveOutpathLocal } from "./resolve.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} name
   * @param {string} code compiled code emitted for the module's contents
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {string[]} [opts.dependencies=[]]
   * @param {import("../parser/ast.js").Symbol[]} opts.provides
   */
  constructor(
    name,
    code,
    sourcePath,
    { outPath = "", dependencies = [], provides = [] } = {}
  ) {
    this.name = name;
    this.code = code;
    this.sourcePath = sourcePath;
    this.dependencies = dependencies;
    this.provides = provides;

    if (!this.sourcePath.endsWith(".wanda")) {
      this.outPath = this.sourcePath;
    } else if (!outPath) {
      this.outPath = resolveOutpathLocal(sourcePath, global);
    } else {
      this.outPath = outPath;
    }
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {string} code
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]} [opts.dependencies=[]]
   * @param {import("../parser/ast.js").Symbol[]} opts.provides
   * @returns {ModuleCompilation}
   */
  static new(
    name,
    code,
    sourcePath,
    { outPath = "", dependencies = [], provides = [] } = {}
  ) {
    return new ModuleCompilation(name, code, sourcePath, {
      outPath,
      global,
      dependencies,
      provides,
    });
  }
}
