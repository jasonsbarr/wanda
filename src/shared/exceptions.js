import { SrcLoc } from "../lexer/SrcLoc.js";
import { addMetaField } from "../runtime/object.js";

/**
 * @typedef Frame
 * @prop {string} name Name of function being called
 * @prop {SrcLoc?} srcloc
 */
/**
 * Base error class for Wanda
 * @prop {string} msg
 * @prop {Frame[]} stack
 */
export class Exception extends Error {
  /**
   * Constructs the Exception class
   * @param {string} msg
   * @param {Frame[]} [stack=[]]
   */
  constructor(msg, stack = []) {
    super(msg);
    this.wandaStack = stack;

    Object.defineProperty(this, "wandaStack", {
      enumerable: false,
      configurable: false,
      writable: false,
    });

    addMetaField(this, "dict", { message: msg });
  }

  /**
   * Adds call frame info to stack trace
   * @param {Frame} frame
   */
  appendStack(frame) {
    this.wandaStack.push(frame);
  }

  /**
   * Dumps the call stack as a string
   * @returns {string}
   */
  dumpStack() {
    let stack = this.wandaStack;

    let dump = `${this.constructor.name}: ${this.message}`;

    for (let frame of stack) {
      dump += `    at ${
        frame.srcloc
          ? `${frame.srcloc.file} (${frame.srcloc.line}:${frame.srcloc.col}) `
          : ""
      }${frame.name}\n`;
    }

    return dump;
  }
}

/**
 * Syntax errors found during lexing, reading, and parsing
 */
export class SyntaxException extends Exception {
  /**
   * Constructs a SyntaxException
   * @param {string} value
   * @param {SrcLoc} srcloc
   * @param {string} [expected=""]
   */
  constructor(value, srcloc, expected = "") {
    super(
      `Syntax Exception: invalid syntax ${value} found at ${srcloc.file} (${
        srcloc.line
      }:${srcloc.col})${expected ? ` (expected ${expected})` : ""}`
    );
  }
}

/**
 * Type errors found during type checking
 */
export class TypeException extends Exception {
  /**
   * Constructs a TypeException
   * @param {string} msg
   * @param {SrcLoc} srcloc
   */
  constructor(msg, srcloc) {
    super(`${msg} at ${srcloc.file} ${srcloc.line}:${srcloc.col}`);
  }
}

/**
 *  Reference errors found during compilation
 */
export class ReferenceException extends Exception {
  /**
   * Constructs a ReferenceException
   * @param {string} msg
   * @param {SrcLoc} srcloc
   */
  constructor(msg, srcloc) {
    super(`${msg} at ${srcloc.file} ${srcloc.line}:${srcloc.col}`);
  }
}

/**
 * Errors found during runtime
 */
export class RuntimeException extends Exception {
  /**
   * Constructs a RuntimeException
   * @param {string} msg
   */
  constructor(msg) {
    super(msg);
  }
}
