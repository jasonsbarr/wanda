import { AST, ASTTypes } from "../parser/ast.js";
import { Exception, TypeException } from "../shared/exceptions.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { check } from "./check.js";
import { infer } from "./infer.js";
import { fromTypeAnnotation } from "./fromTypeAnnotation.js";
import { Type } from "./Type.js";
import { propType } from "./propType.js";

/**
 * @typedef {AST & {type: import("./types").Type}} TypedAST
 */

let isSecondPass = false;

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
   * Execute 2-pass type checking of entire program
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  check(env = this.env) {
    // first pass is to populate environments so valid forward references will resolve
    const firstPassProgram = this.checkNode(this.program, env);
    isSecondPass = true;
    return this.checkNode(firstPassProgram, env);
  }

  /**
   * Type checks an AST node
   * @param {AST} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkNode(node, env) {
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
      case ASTTypes.TypeAlias:
        return this.checkTypeAlias(node, env);
      case ASTTypes.MemberExpression:
        return this.checkMemberExpression(node, env);
      case ASTTypes.RecordLiteral:
        return this.checkRecordLiteral(node, env);
      case ASTTypes.VectorLiteral:
        return this.checkVectorLiteral(node, env);
      case ASTTypes.FunctionDeclaration:
        return this.checkFunctionDeclaration(node, env);
      case ASTTypes.LambdaExpression:
        return this.checkLambdaExpression(node, env);
      case ASTTypes.ConstantDeclaration:
        return this.checkConstantDeclaration(node, env);
      case ASTTypes.AsExpression:
        return this.checkAsExpression(node, env);
      default:
        throw new Exception(`Type checking not implemented for ${node.kind}`);
    }
  }

  /**
   * Type checks an :as expression
   * @param {import("../parser/ast.js").AsExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkAsExpression(node, env) {
    env.checkingOn = true;
    const type = infer(node, env);
    return { ...node.expression, type };
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
    let type = infer(node, env);

    if (Type.isUndefined(type) && isSecondPass) {
      type = Type.any;
    }

    return { ...node, type };
  }

  /**
   * Type checks a constant declaration
   * @param {import("../parser/ast.js").ConstantDeclaration} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkConstantDeclaration(node, env) {
    return this.checkVariableDeclaration(node, env, true);
  }

  /**
   * Type checks a do (block) expression
   * @param {import("../parser/ast.js").DoExpression} node
   * @param {TypeEnvironment} env
   * @return {TypedAST}
   */
  checkDoExpression(node, env) {
    if (!node.env) {
      // during the first pass this will create the child env
      node.env = env.extend("DoExpression");
    }

    const doEnv = node.env;

    /** @type {TypedAST[]} */
    let body = [];
    for (let expr of node.body) {
      const node = this.checkNode(expr, doEnv);
      body.push(node);
    }

    return {
      kind: node.kind,
      body,
      srcloc: node.srcloc,
      type: infer(node, doEnv),
    };
  }

  /**
   * Type checks a function declaration
   * @param {import("../parser/ast.js").FunctionDeclaration} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkFunctionDeclaration(node, env) {
    if (!node.env) {
      node.env = env.extend(node.name.name);
    }

    const funcEnv = node.env;
    const type = infer(node, funcEnv);

    if (funcEnv.checkingOn) {
      env.checkingOn = funcEnv.checkingOn;
      check(node, type, funcEnv);
    }

    env.set(node.name.name, type);
    return { ...node, type };
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
   * Type checks a lambda expression
   * @param {import("../parser/ast.js").LambdaExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkLambdaExpression(node, env) {
    if (!node.env) {
      node.env = env.extend("Lambda");
    }

    const funcEnv = node.env;
    const type = infer(node, funcEnv);

    if (funcEnv.checkingOn) {
      env.checkingOn = funcEnv.checkingOn;
      check(node, type, funcEnv);
    }

    return { ...node, type };
  }

  checkMemberExpression(node, env) {
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
    /** @type {TypedAST[]} */
    let body = [];
    let type;
    let i = 0;
    for (let expr of node.body) {
      if (i === node.body.length - 1) {
        const node = this.checkNode(expr, env);
        type = node.type;
        body.push(node);
      } else {
        const node = this.checkNode(expr, env);
        body.push(node);
      }
    }

    return { kind: node.kind, body, srcloc: node.srcloc, type };
  }

  checkRecordLiteral(node, env) {
    return { ...node, type: infer(node, env) };
  }

  /**
   * Type checks a set expression
   * @param {import("../parser/ast.js").SetExpression} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkSetExpression(node, env) {
    if (node.lhv.kind !== ASTTypes.Symbol) {
      throw new TypeException(
        `Cannot use destructuring with set! assignment`,
        node.srcloc
      );
    }

    const nameType = env.get(node.lhv.name);

    if (nameType.constant) {
      throw new TypeException(
        `Cannot assign to constant value ${node.lhv.name}`,
        node.srcloc
      );
    }

    if (env.checkingOn) {
      check(node.expression, nameType, env);
      return {
        kind: node.kind,
        lhv: node.lhv,
        expression: this.checkNode(node.expression, env),
        srcloc: node.srcloc,
        type: nameType,
      };
    }

    return {
      kind: node.kind,
      lhv: node.lhv,
      expression: this.checkNode(node.expression, env),
      srcloc: node.srcloc,
      type: infer(node, env),
    };
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
    try {
      let type = infer(node, env);

      if (Type.isUndefined(type)) {
        type = Type.any;
        env.set(node.name, type);
      }

      return { ...node, type };
    } catch (e) {
      if (!isSecondPass) {
        env.set(node.name, Type.undefinedType);
      }
    }
  }

  /**
   * Adds a type alias to the type environment
   * @param {import("../parser/ast.js").TypeAlias} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkTypeAlias(node, env) {
    const type = isSecondPass ? node.type : fromTypeAnnotation(node.type, env);
    env.setType(node.name, type);
    return { ...node, type };
  }

  /**
   * Type checks a variable declaration
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {TypeEnvironment} env
   * @param {boolean} [constant=false]
   * @returns {TypedAST}
   */
  checkVariableDeclaration(node, env, constant = false) {
    let type;

    if (node.typeAnnotation) {
      type = fromTypeAnnotation(node.typeAnnotation, env);
      check(node.expression, type, env);
      env.checkingOn = true;
    } else {
      type = infer(node, env, constant);
    }

    if (env.checkingOn && Type.isNever(type)) {
      throw new TypeException(
        `Type never cannot be assigned a value`,
        node.srcloc
      );
    }

    if (node.lhv.kind === ASTTypes.Symbol) {
      env.set(node.lhv.name, type);
    } else if (node.lhv.kind === ASTTypes.VectorPattern) {
      if (!Type.isVector(type) && !Type.isList(type) && !Type.isTuple(type)) {
        throw new TypeException(
          `Vector pattern destructuring must take a vector, list, or tuple type`,
          node.srcloc
        );
      } else {
        let i = 0;
        for (let mem of node.lhv.members) {
          if (Type.isVector(type) || Type.isList(type)) {
            if (node.lhv.rest && i === node.lhv.members.length - 1) {
              env.set(mem.name, type);
            } else {
              env.set(
                mem.name,
                type.vectorType ? type.vectorType : type.listType
              );
            }
          } else {
            // is tuple type
            if (node.lhv.rest && i === node.lhv.members.length - 1) {
              // is rest variable
              env.set(mem.name, type.types.slice(i));
            } else {
              env.set(mem.name, type.types[i]);
            }
          }
          i++;
        }
      }
    } else if (node.lhv.kind === ASTTypes.RecordPattern) {
      if (!Type.isObject(type)) {
        throw new TypeException(
          `Cannot destructure non-object type with record pattern`,
          node.srcloc
        );
      } else {
        let i = 0;
        /** @type {string[]} */
        let used = [];
        for (let prop of node.lhv.properties) {
          if (node.lhv.rest && i === node.lhv.properties.length - 1) {
            const unusedProps = type.properties.filter(
              (p) => !used.includes(p.name)
            );

            env.set(prop.name, Type.object(unusedProps));
          } else {
            const pType = propType(type, prop.name);

            if (!pType) {
              throw new TypeException(
                `Property ${
                  prop.name
                } not found on object of type ${Type.toString(type)}`,
                node.srcloc
              );
            }

            env.set(prop.name, pType);
            used.push(prop.name);
          }

          i++;
        }
      }
    }

    return {
      kind: node.kind,
      lhv: node.lhv,
      expression: this.checkNode(node.expression, env),
      srcloc: node.srcloc,
      type,
    };
  }

  /**
   * Type checks a vector literal
   * @param {import("../parser/ast.js").VectorLiteral} node
   * @param {TypeEnvironment} env
   * @returns {TypedAST}
   */
  checkVectorLiteral(node, env) {
    return { ...node, type: infer(node, env) };
  }
}
