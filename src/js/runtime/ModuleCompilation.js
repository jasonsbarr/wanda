export class ModuleCompilation {
  /**
   * Constructs a module compilation object
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast").Program} ast
   * @param {string[]} requires
   */
  constructor(name, location, ast, requires) {
    this.name = name;
    this.location = location;
    this.ast = ast;
    this.requires = requires;
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast").Program} ast
   * @param {string[]} requires
   * @returns {ModuleCompilation}
   */
  static new(name, location, ast, requires) {
    return new ModuleCompilation(name, location, ast, requires);
  }
}
