import equal from "fast-deep-equal/es6/index.js";
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
    print: rt.makeFunction(print),
    println: rt.makeFunction(println),
    cons,
    car: rt.makeFunction((pair) => pair.car),
    cdr: rt.makeFunction((pair) => pair.cdr),
    string: rt.makeFunction(printString),
    number: rt.makeFunction(Number),
    boolean: rt.makeFunction((val) => isTruthy(val)),
    symbol: rt.makeFunction((str) => Symbol.for(str)),
    keyword: rt.makeFunction((str) => Symbol.for(":" + str)),
    "+": rt.makeFunction((a, b, ...nums) =>
      nums.reduce((sum, n) => sum + n, a + b)
    ),
    "-": rt.makeFunction((a, b, ...nums) =>
      nums.reduce((diff, n) => diff - n, a - b)
    ),
    "*": rt.makeFunction((a, b, ...nums) =>
      nums.reduce((prod, n) => prod * n, a * b)
    ),
    "/": rt.makeFunction((a, b, ...nums) =>
      nums.reduce((quot, n) => quot / n, a / b)
    ),
    "%": rt.makeFunction((a, b, ...nums) =>
      nums.reduce((quot, n) => quot % n, a % b)
    ),
    "=": rt.makeFunction((a, b) => a === b),
    ">": rt.makeFunction((a, b) => a > b),
    ">=": rt.makeFunction((a, b) => a >= b),
    "<": rt.makeFunction((a, b) => a < b),
    "<=": rt.makeFunction((a, b) => a <= b),
    not: rt.makeFunction((x) => !x),
    list: rt.makeFunction((...args) => Cons.of(...args)),
    length: rt.makeFunction((obj) => {
      if (obj instanceof Cons) {
        let i = 0;
        for (let _ of obj) {
          i++;
        }
        return i;
      }

      return obj.length;
    }),
    get: rt.makeFunction((n, lst) => lst.get(n)),
    "list?": rt.makeFunction(isList),
    "pair?": rt.makeFunction((obj) => obj instanceof Cons),
    "number?": rt.makeFunction((obj) => typeof obj === "number"),
    "string?": rt.makeFunction((obj) => typeof obj === "string"),
    "boolean?": rt.makeFunction((obj) => typeof obj === "boolean"),
    "nil?": rt.makeFunction((obj) => obj == null),
    "keyword?": rt.makeFunction(
      (obj) => typeof obj === "symbol" && obj.description.startsWith(":")
    ),
    "equal?": rt.makeFunction((a, b) => equal(a, b)),
    "is?": rt.makeFunction((a, b) => Object.is(a, b)),
    append: rt.makeFunction((obj1, obj2) => {
      if (typeof obj1 === "string" && typeof obj2 === "string") {
        return obj1 + obj2;
      }
      return obj1.append(obj2);
    }),
  };
});
