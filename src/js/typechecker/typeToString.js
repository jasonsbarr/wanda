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
    case TypeTypes.FunctionType:
      return `(${type.params.map(typeToString).join(", ")}) -> ${typeToString(
        type.ret
      )}`;
    case TypeTypes.TypeAlias:
      return `TypeAlias: ${type.name}, base: ${typeToString(type.base)}`;
    case TypeTypes.List:
      return `list (${typeToString(type.listType)})`;
    case TypeTypes.Vector:
      return `vector (${typeToString(type.vectorType)})`;
    case TypeTypes.Object:
      return `{ ${type.properties
        .map((p) => `${p.name} : ${typeToString(p.type)}`)
        .join(", ")} }`;
    case TypeTypes.Undefined:
      return "undefined";
    case TypeTypes.Tuple:
      return `[${type.types.map(typeToString).join(", ")}]`;
    case TypeTypes.Singleton:
      return type.value;
    case TypeTypes.Never:
      return "never";
    case TypeTypes.Union:
      return `(${type.types.map(typeToString).join(" || ")})`;
    case TypeTypes.Unknown:
      return "unknown";
    case TypeTypes.Intersection:
      return `(${type.types.map(typeToString).join(" && ")})`;
    case TypeTypes.Module:
      return "Module";
    default:
      throw new Exception(`String conversion not implemented for ${type.kind}`);
  }
};
