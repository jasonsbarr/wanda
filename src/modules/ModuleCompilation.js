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

    if (this.sourcePath.endsWith(".js")) {
      this.outPath = this.sourcePath;
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
