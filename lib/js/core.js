import equal from "fast-deep-equal/es6/index.js";
import { makeModule } from "../../src/runtime/Module.js";
import { Cons, cons } from "../../src/shared/cons.js";
import { print } from "../../src/printer/print.js";
import { println } from "../../src/printer/println.js";
import { printString } from "../../src/printer/printString.js";
import { isTruthy } from "../../src/runtime/utils.js";
import { Exception } from "../../src/shared/exceptions.js";

export const theModule = makeModule("Core", (rt, ns) => {
  const isList = (obj) => {
    if (!rt.isNil(obj) && !(obj instanceof Cons)) {
      return false;
    } else if (rt.isNil(obj)) {
      return true;
    }

    // only option left is cons
    return isList(obj.cdr);
  };

  return {
    __module__: "Global",
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
    list: rt.makeFunction((...args) => Cons.from(args)),
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
    get: rt.makeFunction((n, obj) => {
      const value = obj.get(n);

      if (value === undefined) {
        throw new Exception(`Value for index ${n} not found on object`);
      }

      return value;
    }),
    "list?": rt.makeFunction(isList),
    "pair?": rt.makeFunction((obj) => obj instanceof Cons),
    "number?": rt.makeFunction((obj) => typeof obj === "number"),
    "string?": rt.makeFunction((obj) => typeof obj === "string"),
    "boolean?": rt.makeFunction((obj) => typeof obj === "boolean"),
    "nil?": rt.makeFunction((obj) => obj == null),
    "keyword?": rt.makeFunction(
      (obj) => typeof obj === "symbol" && obj.description.startsWith(":")
    ),
    "equal?": rt.makeFunction((a, b) => {
      if (rt.hasDict(a) && rt.hasDict(b)) {
        return equal(rt.getMetaField(a, "dict"), rt.getMetaField(b, "dict"));
      }
      return equal(a, b);
    }),
    "is?": rt.makeFunction((a, b) => Object.is(a, b)),
    append: rt.makeFunction((obj1, obj2) => {
      if (typeof obj1 === "string" && typeof obj2 === "string") {
        return obj1 + obj2;
      } else if (obj1 instanceof Cons) {
        return Cons.from(obj1).append(obj2);
      } else {
        rt.failRuntime(`Value of type ${typeof obj1} cannot be appended`);
      }
    }),
    with: rt.makeFunction((rec1, rec2) => {
      const newDict = Object.assign(
        {},
        rt.getMetaField(rec1, "dict"),
        rt.getMetaField(rec2, "dict")
      );
      return rt.makeObject(newDict);
    }),
    prop: rt.makeFunction((prop, obj) => rt.getField(obj, prop)),
  };
});
