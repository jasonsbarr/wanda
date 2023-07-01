import os from "os";
import fs from "fs";
import { join, basename } from "path";
import { compile } from "./compile.js";
import { build } from "./build.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";

const compileFile = (path) => {
  const contents = fs.readFileSync(path, { encoding: "utf-8" });
  return compile(contents, path, makeGlobalNameMap(), makeGlobalTypeEnv());
};

export const wandac = () => {
  if (!process.argv[2]) {
    console.log(`wandac requires either a file path or command argument`);
    process.exit(1);
  }

  switch (process.argv[2]) {
    case "build": {
      const pathname = join(process.cwd(), process.argv[3]);
      const compiledFile = compileFile(pathname);
      const globals = emitGlobalEnv();
      const code = globals + os.EOL + os.EOL + compiledFile;
      const bName = basename(pathname).split(".")[0];
      const outfile = bName + ".build" + ".js";
      const built = build(code, outfile, bName);

      fs.writeFileSync(outfile, built, { encoding: "utf-8" });
      break;
    }
    default: {
      // should be a file path
      const pathname = join(process.cwd(), process.argv[2]);
      const compiledFile = compileFile(pathname);
      const globals = emitGlobalEnv();
      const code = globals + os.EOL + os.EOL + compiledFile;
      const outfile = basename(pathname).split(".")[0] + ".js";

      fs.writeFileSync(outfile, code, { encoding: "utf-8" });
      break;
    }
  }
};
