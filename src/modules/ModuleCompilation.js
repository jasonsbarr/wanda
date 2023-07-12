import { resolveOutpathLocal } from "./resolve.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} code
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {boolean} [opts.global=false]
   */
  constructor(code, sourcePath, { outPath = "", global = false } = {}) {
    this.code = code;
    this.sourcePath = sourcePath;

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
   * @returns {ModuleCompilation}
   */
  static new(code, sourcePath, { outPath = "", global = false } = {}) {
    return new ModuleCompilation(code, sourcePath, { outPath, global });
  }
}
