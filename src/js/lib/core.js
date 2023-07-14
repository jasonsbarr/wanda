import equal from "fast-deep-equal/es6/index.js";
import { Module, makeModule } from "../runtime/Module.js";
import { Cons, cons } from "../shared/cons.js";
import { print } from "../printer/print.js";
import { println } from "../printer/println.js";
import { printString } from "../printer/printString.js";
import { isTruthy, makeKeyword } from "../runtime/utils.js";
import { Exception } from "../shared/exceptions.js";
import { hasMetaField } from "../runtime/object.js";

// Module name
const name = "Core";
// Wanda modules required by the current module
const requires = [];
// JavaScript modules required by the current module
const nativeRequires = [];
// Values provided by the module with their types
const values = {
  __rt__: "any",
  print: "(any -> nil)",
  println: "(any -> nil)",
  cons: "(any, any -> (list any))",
  car: "((list any) -> any)",
  cdr: "((list any) -> any)",
  string: "(any -> string)",
  number: "(string -> number)",
  boolean: "(any -> boolean)",
  keyword: "(string -> keyword)",
  "+": "(number, number, &(vector number) -> number)",
  "-": "(number, number, &(vector number) -> number)",
  "*": "(number, number, &(vector number) -> number)",
  "/": "(number, number, &(vector number) -> number)",
  "%": "(number, number, &(vector number) -> number)",
  "=": "(number, number -> boolean)",
  ">": "(number, number -> boolean)",
  ">=": "(number, number -> boolean)",
  "<": "(number, number -> boolean)",
  "<=": "(number, number -> boolean)",
  not: "(any -> boolean)",
  list: "(&(vector any) -> (list any))",
  length: "((list any) -> number)",
  get: "(((list any) || (vector any)) -> any)",
  "list?": "((list any) -> boolean)",
  "pair?": "((list any) -> boolean)",
  "number?": "(any -> boolean)",
  "string?": "(any -> boolean)",
  "boolean?": "(any -> boolean)",
  "nil?": "(any -> boolean)",
  "keyword?": "(any -> boolean)",
  "equal?": "(any, any) -> boolean",
  "not-equal?": "(any, any) -> boolean",
  "is?": "(any, any -> boolean)",
  append: "(any, any -> any)",
  with: "(any, any -> any)",
  prop: "(string, any -> any)",
  each: "((any -> nil), (list any) -> nil)",
  map: "((any -> any), (list any) -> (list any))",
  filter: "((any -> boolean), (list any) -> (list any))",
  fold: "((any, any -> any), any, (list any) -> any)",
  "fold-r": "((any, any -> any), any, (list any) -> any)",
  typeof: "(any -> string)",
  // contract is variadic because language has no concept of default parameters yet
  // range can take 1, 2, or 3 numbers as args
  range: "(&(vector number) -> (list number))",
  // same as for range - this can take either 2 or 3 args
  slice: "(number, &(vector any) -> ((vector any) || (list any)))",
};
// Types provided by the module
const types = {};
// Absolute path to the module file
const fileURL = import.meta.url;

