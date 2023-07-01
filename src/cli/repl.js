import os from "os";
import vm from "vm";
import fs from "fs";
import readlineSync from "readline-sync";
import { pprintAST, pprintDesugaredAST } from "./pprint.js";
import { println } from "../printer/println.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";
import { countIndent, inputFinished } from "./utils.js";

const read = (prompt) => readlineSync.question(prompt);

export const repl = ({ mode = "repl", path = null } = {}) => {
  // Create global compile environment
  const compileEnv = makeGlobalNameMap();
  const typeEnv = makeGlobalTypeEnv();

  // Build global module and instantiate in REPL context
  // This should make all compiled global symbols available
  const globalCode = build(emitGlobalEnv());
  vm.runInThisContext(globalCode);

  if (path) {
    // load file in REPL interactively
    const fileContents = fs.readFileSync(path, { encoding: "utf-8" });
    const compiledFile = compile(fileContents, path, compileEnv, typeEnv);
    vm.runInThisContext(compiledFile);
  }

  let prompt = "wanda> ";
  let input = "";
  let indent = 0;

  while (true) {
    try {
      input += read(prompt + "  ".repeat(indent));

      switch (input) {
        // If it's a command, execute it
        case ":quit":
          process.exit(0);
        case ":print-ast":
          mode = "printAST";
          input = "";
          break;
        case ":print-desugared":
          mode = "printDesugared";
          input = "";
          break;
        case ":no-print-ast":
          mode = "repl";
          input = "";
          break;
        // If it's code, compile and run it
        default:
          if (inputFinished(input)) {
            let compiled = compile(input, "stdin", compileEnv, typeEnv);
            let result = vm.runInThisContext(compiled);

            if (mode === "printAST") {
              console.log(pprintAST(input));
            } else if (mode === "printDesugared") {
              console.log(pprintDesugaredAST(input));
            }

            println(result);
            input = "";
            indent = 0;
          } else {
            input += os.EOL;
            indent = countIndent(input);
          }
      }
    } catch (e) {
      console.error(e.stack);
      input = "";
      indent = 0;
    }
  }
};
