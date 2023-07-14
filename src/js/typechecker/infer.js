import { AST, ASTTypes } from "../parser/ast.js";
import { Exception, TypeException } from "../shared/exceptions.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { isSubtype } from "./isSubtype.js";
import { getAliasBase } from "./utils.js";
import { fromTypeAnnotation } from "./fromTypeAnnotation.js";
import { unify, unifyAll } from "./unify.js";
import { propType } from "./propType.js";
import { type } from "ramda";
import { narrow, narrowType } from "./narrow.js";

/**
 * Infers a type from an AST node
 * @param {AST} ast
 * @param {TypeEnvironment} env
 * @param {boolean} [constant=false]
 * @returns {import("./types").Type}
 */
export const infer = (ast, env, constant = false) => {
  switch (ast.kind) {
    case ASTTypes.NumberLiteral:
      return inferNumber(ast, constant);
    case ASTTypes.StringLiteral:
      return inferString(ast, constant);
    case ASTTypes.BooleanLiteral:
      return inferBoolean(ast, constant);
    case ASTTypes.KeywordLiteral:
      return inferKeyword(ast, constant);
    case ASTTypes.NilLiteral:
      return inferNil();
    case ASTTypes.Symbol:
      return inferSymbol(ast, env, constant);
    case ASTTypes.CallExpression:
      return inferCallExpression(ast, env, constant);
    case ASTTypes.VariableDeclaration:
      return inferVariableDeclaration(ast, env, constant);
    case ASTTypes.SetExpression:
      return inferSetExpression(ast, env, constant);
    case ASTTypes.DoExpression:
      return inferDoExpression(ast, env, constant);
    case ASTTypes.TypeAlias:
      return inferTypeAlias(ast, env, constant);
    case ASTTypes.VectorLiteral:
      return inferVectorLiteral(ast, env, constant);
    case ASTTypes.RecordLiteral:
      return inferRecordLiteral(ast, env, constant);
    case ASTTypes.MemberExpression:
      return inferMemberExpression(ast, env, constant);
    case ASTTypes.LambdaExpression:
      return inferFunction(ast, env, constant);
    case ASTTypes.FunctionDeclaration:
      return inferFunction(ast, env, constant);
    case ASTTypes.ConstantDeclaration:
      return inferVariableDeclaration(ast, env, true);
    case ASTTypes.AsExpression:
      return inferAsExpression(ast, env, constant);
    case ASTTypes.IfExpression:
      return inferIfExpression(ast, env, constant);
    case ASTTypes.WhenExpression:
      return inferWhenExpression(ast, env, constant);
    case ASTTypes.CondExpression:
      return inferCondExpression(ast, env, constant);
    case ASTTypes.UnaryExpression:
      return inferUnaryExpression(ast, env, constant);
    case ASTTypes.BinaryExpression:
      return inferBinaryExpression(ast, env, constant);
    case ASTTypes.LogicalExpression:
      return inferLogicalExpression(ast, env, constant);
    case ASTTypes.ForExpression:
      return inferForExpression(ast, env, constant);
    default:
      throw new Exception(`No type inferred for AST node type ${ast.kind}`);
  }
};

// Infer types from literal nodes
/**
 * Infer a number type
 * @param {import("../parser/ast.js").NumberLiteral} ast
 * @param {boolean} constant
 * @returns {import("./types").Number|import("./types").Singleton}
 */
const inferNumber = (ast, constant) =>
  constant ? Type.singleton("Number", ast.value) : Type.number;

/**
 * Infer a string type
 * @param {import("../parser/ast.js").StringLiteral} ast
 * @param {boolean} constant
 * @returns {import("./types").String|import("../parser/parseTypeAnnotation.js").SingletonAnn}
 */
const inferString = (ast, constant) =>
  constant ? Type.singleton("String", ast.value) : Type.string;

/**
 * Infer a boolean type
 * @param {import("../parser/ast.js").BooleanLiteral} ast
 * @param {boolean} constant
 * @returns {import("./types").Boolean|import("./types").Singleton}
 */
const inferBoolean = (ast, constant) =>
  constant ? Type.singleton("Boolean", ast.value) : Type.boolean;

/**
 * Infer a keyword type
 * @param {import("../parser/ast.js").KeywordLiteral} ast
 * @param {boolean} constant
 * @returns {import("./types").Keyword|import("./types").Singleton}
 */
