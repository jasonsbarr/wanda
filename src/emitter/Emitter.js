import { ASTTypes } from "../parser/ast.js";
import { ReferenceException, SyntaxException } from "../shared/exceptions.js";
import { Namespace } from "../shared/Namespace.js";
import { makeGenSym, makeSymbol } from "../runtime/makeSymbol.js";

/**
 * @typedef {import("../parser/ast.js").AST} AST
 */
/**
 * @class Emitter
 * @desc Visitor code emitter for Wanda AST
 * @prop {import("../parser/ast.js").AST} AST
 * @prop {Namespace} ns
 */
export class Emitter {
  /**
   * Constructs the emitter object
   * @param {AST} program
   * @param {Namespace} ns
   */
  constructor(program, ns) {
    this.program = program;
    this.ns = ns;
  }

  /**
   * Static constructor
   * @param {AST} program
   * @param {Namespace} ns
   * @returns {Emitter}
   */
  static new(program, ns = new Namespace()) {
    return new Emitter(program, ns);
  }

  /**
   * Emitter dispatcher method
   * @param {AST} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emit(node = this.program, ns = this.ns) {
    switch (node.kind) {
      case ASTTypes.Program:
        return this.emitProgram(node, ns);
      case ASTTypes.NumberLiteral:
        return this.emitNumber(node, ns);
      case ASTTypes.StringLiteral:
        return this.emitString(node, ns);
      case ASTTypes.BooleanLiteral:
        return this.emitBoolean(node, ns);
      case ASTTypes.KeywordLiteral:
        return this.emitKeyword(node, ns);
      case ASTTypes.NilLiteral:
        return this.emitNil(node, ns);
      case ASTTypes.Symbol:
        return this.emitSymbol(node, ns);
      case ASTTypes.CallExpression:
        return this.emitCallExpression(node, ns);
      case ASTTypes.VariableDeclaration:
        return this.emitVariableDeclaration(node, ns);
      case ASTTypes.SetExpression:
        return this.emitSetExpression(node, ns);
      case ASTTypes.DoExpression:
        return this.emitDoExpression(node, ns);
      case ASTTypes.TypeAlias:
        return this.emitTypeAlias(node, ns);
      case ASTTypes.MemberExpression:
        return this.emitMemberExpression(node, ns);
      case ASTTypes.RecordLiteral:
        return this.emitRecordLiteral(node, ns);
      case ASTTypes.RecordPattern:
        return this.emitRecordPattern(node, ns);
      case ASTTypes.VectorLiteral:
        return this.emitVectorLiteral(node, ns);
      case ASTTypes.VectorPattern:
        return this.emitVectorPattern(node, ns);
      case ASTTypes.LambdaExpression:
        return this.emitLambdaExpression(node, ns);
      default:
        throw new SyntaxException(node.kind, node.srcloc);
    }
  }

  /**
   * Generates code from a Boolean AST node
   * @param {import("../parser/ast.js").BooleanLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitBoolean(node, ns) {
    return `rt.makeWandaValue(${node.value})`;
  }

  /**
   * Generates code for a CallExpression AST node
   * @param {import("../parser/ast.js").CallExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitCallExpression(node, ns) {
    return `(${this.emit(node.func, ns)})(${node.args
      .map((a) => this.emit(a, ns))
      .join(", ")})`;
  }

  /**
   * Generates code for a DoExpression AST node
   * @param {import("../parser/ast.js").DoExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitDoExpression(node, ns) {
    const childNs = ns.extend("doExpression");
    let code = "(() => {";

    let i = 0;
    for (let expr of node.body) {
      if (i === node.body.length - 1) {
        code += "return " + this.emit(expr, childNs) + ";\n";
      } else {
        code += this.emit(expr, childNs) + "\n";
      }
      i++;
    }

    code += "})();";
    return code;
  }

  /**
   * Generates code from a Keyword AST node
   * @param {import("../parser/ast.js").KeywordLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitKeyword(node, ns) {
    return `Symbol.for("${node.value}")`;
  }

  /**
   * Generates code from a LambdaExpression AST node
   * @param {import("../parser/ast.js").LambdaExpression} node
   * @param {Namespace} ns
   */
  emitLambdaExpression(node, ns) {
    const funcNs = ns.extend("Lambda");
    /** @type {string[]} */
    let params = [];
    let i = 0;

    for (let p of node.params) {
      funcNs.set(p.name.name, makeSymbol(p.name));

      if (node.variadic && i === node.params.length - 1) {
        params.push(`...${this.emit(p.name, funcNs)}`);
      } else {
        params.push(this.emit(p.name, funcNs));
      }
      i++;
    }

    let code = `rt.makeFunction((${params.join(", ")}) => {\n`;

    let j = 0;
    for (let expr of node.body) {
      if (j === node.body.length - 1) {
        code += `return ${this.emit(expr, funcNs)};`;
      } else {
        code += this.emit(expr, funcNs) + ";\n";
      }
      j++;
    }

    code += "\n}";
    code += `${node.name ? `, { name: "${node.name}" }` : ""})`;

    return code;
  }

