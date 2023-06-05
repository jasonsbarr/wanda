import fs from "fs";
import { join } from "path";
import * as esbuild from "esbuild";
import { ROOT_PATH } from "../../root.js";

export const build = (code, outname) => {
  const tmpPath = join(ROOT_PATH, "./tmp");
  const outPath = join(tmpPath, "./out");

  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
  }

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }

  const transformed = esbuild.transformSync(code);
  const outFile = join(tmpPath, outname);

  fs.writeFileSync(outFile, transformed.code);

  esbuild.buildSync({
    entryPoints: [outFile],
    outdir: outPath,
    bundle: true,
  });

  const builtCode = fs.readFileSync(join(outPath, outname), {
    encoding: "utf-8",
  });

  fs.rmSync(join(outPath, outname));
  fs.rmSync(join(tmpPath, outname));
  fs.rmdirSync(outPath);
  fs.rmdirSync(tmpPath);

  return builtCode;
};
