import { ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions.js";

/**
 * @typedef {import("./ast.js").AST} AST
 */

/**
 * Print the indent spaces
 * @param {number} indent
 * @returns {string}
 */
const prIndent = (indent) => " ".repeat(indent);

/**
 * @class ASTPrinter
 * @desc Pretty printer for AST
 * @prop {import("../parser/ast").Program} program
 */
class ASTPrinter {
  /**
   * Constructor for AST Printer
   * @param {import("../parser/ast").Program} program
   */
  constructor(program) {
    this.program = program;
  }

  /**
   * Static constructor for ASTPrinter
   * @param {import("../parser/ast").Program} program
   * @returns {ASTPrinter}
   */
  static new(program) {
    return new ASTPrinter(program);
  }

  /**
   * Dispatcher for printer visitor
   * @param {AST} node
   * @param {number} [indent=0]
   * @returns {string}
   */
  print(node = this.program, indent = 0) {
    switch (node.kind) {
      case ASTTypes.Program:
        return this.printProgram(node, indent);
      case ASTTypes.NumberLiteral:
      case ASTTypes.StringLiteral:
      case ASTTypes.BooleanLiteral:
      case ASTTypes.KeywordLiteral:
      case ASTTypes.NilLiteral:
        return this.printPrimitive(node, indent);
      case ASTTypes.Symbol:
        return this.printSymbol(node, indent);
      case ASTTypes.CallExpression:
        return this.printCallExpression(node, indent);
      case ASTTypes.VariableDeclaration:
        return this.printVariableDeclaration(node, indent);
      case ASTTypes.SetExpression:
        return this.printSetExpression(node, indent);
      case ASTTypes.DoExpression:
        return this.printDoExpression(node, indent);
      case ASTTypes.TypeAlias:
        return this.printTypeAlias(node, indent);
      case ASTTypes.RecordLiteral:
        return this.printRecordLiteral(node, indent);
      case ASTTypes.RecordPattern:
        return this.printRecordPattern(node, indent);
      case ASTTypes.VectorLiteral:
        return this.printVectorLiteral(node, indent);
      case ASTTypes.VectorPattern:
        return this.printVectorPattern(node, indent);
      case ASTTypes.MemberExpression:
        return this.printMemberExpression(node, indent);
      case ASTTypes.FunctionDeclaration:
        return this.printFunctionDeclaration(node, indent);
      case ASTTypes.LambdaExpression:
        return this.printLambdaExpression(node, indent);
      case ASTTypes.ConstantDeclaration:
        return this.printConstantDeclaration(node, indent);
      case ASTTypes.AsExpression:
        return this.printAsExpression(node, indent);
      case ASTTypes.IfExpression:
        return this.printIfExpression(node, indent);
      case ASTTypes.CondExpression:
        return this.printCondExpression(node, indent);
      case ASTTypes.WhenExpression:
        return this.printWhenExpression(node, indent);
      case ASTTypes.BinaryExpression:
        return this.printBinaryExpression(node, indent);
      case ASTTypes.LogicalExpression:
        return this.printLogicalExpression(node, indent);
      case ASTTypes.UnaryExpression:
        return this.printUnaryExpression(node, indent);
      case ASTTypes.ForExpression:
        return this.printForExpression(node, indent);
      default:
        throw new Exception(`Unknown AST type ${node.kind} to print`);
    }
  }

  /**
   * Prints the expression of an AsExpression node
   * @param {import("../parser/ast.js").AsExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printAsExpression(node, indent) {
    return this.print(node.expression, indent);
  }

  /**
   * Prints a BinaryExpression AST node
   * @param {import("../parser/ast.js").BinaryExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printBinaryExpression(node, indent) {
    let prStr = `${prIndent(indent)}BinaryExpression:\n`;
    prStr += `${prIndent(indent + 2)}Left:\n`;
    prStr += this.print(node.left, indent + 4) + "\n";
    prStr += `${prIndent(indent + 2)}Operator:\n`;
    prStr += `${prIndent(indent + 4)}${node.op}\n`;
    prStr += `${prIndent(indent + 2)}Right:\n`;
    prStr += this.print(node.right, indent + 4) + "\n";

    return prStr;
  }

  /**
   * Prints a CallExpression node
   * @param {import("../parser/ast.js").CallExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printCallExpression(node, indent) {
    let prStr = `${prIndent(indent)}CallExpression\n`;
    prStr += `${prIndent(indent + 2)}Func:\n${this.print(
      node.func,
      indent + 4
    )}\n`;
    prStr += `${prIndent(indent + 2)}Args:\n`;

    let i = 0;
    for (let arg of node.args) {
      prStr += this.print(arg, indent + 4);
      prStr += i === node.args.length - 1 ? "" : "\n";
      i++;
    }

    return prStr;
  }

  /**
   * Prints a CondExpression AST node
   * @param {import("../parser/ast.js").CondExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printCondExpression(node, indent) {
    let prStr = `${prIndent(indent)}CondExpression:\n`;

    for (let clause of node.clauses) {
      prStr += `${prIndent(indent + 2)}Test:\n`;
      prStr += this.print(clause.test, indent + 4) + "\n";
      prStr += `${prIndent(indent + 2)}Expression:\n`;
      prStr += this.print(clause.expression, indent + 4) + "\n";
    }

    prStr += `${prIndent(indent + 2)}Else:\n`;
    prStr += this.print(node.else, indent + 4) + "\n";

    return prStr;
  }

  /**
   * Prints ConstantDeclaration node
   * @param {import("../parser/ast.js").ConstantDeclaration} node
   * @param {number} indent
   * @returns {string}
   */
  printConstantDeclaration(node, indent) {
    let prStr = `${prIndent(indent)}ConstantDeclaration:\n`;
    prStr += `${this.print(node.lhv, indent + 2)}\n`;
    prStr += `${this.print(node.expression, indent + 2)}`;
    return prStr;
  }

  /**
   * Prints a DoExpression node
   * @param {import("../parser/ast.js").DoExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printDoExpression(node, indent) {
    let prStr = `${prIndent(indent)}DoExpression:\n`;

    let i = 0;
    for (let expr of node.body) {
      prStr += `${this.print(expr, indent + 2)}`;
      prStr += i === node.body.length - 1 ? "" : "\n";
      i++;
    }

    return prStr;
  }

  /**
   * Prints a ForExpression node
   * @param {import("../parser/ast.js").ForExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printForExpression(node, indent) {
    let prStr = `${prIndent(indent)}ForExpression:\n`;
    prStr += `${prIndent(indent + 2)}Operator:\n`;
    prStr += ` ${this.print(node.op, indent + 4)}\n`;
    prStr += `${prIndent(indent + 2)}Vars:\n`;

    for (let nodevar of node.vars) {
      prStr += `${prIndent(indent + 4)}Var: ${this.print(nodevar.var, 0)}\n`;
      prStr += `${prIndent(indent + 4)}Init: ${this.print(
        nodevar.initializer,
        0
      )}\n`;
    }

    prStr += `${prIndent(indent + 2)}Body:\n`;

    for (let expr of node.body) {
      prStr += this.print(expr, indent + 4) + "\n";
    }

    return prStr;
  }

  /**
   * Prints a FunctionDeclaration node
   * @param {import("../parser/ast.js").FunctionDeclaration} node
   * @param {number} indent
   * @returns {string}
   */
  printFunctionDeclaration(node, indent) {
    let prStr = `${prIndent(indent)}FunctionDeclaration:\n`;
    prStr += `${prIndent(indent + 2)}Name: ${node.name.name}\n`;
    prStr += `${prIndent(indent + 2)}Params:\n`;

    for (let param of node.params) {
      prStr += this.print(param.name, indent + 4) + "\n";
    }

    prStr += `${prIndent(indent + 2)}Body:\n`;

    for (let expr of node.body) {
      prStr += this.print(expr, indent + 4) + "\n";
    }

    return prStr;
  }

  /**
   * Prints an IfExpression AST node
   * @param {import("../parser/ast.js").IfExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printIfExpression(node, indent) {
    let prStr = `${prIndent(indent)}IfExpression:\n`;
    prStr += `${prIndent(indent + 2)}Test:\n`;
    prStr += this.print(node.test, indent + 4) + "\n";
    prStr += `${prIndent(indent + 2)}Then:\n` + "\n";
    prStr += this.print(node.then, indent + 4) + "\n";
    prStr += `${prIndent(indent + 2)}Else:\n`;
    prStr += this.print(node.else, indent + 4) + "\n";

    return prStr;
  }

  /**
   * Prints a LambdaExpression node
   * @param {import("../parser/ast.js").LambdaExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printLambdaExpression(node, indent) {
    let prStr = `${prIndent(indent)}LambdaExpression:\n`;
    prStr += `${prIndent(indent + 2)}Params:\n`;

    for (let param of node.params) {
      prStr += this.print(param.name, indent + 4) + "\n";
    }

    prStr += `${prIndent(indent + 2)}Body:\n`;

    for (let expr of node.body) {
      prStr += this.print(expr, indent + 4) + "\n";
    }

    return prStr;
  }

  /**
   * Prints a LogicalExpression AST node
   * @param {import("../parser/ast.js").LogicalExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printLogicalExpression(node, indent) {
    let prStr = `${prIndent(indent)}LogicalExpression:\n`;
    prStr += `${prIndent(indent + 2)}Left:\n`;
    prStr += this.print(node.left, indent + 4) + "\n";
    prStr += `${prIndent(indent + 2)}Operator:\n`;
    prStr += `${prIndent(indent + 4)}${node.op}\n`;
    prStr += `${prIndent(indent + 2)}Right:\n`;
    prStr += this.print(node.right, indent + 4) + "\n";

    return prStr;
  }

  /**
   * Prints a MemberExpression node
   * @param {import("../parser/ast.js").MemberExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printMemberExpression(node, indent) {
    let prStr = `${prIndent(indent)}MemberExpression:`;
    prStr += `${prIndent(indent + 2)}Object:`;
    prStr += `${this.print(node.object, indent + 4)}`;
    prStr += `${prIndent(indent + 2)}Property:`;
    prStr += `${this.print(node.property, indent + 4)}`;

    return prStr;
  }

  /**
   * Prints a primitive node
   * @param {import("../parser/ast.js").Primitive} node
   * @param {number} indent
   * @returns {string}
   */
  printPrimitive(node, indent) {
    return `${prIndent(indent)}${node.kind}: ${
      node.kind === "NilLiteral" ? "nil" : node.value
    }`;
  }

  /**
   * Prints Program node
   * @param {import("../parser/ast").Program} node
   * @param {number} indent
   * @returns {string}
   */
  printProgram(node, indent) {
    let pStr = "";

    for (let n of node.body) {
      pStr += this.print(n, indent);
      +"\n";
    }

    return pStr;
  }

  /**
   * Prints RecordLiteral node
   * @param {import("../parser/ast.js").RecordLiteral} node
   * @param {number} indent
   * @returns {string}
   */
  printRecordLiteral(node, indent) {
    let prStr = `${prIndent(indent)}RecordLiteral:`;
    prStr += `${prIndent(indent + 2)}Properties:`;

    for (let prop of node.properties) {
      prStr += `${this.print(prop.key, indent + 4)}`;
      prStr += `${this.print(prop.value, indent + 4)}`;
    }

    return prStr;
  }

  /**
   * Prints a RecordPattern node
   * @param {import("../parser/ast.js").RecordPattern} node
   * @param {number} indent
   * @returns {string}
   */
  printRecordPattern(node, indent) {
    return `${prIndent(indent)}${node.properties
      .map((p) => p.name)
      .join(", ")}`;
  }

  /**
   * Prints SetExpression node
   * @param {import("../parser/ast.js").SetExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printSetExpression(node, indent) {
    let prStr = `${prIndent(indent)}SetExpression:\n`;
    prStr += `${this.print(node.lhv, indent + 2)}\n`;
    prStr += `${this.print(node.expression, indent + 2)}`;
    return prStr;
  }

  /**
   * Prints Symbol node
   * @param {import("../parser/ast").Symbol} node
   * @param {number} indent
   */
  printSymbol(node, indent) {
    return `${prIndent(indent)}Symbol: ${node.name}`;
  }

  /**
   * Emits empty string for TypeAlias node
   * @param {import("../parser/parseTypeAnnotation.js").TypeAlias} node
   * @param {number} indent
   * @returns {string}
   */
  printTypeAlias(node, indent) {
    return "";
  }

  /**
   * Prints a UnaryExpression AST node
   * @param {import("../parser/ast.js").UnaryExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printUnaryExpression(node, indent) {
    let prStr = `${prIndent(indent)}UnaryExpression:\n`;
    prStr += `${prIndent(indent + 2)}Operator:\n`;
    prStr += `${prIndent(indent + 4)}${node.op}\n`;
    prStr += `${prIndent(indent + 2)}Operand:\n`;
    prStr += this.print(node.operand, indent + 4) + "\n";

    return prStr;
  }

  /**
   * Prints VariableDeclaration node
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {number} indent
   * @returns {string}
   */
  printVariableDeclaration(node, indent) {
    let prStr = `${prIndent(indent)}VariableDeclaration:\n`;
    prStr += `${this.print(node.lhv, indent + 2)}\n`;
    prStr += `${this.print(node.expression, indent + 2)}`;
    return prStr;
  }

  /**
   * Prints a VectorLiteral node
   * @param {import("../parser/ast.js").VectorLiteral} node
   * @param {number} indent
   * @returns {string}
   */
  printVectorLiteral(node, indent) {
    let prStr = `${prIndent(indent)}VectorLiteral:`;

    for (let mem of node.members) {
      prStr += `${this.print(mem, indent + 2)}`;
    }

    return prStr;
  }

  /**
   * Prints a RecordPattern node
   * @param {import("../parser/ast.js").VectorPattern} node
   * @param {import { narrow } from '../typechecker/narrow';
number} indent
   * @returns {string}
   */
  printVectorPattern(node, indent) {
    return `${prIndent(indent)}${node.members.map((p) => p.name).join(", ")}`;
  }

  /**
   * Prints a WhenExpression AST node
   * @param {import("../parser/ast.js").WhenExpression} node
   * @param {number} indent
   * @returns {string}
   */
  printWhenExpression(node, indent) {
    let prStr = `${prIndent(indent)}WhenExpression:\n`;
    prStr += `${prIndent(indent + 2)}Test:\n`;
    prStr += this.print(node.test, indent + 4) + "\n";
    prStr += `${prIndent(indent + 2)}Body:`;

    for (let expr of node.body) {
      prStr += this.print(expr, indent + 4) + "\n";
    }

    return prStr;
  }
}

/**
 * Pretty prints an AST
 * @param {AST} ast
 * @returns {string}
 */
export const printAST = (ast) => ASTPrinter.new(ast).print();
