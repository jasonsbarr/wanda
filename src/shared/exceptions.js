import { SrcLoc } from "../lexer/SrcLoc.js";

/**
 * @class
 * @desc Base error class for Wanda
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
    this.stack = stack;
  }

  /**
   * Adds call frame info to stack trace
   * @param {string} frame
   */
  appendStack(frame) {
    this.stack.push(frame);
  }

  /**
   * Dumps the call stack as a string
   * @returns {string}
   */
  dumpStack() {
    let stack = [...this.stack].reverse();

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
 * @class
 * @desc Syntax errors found during lexing, reading, and parsing
 */
export class SyntaxException extends Exception {
  /**
   *
   * @param {string} value
   * @param {SrcLoc} srcloc
   */
  constructor(value, srcloc) {
    super(
      `Syntax Exception: invalid syntax ${value} found at ${srcloc.file} (${srcloc.line}:${srcloc.col})`
    );
  }
}
