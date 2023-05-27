import { repl } from "./repl.js";

export const run = () => {
  const mode = process.argv.length >= 3 ? process.argv[2] : "repl";
  repl(mode);
}