const inferKeyword = (ast, constant) =>
  constant ? Type.singleton("Keyword", ast.value) : Type.keyword;

const inferNil = () => Type.nil;

/**
 * Infers a type from a Symbol/Identifier
 * @param {import("../parser/ast").Symbol} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferSymbol = (node, env, constant) => {
  const name = node.name;
  const namedType = env.get(name);

  if (namedType === undefined && env.checkingOn) {
    throw new TypeException(`Type not found for name ${name}`, node.srcloc);
  }

  const baseType =
    namedType && Type.isTypeAlias(namedType)
      ? getAliasBase(namedType.name)
      : namedType
      ? namedType
      : Type.any;

  return baseType;
};

/**
 * Infers a type from a CallExpression node
 * @param {import("../parser/ast").CallExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferCallExpression = (node, env, constant) => {
  let func = infer(node.func, env, constant);

  if (Type.isAny(func)) {
    return Type.any;
  } else if (
    Type.isUndefined(func) ||
    (type.ret && Type.isUndefined(func.ret))
  ) {
    // this should only happen during first typechecker pass
    return Type.undefinedType;
  } else if (Type.isTypeAlias(func)) {
    func = getAliasBase(func.name, env);
  }

  return Type.map(func, (func) => {
    if (!func.variadic && node.args.length > func.params.length) {
      throw new TypeException(
        `Too many arguments for function: ${node.args.length} given; ${func.params.length} expected`,
        node.srcloc
      );
    }

    // handle partially applied functions
    if (
      node.args.length <
      (func.variadic ? func.params.length - 1 : func.params.length)
    ) {
      // is partially applied
      const params = func.params.slice(0, node.args.length);

      if (env.checkingOn) {
        checkArgTypes(node, params, env, func, constant);
      }

      const newParams = func.params.slice(node.args.length);
      return Type.functionType(newParams, func.ret, func.variadic);
    }

    if (env.checkingOn) {
      checkArgTypes(node, func.params, env, func, constant);
    }

    return func.ret;
  });
};

const checkArgTypes = (node, params, env, func, constant) => {
  node.args.forEach((arg, i) => {
    let argEnv =
      arg.kind === ASTTypes.LambdaExpression
        ? env.extend("LambdaExpression")
        : env;
    const argType = infer(arg, argEnv, constant);

    if (func.variadic && i >= params.length - 1) {
      // is part of rest args
      let p = params[params.length - 1];
      if (!p.vectorType) {
        throw new TypeException(
          `Rest parameter type must be vector; ${Type.toString(p)} given`,
          arg.srcloc
        );
      }
      p = p.vectorType;
      if (!isSubtype(argType, p)) {
        throw new TypeException(
          `${Type.toString(argType)} is not a subtype of ${Type.toString(p)}`,
          arg.srcloc
        );
      }
    } else {
      const p = params[i];
      if (!isSubtype(argType, p)) {
        throw new TypeException(
          `${Type.toString(argType)} is not a subtype of ${Type.toString(p)}`,
          arg.srcloc
        );
      }
    }
  });
};

/**
 * Infers a type from a VariableDeclaration node and sets it in the current env
 * @param {import("../parser/ast.js").VariableDeclaration} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferVariableDeclaration = (node, env, constant) => {
  return infer(node.expression, env, constant);
};

/**
 * Infers a type from a SetExpression node
 * @param {import("../parser/ast").SetExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferSetExpression = (node, env, constant) => {
  return infer(node.expression, env, constant);
};

/**
 * Infers a type from a DoExpression node
 * @param {import("../parser/ast").DoExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferDoExpression = (node, env, constant) => {
  let doType = Type.any;
  const doEnv = env.extend("doExpression");

  for (let expr of node.body) {
    doType = infer(expr, doEnv, constant);
  }

  return doType;
};

/**
 * Infers a type from a TypeAlias node
 * @param {import("../parser/ast.js").TypeAlias} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferTypeAlias = (node, env, constant) => {
  const nameType = env.get(node.name);

  return nameType ? nameType : fromTypeAnnotation(node.type, env);
};

/**
 * Infer the type of a VectorLiteral node
 * @param {import("../parser/ast.js").VectorLiteral} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Vector}
 */
