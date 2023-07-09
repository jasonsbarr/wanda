import { AST, ASTTypes } from "../parser/ast.js";
import { Visitor } from "../visitor/Visitor.js";

/**
 * Swaps the last expression in the node body with expr
 * @param {{body: AST[]}} node
 * @param {AST} expr
 */
const swapLastExpr = (node, expr) => {
  node.body[node.body.length - 1] = expr;
};

/**
 * Checks an IfExpression node to see if either branch is tail recursive
 * @param {import("../parser/ast.js").IfExpression} node
 * @returns {import("../parser/ast.js").IfExpression & {isTailRec: boolean}}
 */
const checkIfExpression = (node, name, visitor) => {
  let isTailRec = false;

  if (
    node.then.kind === ASTTypes.CallExpression &&
    node.then.func.name === name
  ) {
    node.then = visitor.visitCallExpression(node.then, true);
    isTailRec = true;
  }

  if (
    node.else.kind === ASTTypes.CallExpression &&
    node.else.func.name === name
  ) {
    node.else = visitor.visitCallExpression(node.else, true);
    isTailRec = true;
  }

  if (node.then.kind === ASTTypes.IfExpression) {
    node.then = checkIfExpression(node.then, name, visitor);
    if (node.then.isTailRec) {
      isTailRec = true;
    }
  }

  if (node.else.kind === ASTTypes.IfExpression) {
    node.else = checkIfExpression(node.else, name, visitor);
    if (node.else.isTailRec) {
      isTailRec = true;
    }
  }

  return { ...node, isTailRec };
};

/**
 * Handles TCO transformation on ANF syntax tree
 * @class
 */
class TCOTransformer extends Visitor {
  /**
   * Constructor
   * @param {import("../parser/ast.js").Program} program
   */
  constructor(program) {
    super(program);
  }

  /**
   * Static constructor
   * @param {import("../parser/ast.js").Program} program
   * @returns {import("../parser/ast.js").Program}
   */
  static new(program) {
    return new TCOTransformer(program);
  }

  visitCallExpression(node, isTailRec = false) {
    if (isTailRec) {
      return { ...node, isTailRec: true };
    }

    return { ...node, isTailRec: false };
  }

  /**
   * Checks the last expression of the body for tail recursion
   * @param {import("../parser/ast.js").LambdaExpression} node
   * @returns {import("../parser/ast.js").LambdaExpression & {isTailRec: boolean}}
   */
  visitLambdaExpression(node) {
    const name = node.name ?? "";
    const lastExpr = node.body[node.body.length - 1];

    // Could be tail recursive: CallExpression, DoExpression, IfExpression, LogicalExpression
    if (lastExpr.kind === ASTTypes.CallExpression) {
      // should only work if func is symbol
      if (lastExpr.func.name === name) {
        const newCall = this.visitCallExpression(lastExpr, true);
        swapLastExpr(node, newCall);
        return { ...node, isTailRec: true };
      }

      lastExpr.isTailRec = false;
      return { ...node, isTailRec: false };
    } else if (lastExpr.kind === ASTTypes.DoExpression) {
      const lastBodyExpr = lastExpr.body[lastExpr.body.length - 1];

      if (
        lastBodyExpr.kind === ASTTypes.CallExpression &&
        lastBodyExpr.func.name === name
      ) {
        const newCall = this.visitCallExpression(lastBodyExpr, true);
        swapLastExpr(lastExpr, newCall);
        return { ...node, isTailRec: true };
      } else if (lastBodyExpr.kind === ASTTypes.IfExpression) {
        const newIf = checkIfExpression(lastBodyExpr, name, this);
        swapLastExpr(lastExpr, newIf);
        return { ...node, isTailRec: newIf.isTailRec };
      }

      lastExpr.isTailRec = false;
      return { ...node, isTailRec: false };
    } else if (lastExpr.kind === ASTTypes.IfExpression) {
      let newIf = checkIfExpression(lastExpr, name, this);
      swapLastExpr(node, newIf);
      return { ...node, isTailRec: newIf.isTailRec };
    } else if (lastExpr.kind === ASTTypes.LogicalExpression) {
      let isTailRec = false;
      if (
        lastExpr.left.kind === ASTTypes.CallExpression &&
        lastExpr.left.func.name === name
      ) {
        lastExpr.left = this.visitCallExpression(lastExpr.left, true);
        isTailRec = true;
      }

      if (
        lastExpr.right.kind === ASTTypes.CallExpression &&
        lastExpr.right.func.name === name
      ) {
        lastExpr.right = this.visitCallExpression(lastExpr.right, true);
        isTailRec = true;
      }

      return { ...node, isTailRec };
    }

    return { ...node, isTailRec: false };
  }
}

export const tco = (program) => TCOTransformer.new(program).visit();
