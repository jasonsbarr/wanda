import { SyntaxException } from "../shared/exceptions.js";
import { InputStream } from "./InputStream.js";
import { SrcLoc } from "./SrcLoc.js";
import { Token } from "./Token.js";
import { TokenTypes } from "./TokenTypes.js";
import { isDigit, isNewline, isSemicolon, isWhitespace } from "./utils.js";

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

  /**
   * Reads a number token from the input stream
   * @param {string} trivia
   * @returns {Token}
   */
  readNumber(trivia) {
    let { pos, line, col, file } = this.input;
    let num = this.input.readWhile(isDigit);

    return Token.new(
      TokenTypes.Number,
      num,
      SrcLoc.new(pos, line, col, file),
      trivia
    );
  }

  /**
   * Tokenizes the input stream
   * @returns {Token[]}
   */
  tokenize() {
    /** @type {Token[]} */
    let tokens = [];
    let ch = this.input.peek();
    let trivia = "";

    if (isWhitespace(ch)) {
      trivia += this.input.readWhile(isWhitespace);
      ch = this.input.peek();
    } else if (isSemicolon(ch)) {
      trivia = this.input.readWhile((ch) => !isNewline(ch));
      ch = this.input.peek();
    }

    if (isDigit(ch)) {
      tokens.push(this.readNumber(trivia));
    } else {
      const { pos, line, col, file } = this.input;
      throw new SyntaxException(ch, SrcLoc.new(pos, line, col, file));
    }

    return tokens;
  }
}
