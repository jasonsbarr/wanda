import vm from "vm";
import fs from "fs";
import { join } from "path";
import { repl } from "./repl.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";

export const run = () => {
  switch (process.argv[2]) {
    case "-i":
    case "load":
      if (!process.argv[3]) {
        console.log(`load command requires file path as argument`);
        process.exit(1);
      }
      const path = join(process.cwd(), process.argv[3]);
      repl({ path });
      break;
    case "run":
    case "-r":
      if (!process.argv[3]) {
        console.log(`run command requires file path as argument`);
        process.exit(1);
      }
      return runFile(join(process.cwd(), process.argv[3]));
    case undefined:
    case "repl":
      return repl();
    default:
      console.log("Invalid command specified");
      process.exit(1);
  }
};

const runFile = (path) => {
  const fileContents = fs.readFileSync(path, { encoding: "utf-8" });
  const globalNs = makeGlobalNameMap();
  const typeEnv = makeGlobalTypeEnv();
  const globalCode = build(emitGlobalEnv());
  const compiledCode = compile(fileContents, path, globalNs, typeEnv);

  vm.runInThisContext(globalCode);
  return vm.runInThisContext(compiledCode);
};
