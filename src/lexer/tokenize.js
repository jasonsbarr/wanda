import { InputStream } from "./InputStream.js";
import { Lexer } from "./Lexer.js";
import { Token } from "./Token.js";

/**
 * Tokenizes an input string
 * @param {string} input
 * @param {string} file
 * @returns {Token[]}
 */
export const tokenize = (input, file = "<stdin>") => Lexer.new(InputStream.new(input, file)).tokenize();