  /**
   * Generates code from a MemberExpression AST node
   * @param {import("../parser/ast.js").MemberExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitMemberExpression(node, ns) {
    return `rt.getField(${this.emit(node.object, ns)}, "${
      node.property.name
    }")`;
  }

  /**
   * Generates code from a Nil AST node
   * @param {import("../parser/ast.js").NilLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitNil(node, ns) {
    return `rt.makeWandaValue(${null})`;
  }

  /**
   * Generates code from a Number AST node
   * @param {import("../parser/ast.js").NumberLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitNumber(node, ns) {
    return `rt.makeNumber("${node.value}")`;
  }

  /**
   * Generates code from a Program AST node
   * @param {import("../parser/ast.js").Program} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitProgram(node, ns) {
    let code = "";
    for (let n of node.body) {
      code += `${this.emit(n, ns)};\n`;
    }

    return code;
  }

  /**
   * Generates code from a RecordLiteral node
   * @param {import("../parser/ast.js").RecordLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitRecordLiteral(node, ns) {
    let code = "rt.makeObject({";

    for (let prop of node.properties) {
      code += `"${prop.key.name}": ${this.emit(prop.value, ns)}, `;
    }

    code += "})";
    return code;
  }

  /**
   * Generates code from a RecordPattern node
   * @param {import("../parser/ast.js").RecordPattern} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitRecordPattern(node, ns) {
    let code = "{";

    let i = 0;
    for (let prop of node.properties) {
      if (node.rest && i === node.properties.length - 1) {
        // this is the rest variable, which requires extra work
        // see: this.emitVariableDeclarationAssignment
        break;
      } else {
        code += `${this.emit(prop, ns)}, `;
      }

      i++;
    }

    code += "}";
    return code;
  }

  /**
   * Generates code from a SetExpression AST node
   * @param {import("../parser/ast.js").SetExpression} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitSetExpression(node, ns) {
    return `${this.emit(node.lhv, ns)} = ${this.emit(node.expression, ns)};`;
  }

  /**
   * Generates code from a String AST node
   * @param {import("../parser/ast.js").StringLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitString(node, ns) {
    return `rt.makeWandaValue(${"`" + node.value.slice(1, -1) + "`"})`;
  }

  /**
   * Generates code from a Symbol AST node
   * @param {import("../parser/ast.js").Symbol} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitSymbol(node, ns) {
    const name = node.name;
    const emittedName = ns.get(name);

    if (!emittedName) {
      throw new ReferenceException(
        `Cannot access name ${name} before its definition`,
        node.srcloc
      );
    }

    // To make sure when compiling a variable definition the variable name hasn't already been accessed in the same scope
    if (!ns.has(name)) {
      ns.set(name, emittedName);
    }

    return emittedName;
  }

  /**
   * Emits an empty string because TypeAlias has no JavaScript equivalent
   * @param {import("../parser/parseTypeAnnotation.js").TypeAlias} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitTypeAlias(node, ns) {
    return "";
  }

  /**
   * Generates code from a VariableDeclaration AST node
   * @param {import("../parser/ast.js").VariableDeclaration} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVariableDeclaration(node, ns) {
    if (node.lhv.kind === ASTTypes.Symbol) {
      const name = node.lhv.name;

      if (ns.has(name)) {
        throw new ReferenceException(
          `Name ${name} has already been accessed in the current namespace; cannot access name before its definition`,
          node.srcloc
        );
      }

      const translatedName = makeSymbol(name);
      ns.set(name, translatedName);
    } else if (
      node.lhv.kind === ASTTypes.VectorPattern ||
      node.lhv.kind === ASTTypes.RecordPattern
    ) {
      const members =
        node.lhv.kind === ASTTypes.RecordPattern
          ? node.lhv.properties
          : node.lhv.members;

      for (let mem of members) {
        if (ns.has(mem.name)) {
          throw new ReferenceException(
            `Name ${mem.name} has already been accessed in the current namespace; cannot access name before its definition`,
            mem.srcloc
          );
        }
        ns.set(mem.name, makeSymbol(mem.name));
      }
    }

    return this.emitVariableDeclarationAssignment(
      node.lhv,
      node.expression,
      ns
    );
  }

  /**
   * Generates code for a variable assignment.
   * @param {import("../parser/ast.js").LHV} lhv
   * @param {AST} rhv
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVariableDeclarationAssignment(lhv, rhv, ns) {
    if (lhv.kind === ASTTypes.Symbol) {
      return `var ${makeSymbol(lhv.name)} = ${this.emit(rhv, ns)}`;
    } else if (lhv.kind === ASTTypes.VectorPattern) {
      return `var ${this.emit(lhv, ns)} = ${this.emit(rhv, ns)}`;
    } else if (lhv.kind === ASTTypes.RecordPattern) {
      /* Note that this DOES NOT WORK on rest variables in nested record patterns */
      // create random variable to hold object being destructured
      const gensym = makeGenSym();
      let origObjCode = `var ${gensym} = ${this.emit(rhv, ns)}`;
      let code = `${origObjCode};\n`;

