import readlineSync from "readline-sync";
import { EVAL } from "./eval.js";
import { print } from "../printer/print.js";

const read = (prompt) => readlineSync.question(prompt);

export const repl = () => {
  let prompt = "wanda> ";

  while (true) {
    try {
      let result = EVAL(read(prompt));

      if (result === undefined) {
        process.exit(0);
      }

      print(result);
    } catch (e) {
      console.error(e.message);
    }
  }
};
