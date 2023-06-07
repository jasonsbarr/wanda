import { ASTTypes } from "../parser/ast.js";
import { Exception, SyntaxException } from "../shared/exceptions.js";
import { Namespace } from "../runtime/Namespace.js";
import { makeSymbol } from "../runtime/makeSymbol.js";

/**
 * @typedef {import("../parser/ast.js").AST} AST
 */
/**
 * @class Emitter
 * @desc Visitor code emitter for Wanda AST
 * @prop {import("../parser/ast.js").AST} AST
 * @prop {Namespace} ns
 */
export class Emitter {
  /**
   * Constructs the emitter object
   * @param {AST} program
   * @param {Namespace} ns
   */
  constructor(program, ns) {
    this.program = program;
    this.ns = ns;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @param {Namespace} ns
   * @returns {Emitter}
   */
  static new(program, ns = new Namespace()) {
    return new Emitter(program, ns);
  }

  /**
   * Emitter dispatcher method
   * @param {AST} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emit(node = this.program, ns = this.ns) {
    switch (node.type) {
      case ASTTypes.Program:
        return this.emitProgram(node, ns);
      case ASTTypes.NumberLiteral:
        return this.emitNumber(node, ns);
      case ASTTypes.StringLiteral:
        return this.emitString(node, ns);
      case ASTTypes.BooleanLiteral:
        return this.emitBoolean(node, ns);
      case ASTTypes.KeywordLiteral:
        return this.emitKeyword(node, ns);
      case ASTTypes.NilLiteral:
        return this.emitNil(node, ns);
      case ASTTypes.Symbol:
        return this.emitSymbol(node, ns);
      case ASTTypes.CallExpression:
        return this.emitCallExpression(node, ns);
      case ASTTypes.VariableDeclaration:
        return this.emitVariableDeclaration(node, ns);
      case ASTTypes.SetExpression:
        return this.emitSetExpression(node, ns);
      default:
        throw new SyntaxException(node.type, node.srcloc);
    }
  }

  /**
   * Generates code from a Boolean AST node
   * @param {import("../parser/ast.js").BooleanLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitBoolean(node, ns) {
    return node.value;
  }

  /**
   * Generates code for a CallExpression AST node
   * @param {import("../parser/ast.js").CallExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitCallExpression(node, ns) {
    return `(${this.emit(node.func, ns)})(${node.args
      .map((a) => this.emit(a, ns))
      .join(", ")})`;
  }

  /**
   * Generates code from a Keyword AST node
   * @param {import("../parser/ast.js").KeywordLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitKeyword(node, ns) {
    return `Symbol.for("${node.value}")`;
  }

  /**
   * Generates code from a Nil AST node
   * @param {import("../parser/ast.js").NilLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitNil(node, ns) {
    return "null";
  }

  /**
   * Generates code from a Number AST node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitNumber(node, ns) {
    return node.value;
  }

  /**
   * Generates code from a Program AST node
   * @param {import("../parser/ast.js").Program} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitProgram(node, ns) {
    let code = "(() => {\n";

    let i = 0;
    for (let n of node.body) {
      if (i === node.body.length - 1) {
        code += `  return ${this.emit(n, ns)}`;
      } else {
        code += `  ${this.emit(n, ns)};`;
      }

      i++;
    }

    code += "\n})();";

    return code;
  }

  /**
   * Generates code from a SetExpression AST node
   * @param {import("../parser/ast.js").SetExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitSetExpression(node, ns) {
    return `${this.emit(node.lhv, ns)} = ${this.emit(node.expression, ns)};`;
  }

  /**
   * Generates code from a String AST node
   * @param {import("../parser/ast.js").StringLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitString(node, ns) {
    return "`" + node.value.slice(1, -1) + "`";
  }

  /**
   * Generates code from a Symbol AST node
   * @param {import("../parser/ast.js").Symbol} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitSymbol(node, ns) {
    const name = node.name;
    const emittedName = ns.get(name);

    if (!emittedName) {
      throw new Exception(
        `The name ${name} has not been defined in ${node.srcloc.file} at ${node.srcloc.line}:${node.srcloc.col}`
      );
    }

    return emittedName;
  }

  /**
   * Generates code from a VariableDeclaration AST node
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVariableDeclaration(node, ns) {
    const name = node.lhv.name;
    const translatedName = makeSymbol(name);

    ns.set(name, translatedName);

    return `var ${translatedName} = ${this.emit(node.expression, ns)};`;
  }
}
