import { AST, ASTTypes } from "../parser/ast.js";
import { SyntaxException } from "../shared/exceptions.js";

/**
 * Abstract class to be inherited by other visitors
 */
export class Visitor {
  /**
   * Constructs a Visitor
   * @param {AST} program
   */
  constructor(program) {
    this.program = program;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @returns {Visitor}
   */
  static new(program) {
    return new Visitor(program);
  }

  /**
   * Visitor dispatch method
   * @param {AST} node
   * @returns {AST}
   */
  visit(node = this.program) {
    switch (node.kind) {
      case ASTTypes.Program:
        return this.visitProgram(node);
      case ASTTypes.NumberLiteral:
        return this.visitNumberLiteral(node);
      case ASTTypes.StringLiteral:
        return this.visitStringLiteral(node);
      case ASTTypes.BooleanLiteral:
        return this.visitBooleanLiteral(node);
      case ASTTypes.KeywordLiteral:
        return this.visitKeywordLiteral(node);
      case ASTTypes.NilLiteral:
        return this.visitNilLiteral(node);
      case ASTTypes.Symbol:
        return this.visitSymbol(node);
      case ASTTypes.CallExpression:
        return this.visitCallExpression(node);
      case ASTTypes.VariableDeclaration:
        return this.visitVariableDeclaration(node);
      case ASTTypes.SetExpression:
        return this.visitSetExpression(node);
      case ASTTypes.DoExpression:
        return this.visitDoExpression(node);
      case ASTTypes.TypeAlias:
        return this.visitTypeAlias(node);
      case ASTTypes.VectorLiteral:
        return this.visitVectorLiteral(node);
      case ASTTypes.VectorPattern:
        return this.visitVectorPattern(node);
      case ASTTypes.RecordLiteral:
        return this.visitRecordLiteral(node);
      case ASTTypes.RecordPattern:
        return this.visitRecordPattern(node);
      case ASTTypes.MemberExpression:
        return this.visitMemberExpression(node);
      case ASTTypes.Param:
        return this.visitParam(node);
      case ASTTypes.FunctionDeclaration:
        return this.visitFunctionDeclaration(node);
      case ASTTypes.LambdaExpression:
        return this.visitLambdaExpression(node);
      case ASTTypes.ConstantDeclaration:
        return this.visitConstantDeclaration(node);
      case ASTTypes.AsExpression:
        return this.visitAsExpression(node);
      case ASTTypes.IfExpression:
        return this.visitIfExpression(node);
      case ASTTypes.CondExpression:
        return this.visitCondExpression(node);
      case ASTTypes.WhenExpression:
        return this.visitWhenExpression(node);
      case ASTTypes.UnaryExpression:
        return this.visitUnaryExpression(node);
      case ASTTypes.BinaryExpression:
        return this.visitBinaryExpression(node);
      case ASTTypes.LogicalExpression:
        return this.visitLogicalExpression(node);
      case ASTTypes.ForExpression:
        return this.visitForExpression(node);
      case ASTTypes.Module:
        return this.visitModule(node);
      case ASTTypes.Import:
        return this.visitImport(node);
      default:
        throw new SyntaxException(node.kind, node.srcloc);
    }
  }

  /**
   * Visits an AsExpression node
   * @param {import("../parser/ast.js").AsExpression} node
   * @returns {import("../parser/ast.js").AsExpression}
   */
  visitAsExpression(node) {
    const expression = this.visit(node.expression);
    return { ...node, expression };
  }

  /**
   * Visits a BinaryExpression node
   * @param {import("../parser/ast.js").BinaryExpression} node
   * @returns {import("../parser/ast.js").BinaryExpression}
   */
  visitBinaryExpression(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    return { ...node, left, right };
  }

  /**
   * BooleanLiteral node visitor
   * @param {import("../parser/ast").BooleanLiteral} node
   * @returns {import("../parser/ast").BooleanLiteral}
   */
  visitBooleanLiteral(node) {
    return node;
  }

  /**
   * CallExpression node visitor
   * @param {import("../parser/ast").CallExpression} node
   * @returns {import("../parser/ast").CallExpression}
   */
  visitCallExpression(node) {
    const func = this.visit(node.func);
    const args = node.args.map(this.visit.bind(this));
    return { ...node, func, args };
  }

  /**
   * CondExpression node visitor
   * @param {import("../parser/ast.js").CondExpression} node
   * @returns {import("../parser/ast.js").CondExpression}
   */
  visitCondExpression(node) {
    /** @type {import("../parser/ast.js").CondClause[]} */
    let clauses = [];

    for (let clause of node.clauses) {
      const test = this.visit(clause.test);
      const expression = this.visit(clause.expression);

      clauses.push({ test, expression });
    }

    const elseBranch = this.visit(node.else);

    return { ...node, clauses, else: elseBranch };
  }

  /**
   * VariableDeclaration node visitor
   * @param {import("../parser/ast").ConstantDeclaration} node
   * @returns {import("../parser/ast").ConstantDeclaration}
   */
  visitConstantDeclaration(node) {
    const lhv = this.visit(node.lhv);
    const expression = this.visit(node.expression);
    return { ...node, lhv, expression };
  }

  /**
   * DoExpression node visitor
   * @param {import("../parser/ast").DoExpression} node
   * @returns {import("../parser/ast").DoExpression}
   */
  visitDoExpression(node) {
    let body = [];

    for (let n of node.body) {
      body.push(this.visit(n));
    }

    return { ...node, body };
  }

  /**
   * ForExpression node visitor
   * @param {import("../parser/ast.js").ForExpression} node
   * @returns {import("../parser/ast.js").ForExpression}
   */
  visitForExpression(node) {
    const op = this.visit(node.op);

    /** @type {import("../parser/ast.js").ForVar[]} */
    let vars = [];

    for (let nodevar of node.vars) {
      const v = this.visit(nodevar.var);
      const initializer = this.visit(nodevar.initializer);

      vars.push({ var: v, initializer });
    }

    /** @type {AST[]} */
    let body = [];

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, op, vars, body };
  }

