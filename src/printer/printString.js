import { Exception } from "../shared/exceptions.js";

export const printString = (value) => {
  switch (typeof value) {
    case "number":
      return String(value);
    default:
      throw new Exception(`Invalid value ${value}`);
  }
};
