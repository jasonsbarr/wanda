import { TATypes } from "../parser/parseTypeAnnotation.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { Exception } from "../shared/exceptions.js";
import { TokenTypes } from "../lexer/TokenTypes.js";
import { fail } from "../shared/fail.js";

/**
 * Constructs a concrete type from a type annotation node
 * @param {import("../parser/parseTypeAnnotation.js").TypeAnnotation} typeAnnotation
 * @param {TypeEnvironment} typeEnv
 * @returns {import("./types.js").Type}
 */

export const fromTypeAnnotation = (
  typeAnnotation,
  typeEnv = TypeEnvironment.new()
) => {
  switch (typeAnnotation.kind) {
    case TATypes.AnyLiteral:
      return Type.any;
    case TATypes.NumberLiteral:
      return Type.number;
    case TATypes.StringLiteral:
      return Type.string;
    case TATypes.BooleanLiteral:
      return Type.boolean;
    case TATypes.KeywordLiteral:
      return Type.keyword;
    case TATypes.NilLiteral:
      return Type.nil;
    case TATypes.Never:
      return Type.never;
    case TATypes.Unknown:
      return Type.unknown;
    case TATypes.Symbol: {
      const name = typeAnnotation.name;
      const type = typeEnv.getType(name);

      if (!type) {
        throw new Exception(
          `Type ${name} not found in current type environment`
        );
      }

      return type;
    }
    case TATypes.List: {
      const listType = fromTypeAnnotation(typeAnnotation.listType, typeEnv);
      return Type.list(listType);
    }
    case TATypes.Vector: {
      const vectorType = fromTypeAnnotation(typeAnnotation.vectorType, typeEnv);
      return Type.vector(vectorType);
    }
    case TATypes.Object: {
      const propTypes = typeAnnotation.properties.map((prop) => ({
        name: prop.name,
        type: fromTypeAnnotation(prop.propType, typeEnv),
      }));
      return Type.object(propTypes);
    }
    case TATypes.Function: {
      const paramTypes = typeAnnotation.params.map((p) =>
        fromTypeAnnotation(p, typeEnv)
      );
      const retType = fromTypeAnnotation(typeAnnotation.retType, typeEnv);
      return Type.functionType(paramTypes, retType, typeAnnotation.variadic);
    }
    case TATypes.Tuple: {
      /** @type {import("./types.js").Type[]} */
      let types = [];

      for (let mem of typeAnnotation.types) {
        types.push(fromTypeAnnotation(mem, typeEnv));
      }

      return Type.tuple(types);
    }
    case TATypes.Singleton: {
      const tType = typeAnnotation.token.type;
      const base =
        tType === TokenTypes.Number
          ? "Number"
          : tType === TokenTypes.String
          ? "String"
          : tType === TokenTypes.Boolean
          ? "Boolean"
          : TokenTypes.Keyword
          ? "Keyword"
          : fail(
              `Invalid token type ${tType} when parsing type annotation ${JSON.stringify(
                typeAnnotation,
                null,
                2
              )}`
            );
      const value = typeAnnotation.token.value;

      return Type.singleton(base, value);
    }
    case TATypes.Union:
      return Type.union(
        ...typeAnnotation.types.map((t) => fromTypeAnnotation(t, typeEnv))
      );
    case TATypes.Intersection: {
      return Type.intersection(
        ...typeAnnotation.types.map((t) => fromTypeAnnotation(t, typeEnv))
      );
    }
    default:
      throw new Exception(
        `Type not found for type annotation ${JSON.parse(
          typeAnnotation,
          null,
          2
        )}`
      );
  }
};
