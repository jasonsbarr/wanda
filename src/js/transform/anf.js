import { AST, ASTTypes } from "../parser/ast.js";
import { isPrimitive } from "../parser/utils.js";
import { Exception } from "../shared/exceptions.js";
import { makeGenSym } from "../runtime/makeSymbol.js";
import { Token } from "../lexer/Token.js";
import { TokenTypes } from "../lexer/TokenTypes.js";

/**
 * Transforms a node to A Normal Form
 * @param {AST} node
 * @returns {AST}
 */
export const anf = (node) => {
  switch (node.kind) {
    case ASTTypes.Program:
      return transformProgram(node);
    case ASTTypes.NumberLiteral:
    case ASTTypes.StringLiteral:
    case ASTTypes.BooleanLiteral:
    case ASTTypes.KeywordLiteral:
    case ASTTypes.NilLiteral:
    case ASTTypes.Symbol:
      return node;
    case ASTTypes.CallExpression:
      return transformCallExpression(node);
    case ASTTypes.LambdaExpression:
      return transformLambdaExpression(node);
    case ASTTypes.VariableDeclaration:
      return transformVariableDeclaration(node);
    case ASTTypes.SetExpression:
      return transformSetExpression(node);
    case ASTTypes.TypeAlias:
      // ignore
      return node;
    case ASTTypes.VectorLiteral:
      return transformVectorLiteral(node);
    case ASTTypes.RecordLiteral:
      return transformRecordLiteral(node);
    case ASTTypes.MemberExpression:
      return transformMemberExpression(node);
    case ASTTypes.DoExpression:
      return transformDoExpression(node);
    case ASTTypes.AsExpression:
      return transformAsExpression(node);
    case ASTTypes.IfExpression:
      return transformIfExpression(node);
    case ASTTypes.WhenExpression:
      return transformWhenExpression(node);
    case ASTTypes.LogicalExpression:
      return transformLogicalExpression(node);
    default:
      throw new Exception(`Unhandled node kind: ${node.kind}`);
  }
};

/**
 * Transforms a Program node
 * @param {import("../parser/ast").Program} node
 * @returns {import("../parser/ast").Program}
 */
const transformProgram = (node) => {
  let body = node.body.flatMap(anf);

  return { ...node, body };
};

/**
 * Transforms a CallExpression node
 * @param {import("../parser/ast").CallExpression} node
 * @returns {AST[]}
 */
const transformCallExpression = (node) => {
  // create an array for unnested expressions from the call expression
  let unnestedExprs = [];
  // transform the function
  let func = anf(node.func);

  // if func has been transformed into an array, get the actual function
  // which will be the last expression in the array from the transformer
  if (Array.isArray(func)) {
    func = func.pop();
    // add the unnested expressions to our unnested expressions array
    unnestedExprs.concat(func);
  }

  let args = [];

  for (let arg of node.args) {
    // if it's a call expression, we need to unnest any subexpressions from
    // the arguments to the sub-call expression and create a new call expr
    if (arg.kind === ASTTypes.CallExpression) {
      // we'll need unnested arguments for the subcall
      let subArgs = [];
      for (let a of arg.args) {
        // primitives and symbols are already in ANF
        if (isPrimitiveOrSymbol(a)) {
          subArgs.push(a);
          // otherwise, we need to unnest the expression and bind the result to a new
          // variable, then replace the expression in the call body with that variable
        } else {
          const freshLet = AST.VariableDeclaration(
            createFreshSymbol(a.srcloc),
            a,
            a.srcloc,
            null
          );
          const transformedLet = transformVariableDeclaration(freshLet);
          // the actual declaration will always be the last node in the array
          // we're going to need to add this to the unnested expressions
          // for the parent call expression, so we don't pop it
          const actualLet = transformedLet[transformedLet.length - 1];

          // add the unnested expressions from the VariableDeclaration
          // to the unnested expressions from the call expression
          unnestedExprs = unnestedExprs.concat(transformedLet);
          // add the variable that's been assigned to
          // its relative place in the subcall args
          subArgs.push(actualLet.lhv);
        }
      }

      // create a new CallExpression with unnested sub-arguments
      let subCall = AST.CallExpression(arg.func, subArgs, arg.srcloc);
      // create a fresh variable symbol
      const callSymbol = createFreshSymbol(subCall.srcloc);
      // assign the result of the unnested call expression to the fresh variable
      const callLet = AST.VariableDeclaration(
        callSymbol,
        subCall,
        subCall.srcloc
      );

      // add the assignment to the unnested expressions
      unnestedExprs.push(callLet);
      // the argument to the parent call expression should now be the fresh variable
      arg = callSymbol;
    } else {
      arg = anf(arg);
    }

    if (Array.isArray(arg)) {
      // the actual arg will always be the last element in this array, the rest
      // are all unnested expressions and should be concatenated to that array
      args.push(arg.pop());
      unnestedExprs = unnestedExprs.concat(arg);
    } else {
      // the anfed arg is a single node
      args.push(arg);
    }
  }

  const newCallExpr = AST.CallExpression(func, args, node.srcloc);

  return [...unnestedExprs, newCallExpr];
};

