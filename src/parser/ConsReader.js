import { Cons, cons } from "../shared/cons.js";

/**
 * @typedef {import("../reader/read.js").Form} Form
 */

/**
 * @class ConsReader
 * @desc Manages state for parse tree returned by reader
 */
export class ConsReader {
  /**
   * Constructor for ConsReader
   * @param {Cons} forms
   */
  constructor(forms) {
    this.forms = forms;
    this.pos = 0;
  }

  /**
   * Static constructor for ConsReader
   * @param {Cons} forms
   * @returns {ConsReader}
   */
  static new(forms) {
    return new ConsReader(forms);
  }

  /**
   * Gets the length of the current reader
   */
  get length() {
    return [...this.forms].length;
  }

  /**
   * Check if we've reached the end of the parse tree
   * @returns {boolean}
   */
  eof() {
    return this.pos >= this.length;
  }

  /**
   * Gets the form at the current index
   * @returns {Form}
   */
  peek() {
    return this.forms.get(this.pos);
  }

  /**
   * Gets the form at the current index and advances the parse stream
   * @returns {Form}
   */
  pop() {
    return this.forms.get(this.pos++);
  }

  /**
   * Skips over the current form
   */
  skip() {
    this.pos++;
  }
}
