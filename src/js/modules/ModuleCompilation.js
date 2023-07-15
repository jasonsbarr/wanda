import { resolveOutPath, getImportsWithSource } from "./utils.js";

export class ModuleCompilation {
  /**
   * Constructor
   * @param {string} name
   * @param {import("../parser/ast.js").Program} code compiled code emitted for the module's contents
   * @param {string} sourcePath
   * @param {Object} opts
   * @param {import("./visitModule.js").ImportSpecifier[]} [opts.dependencies=[]]
   * @param {string[]} opts.provides
   */
  constructor(
    name,
    code,
    sourcePath,
    { dependencies = [], provides = [] } = {}
  ) {
    this.name = name;
    this.code = code;
    this.sourcePath = sourcePath;
    this.dependencies = getImportsWithSource(dependencies);
    this.provides = provides;
    this.outPath = resolveOutPath(sourcePath, global);
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {import("../parser/ast.js").Program} code
   * @param {string} sourcePath
   * @param {Object} opts
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
