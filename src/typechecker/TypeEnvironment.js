import { Namespace } from "../shared/Namespace.js";

/**
 * @class TypeEnvironment
 * @extends Namespace
 * @desc Environment for type checking
 * @prop {Map<string, Type>} types
 */
export class TypeEnvironment extends Namespace {
  constructor(parent = null, { name = "global" } = {}) {
    super(parent, { name });
    this.types = new Map();
  }

  static new(parent = null, { name = "global" } = {}) {
    return new TypeEnvironment(parent, { name });
  }

  /**
   * Constructs a child out of the current type environment
   * @param {string} name
   * @returns {TypeEnvironment}
   */
  extend(name) {
    return new TypeEnvironment(this, { name });
  }
}
