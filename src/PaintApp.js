import Model from "./Model.js";
import Controller from "./Controller.js";
import View from "./View.js";

export default class PaintApp {
  constructor() {
    let model = new Model();
    let view = new View();
    let controller = new Controller();

    view.init(controller);
    model.init(controller);
    controller.init(model, view);
  }
}
