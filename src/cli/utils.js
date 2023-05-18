export const countIndent = (str) => {
  let indentCount = 0;

  for (let char of str) {
    if (char === "(" || char === "[" || char === "{") {
      indentCount++;
    } else if (char === ")" || char === "]" || char === "}") {
      indentCount--;
    }
  }

  return indentCount;
};