const inferVectorLiteral = (node, env, constant) => {
  if (node.members.length === 0) {
    return Type.vector(Type.never);
  }

  const types = node.members.map((m) => infer(m, env, constant));
  const unified = unifyAll(...types);

  return Type.vector(unified, constant);
};

/**
 * Infer the type of a RecordLiteral node
 * @param {import("../parser/ast.js").RecordLiteral} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Object}
 */
const inferRecordLiteral = (node, env, constant) => {
  const properties = node.properties.map((prop) => ({
    kind: Type.Type.Property,
    name: prop.key.name,
    type: infer(prop.value, env, constant),
  }));
  return Type.object(properties, constant);
};

/**
 * Infer the type of a MemberExpression node
 * @param {import("../parser/ast.js").MemberExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferMemberExpression = (node, env, constant) => {
  const prop = node.property;
  let object = infer(node.object, env, constant);

  if (Type.isModule(object)) {
    const name = prop.name;
    const type = object[name];

    if (!type) {
      // For a module, the object should always be a Symbol node
      throw new TypeException(
        `Type for ${name} not found on module ${object.name}`,
        node.srcloc
      );
    }

    return type;
  }

  if (Type.isTypeAlias(object)) {
    object = getAliasBase(object.name, env);
  }

  return Type.map(object, (object) => {
    if (!Type.isObject(object)) {
      if (env.checkingOn) {
        throw new TypeException(
          `Member expression expects object type; ${Type.toString(
            object
          )} given`,
          node.srcloc
        );
      } else {
        return Type.any;
      }
    }

    const type = propType(object, prop.name);

    if (!type && env.checkingOn) {
      throw new TypeException(
        `Property ${prop.name} not found on object of type ${Type.toString(
          object
        )}`,
        node.srcloc
      );
    }

    return type ?? Type.any;
  });
};

/**
 * Infers a type for a function
 * @param {import("../parser/ast.js").LambdaExpression|import("../parser/ast.js").FunctionDeclaration} node
 * @param {TypeEnvironment} env will already be extended function environment
 * @param {boolean} constant
 * @returns {import("./types").FunctionType}
 */
const inferFunction = (node, env, constant) => {
  const params = node.params.map((p) => {
    if (p.typeAnnotation) {
      env.checkingOn = true;
    }
    const type = p.typeAnnotation
      ? fromTypeAnnotation(p.typeAnnotation, env)
      : p.type
      ? p.type
      : Type.any;
    env.set(p.name.name, type);
    return type;
  });

  if (node.retType) {
    env.checkingOn = true;
  }

  const retType = node.retType
    ? fromTypeAnnotation(node.retType, env)
    : Type.any;
  let inferredRetType;

  for (let expr of node.body) {
    // type of last expression "wins"
    inferredRetType = infer(expr, env, constant);
  }

  if (env.checkingOn && !isSubtype(inferredRetType, retType)) {
    throw new TypeException(
      `Inferred return type ${Type.toString(
        inferredRetType
      )} is not a subtype of annotated return type ${Type.toString(retType)}`,
      node.srcloc
    );
  } else if (env.checkingOn && Type.isNever(retType)) {
    if (!Type.isNever(inferredRetType)) {
      throw new TypeException(
        `Function with return type never cannot return inferred type of ${Type.toString(
          inferredRetType
        )}`,
        node.srcloc
      );
    }
  }

  return Type.functionType(
    params,
    Type.isAny(retType) || Type.isUndefined(retType)
      ? inferredRetType
      : retType,
    node.variadic
  );
};

/**
 * Infers a type from an expression and checks it against a given type
 * @param {import("../parser/ast.js").AsExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferAsExpression = (node, env, constant) => {
  const type = fromTypeAnnotation(node.type);
  const exprType = infer(node.expression, env, constant);

  if (env.checkingOn) {
    if (!isSubtype(exprType, type)) {
      throw new TypeException(
        `${Type.toString(
          exprType
        )} is not a valid subtype of the given type ${Type.toString(
          type
        )} in :as expression`,
        node.srcloc
      );
    }
  }

  return type;
};

/**
 * Infers a type from an if expression
 * @param {import("../parser/ast.js").IfExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferIfExpression = (node, env, constant) => {
  const test = infer(node.test, env, constant);
  const consequent = () => infer(node.then, narrow(node.test, env, true));
  const alternate = () => infer(node.else, narrow(node.test, env, false));

  if (Type.isTruthy(test)) {
    return consequent();
  } else if (Type.isFalsy(test)) {
    return alternate();
  } else {
    return unify(consequent(), alternate());
  }
};

/**
 * Infers a type from a when expression
 * @param {import("../parser/ast.js").WhenExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Nil}
 */
