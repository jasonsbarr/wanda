import { join } from "path";
import { Exception } from "../shared/exceptions.js";
import { repl } from "./repl.js";

export const run = () => {
  switch (process.argv[2]) {
    case "-i":
      if (!process.argv[3]) {
        throw new Exception(`-i option requires file path as argument`);
      }
      const path = join(process.cwd(), process.argv[3]);
      repl({ path });
      break;
    case undefined:
    case "repl":
      repl();
      break;
    default:
      throw new Exception("Invalid command specified");
  }
};
