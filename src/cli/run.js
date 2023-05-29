import { Exception } from "../shared/exceptions.js";
import { repl } from "./repl.js";

export const run = () => {
  let mode = "";
  switch (process.argv[2]) {
    case "print":
      if (process.argv[3] === "-d") {
        mode = "printDesugared";
        break;
      } else if (process.argv[3] === "-a") {
        mode = "printAST";
        break;
      }
    case undefined:
    case "-i":
    case "repl":
      mode = "repl";
      break;
    default:
      throw new Exception("Invalid command specified");
  }
  repl(mode);
};
