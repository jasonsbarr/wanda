import readlineSync from "readline-sync";
import { EVAL } from "./eval.js";
import { print } from "../printer/print.js";

const getInput = (prompt) => readlineSync.question(prompt);

export const repl = () => {
  let prompt = "wanda> ";

  while (true) {
    try {
      let result = EVAL(getInput(prompt)) ?? "";

      if (result === "") {
        process.exit(0);
      }

      print(result);
    } catch (e) {
      console.error(e.message);
    }
  }
};
