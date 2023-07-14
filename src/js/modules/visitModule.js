import { Visitor } from "../visitor/Visitor.js";

/**
 * @typedef ImportSpecifier
 * @prop {import("../parser/ast.js").Symbol|import("../parser/ast.js").MemberExpression} import
 * @prop {null|import("../parser/ast.js").Symbol} alias
 */

class ModuleVisitor extends Visitor {
  /**
   * Constructor
   * @param {import("../parser/ast.js").Program} program
   */
  constructor(program) {
    super(program);

    /** @type {string[]} */
    this.provides = [];
    /** @type {ImportSpecifier[]} */
    this.dependencies = [];
    /** @type {null|string} */
    this.module = null;
    this.sourcePath = program.srcloc.file;
  }

  /**
   * Adds an import specifier to dependencies
   * @param {import("../parser/ast.js").Import} node
   */
  visitImport(node) {
    this.dependencies.push({ import: node.import, alias: node.alias });
    return node;
  }

  /**
   * Sets the value of this.module
   * @param {import("../parser/ast.js").Module} node
   */
  visitModule(node) {
    this.module = node.name.name;
    return node;
  }

  /**
   * Adds the relevant properties from this visitor class to the Program node
   * @param {import("../parser/ast.js").Program} node
   * @returns {import("../parser/ast.js").Program & {provides: string[]; dependencies: ImportSpecifier[]; module: string|null; sourcePath: string}}
   */
  visitProgram(node) {
    for (let expr of node.body) {
      this.visit(expr);
    }

    return {
      ...node,
      provides: this.provides,
      dependencies: this.dependencies,
      module: this.module,
    };
  }

  /**
   * Adds the variable name to this.provides
   * @param {import("../parser/ast.js").VariableDeclaration} node
   */
  visitVariableDeclaration(node) {
    // this is after desugaring, so node.lhv will always be a Symbol node
    this.provides.push(node.lhv.name);
    return node;
  }
}

/**
 * Executes the ModuleVisitor on a module's Program node
 * @param {import("../parser/ast.js").Program} program
 * @returns {import("../parser/ast.js").Program & {provides: string[]; dependencies: ImportSpecifier[]; module: string|null sourcePath: string}}
 */
export const visitModule = (program) => new ModuleVisitor(program).visit();
