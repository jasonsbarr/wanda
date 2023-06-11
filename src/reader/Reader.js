import { Token } from "../lexer/Token.js";

/**
 * @class
 * @desc Manages the token stream for the read functions
 * @property {Token[]} tokens
 * @property {number} pos
 */
export class Reader {
  /**
   * Constructs the Reader object
   * @param {Token[]} tokens
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  /**
   * Static constructor
   * @param {Token[]} tokens
   * @returns {Reader}
   */
  static new(tokens) {
    return new Reader(tokens);
  }

  get length() {
    return this.tokens.length;
  }

  /**
   * Check if we're at the end of the token stream
   * @returns {boolean}
   */
  eof() {
    return this.pos >= this.length;
  }

  /**
   * Gets the token at current position plus n
   * @param {number} n
   * @returns {Token}
   */
  lookahead(n = 1) {
    return this.tokens[this.pos + n];
  }

  /**
   * Get the current token and advance the stream
   * @returns {Token}
   */
  next() {
    return this.tokens[this.pos++];
  }

  /**
   * Get the current token
   * @returns {Token}
   */
  peek() {
    return this.tokens[this.pos];
  }

  /**
   * Skip over the current token
   */
  skip() {
    this.pos++;
  }
}
