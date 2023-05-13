import { SrcLoc } from "../lexer/SrcLoc";

/**
 * @class
 * @desc Base error class for Wanda
 */
export class Exception extends Error {
  /**
   * Constructs the Exception class
   * @param {string} msg
   */
  constructor(msg) {
    super(msg);
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
