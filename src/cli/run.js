import { repl } from "./repl.js";

export const run = () => {
  let mode = ""
  switch (process.argv[2]) {
    case "print":
      if (process.argv[3] === "-d") {
        mode = "printDesugared"
        break;
      } else if (process.argv[3] === "-a") {
        mode = "printAST"
        break;
      }
    default:
      mode = "repl"
  }
  repl(mode);
}
