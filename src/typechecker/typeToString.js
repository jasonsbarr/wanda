import { Exception } from "../shared/exceptions.js";
import { TypeTypes } from "./types.js";

/**
 * Converts a type to its string representation
 * @param {import("./types").Type} type
 * @returns {string}
 */
export const typeToString = (type) => {
  switch (type.kind) {
    case TypeTypes.Any:
      return "any";
    case TypeTypes.Number:
      return "number";
    case TypeTypes.String:
      return "string";
    case TypeTypes.Boolean:
      return "boolean";
    case TypeTypes.Keyword:
      return "keyword";
    case TypeTypes.Nil:
      return "nil";
    case TypeTypes.TypeAlias:
      return `TypeAlias: ${type.name}, base: ${typeToString(type.base)}`;
    case TypeTypes.List:
      return `list (${typeToString(type.listType)})`;
    default:
      throw new Exception(`String conversion not implemented for ${type.kind}`);
  }
};
