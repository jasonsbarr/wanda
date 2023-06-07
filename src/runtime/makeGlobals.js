import { theModule as Core } from "../../lib/js/core.js";
import { Namespace } from "./Namespace.js";
import { makeSymbol } from "./makeSymbol.js";
import { makeRuntime } from "./makeRuntime.js";

export const makeGlobal = () => {
  const globalNS = Namespace.new();
  const mod = Core.module(makeRuntime());

  for (let [k, v] of Object.entries(mod)) {
    globalNS.set(makeSymbol(k), v);
  }

  return globalNS;
};

export const makeGlobalNameMap = () => {
  const globalNS = Namespace.new();
  const mod = Core.module(makeRuntime());

  for (let [k] of Object.entries(mod)) {
    globalNS.set(k, makeSymbol(k));
  }

  return globalNS;
};