const inferWhenExpression = (node, env, constant) => {
  const test = infer(node.test, env, constant);

  // if the test is falsy, this will never run
  if (!Type.isFalsy(test)) {
    // check expressions in body
    for (let expr of node.body) {
      infer(expr, narrow(node.test, env, true), constant);
    }
  }

  return Type.nil;
};

/**
 * Infers a type from a cond expression
 * @param {import("../parser/ast.js").CondExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferCondExpression = (node, env, constant) => {
  /** @type {import("./types").Type[]} */
  let types = [];

  for (let clause of node.clauses) {
    const test = infer(clause.test, env, constant);
    const type = infer(
      clause.expression,
      narrow(clause.test, env, true),
      constant
    );

    if (Type.isTruthy(test)) {
      // the first truthy condition type will trigger the clause's expression
      return type;
    }

    types.push(type);
  }

  const elseType = infer(node.else, env, constant);

  return unifyAll(...types, elseType);
};

/**
 * Infers a type from a unary expression
 * @param {import("../parser/ast.js").UnaryExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferUnaryExpression = (node, env, constant) => {
  const operand = infer(node.operand, env, constant);

  return Type.map(operand, (operand) => {
    switch (node.op) {
      case "not":
        if (Type.isTruthy(operand)) {
          return Type.singleton("Boolean", "false");
        } else if (Type.isFalsy(operand)) {
          return Type.singleton("Boolean", true);
        } else {
          return Type.boolean;
        }

      default:
        throw new Exception(`Unknown unary operator ${node.op}`);
    }
  });
};

/**
 * Infers a type from a binary expression
 * @param {import("../parser/ast.js").BinaryExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferBinaryExpression = (node, env, constant) => {
  const left = infer(node.left, env, constant);
  const right = infer(node.right, env, constant);

  return Type.map(left, right, (left, right) => {
    switch (node.op) {
      case "equal?":
        if (Type.isSingleton(left) && Type.isSingleton(right)) {
          return Type.singleton(left.value === right.value ? "true" : "false");
        } else {
          return Type.boolean;
        }

      case "not-equal?":
        if (Type.isSingleton(left) && Type.isSingleton(right)) {
          return Type.singleton(left.value !== right.value ? "true" : "false");
        } else {
          return Type.boolean;
        }

      default:
        throw new Exception(`Unknown binary operator ${node.op}`);
    }
  });
};

/**
 * Infers a type from a logical expression
 * @param {import("../parser/ast.js").LogicalExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferLogicalExpression = (node, env, constant) => {
  const left = infer(node.left, env, constant);
  const right = () => infer(node.right, env, constant);

  switch (node.op) {
    case "and":
      if (Type.isFalsy(left)) {
        return left;
      } else if (Type.isTruthy(left)) {
        return right();
      } else {
        return unify(narrowType(left, Type.falsy), right());
      }

    case "or":
      if (Type.isTruthy(left)) {
        return left;
      } else if (Type.isFalsy(left)) {
        return right();
      } else {
        return unify(narrowType(left, Type.truthy), right());
      }

    default:
      throw new Exception(`Unknown logical operator ${node.op}`);
  }
};

/**
 * Infers a type from a for expression
 * @param {import("../parser/ast.js").ForExpression} node
 * @param {TypeEnvironment} env
 * @param {boolean} constant
 * @returns {import("./types").Type}
 */
const inferForExpression = (node, env, constant) => {
  const lambdaArgs = node.vars.map((v) => {
    let varType = infer(v.initializer, env, constant);

    if (Type.isList(varType)) {
      varType = varType.listType;
    } else if (Type.isVector(varType)) {
      varType = varType.vectorType;
    }

    return { name: v.var, type: varType };
  });
  const lambda = AST.LambdaExpression(
    lambdaArgs,
    node.body,
    false,
    null,
    node.srcloc
  );
  const opArgs = [lambda, ...node.vars.map((v) => v.initializer)];

  return infer(AST.CallExpression(node.op, opArgs, node.srcloc), env, constant);
};
