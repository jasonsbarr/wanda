export class ModuleCompilation {
  /**
   * Constructs a module compilation object
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast.js").Program} ast
   * @param {import("./Require.js").Require[]} requires
   * @param {string} outputLocation
   */
  constructor(name, location, ast, requires, outputLocation) {
    this.name = name;
    this.location = location;
    this.ast = ast;
    this.requires = requires;
    this.outputLocation = outputLocation;
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast.js").Program} ast
   * @param {import("./Requires.js").Requires} requires
   * @param {string} outputLocation
   * @returns {ModuleCompilation}
   */
  static new(name, location, ast, requires, outputLocation) {
    return new ModuleCompilation(name, location, ast, requires, outputLocation);
  }
}
