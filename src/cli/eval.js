import vm from "vm";
import { compile } from "./compile.js";

export const EVAL = (input) => vm.runInThisContext(compile(input));
