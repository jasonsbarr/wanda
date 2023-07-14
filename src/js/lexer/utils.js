// Character matchers
export const isDot = (ch) => /\./.test(ch);
export const isDigit = (ch) => /\d/.test(ch);
export const isWhitespace = (ch) => /[\s,]/.test(ch);
export const isSemicolon = (ch) => /;/.test(ch);
export const isNewline = (ch) => /\n/.test(ch);
export const isDash = (ch) => /\-/.test(ch);
export const isPlus = (ch) => /\+/.test(ch);
export const isDoubleQuote = (ch) => /"/.test(ch);
export const isColon = (ch) => /:/.test(ch);
export const isSymbolStart = (ch) => /[=<>%|?\\/*\p{L}_$!+-]/u.test(ch);
export const isSymbolChar = (ch) =>
  /[=@~<>%&|?\\/^*&#'\p{L}\p{N}_$!+-]/u.test(ch);
export const isLParen = (ch) => /\(/.test(ch);
export const isRParen = (ch) => /\)/.test(ch);
export const isLBrack = (ch) => /\[/.test(ch);
export const isRBrack = (ch) => /\]/.test(ch);
export const isLBrace = (ch) => /\{/.test(ch);
export const isRBrace = (ch) => /\}/.test(ch);
export const isAmp = (ch) => /&/.test(ch);

// String matchers
export const isNumber = (str) => /^[+-]?\d+(\.\d+)?$/.test(str);
export const isBoolean = (str) => /true|false/.test(str);
export const isNil = (str) => /nil/.test(str);
