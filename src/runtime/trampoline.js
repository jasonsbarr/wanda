export const trampoline =
  (fn) =>
  (...args) => {
    let result = fn(...args);

    while (typeof result === "function") {
      result = result();
    }

    return result;
  };