/** @type {Module} */
export const theModule = makeModule(
  name,
  (rt, ns) => {
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
      __rt__: rt,
      print: rt.makeFunction(print, {
        name: "print",
      }),
      println: rt.makeFunction(println, {
        name: "println",
      }),
      cons: rt.makeFunction(cons, {
        name: "cons",
      }),
      car: rt.makeFunction((pair) => pair.car, {
        name: "car",
      }),
      cdr: rt.makeFunction((pair) => pair.cdr, {
        name: "cdr",
      }),
      string: rt.makeFunction(printString, {
        name: "string",
      }),
      number: rt.makeFunction(Number, {
        name: "number",
      }),
      boolean: rt.makeFunction((val) => isTruthy(val), {
        name: "boolean",
      }),
      keyword: rt.makeFunction((str) => Symbol.for(":" + str), {
        name: "keyword",
      }),
      "+": rt.makeFunction(
        (a, b, ...nums) => nums.reduce((sum, n) => sum + n, a + b),
        { name: "+" }
      ),
      "-": rt.makeFunction(
        (a, b, ...nums) => nums.reduce((diff, n) => diff - n, a - b),
        { name: "-" }
      ),
      "*": rt.makeFunction(
        (a, b, ...nums) => nums.reduce((prod, n) => prod * n, a * b),
        { name: "*" }
      ),
      "/": rt.makeFunction(
        (a, b, ...nums) => nums.reduce((quot, n) => quot / n, a / b),
        { name: "/" }
      ),
      "%": rt.makeFunction(
        (a, b, ...nums) => nums.reduce((quot, n) => quot % n, a % b),
        { name: "%" }
      ),
      "=": rt.makeFunction((a, b) => a === b, {
        name: "=",
      }),
      ">": rt.makeFunction((a, b) => a > b, {
        name: ">",
      }),
      ">=": rt.makeFunction((a, b) => a >= b, {
        name: ">=",
      }),
      "<": rt.makeFunction((a, b) => a < b, {
        name: "<",
      }),
      "<=": rt.makeFunction((a, b) => a <= b, {
        name: "<=",
      }),
      not: rt.makeFunction((x) => !x, {
        name: "not",
      }),
      list: rt.makeFunction((...args) => Cons.from(args), {
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
        { name: "length" }
      ),
      get: rt.makeFunction(
        (n, obj) => {
          let value =
            obj.get && typeof obj.get === "function" ? obj.get(n) : obj[n];

          if (value === undefined) {
            throw new Exception(`Value for index ${n} not found on object`);
          }

          return value;
        },
        { name: "get" }
      ),
      "list?": rt.makeFunction(isList, {
        name: "list?",
      }),
      "pair?": rt.makeFunction((obj) => obj instanceof Cons, {
        name: "pair?",
      }),
      "number?": rt.makeFunction((obj) => typeof obj === "number", {
        name: "number?",
      }),
      "string?": rt.makeFunction((obj) => typeof obj === "string", {
        name: "string?",
      }),
      "boolean?": rt.makeFunction((obj) => typeof obj === "boolean", {
        name: "boolean?",
      }),
      "nil?": rt.makeFunction((obj) => obj == null, {
        name: "nil?",
      }),
      "keyword?": rt.makeFunction(
        (obj) => typeof obj === "symbol" && obj.description.startsWith(":"),
        { name: "keyword?" }
      ),
      "equal?": rt.makeFunction(
        (a, b) => {
          if (rt.hasDict(a) && rt.hasDict(b)) {
            return equal(
              rt.getMetaField(a, "dict"),
              rt.getMetaField(b, "dict")
            );
          }
          return equal(a, b);
        },
        { name: "equal?" }
      ),
      "not-equal?": rt.makeFunction(
        (a, b) => {
          if (rt.hasDict(a) && rt.hasDict(b)) {
            return !equal(
              rt.getMetaField(a, "dict"),
              rt.getMetaField(b, "dict")
            );
          }
          return !equal(a, b);
        },
        { name: "not-equal?" }
      ),
      "is?": rt.makeFunction((a, b) => Object.is(a, b), {
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
        { name: "append" }
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
        { name: "with" }
      ),
      prop: rt.makeFunction((prop, obj) => rt.getField(obj, prop), {
        name: "prop",
      }),
      each: rt.makeFunction(
        (fn, lst) => {
          for (let item of lst) {
            fn(item);
          }
        },
        {
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
          name: "fold-r",
        }
      ),
      typeof: rt.makeFunction(
        (obj) => {
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
        },
        {
          name: "typeof",
        }
      ),
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
          name: "range",
        }
      ),
      slice: rt.makeFunction(
        (start, end, obj = undefined) => {
          if (start < 0) {
            start = [...obj].length + start;
          }

          if (end < 0) {
            end = [...obj].length + end;
          } else if (obj === undefined) {
            // didn't pass in an end value, which is valid
            obj = end;
            end = [...obj].length;
          }

          if (isList(obj)) {
            let values = [];
            let i = start;

            while (i < end && obj.get(i) !== undefined) {
              values.push(obj.get(i));
            }

            return Cons.from(values);
          } else if (Array.isArray(obj)) {
            return obj.slice(start, end);
          } else {
            throw new Exception(
              "slice can only take a list or vector as its argument"
            );
          }
        },
        {
          name: "slice",
        }
      ),
    };
  },
  { requires, nativeRequires, values, types, fileURL }
);
