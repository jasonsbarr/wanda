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

const fetchModuleDependencies = (module) => {
  let requires = [];

  if (module instanceof NativeModule) {
    const { requires: dependencies } = module;
    requires = dependencies.map((dep) => {
      const node = convertNativeRequireToNode(dep);
      return Require.new(
        node,
        module.name,
        resolveModuleImport(node),
        module.name
      );
    });
  } else if (module instanceof ModuleCompilation) {
    requires = module.requires;
  } else {
    throw new Exception(`Unknown module ${module}`);
  }

  return requires;
};

const getLoadOrder = (deps) => {
  let sorted = [];
  let toVisit = {};
  let currentlyVisited = {};
  let visited = {};
};
