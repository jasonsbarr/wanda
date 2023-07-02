import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { AST, ASTTypes } from "../parser/ast.js";
import { TATypes } from "../parser/parseTypeAnnotation.js";
import { Visitor } from "../visitor/Visitor.js";

/**
 * @class
 * @desc Desugars the typed AST into core forms
 * @extends Visitor
 */
export class Desugarer extends Visitor {
  /**
   * Constructor
   * @param {import("../typechecker/TypeChecker.js").TypedAST} program
   */
  constructor(program) {
    super(program);
  }

  /**
   * Static constructor
   * @param {import("../typechecker/TypeChecker.js").TypedAST} program
   * @returns {Desugarer}
   */
  static new(program) {
    return new Desugarer(program);
  }

  /**
   * Desugars a BinaryExpression into a CallExpression
   * @param {import("../parser/ast.js").BinaryExpression & {type: import("../typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").CallExpression & {type: import("../typechecker/types.js").Type}}
   */
  visitBinaryExpression(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);
    const func = AST.Symbol(Token.new(TokenTypes.Symbol, node.op, node.srcloc));

    return AST.CallExpression(func, [left, right], node.srcloc);
  }

  /**
   * Desugars a CondExpression into nested IfExpressions
   * @param {import("../parser/ast.js").CondExpression & {type: import(".node./typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").IfExpression & {type: import(".node./typechecker/types.js").Type}}
   */
  visitCondExpression(node) {
    const srcloc = node.srcloc;

    /**
     * Recursive helper to construct IfExpression from CondExpression
     * @param {import("../parser/ast.js").CondClause[]} clauses
     * @param {import("../parser/ast.js").IfExpression} accum
     */
    const condVisitHelper = (clauses, accum) => {
      if (clauses.length > 1) {
        const clause = clauses[0];
        accum = AST.IfExpression(
          clause.test,
          clause.expression,
          condVisitHelper(clauses.slice(1), accum),
          srcloc
        );

        return accum;
      } else if (clauses.length === 1) {
        const clause = clauses[0];
        const elseBranch = node.else;

        return AST.IfExpression(
          clause.test,
          clause.expression,
          elseBranch,
          srcloc
        );
      }
    };

    return condVisitHelper(node.clauses, {});
  }

  /**
   * Desugars a ConstantDeclaration node into a VariableDeclaration
   * @param {import("../parser/ast.js").ConstantDeclaration & {type: import("../typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").VariableDeclaration & {type: import("../typechecker/types.js").Type}}
   */
  visitConstantDeclaration(node) {
    return { ...node, kind: ASTTypes.VariableDeclaration };
  }

  /**
   * Desugars a FunctionDefinition node into a VariableDeclaration with lambda
   * @param {import("../parser/ast.js").FunctionDeclaration & {type: import("../typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").VariableDeclaration & {type: import("../typechecker/types.js").Type}}
   */
  visitFunctionDeclaration(node) {
    const variadic = node.variadic;
    // since it's TypedAST it has a type property
    const type = node.type;
    const lambda = AST.LambdaExpression(
      node.params,
      node.body,
      variadic,
      node.retType,
      node.srcloc
    );
    lambda.type = type;
    lambda.name = node.name.name;
    const paramTypes = node.params.map(
      (p) => p.typeAnnotation ?? { kind: TATypes.AnyLiteral }
    );
    const retType = node.retType ?? { kind: TATypes.AnyLiteral };
    const funcType = {
      kind: TATypes.Function,
      params: paramTypes,
      retType,
      variadic,
    };

    const varDecl = AST.VariableDeclaration(
      node.name,
      lambda,
      node.srcloc,
      funcType
    );

    varDecl.type = type;
    return varDecl;
  }

  /**
   *
   * @param {import("../parser/ast.js").UnaryExpression & {type: import("../typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").CallExpression & {type: import("../typechecker/types.js").Type}}
   */
  visitUnaryExpression(node) {
    const operand = this.visit(node.operand);

    return AST.CallExpression(
      AST.Symbol(Token.new(TokenTypes.Symbol, node.op, node.srcloc)),
      [operand],
      node.srcloc
    );
  }
}
