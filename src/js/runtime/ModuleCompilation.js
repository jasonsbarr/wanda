export class ModuleCompilation {
  /**
   * Constructs a module compilation object
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast").Program} ast
   */
  constructor(name, location, ast) {
    this.name = name;
    this.location = location;
    this.ast = ast;
  }

  /**
   * Static constructor
   * @param {string} name
   * @param {string} location
   * @param {import("../parser/ast").Program} ast
   * @returns {ModuleCompilation}
   */
  static new(name, location, ast) {
    return new ModuleCompilation(name, location, ast);
  }
}
