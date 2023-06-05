import path from "path";
import { fileURLToPath } from "url";

export const ROOT_URL = import.meta.url;
export const ROOT_PATH = fileURLToPath(path.dirname(ROOT_URL));
