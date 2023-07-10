/**
 * @class Module
 * @desc In-language module
 * @prop {string} name
 * @prop {Function} module the module constructor
 * @prop {string[]} requires in-lang required modules
 * @prop {string[]} nativeRequires native JS required modules
 * @prop {Object} values values provided by a module and their types
 * @prop {Object} types types provided by a module
 */
class Module {
  /**
   * Module class constructor
   * @param {string} name
   * @param {Function} module the module constructor
   * @param {string[]} requires in-lang required modules
   * @param {string[]} nativeRequires native JS required modules
   * @param {Object} values
   * @param {Object} types
   */
  constructor(name, module, requires, nativeRequires, values, types) {
    this.name = name;
    this.module = module;
    this.requires = requires;
    this.nativeRequires = nativeRequires;
    this.values = values;
    this.types = types;
  }

  toString() {
    return `Module ${this.name}`;
  }
}

/**
 * Functional interface for Module constructor
 * @param {string} name
 * @param {Function} module the module constructor
 * @param {string[]} requires in-lang required modules
 * @param {string[]} nativeRequires native JS required modules
 * @param {Object} values
 * @param {Object} types
 * @returns {Module}
 */
export const makeModule = (
  name,
  module,
  requires = [],
  nativeRequires = [],
  values = {},
  types = {}
) => new Module(name, module, requires, nativeRequires, values, types);
