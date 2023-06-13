import { ASTTypes } from "../parser/ast.js";
import { ReferenceException, SyntaxException } from "../shared/exceptions.js";
import { Namespace } from "../shared/Namespace.js";
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
    switch (node.kind) {
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
      case ASTTypes.DoExpression:
        return this.emitDoExpression(node, ns);
      case ASTTypes.TypeAlias:
        return this.emitTypeAlias(node, ns);
      default:
        throw new SyntaxException(node.kind, node.srcloc);
    }
  }

  /**
   * Generates code from a Boolean AST node
   * @param {import("../parser/ast.js").BooleanLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitBoolean(node, ns) {
    return `rt.makeWandaValue(${node.value})`;
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
   * Generates code for a DoExpression AST node
   * @param {import("../parser/ast.js").DoExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitDoExpression(node, ns) {
    const childNs = ns.extend("doExpression");
    let code = "(() => {";

    let i = 0;
    for (let expr of node.body) {
      if (i === node.body.length - 1) {
        code += "return " + this.emit(expr, childNs) + "\n";
      } else {
        code += this.emit(expr, childNs) + "\n";
      }
      i++;
    }

    code += "})();";
    return code;
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
    return `rt.makeWandaValue(${"null"})`;
  }

  /**
   * Generates code from a Number AST node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitNumber(node, ns) {
    return `rt.makeWandaValue(${node.value})`;
  }

  /**
   * Generates code from a Program AST node
   * @param {import("../parser/ast.js").Program} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitProgram(node, ns) {
    let code = "";
    for (let n of node.body) {
      code += `${this.emit(n, ns)};\n`;
    }

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
    return `rt.makeWandaValue(${"`" + node.value.slice(1, -1) + "`"})`;
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
      throw new ReferenceException(
        `Cannot access name ${name} before its definition`,
        srcloc
      );
    }

    // To make sure when compiling a variable definition the variable name hasn't already been accessed in the same scope
    if (!ns.has(name)) {
      ns.set(name, emittedName);
    }

    return emittedName;
  }

  /**
   * Emits an empty string because TypeAlias has no JavaScript equivalent
   * @param {import("../parser/parseTypeAnnotation.js").TypeAlias} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitTypeAlias(node, ns) {
    return "";
  }

  /**
   * Generates code from a VariableDeclaration AST node
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVariableDeclaration(node, ns) {
    const name = node.lhv.name;

    if (ns.has(name)) {
      throw new ReferenceException(
        `Name ${name} has already been accessed in the current namespace; cannot access name before its definition`,
        node.srcloc
      );
    }

    const translatedName = makeSymbol(name);

    ns.set(name, translatedName);

    return `var ${translatedName} = ${this.emit(node.expression, ns)};`;
  }
}
