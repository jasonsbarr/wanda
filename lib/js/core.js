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
    print: rt.makeFunction(print, { contract: "(any -> string)" }),
    println: rt.makeFunction(println, { contract: "(any -> string)" }),
    cons: rt.makeFunction(cons, { contract: "(any, any -> (list any))" }),
    car: rt.makeFunction((pair) => pair.car, {
      contract: "((list any) -> any)",
    }),
    cdr: rt.makeFunction((pair) => pair.cdr, {
      contract: "((list any) -> any)",
    }),
    string: rt.makeFunction(printString, { contract: "(any -> string)" }),
    number: rt.makeFunction(Number, { contract: "(string -> number)" }),
    boolean: rt.makeFunction((val) => isTruthy(val), {
      contract: "(any -> boolean)",
    }),
    keyword: rt.makeFunction((str) => Symbol.for(":" + str), {
      contract: "(string -> keyword)",
    }),
    "+": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
      { contract: "(number, number, &(vector number) -> number)" }
    ),
    "-": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
      { contract: "(number, number, &(vector number) -> number)" }
    ),
    "*": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
      { contract: "(number, number, &(vector number) -> number)" }
    ),
    "/": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
      { contract: "(number, number, &(vector number) -> number)" }
    ),
    "%": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((quot, n) => quot % n, a % b),
      { contract: "(number, number, &(vector number) -> number)" }
    ),
    "=": rt.makeFunction((a, b) => a === b, {
      contract: "(number, number -> boolean)",
    }),
    ">": rt.makeFunction((a, b) => a > b, {
      contract: "(number, number -> boolean)",
    }),
    ">=": rt.makeFunction((a, b) => a >= b, {
      contract: "(number, number -> boolean)",
    }),
    "<": rt.makeFunction((a, b) => a < b, {
      contract: "(number, number -> boolean)",
    }),
    "<=": rt.makeFunction((a, b) => a <= b, {
      contract: "(number, number -> boolean)",
    }),
    not: rt.makeFunction((x) => !x, { contract: "(any -> boolean)" }),
    list: rt.makeFunction((...args) => Cons.from(args), {
      contract: "(&(vector any) -> (list any))",
    }),
    length: rt.makeFunction(
      (obj) => {
        if (obj instanceof Cons) {
          let i = 0;
          for (let _ of obj) {
            i++;
          }
          return i;
        }

        return obj.length;
      },
      { contract: "((list any) -> number)" }
    ),
    get: rt.makeFunction(
      (n, obj) => {
        const value = obj.get(n);

        if (value === undefined) {
          throw new Exception(`Value for index ${n} not found on object`);
        }

        return value;
      },
      { contract: "((list any) -> any)" }
    ),
    "list?": rt.makeFunction(isList, { contract: "((list any) -> boolean)" }),
    "pair?": rt.makeFunction((obj) => obj instanceof Cons, {
      contract: "((list any) -> boolean)",
    }),
    "number?": rt.makeFunction((obj) => typeof obj === "number", {
      contract: "(any -> boolean)",
    }),
    "string?": rt.makeFunction((obj) => typeof obj === "string", {
      contract: "(any -> boolean)",
    }),
    "boolean?": rt.makeFunction((obj) => typeof obj === "boolean", {
      contract: "(any -> boolean)",
    }),
    "nil?": rt.makeFunction((obj) => obj == null, {
      contract: "(any -> boolean)",
    }),
    "keyword?": rt.makeFunction(
      (obj) => typeof obj === "symbol" && obj.description.startsWith(":"),
      { contract: "(any -> boolean)" }
    ),
    "equal?": rt.makeFunction(
      (a, b) => {
        if (rt.hasDict(a) && rt.hasDict(b)) {
          return equal(rt.getMetaField(a, "dict"), rt.getMetaField(b, "dict"));
        }
        return equal(a, b);
      },
      { contract: "(any, any) -> boolean" }
    ),
    "is?": rt.makeFunction((a, b) => Object.is(a, b), {
      contract: "(any, any -> boolean)",
    }),
    append: rt.makeFunction(
      (obj1, obj2) => {
        if (typeof obj1 === "string" && typeof obj2 === "string") {
          return obj1 + obj2;
        } else if (obj1 instanceof Cons) {
          return Cons.from(obj1).append(obj2);
        } else if (Array.isArray(obj1)) {
          return [...obj1].push(obj2);
        } else {
          rt.failRuntime(`Value of type ${typeof obj1} cannot be appended`);
        }
      },
      { contract: "(any, any -> any)" }
    ),
    with: rt.makeFunction(
      (rec1, rec2) => {
        const newDict = Object.assign(
          {},
          rt.getMetaField(rec1, "dict"),
          rt.getMetaField(rec2, "dict")
        );
        return rt.makeObject(newDict);
      },
      { contract: "(any, any -> any)" }
    ),
    prop: rt.makeFunction((prop, obj) => rt.getField(obj, prop), {
      contract: "(string, any -> any)",
    }),
    each: rt.makeFunction(
      (fn, lst) => {
        for (let item of lst) {
          fn(item);
        }
      },
      {
        contract: "((any -> nil), (list any) -> nil)",
      }
    ),
    map: rt.makeFunction(
      (fn, lst) => {
        let mapped = [];
        for (let item of lst) {
          mapped.push(fn(item));
        }
        return Cons.from(mapped);
      },
      {
        contract: "((any -> any), (list any) -> (list any))",
      }
    ),
    filter: rt.makeFunction(
      (fn, lst) => {
        let filtered = [];
        for (let item of lst) {
          if (rt.isTruthy(fn(item))) {
            filtered.push(item);
          }
        }
        return Cons.from(filtered);
      },
      {
        contract: "((any -> boolean), (list any) -> (list any))",
      }
    ),
    fold: rt.makeFunction(
      (fn, init, lst) => {
        let acc = init;
        for (let item of lst) {
          acc = fn(acc, item);
        }
        return acc;
      },
      {
        contract: "((any, any -> any), any, (list any) -> any)",
      }
    ),
    "fold-r": rt.makeFunction(
      (fn, init, lst) => {
        let acc = init;
        const reversed = [...lst].reverse();
        for (let item of reversed) {
          acc = fn(acc, item);
        }
        return acc;
      },
      {
        contract: "((any, any -> any), any, (list any) -> any)",
      }
    ),
  };
});
