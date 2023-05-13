// Character matchers
export const isDot = (ch) => /\./.test(ch);
export const isDigit = (ch) => /\d/.test(ch);
export const isWhitespace = (ch) => /\s/.test(ch);
export const isSemicolon = (ch) => /;/.test(ch);
export const isNewline = (ch) => /\n/.test(ch);

// String matchers
export const isNumber = (str) => /^[+-]?\d+(\.\d+)?$/.test(str);
