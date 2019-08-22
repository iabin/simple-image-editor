export default class Controller {
  constructor() { }

  init(model, view) {
    this.model = model;
    this.view = view;
  }

  open() {
    let file_input = document.createElement("input");
    file_input.setAttribute("type", "file");
    file_input.setAttribute("accept", "image/png,image/jpeg");

    file_input.addEventListener("change", (evt) => {
      let file = file_input.files[0];

      const reader = new FileReader();
      reader.addEventListener("load", (elem) => {
        let image = document.createElement("img");

        image.addEventListener("load", () => {
          this.view.setTitle(file.name);
          this.view.changeSize(image.width, image.height);
          this.model.setImage(image);
        });
        image.src = reader.result;
      });
      if (file) {
        reader.readAsDataURL(file);
      }
    });

    file_input.click();
  }

  save() {
    let link = document.createElement("a");
    link.setAttribute("download", "image.png");
    document.body.appendChild(link);

    link.addEventListener("click", (evt) => {
      link.href = this.model.getImage();
      document.body.removeChild(link);
    });

    link.click();
  }

  undo() {
    this.model.undo();
  }

  redo() {
    this.model.redo();
  }

  setStrokeColor(color) {
    this.strokeColor = color;
  }

  setFillColor(color) {
    this.fillColor = color;
  }

  rect_mode() {
    this.mode = "rect_border";
  }

  rect_fill_mode() {
    this.mode = "rect_fill";
  }

  circle_mode() {
    this.mode = "circle_border";
  }
  circle_fill_mode() {
    this.mode = "circle_fill";
  }


  line_mode() {
    this.mode = "line";
  }

  free_mode() {
    this.mode = "free";
  }

  mouse_down(evt, canvas) {

    this.view.setStrokeColor(this.strokeColor);
    this.view.setFillColor(this.fillColor);
    this.rect = canvas.getBoundingClientRect();
    this.init_x = evt.clientX - this.rect.left;
    this.init_y = evt.clientY - this.rect.top;


    if (this.mode === "free") {
      this.view.initFree(this.init_x, this.init_y);
    }


  }

  mouse_move(evt) {
    this.new_x = evt.clientX - this.rect.left;
    this.new_y = evt.clientY - this.rect.top;
    var a = this.init_x - this.new_x;
    var b = this.init_y - this.new_y;;
    var distance = Math.sqrt(a * a + b * b);//Obtengo el radio del círculo
    if (this.mode === "line") {
      this.view.drawLine(
        this.init_x, this.init_y,
        evt.clientX - this.rect.left, evt.clientY - this.rect.top
      );
    }
    else if (this.mode === "free") {
      this.view.continueFree(evt.clientX - this.rect.left, evt.clientY - this.rect.top);
    } else if (this.mode === "rect_border") {
      this.view.drawRect(
        this.init_x, this.init_y,
        evt.clientX - this.rect.left - this.init_x, evt.clientY - this.rect.top - this.init_y, "stroke");
    } else if (this.mode === "rect_fill") {
      this.view.drawRect(
        this.init_x, this.init_y,
        evt.clientX - this.rect.left - this.init_x, evt.clientY - this.rect.top - this.init_y, "fill");
    } else if (this.mode === "circle_border") {
      this.view.drawCircle(
        this.init_x, this.init_y, distance,
        "stroke");
    } else if (this.mode === "circle_fill") {
      this.view.drawCircle(
        this.init_x, this.init_y, distance,
        "fill");
    }
  }

  mouse_up(aux_canvas) {
    this.model.putImage(aux_canvas);

    this.view.clear();
  }
}