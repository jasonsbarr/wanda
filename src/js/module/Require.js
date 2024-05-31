/**
 * @typedef {import("../parser/ast.js").MemberExpression} MemberExpression
 */
/**
 * @typedef {import("../parser/ast.js").Symbol} Symbol
 */
/**
 * @class
 * @prop {MemberExpression|Symbol} ModuleCompilation
 * @prop {string} alias
 * @prop {string} location
 * @prop {string} name
 */

export class Require {
  /**
   * Require object constructor
   * @param {MemberExpression|Symbol} module
   * @param {string} alias
   * @param {string} location
   * @param {string} name
   */
  constructor(module, alias, location, name) {
    this.module = module;
    this.alias = alias;
    this.location = location;
    this.name = name;
  }

  /**
   * Static constructor for Require object
   * @param {MemberExpression|Symbol} module
   * @param {string} alias
   * @param {string} location
   * @param {string} name
   * @returns {Require}
   */
  static new(module, alias, location, name) {
    return new Require(module, alias, location, name);
  }
}
