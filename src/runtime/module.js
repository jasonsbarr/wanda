/**
 * @class Module
 * @desc In-language module
 * @prop {string} name
 * @prop {Function} module the module constructor
 * @prop {string[]} requires in-lang required modules
 * @prop {string[]} nativeRequires native JS required modules
 */
class Module {
  /**
   * Module class constructor
   * @param {string} name
   * @param {Function} module the module constructor
   * @param {string[]} requires in-lang required modules
   * @param {string[]} nativeRequires native JS required modules
   */
  constructor(name, module, requires, nativeRequires) {
    this.name = name;
    this.module = module;
    this.requires = requires;
    this.nativeRequires = nativeRequires;
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
 * @returns {Module}
 */
export const makeModule = (name, module, requires = [], nativeRequires = []) =>
  new Module(name, module, requires, nativeRequires);
