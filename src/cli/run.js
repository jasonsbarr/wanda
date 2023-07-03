import vm from "vm";
import fs from "fs";
import { join } from "path";
import { repl } from "./repl.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";
import { getVersion, getHelp } from "./utils.js";

const COMMANDS = {
  load: {
    alias: "-l",
    description:
      "Loads a Wanda file into an interactive session so you can use its definitions",
    usage: "wanda load <filepath> or wanda -l <filepath>",
  },
  run: {
    alias: "-r",
    description: "Runs a Wanda file from the command line",
    usage: "wanda run <filepath> or wanda -r <filepath>",
  },
  repl: {
    alias: "-i",
    description: "Starts an interactive session with the Wanda REPL",
    usage: "wanda repl or wanda -i",
  },
  version: {
    alias: "-v",
    description: "Prints the current version number of your Wanda installation",
    usage: "wanda version or wanda -v",
  },
  help: {
    alias: "-h",
    description: "Prints this help message on the screen",
    usage: "wanda help or wanda -h",
  },
};

export const run = () => {
  switch (process.argv[2]) {
    case "-l":
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
    case "-v":
    case "version":
      return console.log(getVersion());
    case "help":
    case "-h":
      return getHelp(
        COMMANDS,
        "Wanda Programming Language",
        "Just running wanda with no command also starts an interactive session"
      );
    case undefined:
    case "repl":
    case "-i":
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
