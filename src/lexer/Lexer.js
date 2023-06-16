import { Exception, SyntaxException } from "../shared/exceptions.js";
import { InputStream } from "./InputStream.js";
import { SrcLoc } from "./SrcLoc.js";
import { Token } from "./Token.js";
import { TokenTypes } from "./TokenTypes.js";
import {
  isAmp,
  isBoolean,
  isColon,
  isDash,
  isDigit,
  isDot,
  isDoubleQuote,
  isLBrace,
  isLBrack,
  isLParen,
  isNewline,
  isNil,
  isNumber,
  isPlus,
  isRBrace,
  isRBrack,
  isRParen,
  isSemicolon,
  isSymbolChar,
  isSymbolStart,
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

  /**
   * Reads the contents of a double-quoted string
   * @returns {string}
   */
  readEscaped() {
    let str = "";
    let escaped = false;
    let ended = false;

    while (!this.input.eof()) {
      let ch = this.input.next();

      if (escaped) {
        str += this.readEscapeSequence(ch);
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (isDoubleQuote(ch)) {
        ended = true;
        str += ch;
        break;
      } else if (ch === "\n") {
        throw new Exception(
          "Unexpected newline in nonterminated single-line string literal"
        );
      } else if (ch === "`") {
        str += "\\`";
      } else {
        str += ch;
      }
    }

    if (!ended && this.input.eof()) {
      throw new Exception(
        "Expected double quote to close string literal; got EOF"
      );
    }

    return str;
  }

  /**
   * Converts an escape sequence into a literal character
   * @param {string} c
   * @returns {string}
   */
  readEscapeSequence(c) {
    let str = "";
    let seq = "";

    if (c === "n") {
      str += "\n";
    } else if (c === "b") {
      str += "\b";
    } else if (c === "f") {
      str += "\f";
    } else if (c === "r") {
      str += "\r";
    } else if (c === "t") {
      str += "\t";
    } else if (c === "v") {
      str += "\v";
    } else if (c === "0") {
      str += "\0";
    } else if (c === "'") {
      str += "'";
    } else if (c === '"') {
      str += '"';
    } else if (c === "\\") {
      str += "\\";
    } else if (c === "u" || c === "U") {
      // is Unicode escape sequence
      seq += this.input.readWhile(isHexDigit);
      str += String.fromCodePoint(parseInt(seq, 16));
    }

    return str;
  }

  /**
   * REads a keyword from the input stream
   * @returns {Token}
   */
  readKeyword() {
    let { pos, line, col, file } = this.input;
    const srcloc = SrcLoc.new(pos, line, col, file);
    const kw = this.input.next() + this.input.readWhile(isSymbolChar);

    return Token.new(TokenTypes.Keyword, kw, srcloc);
  }

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

  /**
   * Reads a string literal from the input stream
   * @returns {Token}
   */
  readString() {
    let { pos, line, col, file } = this.input;
    const srcloc = SrcLoc.new(pos, line, col, file);
    let str = this.input.next(); // collect opening double-quote

    str += this.readEscaped();
    return Token.new(TokenTypes.String, str, srcloc);
  }

  /**
   * Reads a symbol or primitive literal from the input stream
   * @returns {Token}
   */
  readSymbol() {
    let { pos, line, col, file } = this.input;
    const srcloc = SrcLoc.new(pos, line, col, file);
    const sym = this.input.readWhile(isSymbolChar);

    if (isBoolean(sym)) {
      return Token.new(TokenTypes.Boolean, sym, srcloc);
    } else if (isNil(sym)) {
      return Token.new(TokenTypes.Nil, sym, srcloc);
    }

    return Token.new(TokenTypes.Symbol, sym, srcloc);
  }

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
      } else if (isDoubleQuote(ch)) {
        tokens.push(this.readString());
      } else if (isColon(ch)) {
        tokens.push(this.readKeyword());
      } else if (isSymbolStart(ch)) {
        tokens.push(this.readSymbol());
      } else if (isLParen(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.LParen, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isRParen(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.RParen, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isLBrack(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.LBrack, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isRBrack(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.RBrack, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isLBrace(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.LBrace, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isRBrace(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.RBrace, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isDot(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.Dot, ch, SrcLoc.new(pos, line, col, file))
        );
      } else if (isAmp(ch)) {
        const { pos, line, col, file } = this.input;
        this.input.next(); // skip over punc
        tokens.push(
          Token.new(TokenTypes.Amp, ch, SrcLoc.new(pos, line, col, file))
        );
      } else {
        const { pos, line, col, file } = this.input;
        throw new SyntaxException(ch, SrcLoc.new(pos, line, col, file));
      }
    }

    return tokens;
  }
}
