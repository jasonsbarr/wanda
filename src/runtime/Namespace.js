/**
 * @class Namespace
 * @desc Maps names to in-language objects
 * @prop {Map<string, any>} vars
 * @prop {Namespace | null} parent
 */
export class Namespace {
  /**
   * Namespace constructor
   * @param {Namespace | null} parent
   */
  constructor(parent = null, { name = "global" } = {}) {
    this.parent = parent;
    this.vars = new Map();
    this.name = name;
  }

  static new(parent = null, { name = "global" } = {}) {
    return new Namespace(parent, { name });
  }

  /**
   * Adds many names to the current namespace
   * @param {Map | Object} vars
   */
  addMany(vars) {
    for (let [k, v] of vars instanceof Map
      ? vars.entries()
      : Object.entries(vars)) {
      this.set(k, v);
    }
  }

  /**
   * Checks to see if name exists in the namespace chain
   * @param {string} name
   * @returns {boolean}
   */
  exists(name) {
    return this.lookup(name) !== null;
  }

  /**
   * Constructs a child out of the current namespace
   * @param {string} name
   * @returns {Namespace}
   */
  extend(name) {
    return new Namespace(this, { name });
  }

  /**
   * Gets a value if its name is found in the current namespace chain
   * @param {string} name
   * @returns {any}
   */
  get(name) {
    const scope = this.lookup(name);

    if (scope) {
      return scope.vars.get(name);
    }

    return undefined;
  }

  /**
   * Checks to see if name exists in the current namespace ONLY
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.vars.has(name);
  }

  /**
   * Looks up a name in the current namespace chain
   * @param {string} name
   * @returns {Namespace | null}
   */
  lookup(name) {
    let scope = this;

    while (scope !== null) {
      if (scope.vars.has(name)) {
        return scope;
      }

      scope = scope.parent;
    }

    return null;
  }

  /**
   * Sets the value for a name in the current namespace
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.vars.set(key, value);
  }

  *[Symbol.iterator]() {
    for (let [k, v] of this.vars) {
      yield [k, v];
    }
  }
}
