import objectHash from "object-hash";
import { PREFIX } from "../emitter/Emitter.js";

export const makeSymbol = (str) => PREFIX + objectHash(str);