  /**
   * FunctionDeclaration node visitor
   * @param {import("../parser/ast.js").FunctionDeclaration} node
   * @returns {import("../parser/ast.js").FunctionDeclaration}
   */
  visitFunctionDeclaration(node) {
    const params = node.params.map(this.visit.bind(this));
    /** @type {AST[]} */
    let body = [];

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, params, body };
  }

  /**
   * IfExpression node visitor
   * @param {import("../parser/ast.js").IfExpression} node
   * @returns {import("../parser/ast.js").IfExpression}
   */
  visitIfExpression(node) {
    const test = this.visit(node.test);
    const then = this.visit(node.then);
    const elseBranch = this.visit(node.else);

    return { ...node, test, then, else: elseBranch };
  }

  /**
   * Import node visitor
   * @param {import("../parser/ast.js").Import} node
   * @returns {import("../parser/ast.js").Import}
   */
  visitImport(node) {
    return node;
  }

  /**
   * KeywordLiteral node visitor
   * @param {import("../parser/ast").KeywordLiteral} node
   * @returns {import("../parser/ast").KeywordLiteral}
   */
  visitKeywordLiteral(node) {
    return node;
  }

  /**
   * LambdaExpression node visitor
   * @param {import("../parser/ast.js").LambdaExpression} node
   * @returns {import("../parser/ast.js").LambdaExpression}
   */
  visitLambdaExpression(node) {
    const params = node.params.map(this.visit.bind(this));
    /** @type {AST[]} */
    let body = [];

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, params, body };
  }

  /**
   * LogicalExpression node visitor
   * @param {import("../parser/ast.js").LogicalExpression} node
   * @returns {import("../parser/ast.js").LogicalExpression}
   */
  visitLogicalExpression(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    return { ...node, left, right };
  }

  /**
   * MemberExpression node visitor
   * @param {import("../reader/read").MemberExpression} node
   * @returns {import("../parser/ast").MemberExpression}
   */
  visitMemberExpression(node) {
    const object = this.visit(node.object);
    const property = this.visit(node.property);
    return { ...node, object, property };
  }

  /**
   * Module node visitor
   * @param {import("../parser/ast.js").Module} node
   * @returns {import("../parser/ast.js").Module}
   */
  visitModule(node) {
    return node;
  }

  /**
   * NilLiteral node visitor
   * @param {import("../parser/ast").NilLiteral} node
   * @returns {import("../parser/ast").NilLiteral}
   */
  visitNilLiteral(node) {
    return node;
  }

  /**
   * NumberLiteral node visitor
   * @param {import("../parser/ast").NumberLiteral} node
   * @returns {import("../parser/ast").NumberLiteral}
   */
  visitNumberLiteral(node) {
    return node;
  }

  /**
   * Param node visitor
   * @param {import("../parser/ast.js").Param} node
   * @returns {import("../parser/ast.js").Param}
   */
  visitParam(node) {
    return node;
  }

  /**
   * Program node visitor
   * @param {import("../parser/ast").Program} node
   * @returns {import("../parser/ast").Program}
   */
  visitProgram(node) {
    let body = [];
    for (let n of node.body) {
      body.push(this.visit(n));
    }

    return { ...node, body };
  }

  /**
   * RecordLiteral node visitor
   * @param {import("../parser/ast").RecordLiteral} node
   * @returns {import("../parser/ast").RecordLiteral}
   */
  visitRecordLiteral(node) {
    return node;
  }

  /**
   * RecordPattern node visitor
   * @param {import("../parser/ast").RecordPattern} node
   * @returns {import("../parser/ast").RecordPattern}
   */
  visitRecordPattern(node) {
    return node;
  }

  /**
   * SetExpression node visitor
   * @param {import("../parser/ast").SetExpression} node
   * @returns {import("../parser/ast").SetExpression}
   */
  visitSetExpression(node) {
    const lhv = this.visit(node.lhv);
    const expression = this.visit(node.expression);
    return { ...node, lhv, expression };
  }

  /**
   * StringLiteral node visitor
   * @param {import("../parser/ast").StringLiteral} node
   * @returns {import("../parser/ast").StringLiteral}
   */
  visitStringLiteral(node) {
    return node;
  }

  /**
   * Symbol node visitor
   * @param {import("../parser/ast").Symbol} node
   * @returns {import("../parser/ast").Symbol}
   */
  visitSymbol(node) {
    return node;
  }

  /**
   * TypeAlias node visitor
   * @param {import("../parser/ast").TypeAlias} node
   * @returns {import("../parser/ast").TypeAlias}
   */
  visitTypeAlias(node) {
    return node;
  }

  /**
   * UnaryExpression node visitor
   * @param {import("../parser/ast.js").UnaryExpression} node
   * @returns {import("../parser/ast.js").UnaryExpression}
   */
  visitUnaryExpression(node) {
    const operand = this.visit(node.operand);
    return { ...node, operand };
  }

  /**
   * VariableDeclaration node visitor
   * @param {import("../parser/ast").VariableDeclaration} node
   * @returns {import("../parser/ast").VariableDeclaration}
   */
  visitVariableDeclaration(node) {
    const lhv = this.visit(node.lhv);
    const expression = this.visit(node.expression);
    return { ...node, lhv, expression };
  }

  /**
   * VectorLiteral node visitor
   * @param {import("../parser/ast").VectorLiteral} node
   * @returns {import("../parser/ast").VectorLiteral}
   */
  visitVectorLiteral(node) {
    return node;
  }

  /**
   * VectorPattern node visitor
   * @param {import("../parser/ast").VectorPattern} node
   * @returns {import("../parser/ast").VectorPattern}
   */
  visitVectorPattern(node) {
    return node;
  }

  /**
   * WhenExpression node visitor
   * @param {import("../parser/ast.js").WhenExpression} node
   * @returns {import("../parser/ast.js").WhenExpression}
   */
  visitWhenExpression(node) {
    /** @type {AST[]} */
    let body = [];
    const test = this.visit(node.test);

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, test, body };
  }
}