/**
 * Transforms a LambdaExpression body
 * @param {import("../parser/ast").LambdaExpression} node
 * @returns {import("../parser/ast").LambdaExpression}
 */
const transformLambdaExpression = (node) => {
  const body = node.body.flatMap(anf);
  return { ...node, body };
};

/**
 * Transforms a VariableDeclaration node
 * @param {import("../parser/ast").VariableDeclaration} node
 * @returns {AST[]}
 */
const transformVariableDeclaration = (node) => {
  let unnestedExprs = [];
  const anfedExpr = anf(node.expression);
  let anfedDecl;
  let expression;

  if (Array.isArray(anfedExpr)) {
    expression = anfedExpr.pop();
    anfedDecl = { ...node, expression };

    unnestedExprs = unnestedExprs.concat(anfedExpr);
  } else {
    expression = anfedExpr;
    anfedDecl = { ...node, expression };
  }

  if (node.lhv.kind === ASTTypes.VectorPattern) {
    // is vector pattern destructuring
    /** @type {import("../parser/ast.js").VectorPattern} */
    const pattern = node.lhv;
    let i = 0;

    for (let mem of pattern.members) {
      if (i === pattern.members.length - 1 && pattern.rest) {
        // need to slice off the rest of the list/vector/tuple and assign it to the last member
        const destructuredDecl = AST.VariableDeclaration(
          mem,
          AST.CallExpression(
            AST.Symbol(Token.new(TokenTypes.Symbol, "slice", mem.srcloc)),
            [
              AST.NumberLiteral(
                Token.new(TokenTypes.Number, i.toString(), mem.srcloc)
              ),
              expression,
            ],
            mem.srcloc
          )
        );
        // and push it onto the unnestedExprs array
        unnestedExprs.push(destructuredDecl);
      } else {
        // need to get the value from the current index of the list/vector/tuple and assign it to the current pattern member
        const destructuredDecl = AST.VariableDeclaration(
          mem,
          AST.CallExpression(
            AST.Symbol(Token.new(TokenTypes.Symbol, "get", mem.srcloc)),
            [
              AST.NumberLiteral(
                Token.new(TokenTypes.Number, i.toString(), mem.srcloc)
              ),
              expression,
            ]
          )
        );
        // and push it onto the unnestedExprs array
        unnestedExprs.push(destructuredDecl);
      }
      i++;
    }
    return unnestedExprs;
  } else if (node.lhv.kind === ASTTypes.RecordPattern) {
    // is record pattern destructuring
    // remember, we have the RHV's type at this point
    /** @type {import("../parser/ast.js").RecordPattern} */
    const pattern = node.lhv;
    // first we need to assign the actual object to a fresh variable name
    const objSymbol = createFreshSymbol(expression.srcloc);
    const objDecl = AST.VariableDeclaration(
      objSymbol,
      expression,
      expression.srcloc
    );

    unnestedExprs.push(objDecl);

    let i = 0;
    let used = [];

    for (let prop of pattern.properties) {
      if (i === pattern.properties.length - 1 && pattern.rest) {
        // need to get the rest of the object's properties and assign them to the rest variable
        // this maps the array of unused properties from the type to an array of Symbol
        // nodes with each property name as the node name
        const unusedProps = expression.type.properties
          .filter((p) => {
            return !used.includes(p.name);
          })
          .map((p) =>
            AST.Symbol(Token.new(TokenTypes.Symbol, p.name, prop.srcloc))
          );

        // now create an object using the properties
        const properties = unusedProps.reduce((props, p) => {
          return [
            ...props,
            AST.Property(
              p,
              AST.MemberExpression(objSymbol, p, p.srcloc),
              p.srcloc
            ),
          ];
        }, []);
        const remainingObject = AST.RecordLiteral(properties, prop.srcloc);
        // and a variable declaration using the remainder object assigning it to the rest variable
        const restDecl = AST.VariableDeclaration(
          prop,
          remainingObject,
          prop.srcloc
        );

        unnestedExprs.push(restDecl);
      } else {
        // need to assign the current variable's object property
        const currentDecl = AST.VariableDeclaration(
          prop,
          AST.MemberExpression(objSymbol, prop, prop.srcloc)
        );
        // and push it onto the unnestedExprs array
        unnestedExprs.push(currentDecl);
        used.push(prop.name);
      }
      i++;
    }

    return unnestedExprs;
  }
  // If we get here, it's a simple variable declaration with a symbol as LHV
  return [...unnestedExprs, anfedDecl];
};

/**
 * Transforms a SetExpression node
 * @param {import("../parser/ast.js").SetExpression} node
 * @returns {AST[]}
 */
const transformSetExpression = (node) => {
  const anfedExpr = anf(node.expression);

  if (Array.isArray(anfedExpr)) {
    let expression = anfedExpr.pop();
    return [...anfedExpr, { ...node, expression }];
  }

  return [{ ...node, expression: anfedExpr }];
};

