import { equals } from "fast-deep-equal";
import { makeModule } from "../../src/runtime/module.js";
import { Cons, cons } from "../../src/shared/cons.js";

export const theModule = makeModule("Core", (rt, ns) => {
  const isList = (obj) => {
    if (obj != null && !obj instanceof Cons) {
      return false;
    } else if (obj == null) {
      return true;
    }

    // only option left is cons
    return isList(obj.cdr);
  };

  return {
    "+": (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
    "-": (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
    "*": (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
    "/": (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
    "=": (a, b) => a === b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    "equal?": (a, b) => equals(a, b),
    "is?": (a, b) => Object.is(a, b),
    "str-append": (...strs) => strs.reduce((str, s) => str + s, ""),
    upcase: (str) => str.toUpperCase(),
    downcase: (str) => str.toLowerCase(),
    cons,
    car: (pair) => pair.car,
    cdr: (pair) => pair.cdr,
    list: (...args) => Cons.of(...args),
    length: (obj) => {
      if (obj instanceof Cons) {
        let i = 0;
        for (let _ of obj) {
          i++;
        }
        return i;
      }

      return obj.length;
    },
    "list?": isList,
    "pair?": (obj) => obj instanceof Cons,
    "number?": (obj) => typeof obj === "number",
    "string?": (obj) => typeof obj === "string",
    "boolean?": (obj) => typeof obj === "boolean",
    "nil?": (obj) => obj == null,
    "keyword?": (obj) =>
      typeof obj === "symbol" && obj.description.startsWith(":"),
    append: (lst, obj) => lst.append(obj),
  };
});
