import { resolveOutpathLocal } from "./resolve.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} code
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {boolean} [opts.global=false]
   * @param {{name: string; source: string}[]} [dependencies=[]]
   */
  constructor(
    code,
    sourcePath,
    { outPath = "", global = false, dependencies = [] } = {}
  ) {
    this.code = code;
    this.sourcePath = sourcePath;
    this.dependencies = dependencies;

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
   * @param {{name: string; source: string}[]} [opts.dependencies=[]]
   * @returns {ModuleCompilation}
   */
  static new(
    code,
    sourcePath,
    { outPath = "", global = false, dependencies = [] } = {}
  ) {
    return new ModuleCompilation(code, sourcePath, {
      outPath,
      global,
      dependencies,
    });
  }
}
