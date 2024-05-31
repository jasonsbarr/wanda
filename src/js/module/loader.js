import { fileURLToPath } from "url";
import fs from "fs";
import { resolveModuleImport } from "../runtime/resolveModule.js";

let moduleTable = {};
let nameMap = {};
let modules = {};
