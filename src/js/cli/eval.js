import vm from "vm";
import { compile } from "./compile.js";

export const EVAL = (input, file = "global", ns = undefined) =>
  vm.runInThisContext(compile(input, file, ns));
