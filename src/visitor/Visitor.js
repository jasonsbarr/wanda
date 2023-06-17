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
      default:
        throw new SyntaxException(node.kind, node.srcloc);
    }
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
    const args = node.args.map(this.visit);
    return { ...node, func, args };
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
   * FunctionDeclaration node visitor
   * @param {import("../parser/ast.js").FunctionDeclaration} node
   * @returns {import("../parser/ast.js").FunctionDeclaration}
   */
  visitFunctionDeclaration(node) {
    const params = node.params.map(this.visit);
    /** @type {AST[]} */
    let body = [];

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, params, body };
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
    const params = node.params.map(this.visit);
    /** @type {AST[]} */
    let body = [];

    for (let expr of node.body) {
      body.push(this.visit(expr));
    }

    return { ...node, params, body };
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
}