      code += `var ${this.emit(lhv, ns)} = ${gensym};\n`;

      if (lhv.rest) {
        /** @type {string[]} */
        let used = [];
        let i = 0;
        for (let prop of lhv.properties) {
          if (i !== lhv.properties.length - 1) {
            used.push(prop.name);
          }
          i++;
        }

        /** @type {import("../parser/ast.js").Property[]} */
        const unusedProps = rhv.type.properties.filter((p) => {
          return !used.includes(p.name);
        });

        const restVarName = lhv.properties[lhv.properties.length - 1].name;
        let restObjCode = "{ ";

        for (let prop of unusedProps) {
          restObjCode += `"${prop.name}": rt.getField(${gensym}, "${prop.name}"), `;
        }

        restObjCode += "}";

        code += `var ${makeSymbol(restVarName)} = ${restObjCode}`;
      }

      return code;
    }
  }

  /**
   * Generates code from a VectorLiteral node
   * @param {import("../parser/ast.js").VectorLiteral} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVectorLiteral(node, ns) {
    let code = "rt.makeWandaValue([";

    for (let mem of node.members) {
      code += `${this.emit(mem, ns)}, `;
    }

    code += "])";
    return code;
  }

  /**
   * Generates code from a VectorPattern node
   * @param {import("../parser/ast.js").VectorPattern} node
   * @param {Namespace} ns
   * @returns {string}
   */
  emitVectorPattern(node, ns) {
    let code = "[";

    let i = 0;
    for (let mem of node.members) {
      if (node.rest && i === node.members.length - 1) {
        code += `...${this.emit(mem, ns)}`;
      } else {
        code += `${this.emit(mem, ns)}, `;
      }
      i++;
    }

    code += "]";
    return code;
  }
}
