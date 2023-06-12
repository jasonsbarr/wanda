import { TATypes } from "../parser/parseTypeAnnotation.js";
import { Type } from "./Type.js";
import { TypeEnvironment } from "./TypeEnvironment.js";
import { Exception } from "../shared/exceptions.js";

/**
 * Constructs a concrete type from a type annotation node
 * @param {import("../parser/parseTypeAnnotation.js").TypeAnnotation} typeAnnotation
 * @param {TypeEnvironment} typeEnv
 * @returns {import("./types.js").Type}
 */

export const fromTypeAnnotation = (typeAnnotation, typeEnv) => {
  switch (typeAnnotation.kind) {
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
