import readlineSync from "readline-sync";
import { EVAL } from "./eval.js";
import { pprintAST, pprintDesugaredAST } from "./pprint.js";
import { print } from "../printer/print.js";
import { fail } from "../shared/fail.js";

const read = (prompt) => readlineSync.question(prompt);

export const repl = (mode) => {
  const proc =
    mode === "repl"
      ? EVAL
      : mode === "printDesugared"
      ? pprintDesugaredAST
      : mode === "printAST"
      ? pprintAST
      : fail("Invalid REPL mode specified");
  let prompt = "wanda> ";

  while (true) {
    try {
      const input = read(prompt);
      let result = proc(input);

      if (result === undefined) {
        process.exit(0);
      }

      print(result, mode === "repl");
    } catch (e) {
      console.error(e.message);
    }
  }
};
