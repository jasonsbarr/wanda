import { resolveOutPath } from "./utils.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} name
   * @param {string} code compiled code emitted for the module's contents
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {string} [opts.outPath=""]
   * @param {import("./visitModule.js").ImportSpecifier[]} [opts.dependencies=[]]
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

    if (!outPath) {
      this.outPath = resolveOutPath(sourcePath, global);
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
   * @param {import("./visitModule.js").ImportSpecifier[]} [opts.dependencies=[]]
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