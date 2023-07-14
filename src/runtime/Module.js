import { parseTypesObject } from "./parseTypesObject.js";

/**
 * @class Module
 * @desc In-language module
 * @prop {string} name
 * @prop {Function} module the module constructor
 * @prop {string[]} requires in-lang required modules
 * @prop {string[]} nativeRequires native JS required modules
 * @prop {Object} values values provided by a module and their types
 * @prop {Object} types types provided by a module
 * @prop {string} absPath absolute path to the native or compiled module
 */
export class Module {
  /**
   * Module class constructor
   * @param {string} name
   * @param {Function} module the module constructor
   * @param {Object} opts
   * @param {string[]} opts.requires in-lang required modules
   * @param {string[]} opts.nativeRequires native JS required modules
   * @param {Object} opts.values
   * @param {Object} opts.types
   * @param {string} opts.fileURL
   */
  constructor(
    name,
    module,
    { requires, nativeRequires, values, types, fileURL }
  ) {
    this.name = name;
    this.module = module;
    this.requires = requires;
    this.nativeRequires = nativeRequires;
    this.values = parseTypesObject(values);
    this.types = parseTypesObject(types);
    // hacky version of fileURLToPath since ESBuild errors if we try to import the function from Node's url module
    this.absPath = fileURL.split("file://")[1] ?? "";
  }

  toString() {
    return `Module ${this.name}`;
  }
}

/**
 * Functional interface for Module constructor
 * @param {string} name
 * @param {Function} module the module constructor
 * @param {Object} opts
 * @param {string[]} opts.requires in-lang required modules
 * @param {string[]} opts.nativeRequires native JS required modules
 * @param {Object} opts.values
 * @param {Object} opts.types
 * @param {string} opts.fileURL
 * @returns {Module}
 */
export const makeModule = (
  name,
  module,
  {
    requires = [],
    nativeRequires = [],
    values = {},
    types = {},
    fileURL = "",
  } = {}
) =>
  new Module(name, module, {
    requires,
    nativeRequires,
    values,
    types,
    fileURL,
  });
