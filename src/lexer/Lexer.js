import { SyntaxException } from "../shared/exceptions.js";
import { InputStream } from "./InputStream.js";
import { SrcLoc } from "./SrcLoc.js";
import { Token } from "./Token.js";
import { TokenTypes } from "./TokenTypes.js";
import {
  isDash,
  isDigit,
  isDot,
  isNewline,
  isNumber,
  isPlus,
  isSemicolon,
  isWhitespace,
} from "./utils.js";

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

  readEscaped() {}

  readEscapeSequence() {}

  readKeyword() {}

  /**
   * Reads a number token from the input stream
   * @returns {Token}
   */
  readNumber() {
    let { pos, line, col, file } = this.input;
    const srcloc = SrcLoc.new(pos, line, col, file);
    let num = "";

    if (isDash(this.input.peek()) || isPlus(this.input.peek())) {
      num += this.input.next();
    }

    num += this.input.readWhile((ch) => isDigit(ch) || isDot(ch));

    if (!isNumber(num)) {
      throw new SyntaxException(num, srcloc);
    }

    return Token.new(TokenTypes.Number, num, srcloc);
  }

  readString() {}

  readSymbol() {}

  /**
   * Tokenizes the input stream
   * @returns {Token[]}
   */
  tokenize() {
    /** @type {Token[]} */
    let tokens = [];

    while (!this.input.eof()) {
      let ch = this.input.peek();
      if (isWhitespace(ch)) {
        this.input.readWhile(isWhitespace);
      } else if (isSemicolon(ch)) {
        this.input.readWhile((ch) => !isNewline(ch) && !this.input.eof());
      } else if (isDash(ch) && isDigit(this.input.lookahead(1))) {
        tokens.push(this.readNumber());
      } else if (isPlus(ch) && isDigit(this.input.lookahead(1))) {
        tokens.push(this.readNumber());
      } else if (isDigit(ch)) {
        tokens.push(this.readNumber());
      } else {
        const { pos, line, col, file } = this.input;
        throw new SyntaxException(ch, SrcLoc.new(pos, line, col, file));
      }
    }

    return tokens;
  }
}
