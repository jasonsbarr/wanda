import { getModuleName, resolveModuleImport } from "./resolveModule.js";
import { Visitor } from "../visitor/Visitor.js";
import { Require } from "./Require.js";

export class GetRequires extends Visitor {
  constructor(program) {
    super(program);
    /** @type {Require[]} */
    this.requires = [];
  }

  static new(program) {
    return new GetRequires(program);
  }

  /**
   * Extract Require from Import node
   * @param {import("../parser/ast.js").Import} node
   * @returns {import("../parser/ast.js").Import}
   */
  visitImport(node) {
    const name = getModuleName(node.module);
    const require = Require.new(
      node.module,
      node.alias ? node.alias : name,
      resolveModuleImport(node.module),
      name
    );

    this.requires.push(require);
    return node;
  }
}
