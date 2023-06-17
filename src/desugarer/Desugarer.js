import { AST } from "../parser/ast.js";
import { TATypes } from "../parser/parseTypeAnnotation.js";
import { Visitor } from "../visitor/Visitor.js";

/**
 * @class
 * @desc Desugars the AST into core forms
 * @extends Visitor
 */
export class Desugarer extends Visitor {
  /**
   * Constructor
   * @param {AST} program
   */
  constructor(program) {
    super(program);
  }

  /**
   * Static constructor
   * @param {AST} program
   * @returns {Desugarer}
   */
  static new(program) {
    return new Desugarer(program);
  }

  /**
   * Desugars a FunctionDefinition node into a VariableDeclaration with lambda
   * @param {import("../parser/ast.js").FunctionDeclaration} node
   * @returns {import("../parser/ast.js").VariableDeclaration}
   */
  visitFunctionDeclaration(node) {
    const variadic = node.variadic;
    const lambda = AST.LambdaExpression(
      node.params,
      node.body,
      variadic,
      node.retType,
      node.srcloc
    );
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

    return AST.VariableDeclaration(node.name, lambda, node.srcloc, funcType);
  }
}
