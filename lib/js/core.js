import { makeModule } from "../../src/runtime/module.js";
import { Cons, cons } from "../../src/shared/cons.js";

export const theModule = makeModule("Core", (rt, ns) => {
  return {
    "+": (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
    "-": (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
    "*": (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
    "/": (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
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
  };
});
