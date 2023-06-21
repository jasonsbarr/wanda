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
   * Desugars a ConstantDeclaration node into a VariableDeclaration
   * @param {import("../parser/ast.js").ConstantDeclaration && {type: import("../typechecker/types.js").Type}} node
   * @returns {import("../parser/ast.js").ConstantDeclaration && {type: import("../typechecker/types.js").Type}} node
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
}
