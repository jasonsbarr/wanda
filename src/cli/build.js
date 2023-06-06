import fs from "fs";
import { join } from "path";
import * as esbuild from "esbuild";
import { ROOT_PATH } from "../../root.js";

/**
 * Builds and bundles a compiled code module with any imports
 * @param {string} code
 * @param {string} outName
 * @returns {string}
 */
export const build = (code, outName = "global.js", moduleName = "main") => {
  const tmpPath = join(ROOT_PATH, "./tmp");
  const outPath = join(tmpPath, "./out");

  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
  }

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }

  const transformed = esbuild.transformSync(code);
  const outFile = join(tmpPath, outName);

  fs.writeFileSync(outFile, transformed.code);

  esbuild.buildSync({
    entryPoints: [outFile],
    outdir: outPath,
    bundle: true,
    // globalName: moduleName,
    footer: { js: `${moduleName}.result` },
    format: "iife",
    banner: { js: `var ${moduleName} = {};\n` },
  });

  const builtCode = fs.readFileSync(join(outPath, outName), {
    encoding: "utf-8",
  });

  fs.rmSync(join(outPath, outName));
  fs.rmSync(join(tmpPath, outName));
  fs.rmdirSync(outPath);
  fs.rmdirSync(tmpPath);

  return builtCode;
};
