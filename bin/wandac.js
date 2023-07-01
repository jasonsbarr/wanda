#!/usr/bin/env node

import os from "os";
import fs from "fs";
import { join, basename } from "path";
import { compile } from "../src/cli/compile.js";
import { build } from "../src/cli/build.js";
import { makeGlobalNameMap } from "../src/runtime/makeGlobals.js";
import { makeGlobalTypeEnv } from "../src/typechecker/makeGlobalTypeEnv.js";
import { emitGlobalEnv } from "../src/emitter/emitGlobalEnv.js";

const compileFile = (path) => {
  const contents = fs.readFileSync(path, { encoding: "utf-8" });
  return compile(contents, path, makeGlobalNameMap(), makeGlobalTypeEnv());
};

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
    const outfile = basename(pathname).split(".")[0] + ".build" + ".js";
    const built = build(code, outfile, basename(pathname).split(".")[0]);

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
