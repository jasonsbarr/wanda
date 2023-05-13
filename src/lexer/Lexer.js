import { InputStream } from "./InputStream";

/**
 * @class
 * @desc Tokenizes the input stream into an array of tokens
 */
export class Lexer {
    /**
     * Constructs the Lexer
     * @param {InputStream} input
     */
    constructor(input) {
        this.input = input;
    }

    /**
     * Static constructor for Lexer
     * @param {InputStream} input
     * @returns {Lexer}
     */
    static new(input) {
        return new Lexer(input);
    }

    get length() {
        return this.input.length;
    }
}
