import os from "os";
import fs from "fs";
import { join } from "path";
import ffi from "ffi-napi";

const rllib = ffi.Library("libreadline", {
  readline: ["string", ["string"]],
  add_history: ["int", ["string"]],
});

const HISTORY_FILE = join(os.homedir(), ".wanda-history");
let historyLoaded = false;

export const readline = (prompt = ">") => {
  if (!historyLoaded) {
    let lines = [];

    if (fs.existsSync(HISTORY_FILE)) {
      lines = fs
        .readFileSync(HISTORY_FILE, { encoding: "utf-8" })
        .split(os.EOL)
        // remove blank lines
        .filter((line) => line !== "");
    }

    lines = lines.slice(Math.max(lines.length - 2000, 0));

    for (let line of lines) {
      rllib.add_history(line);
    }
  }

  const line = rllib.readline(prompt);

  if (line) {
    rllib.add_history(line);

    try {
      fs.appendFileSync(HISTORY_FILE, line + os.EOL, { encoding: "utf-8" });
    } catch (e) {
      // do nothing
    }
  }

  return line;
};
