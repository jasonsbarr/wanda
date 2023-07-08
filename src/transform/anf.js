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
    // if it's a variable declaration, we need to anf the expression
    // you shouldn't ever use a variable declaration as the argument
    // to a call expression, but someone probably will at some point
    if (arg.kind === ASTTypes.VariableDeclaration) {
      arg = anf(arg.expression);
      // if it's a call expression, we need to unnest any subexpressions from
      // the arguments to the sub-call expression and create a new call expr
    } else if (arg.kind === ASTTypes.CallExpression) {
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
      if (i === pattern.length - 1 && pattern.rest) {
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
  } else {
    // is a Symbol
    return [...unnestedExprs, anfedDecl];
  }
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
    return { ...node, object };
  }

  return [{ ...node, object: anfedObject }];
};

const createFreshSymbol = (srcloc) => {
  return AST.Symbol(Token.new(TokenTypes.Symbol, makeGenSym(), srcloc));
};

const isPrimitiveOrSymbol = (node) => {
  return isPrimitive(node) || node.kind === ASTTypes.Symbol;
};
