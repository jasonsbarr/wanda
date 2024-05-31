import { parseTypesObject } from "../runtime/parseTypesObject";

/**
 * @class Module
 * @desc In-language module
 * @prop {string} name
 * @prop {Function} module the module constructor
 * @prop {string[]} requires in-lang required modules
 * @prop {Object} values values provided by a module and their types
 * @prop {Object} types types provided by a module
 */
export class NativeModule {
  /**
   * Module class constructor
   * @param {string} name
   * @param {Function} module the module constructor
   * @param {string[]} requires in-lang required modules
   * @param {Object} values
   * @param {Object} types
   */
  constructor(name, module, requires, values, types) {
    this.name = name;
    this.module = module;
    this.requires = requires;
    this.values = parseTypesObject(values);
    this.types = parseTypesObject(types);
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
 * @param {Object} values
 * @param {Object} types
 * @returns {NativeModule}
 */
export const makeNativeModule = (
  name,
  module,
  requires = [],
  values = {},
  types = {}
) => new NativeModule(name, module, requires, values, types);
