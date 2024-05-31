import { Exception } from "../shared/exceptions.js";
import { ModuleCompilation } from "./ModuleCompilation.js";
import { NativeModule } from "./NativeModule.js";
import { Require } from "./Require.js";
import {
  convertNativeRequireToNode,
  resolveModuleImport,
} from "./resolveModule.js";

let moduleTable = {};
let nameMap = {};
let modules = {};

const getLoadOrder = (deps) => {
  let sorted = [];
  let toVisit = {};
  let currentlyVisited = {};
  let visited = {};
};
