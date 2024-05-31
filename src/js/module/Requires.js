import { getModuleName, resolveModuleImport } from "./resolveModule.js";
import { Visitor } from "../visitor/Visitor.js";

/**
 * @typedef {import("../parser/ast.js").MemberExpression} MemberExpression
 */
/**
 * @typedef {import("../parser/ast.js").Symbol} Symbol
 */
/**
 * @typedef {{module: MemberExpression|Symbol; alias: string; location: string; name: string}} Require
 */

export class Requires extends Visitor {
  constructor(program) {
    super(program);
    /** @type {Require[]} */
    this.requires = [];
  }

  static new(program) {
    return new Requires(program);
  }

  /**
   *
   * @param {import("../parser/ast.js").Import} node
   * @returns {import("../parser/ast.js").Import}
   */
  visitImport(node) {
    const name = getModuleName(node.module);
    const require = {
      module: node.module,
      alias: node.alias ? node.alias : name,
      location: resolveModuleImport(node.module),
      name,
    };
    this.requires.push(require);
    return node;
  }
}
