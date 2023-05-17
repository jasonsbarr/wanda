import { Exception } from "../shared/exceptions.js";

export const print = (value) => {
  switch (typeof value) {
    case "number":
      return String(value);
    default:
      throw new Exception(`Invalid value ${value}`);
  }
};
