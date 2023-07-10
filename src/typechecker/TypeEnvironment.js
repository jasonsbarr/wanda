import { Namespace } from "../shared/Namespace.js";

/**
 * @class TypeEnvironment
 * @extends Namespace
 * @desc Environment for type checking
 * @prop {Map<string, Type>} types
 * @prop {boolean} checkingOn
 */
export class TypeEnvironment extends Namespace {
  constructor(parent = null, { name = "global" } = {}) {
    super(parent, { name });
    this.types = new Map();
    this.checkingOn = false;
  }

  static new(parent = null, { name = "global" } = {}) {
    return new TypeEnvironment(parent, { name });
  }

  /**
   * Adds many names to the current namespace
   * @param {Map | Object} types
   */
  addManyTypes(types) {
    for (let [k, v] of types instanceof Map
      ? types.entries()
      : Object.entries(types)) {
      this.setType(k, v);
    }
  }

  /**
   * Checks if type name exists anywhere in the environment chain
   * @param {string} name
   * @returns {boolean}
   */
  existsType(name) {
    return this.lookupType(name) !== null;
  }

  /**
   * Constructs a child out of the current type environment
   * @param {string} name
   * @returns {TypeEnvironment}
   */
  extend(name) {
    let env = new TypeEnvironment(this, { name });
    env.checkingOn = this.checkingOn;
    return env;
  }

  /**
   * Returns a type from the TypeEnvironment
   * @param {string} name
   * @returns {import("./types.js").Type}
   */
  getType(name) {
    const scope = this.lookupType(name);

    if (scope) {
      return scope.types.get(name);
    }

    return null;
  }

  /**
   * Checks if a type name exists in the current environment
   * @param {string} name
   * @returns {boolean}
   */
  hasType(name) {
    return this.types.has(name);
  }

  /**
   * Looks up if a type exists in the environment chain
   * @param {string} name
   * @returns {TypeEnvironment|null}
   */
  lookupType(name) {
    let scope = this;

    while (scope) {
      if (scope.types.has(name)) {
        return scope;
      }

      scope = scope.parent;
    }

    return null;
  }

  /**
   * Sets a type in the current TypeEnvironment
   * @param {string} name
   * @param {import("./types.js").Type} type
   */
  setType(name, type) {
    this.types.set(name, type);
  }

  /**
   * Converts the TypeEnvironment into a pair of module type objects for values and types
   * @returns {{values: Object, types: Object}}
   */
  toObject() {
    const values = Object.fromEntries(this.vars.entries());
    const types = Object.fromEntries(this.types.entries());

    return { values, types };
  }
}
