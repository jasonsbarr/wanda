import { AST, ASTTypes } from "../parser/ast.js";
import { Exception } from "../shared/exceptions.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { check } from "./check.js";
import { infer } from "./infer.js";

/**
 * @typedef {AST & {type: import("./types").Type}} TypedAST
 */
/**
 * @class TypeChecker
 * @desc Type checker for Wanda programming language (gradual types)
 */
export class TypeChecker {
  /**
   *
   * @param {AST} program
   * @param {TypeEnvironment} env
   */
  constructor(program, env) {
    this.program = program;
    this.env = env;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @param {TypeEnvironment} env
   * @returns {TypeChecker}
   */
  static new(program, env = TypeEnvironment.new()) {
    return new TypeChecker(program, env);
  }

  /**
   * Type checks an AST node
   * @param {AST} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  check(node = this.program, env = this.env) {
    switch (node.kind) {
      case ASTTypes.Program:
        return this.checkProgram(node, env);
      case ASTTypes.NumberLiteral:
        return this.checkNumber(node, env);
      case ASTTypes.StringLiteral:
        return this.checkString(node, env);
      case ASTTypes.BooleanLiteral:
        return this.checkBoolean(node, env);
      case ASTTypes.KeywordLiteral:
        return this.checkKeyword(node, env);
      case ASTTypes.NilLiteral:
        return this.checkKeyword(node, env);
      case ASTTypes.Symbol:
        return this.checkSymbol(node, env);
      case ASTTypes.CallExpression:
        return this.checkCallExpression(node, env);
      case ASTTypes.VariableDeclaration:
        return this.checkVariableDeclaration(node, env);
      case ASTTypes.SetExpression:
        return this.checkSetExpression(node, env);
      case ASTTypes.DoExpression:
        return this.checkDoExpression(node, env);
      default:
        throw new Exception(`Type checking not implemented for ${node.kind}`);
    }
  }

  /**
   * Type checks a boolean literal
   * @param {import("../parser/ast").BooleanLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkBoolean(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a call expression
   * @param {import("../parser/ast.js").CallExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkCallExpression(node, env) {
    // infer handles checking for argument types
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a do (block) expression
   * @param {import("../parser/ast.js").DoExpression} node
   * @param {TypeEnvironment} env
   * @return {TypedAST}
   */
  checkDoExpression(node, env) {
    for (let expr of node.body) {
      this.check(expr, env);
    }

    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a keyword literal
   * @param {import("../parser/ast").KeywordLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkKeyword(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a nil literal
   * @param {import("../parser/ast").NilLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkNil(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a number literal
   * @param {import("../parser/ast").NumberLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkNumber(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a Program node
   * @param {import("../parser/ast.js").Program} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkProgram(node, env) {
    let type;
    let i = 0;
    for (let expr of node.body) {
      if (i === node.body.length - 1) {
        const node = this.check(expr, env);
        type = node.type;
      } else {
        this.check(expr, env);
      }
    }

    return { ...node, type };
  }

  /**
   * Type checks a set expression
   * @param {import("../parser/ast.js").SetExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkSetExpression(node, env) {
    const nameType = env.getType(node.lhv.name);

    check(node.expression, nameType, env);

    return { ...node, type: nameType };
  }

  /**
   * Type checks a string literal
   * @param {import("../parser/ast").StringLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkString(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a symbol
   * @param {import("../parser/ast").Symbol} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkSymbol(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a variable declaration
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkVariableDeclaration(node, env) {
    if (node.typeAnnotation) {
      const annotType = Type.fromTypeAnnotation(node.typeAnnotation);
      check(node.expression, annotType, env);
      return { ...node, type: annotType };
    }

    return { ...node, type: infer(node, env) };
  }
}
