export const makeFunction = (func) => {
  func.variadic = true;

  Object.defineProperty(func, "length", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: 1,
  });

  return func;
};
