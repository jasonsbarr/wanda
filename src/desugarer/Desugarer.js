import { Visitor } from "../visitor/Visitor.js";

/**
 * @class
 * @desc Desugars the AST into core forms
 * @extends Visitor
 */
class Desugarer extends Visitor {
  constructor(program) {
    super(program);
  }
}
