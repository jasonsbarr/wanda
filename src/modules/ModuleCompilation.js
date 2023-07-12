import { resolveOutpathLocal } from "./resolve.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} code
   * @param {string} sourcePath
   * @param {string} outPath
   */
  constructor(code, sourcePath, outPath = "") {
    this.code = code;
    this.sourcePath = sourcePath;

    if (!this.sourcePath.endsWith(".wanda")) {
      this.outPath = this.sourcePath;
    } else if (!outPath) {
      this.outPath = resolveOutpathLocal(sourcePath);
    } else {
      this.outPath = outPath;
    }
  }

  /**
   * Static constructor
   * @param {string} code
   * @param {string} sourcePath
   * @param {string} outPath
   * @returns {ModuleCompilation}
   */
  static new(code, sourcePath, outPath = "") {
    return new ModuleCompilation(code, sourcePath, outPath);
  }
}
