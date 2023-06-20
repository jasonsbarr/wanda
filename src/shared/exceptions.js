import { SrcLoc } from "../lexer/SrcLoc.js";

/**
 * Base error class for Wanda
 * @prop {string} msg
 * @prop {string[]} stack
 */
export class Exception extends Error {
  /**
   * Constructs the Exception class
   * @param {string} msg
   * @param {string[]} [stack=[]]
   */
  constructor(msg, stack = []) {
    super(msg);
    this.wandaStack = stack;
    this[Symbol.for(":dict")] = { message: msg };
  }

  /**
   * Adds call frame info to stack trace
   * @param {string} frame
   */
  appendStack(frame) {
    this.wandaStack.push(frame);
  }

  /**
   * Dumps the call stack as a string
   * @returns {string}
   */
  dumpStack() {
    let stack = [...this.wandaStack].reverse();

    let dump = "";

    let i = 0;
    for (let frame of stack) {
      dump += `${i !== 0 ? "  " : ""}${frame}\n`;
      i++;
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
    this[Symbol.for(":dict")] = { message: msg };
  }
}
