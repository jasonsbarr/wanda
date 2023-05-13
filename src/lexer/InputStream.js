/**
 * @class
 * @desc Object to manage the state of the input to the program
 * @property {string} input
 * @property {number} pos
 * @property {number} line
 * @property {number} col
 * @property {string} file
 * @property {number} length
 */
export class InputStream {
  /**
   * Constructs the InputStream object
   * @param {string} input
   * @param {string} file
   */
  constructor(input, file) {
    this.input = input;
    this.file = file;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }

  /**
   * Static constructor
   * @param {string} input
   * @param {string} file
   * @returns {InputStream}
   */
  static new(input, file) {
    return new InputStream(input, file);
  }

  get length() {
    return this.input.length;
  }

  /**
   * Checks to see if we're at the end of the input
   * @returns {boolean}
   */
  eof() {
    return this.pos >= this.length;
  }

  /**
   * See what the character is n steps in front of the current position
   * @param {number} n
   * @returns {string}
   */
  lookahead(n = 1) {
    return this.input[this.pos + n];
  }

  /**
   * Get the character at the current position and advance the stream
   * @returns {string}
   */
  next() {
    return this.input[this.pos++];
  }

  /**
   * Get the character at the current position in the input stream
   * @returns {string}
   */
  peek() {
    return this.input[this.pos];
  }

  /**
   * @callback Predicate
   * @param {string} ch
   * @returns {boolean}
   */
  /**
   * Reads from the input while pred is true
   * @param {Predicate} pred
   * @returns {string}
   */
  readWhile(pred) {
    let str = "";
    while (pred(this.peek())) {
      str += this.next();
    }

    return str;
  }
}
