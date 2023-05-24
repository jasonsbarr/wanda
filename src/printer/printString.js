import { Exception } from "../shared/exceptions.js";

export const printString = (value) => {
  switch (typeof value) {
    case "number":
      return String(value);
    case "string":
      return `"` + value + `"`;
    case "symbol":
      return value.description;
    case "boolean":
      return String(value);
    case "undefined":
      return "nil";
    case "object":
      if (value === null) {
        return "nil";
      }
    default:
      throw new Exception(`Invalid value ${value}`);
  }
};
