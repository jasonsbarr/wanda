import { Exception } from "../shared/exceptions.js";
import { repl } from "./repl.js";

export const run = () => {
  let mode = "";
  switch (process.argv[2]) {
    case undefined:
    case "-i":
    case "repl":
      mode = "repl";
      repl(mode);
      break;
    default:
      throw new Exception("Invalid command specified");
  }
};
