import os from "os";
import vm from "vm";
import fs from "fs";
import { join } from "path";
import readlineSync from "readline-sync";
import { pprintAST, pprintDesugaredAST } from "./pprint.js";
import { println } from "../printer/println.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { build } from "./build.js";
import { compile } from "./compile.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";
import { countIndent, inputFinished } from "./utils.js";
import { readline } from "../shared/readline.js";
import { getVersion, getHelp } from "./utils.js";

const read = (prompt) => readline(prompt);

// Create global compile environment
const compileEnv = makeGlobalNameMap();
const typeEnv = makeGlobalTypeEnv();

const COMMANDS = {
  ":quit": {
    description: "Quits the REPL with exit 0",
  },
  ":print-ast": {
    description:
      "Makes a printed representation of the AST show when you enter an expression",
  },
  ":print-desugared": {
    description:
      "Like :print-ast, but shows the desugared tree prior to code emitting",
  },
  ":no-print-ast": {
    description: "Turns off AST printing if it's on",
  },
  ":save-file": {
    description: "Saves the current REPL session as a file",
    usage: "Prompts you for a path to save the file",
  },
  ":load-file": {
    description:
      "Loads the definitions from a file into the interactive session",
    usage: "Prompts you for a path to load the file from",
  },
  ":version": {
    description: "Prints the currently installed version of Wanda",
  },
  ":help": {
    description: "Shows this help message",
  },
};

export const repl = ({ mode = "repl", path = "" } = {}) => {
  // Build global module and instantiate in REPL context
  // This should make all compiled global symbols available
  const globalCode = build(emitGlobalEnv());
  vm.runInThisContext(globalCode);

  if (path) {
    // load file in REPL interactively
    compileAndRunFromPath(path);
  }
  console.log(
    `**** Welcome to the Wanda Programming Language v${getVersion()} interactive session ****`
  );
  console.log("Enter :help for more information");

  let prompt = "> ";
  let input = "";
  let indent = 0;
  let session = "";

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
        case ":save-file":
          saveAsFile(session);
          input = "";
          break;
        case ":load-file":
          compileAndRunFromPath(getPathFromInput());
          input = "";
          break;
        case ":version":
          console.log(getVersion());
          input = "";
          break;
        case ":help":
          getHelp(
            COMMANDS,
            "Wanda Interactive Session",
            "Enter an expression at the prompt for immediate evaluation"
          );
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
            session += input + os.EOL + os.EOL;
            input = "";
            indent = 0;
          } else {
            indent = countIndent(input);
            input += os.EOL + "  ".repeat(indent);
          }
      }
    } catch (e) {
      console.error(e.stack);
      input = "";
      indent = 0;
    }
  }
};

const saveAsFile = (session) => {
  const path = readlineSync.question("Enter the path to save the file at: ");
  const filePath = join(process.cwd(), path);

  try {
    fs.writeFileSync(filePath, session, { encoding: "utf-8" });
    console.log("File saved!");
  } catch (e) {
    console.log(
      `Error while saving file, please try again later: ${e.message}`
    );
  }
};

const compileAndRunFromPath = (path) => {
  const fileContents = fs.readFileSync(path, { encoding: "utf-8" });
  const compiledFile = compile(fileContents, path, compileEnv, typeEnv);
  vm.runInThisContext(compiledFile);
};

const getPathFromInput = () => {
  const path = readlineSync.question("Enter the path to load the file from: ");
  return join(process.cwd(), path);
};
