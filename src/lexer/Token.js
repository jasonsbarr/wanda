import { TokenTypes } from "./TokenTypes.js";
import { SrcLoc } from "./SrcLoc.js";

/**
 * @class
 * @desc Lexical token representing an single lexeme
 * @property {TokenTypes} type
 * @property {string} value
 * @property {SrcLoc} srcloc
 * @property {string} trivia
 */
export class Token {
    /**
     * Constructor for Token class
     * @param {TokenTypes} type
     * @param {string} value
     * @param {SrcLoc} srcloc
     * @param {string} trivia
     */
    constructor(type, value, srcloc, trivia) {
        this.type = type;
        this.value = value;
        this.srcloc = srcloc;
        this.trivia = trivia;
    }
}
