import os from "os";
import fs from "fs";
import { join, basename } from "path";
import { compile } from "./compile.js";
import { build } from "./build.js";
import { makeGlobalNameMap } from "../runtime/makeGlobals.js";
import { makeGlobalTypeEnv } from "../typechecker/makeGlobalTypeEnv.js";
import { emitGlobalEnv } from "../emitter/emitGlobalEnv.js";
import { getVersion, printHelp } from "./utils.js";
import { kebabToPascalCase } from "../shared/utils.js";

const COMMANDS = {
  compile: {
    alias: "-c",
    description:
      "Compiles a single Wanda file to JavaScript that imports its dependencies",
    usage: "wandac compile <filepath> or wandac -c <filepath>",
  },
  build: {
    alias: "-b",
    description:
      "Compiles a Wanda file and builds it with bundled JavaScript dependencies",
    usage: "wandac build <filepath> or wandac -b <filepath>",
  },
  version: {
    alias: "-v",
    description:
      "Prints the current version number of your WandaC installation",
    usage: "wandac version or wandac -v",
  },
  help: {
    alias: "-h",
    description: "Prints this help message on the screen",
    usage: "wandac help or wandac -h",
  },
};

const compileFile = (path) => {
  const contents = fs.readFileSync(path, { encoding: "utf-8" });
  return compile(contents, path, makeGlobalNameMap(), makeGlobalTypeEnv());
};

export const wandac = (cli = false) => {
  if (cli && !process.argv[2]) {
    console.log(`wandac requires either a file path or command argument`);
    process.exit(1);
  }

  switch (process.argv[2]) {
    case "build":
    case "-b": {
      const pathname = join(process.cwd(), process.argv[3]);
      const compiledFile = compileFile(pathname);
      const globals = emitGlobalEnv(true);
      const code = globals + os.EOL + os.EOL + compiledFile;
      const bName = basename(pathname).split(".")[0];
      const outfile = bName + ".build" + ".js";
      const mName = kebabToPascalCase(bName);
      const built = build(code, outfile, mName);

      if (cli) {
        fs.writeFileSync(outfile, built, { encoding: "utf-8" });
        break;
      } else {
        return built;
      }
    }
    case "version":
    case "-v":
      console.log(getVersion());
      break;
    case "help":
    case "-h":
      printHelp(
        COMMANDS,
        "WandaC Compiler",
        "Just using wandac <filename> also compiles a single file"
      );
      break;
    default: {
      // should be a file path
      const pathname = join(process.cwd(), process.argv[2]);
      const compiledFile = compileFile(pathname);
      const globals = emitGlobalEnv(true);
      const code = globals + os.EOL + os.EOL + compiledFile;
      const outfile = basename(pathname).split(".")[0] + ".js";

      if (cli) {
        fs.writeFileSync(outfile, code, { encoding: "utf-8" });
        break;
      } else {
        return code;
      }
    }
  }
};
