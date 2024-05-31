import { resolveModuleImport } from "../runtime/resolveModule.js";
import { Visitor } from "../visitor/Visitor.js";

/**
 * @typedef {import("../parser/ast.js").MemberExpression} MemberExpression
 */
/**
 * @typedef {import("../parser/ast.js").Symbol} Symbol
 */
/**
 * @typedef {{module: MemberExpression|Symbol; alias: string; location: string}} Require
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
    const require = {
      module: node.module,
      alias: node.alias,
      location: resolveModuleImport(node.module),
    };
    this.requires.push(require);
    return node;
  }
}
