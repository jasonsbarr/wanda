import { TokenTypes } from "./TokenTypes.js";
import { SrcLoc } from "./SrcLoc.js";

/**
 * @class
 * @desc Lexical token representing an single lexeme
 * @property {TokenTypes} type
 * @property {string} value
 * @property {SrcLoc} srcloc
 */
export class Token {
  /**
   * Constructor for Token class
   * @param {TokenTypes} type
   * @param {string} value
   * @param {SrcLoc} srcloc
   */
  constructor(type, value, srcloc) {
    this.type = type;
    this.value = value;
    this.srcloc = srcloc;
  }

  /**
   * Static constructor
   * @param {TokenTypes} type
   * @param {string} value
   * @param {SrcLoc} srcloc
   * @returns {Token}
   */
  static new(type, value, srcloc) {
    return new Token(type, value, srcloc);
  }
}
