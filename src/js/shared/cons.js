import { Exception } from "./exceptions.js";

/**
 * @class Cons
 * @extends Array
 * @desc Cons cell and singly-linked list
 */
export class Cons extends Array {
  /**
   * Constructs a Cons cell
   * @param {any} car
   * @param {any} cdr
   */
  constructor(car, cdr) {
    super(car, cdr);
  }

  /**
   * Constructs a list out of any number of arguments
   * @param {any} first
   * @param  {...any} args
   * @returns {Cons}
   */
  static of(first, ...args) {
    if (first === undefined) {
      return null;
    }

    let list = cons(first, null);

    for (let arg of args) {
      list.append(arg);
    }

    return list;
  }

  /**
   * Converts an iterable to a list
   * @param {Array} iter
   * @returns {Cons}
   */
  static from(iter) {
    return Cons.of(...iter);
  }

  /**
   * Get the head of the Cons cell
   */
  get car() {
    return this[0];
  }

  /**
   * Get the tail of the cons cell
   */
  get cdr() {
    return this[1];
  }

  /**
   * Set the tail of the cons cell
   */
  set cdr(value) {
    this[1] = value;
  }

  append(value) {
    let list = this;
    let cdr = this.cdr;

    while (cdr !== undefined) {
      if (cdr instanceof Cons) {
        if (cdr.cdr === null) {
          // is the end of the list
          cdr.cdr = cons(value, null);
          return list;
        }

        // is not yet at the end of the list; keep going
        cdr = cdr.cdr;
      } else if (cdr === null) {
        // this is a single-item list
        this.cdr = cons(value, null);
        return list;
      } else {
        // this is an improper list and cannot be appended to
        throw new Exception(
          "Cannot append item to improper list or pair whose tail is not nil"
        );
      }
    }

    // if we're out of the loop and haven't returned or errored yet, something bad happened and I don't know what
    throw new Exception(
      `Error trying to append ${
        typeof value === "object" ? JSON.stringify(value, null, 2) : value
      } to list`
    );
  }

  /**
   * Fetch the value at index n of the current list
   * @param {number} i
   * @returns {any}
   */
  get(n) {
    let i = 0;

    for (let value of this) {
      if (i === n) {
        return value;
      }
      i++;
    }

    return undefined;
  }

  toArray() {
    return [...this];
  }

  *[Symbol.iterator]() {
    let value = this.car;
    let tail = this.cdr;

    while (tail !== undefined) {
      if (tail instanceof Cons) {
        yield value;
        value = tail.car;
        tail = tail.cdr;
      } else if (tail === null) {
        yield value;
        tail = undefined;
      } else {
        // is a pair or improper list
        yield value;
        yield tail;
        tail = undefined;
      }
    }
  }
}

export const cons = (car, cdr) => new Cons(car, cdr);

export const isList = (obj) => {
  if (obj != null && obj.constructor?.name !== "Cons") {
    return false;
  } else if (obj == null) {
    return true;
  }

  // only option left is cons
  return isList(obj.cdr);
};
