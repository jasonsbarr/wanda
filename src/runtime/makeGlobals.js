import { theModule as Core } from "../../lib/js/core.js";
import { Namespace } from "../shared/Namespace.js";
import { makeSymbol } from "./makeSymbol.js";
import { makeRuntime } from "./makeRuntime.js";

export const makeGlobal = () => {
  const globalNS = Namespace.new();
  const mod = Core.module(makeRuntime());

  for (let [k, v] of Object.entries(mod)) {
    globalNS.set(makeSymbol(k), v);
  }

  globalNS.set(makeSymbol("__module__"), Core.name);

  return globalNS;
};

export const makeGlobalNameMap = () => {
  const globalNS = Namespace.new();
  const mod = Core.module(makeRuntime());

  for (let [k] of Object.entries(mod)) {
    globalNS.set(k, makeSymbol(k));
  }

  globalNS.set("__module__", makeSymbol("__module__"));

  return globalNS;
};
