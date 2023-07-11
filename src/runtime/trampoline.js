import { makeWandaValue } from "./conversion.js";

export const recur = (f, ...args) => ({ tag: recur, f, args });

export const trampoline = (f) => {
  const trampolined = (...args) => {
    let t = f(...args);
    while (t && t.tag === recur) {
      t = t.f(...t.args);

      if (t && t.tag !== recur) {
        return makeWandaValue(t);
      }
    }
  };

  trampolined.f = f;

  return trampolined;
};
