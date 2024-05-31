import { Exception } from "../shared/exceptions.js";
import { ModuleCompilation } from "./ModuleCompilation.js";
import { NativeModule } from "./NativeModule.js";
import { Require } from "./Require.js";
import {
  convertNativeRequireToNode,
  getModuleName,
  resolveModuleImport,
} from "./resolveModule.js";

let moduleTable = {};
let nameMap = {};
let modules = {};

const fetchModuleDependencies = (module) => {
  let requires = [];

  if (module instanceof NativeModule) {
    const { requires: dependencies } = module;
    requires = dependencies.map((dep) => {
      const node = convertNativeRequireToNode(dep);
      const importURL = resolveModuleImport(node);
      const name = getModuleName(node);

      nameMap[importURL] = name;

      return Require.new(node, name, importURL, name);
    });
  } else if (module instanceof ModuleCompilation) {
    for (let require of module.requires) {
      nameMap[require.location] = require.name;
    }

    requires = module.requires;

    // this should never happen
  } else {
    throw new Exception(`Unknown module ${module}`);
  }

  moduleTable[module.name] = module;
  return requires;
};

const getLoadOrder = (deps) => {
  let sorted = [];
  let toVisit = {};
  let currentlyVisited = {};
  let visited = {};
};
