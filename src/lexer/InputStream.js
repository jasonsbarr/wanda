/**
 * @class
 * @desc Object to manage the state of the input to the program
 * @property {string} input
 * @property {number} pos
 * @property {number} line
 * @property {number} col
 * @property {number} length
 */
export class InputStream {
    /**
     * Constructs the InputStream object
     * @param {string} input
     */
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.line = 1;
        this.col = 1;
    }

    /**
     * Static constructor
     * @param {string} input
     * @returns {InputStream}
     */
    static new(input) {
        return new InputStream(input);
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
}
