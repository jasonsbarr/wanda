import equal from "fast-deep-equal/es6/index.js";
import { makeModule } from "../../src/runtime/Module.js";
import { Cons, cons } from "../../src/shared/cons.js";
import { print } from "../../src/printer/print.js";
import { println } from "../../src/printer/println.js";
import { printString } from "../../src/printer/printString.js";
import { isTruthy, makeKeyword } from "../../src/runtime/utils.js";
import { Exception } from "../../src/shared/exceptions.js";
import { hasMetaField } from "../../src/runtime/object.js";

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
    print: rt.makeFunction(print, {
      contract: "(any -> nil)",
      name: "print",
    }),
    println: rt.makeFunction(println, {
      contract: "(any -> nil)",
      name: "println",
    }),
    cons: rt.makeFunction(cons, {
      contract: "(any, any -> (list any))",
      name: "cons",
    }),
    car: rt.makeFunction((pair) => pair.car, {
      contract: "((list any) -> any)",
      name: "car",
    }),
    cdr: rt.makeFunction((pair) => pair.cdr, {
      contract: "((list any) -> any)",
      name: "cdr",
    }),
    string: rt.makeFunction(printString, {
      contract: "(any -> string)",
      name: "string",
    }),
    number: rt.makeFunction(Number, {
      contract: "(string -> number)",
      name: "number",
    }),
    boolean: rt.makeFunction((val) => isTruthy(val), {
      contract: "(any -> boolean)",
      name: "boolean",
    }),
    keyword: rt.makeFunction((str) => Symbol.for(":" + str), {
      contract: "(string -> keyword)",
      name: "keyword",
    }),
    "+": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
      { contract: "(number, number, &(vector number) -> number)", name: "+" }
    ),
    "-": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
      { contract: "(number, number, &(vector number) -> number)", name: "-" }
    ),
    "*": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
      { contract: "(number, number, &(vector number) -> number)", name: "*" }
    ),
    "/": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
      { contract: "(number, number, &(vector number) -> number)", name: "/" }
    ),
    "%": rt.makeFunction(
      (a, b, ...nums) => nums.reduce((quot, n) => quot % n, a % b),
      { contract: "(number, number, &(vector number) -> number)", name: "%" }
    ),
    "=": rt.makeFunction((a, b) => a === b, {
      contract: "(number, number -> boolean)",
      name: "=",
    }),
    ">": rt.makeFunction((a, b) => a > b, {
      contract: "(number, number -> boolean)",
      name: ">",
    }),
    ">=": rt.makeFunction((a, b) => a >= b, {
      contract: "(number, number -> boolean)",
      name: ">=",
    }),
    "<": rt.makeFunction((a, b) => a < b, {
      contract: "(number, number -> boolean)",
      name: "<",
    }),
    "<=": rt.makeFunction((a, b) => a <= b, {
      contract: "(number, number -> boolean)",
      name: "<=",
    }),
    not: rt.makeFunction((x) => !x, {
      contract: "(any -> boolean)",
      name: "not",
    }),
    list: rt.makeFunction((...args) => Cons.from(args), {
      contract: "(&(vector any) -> (list any))",
      name: "list",
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
      { contract: "((list any) -> number)", name: "length" }
    ),
    get: rt.makeFunction(
      (n, obj) => {
        const value = obj.get(n);

        if (value === undefined) {
          throw new Exception(`Value for index ${n} not found on object`);
        }

        return value;
      },
      { contract: "((list any) -> any)", name: "get" }
    ),
    "list?": rt.makeFunction(isList, {
      contract: "((list any) -> boolean)",
      name: "list?",
    }),
    "pair?": rt.makeFunction((obj) => obj instanceof Cons, {
      contract: "((list any) -> boolean)",
      name: "pair?",
    }),
    "number?": rt.makeFunction((obj) => typeof obj === "number", {
      contract: "(any -> boolean)",
      name: "number?",
    }),
    "string?": rt.makeFunction((obj) => typeof obj === "string", {
      contract: "(any -> boolean)",
      name: "string?",
    }),
    "boolean?": rt.makeFunction((obj) => typeof obj === "boolean", {
      contract: "(any -> boolean)",
      name: "boolean?",
    }),
    "nil?": rt.makeFunction((obj) => obj == null, {
      contract: "(any -> boolean)",
      name: "nil?",
    }),
    "keyword?": rt.makeFunction(
      (obj) => typeof obj === "symbol" && obj.description.startsWith(":"),
      { contract: "(any -> boolean)", name: "keyword?" }
    ),
    "equal?": rt.makeFunction(
      (a, b) => {
        if (rt.hasDict(a) && rt.hasDict(b)) {
          return equal(rt.getMetaField(a, "dict"), rt.getMetaField(b, "dict"));
        }
        return equal(a, b);
      },
      { contract: "(any, any) -> boolean", name: "equal?" }
    ),
    "not-equal?": rt.makeFunction(
      (a, b) => {
        if (rt.hasDict(a) && rt.hasDict(b)) {
          return !equal(rt.getMetaField(a, "dict"), rt.getMetaField(b, "dict"));
        }
        return !equal(a, b);
      },
      { contract: "(any, any) -> boolean", name: "not-equal?" }
    ),
    "is?": rt.makeFunction((a, b) => Object.is(a, b), {
      contract: "(any, any -> boolean)",
      name: "is?",
    }),
    append: rt.makeFunction(
      (obj1, obj2) => {
        if (typeof obj1 === "string" && typeof obj2 === "string") {
          return obj1 + obj2;
        } else if (obj1 instanceof Cons) {
          return Cons.from(obj1).append(obj2);
        } else if (Array.isArray(obj1)) {
          let v = [...obj1];
          v.push(obj2);
          return v;
        } else {
          rt.failRuntime(`Value of type ${typeof obj1} cannot be appended`);
        }
      },
      { contract: "(any, any -> any)", name: "append" }
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
      { contract: "(any, any -> any)", name: "with" }
    ),
    prop: rt.makeFunction((prop, obj) => rt.getField(obj, prop), {
      contract: "(string, any -> any)",
      name: "prop",
    }),
    each: rt.makeFunction(
      (fn, lst) => {
        for (let item of lst) {
          fn(item);
        }
      },
      {
        contract: "((any -> nil), (list any) -> nil)",
        name: "each",
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
        name: "map",
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
        name: "filter",
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
        name: "fold",
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
        name: "fold-r",
      }
    ),
    typeof: rt.makeFunction((obj) => {
      if (obj == null) {
        return "nil";
      }

      if (hasMetaField(obj, "type")) {
        return obj[makeKeyword("type")];
      }

      if (obj instanceof Cons) {
        return isList(obj) ? "list" : "pair";
      }

      if (Array.isArray(obj)) {
        return "vector";
      }

      return typeof obj;
    }),
    range: rt.makeFunction(
      (start, stop = undefined, step = 1) => {
        if (typeof stop === "undefined") {
          stop = start;
          start = 0;
        }

        let list = null;
        if (start < stop) {
          list = cons(start, list);
          for (let i = start + step; i < stop; i += step) {
            list.append(i);
          }
        } else if (stop < start) {
          list = cons(start, list);
          for (let i = start - step; i > stop; i -= step) {
            list.append(i);
          }
        }

        return list;
      },
      {
        // contract is variadic because language has no concept of default parameters
        contract: "(&(vector number) -> (list number))",
        name: "range",
      }
    ),
  };
});
