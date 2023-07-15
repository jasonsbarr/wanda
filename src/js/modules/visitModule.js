import { Visitor } from "../visitor/Visitor.js";
import { ModuleCompilation } from "./ModuleCompilation.js";

/**
 * @typedef ImportSpecifier
 * @prop {import("../parser/ast.js").Symbol|import("../parser/ast.js").MemberExpression} import
 * @prop {null|string} alias
 */

class ModuleVisitor extends Visitor {
  /**
   * Constructor
   * @param {import("../typechecker/TypeChecker.js").TypedProgram} program
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
    this.env = this.program.env;
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
   * @returns {ModuleCompilation}
   */
  visitProgram(node) {
    for (let expr of node.body) {
      this.visit(expr);
    }

    if (!this.module) {
      const parts = this.sourcePath.split("/");
      const fileName = parts[parts.length - 1];
      let module = fileName.split(".")[0];
      module = module[0].toUpperCase() + module.slice(1);

      this.module = module;
    }

    return ModuleCompilation.new(this.module, this.program, this.sourcePath, {
      dependencies: this.dependencies,
      provides: this.provides,
      env: this.env,
    });
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
