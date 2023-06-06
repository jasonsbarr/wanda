import equal from "fast-deep-equal/es6/index.js";
import readlineSync from "readline-sync";
import { makeModule } from "../../src/runtime/Module.js";
import { Cons, cons } from "../../src/shared/cons.js";
import { print } from "../../src/printer/print.js";
import { println } from "../../src/printer/println.js";
import { printString } from "../../src/printer/printString.js";
import { isTruthy } from "../../src/runtime/utils.js";

export const theModule = makeModule("Core", (rt, ns) => {
  const isList = (obj) => {
    if (obj != null && !(obj instanceof Cons)) {
      return false;
    } else if (obj == null) {
      return true;
    }

    // only option left is cons
    return isList(obj.cdr);
  };

  return {
    print,
    println,
    input: (prompt) => readlineSync.question(prompt),
    string: printString,
    number: Number,
    boolean: (val) => isTruthy(val),
    symbol: (str) => Symbol.for(str),
    keyword: (str) => Symbol.for(":" + str),
    "+": (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
    "-": (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
    "*": (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
    "/": (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
    "%": (a, b, ...nums) => nums.reduce((quot, n) => quot % n, a % b),
    "=": (a, b) => a === b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    not: (x) => !x,
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
    get: (n, lst) => lst.get(n),
    "list?": isList,
    "pair?": (obj) => obj instanceof Cons,
    "number?": (obj) => typeof obj === "number",
    "string?": (obj) => typeof obj === "string",
    "boolean?": (obj) => typeof obj === "boolean",
    "nil?": (obj) => obj == null,
    "keyword?": (obj) =>
      typeof obj === "symbol" && obj.description.startsWith(":"),
    "equal?": (a, b) => equal(a, b),
    "is?": (a, b) => Object.is(a, b),
    append: (obj1, obj2) => {
      if (typeof obj1 === "string" && typeof obj2 === "string") {
        return obj1 + obj2;
      }
      return obj1.append(obj2);
    },
  };
});
