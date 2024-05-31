import { fileURLToPath } from "url";
import fs from "fs";
import { resolveModuleImport } from "./resolveModule.js";

let moduleTable = {};
let nameMap = {};
let modules = {};