/**
 * Transforms a VectorLiteral node
 * @param {import("../parser/ast.js").VectorLiteral} node
 * @returns {AST[]}
 */
const transformVectorLiteral = (node) => {
  let unnestedExprs = [];
  let members = [];

  for (let mem of node.members) {
    let anfed = anf(mem);

    if (Array.isArray(anfed)) {
      members.push(anfed.pop());
      unnestedExprs = unnestedExprs.concat(anfed);
    } else {
      members.push(anfed);
    }
  }

  return [...unnestedExprs, { ...node, members }];
};

/**
 * Transforms a RecordLiteral node
 * @param {import("../parser/ast.js").RecordLiteral} node
 * @returns {AST[]}
 */
const transformRecordLiteral = (node) => {
  let unnestedExprs = [];
  let properties = [];

  for (let prop of node.properties) {
    let anfed = anf(prop.value);

    if (Array.isArray(anfed)) {
      let value = anfed.pop();
      properties.push({ ...prop, value });
      unnestedExprs = unnestedExprs.concat(anfed);
    } else {
      properties.push({ ...prop, value: anfed });
    }
  }

  return [...unnestedExprs, { ...node, properties }];
};

/**
 * Transforms a MemberExpression node
 * @param {import("../parser/ast.js").MemberExpression} node
 * @returns {AST[]}
 */
const transformMemberExpression = (node) => {
  let unnestedExprs = [];
  let anfedObject = anf(node.object);

  if (Array.isArray(anfedObject)) {
    const object = anfedObject.pop();
    unnestedExprs = unnestedExprs.concat(anfedObject);
    return [...unnestedExprs, { ...node, object }];
  }

  return [{ ...node, object: anfedObject }];
};

/**
 * Transforms a DoExpression node
 * @param {import("../parser/ast.js").DoExpression} node
 * @returns {import("../parser/ast.js").DoExpression}
 */
const transformDoExpression = (node) => {
  const body = node.body.flatMap(anf);
  return { ...node, body };
};

/**
 * Transforms an AsExpression node
 * @param {import("../parser/ast.js").AsExpression} node
 * @returns {AST[]}
 */
const transformAsExpression = (node) => {
  const anfed = anf(node.expression);

  if (Array.isArray(anfed)) {
    return anfed;
  }

  return [anfed];
};

/**
 * Transforms an IfExpression node
 * @param {import("../parser/ast.js").IfExpression} node
 * @returns {AST[]}
 */
const transformIfExpression = (node) => {
  let unnestedExprs = [];
  let transformedCondition = anf(node.test);
  let test;

  if (Array.isArray(transformedCondition)) {
    test = transformedCondition.pop();
    unnestedExprs = unnestedExprs.concat(transformedCondition);
  } else {
    test = transformedCondition;
  }

  let transformedThen = anf(node.then);
  let then;

  if (Array.isArray(transformedThen)) {
    then = transformedThen.pop();
    unnestedExprs = unnestedExprs.concat(transformedThen);
  } else {
    then = transformedThen;
  }

  let transformedElse = anf(node.else);
  let elseBranch;

  if (Array.isArray(transformedElse)) {
    elseBranch = transformedElse.pop();
    unnestedExprs = unnestedExprs.concat(transformedElse);
  } else {
    elseBranch = transformedElse;
  }

  return [...unnestedExprs, { ...node, test, then, else: elseBranch }];
};

/**
 * Transforms a WhenExpression node
 * @param {import("../parser/ast.js").WhenExpression} node
 * @returns {AST[]}
 */
const transformWhenExpression = (node) => {
  let unnestedExprs = [];
  let transformedCondition = anf(node.test);
  let test;

  if (Array.isArray(transformedCondition)) {
    test = transformedCondition.pop();
    unnestedExprs = unnestedExprs.concat(transformedCondition);
  }

  let body = node.body.flatMap(anf);

  return [...unnestedExprs, { ...node, test, body }];
};

/**
 * Transforms a LogicalExpression node
 * @param {import("../parser/ast.js").LogicalExpression} node
 * @returns {AST[]}
 */
const transformLogicalExpression = (node) => {
  let unnestedExprs = [];
  let transformedLeft = anf(node.left);
  let left;

  if (Array.isArray(transformedLeft)) {
    left = transformedLeft.pop();
    unnestedExprs = unnestedExprs.concat(transformedLeft);
  } else {
    left = transformedLeft;
  }

  let transformedRight = anf(right);
  let right;

  if (Array.isArray(transformedRight)) {
    right = transformedRight.pop();
    unnestedExprs = unnestedExprs.concat(transformedRight);
  } else {
    right = transformedRight;
  }

  return [...unnestedExprs, { ...node, left, right }];
};

const createFreshSymbol = (srcloc) => {
  return AST.Symbol(Token.new(TokenTypes.Symbol, makeGenSym(), srcloc));
};

const isPrimitiveOrSymbol = (node) => {
  return isPrimitive(node) || node.kind === ASTTypes.Symbol;
};
