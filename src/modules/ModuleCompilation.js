import { resolveOutpathLocal } from "./resolve.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} code
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {boolean} [opts.global=false]
   * @param {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]} [dependencies=[]]
   * @param {import("../parser/ast.js").Symbol[]} opts.provides
   */
  constructor(
    code,
    sourcePath,
    { outPath = "", global = false, dependencies = [], provides = [] } = {}
  ) {
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
   * @param {string} code
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {boolean} [opts.global=false]
   * @param {{name: string|import("../parser/ast.js").MemberExpression; source: string}[]} [opts.dependencies=[]]
   * @param {import("../parser/ast.js").Symbol[]} opts.provides
   * @returns {ModuleCompilation}
   */
  static new(
    code,
    sourcePath,
    { outPath = "", global = false, dependencies = [], provides = [] } = {}
  ) {
    return new ModuleCompilation(code, sourcePath, {
      outPath,
      global,
      dependencies,
      provides,
    });
  }
}
