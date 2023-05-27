import { repl } from "./repl.js";

const mode = process.argv.length >= 3 ? process.argv[2] : "repl";

repl(mode);
