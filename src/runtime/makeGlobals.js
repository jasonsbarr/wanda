import { theModule } from "../../lib/js/core.js";
import { Namespace } from "./Namespace.js";
import { makeSymbol } from "./makeSymbol.js";

export const makeGlobal = () => {
  const globalNS = Namespace.new();
  globalNS.addMany(theModule.module());
  return globalNS;
};

export const makeGlobalNameMap = () => {
  const globalNS = Namespace.new();
  const mod = theModule.module();

  for (let [k] of Object.entries(mod)) {
    globalNS.set(k, makeSymbol(k));
  }

  return globalNS;
};

console.log(makeGlobalNameMap());
