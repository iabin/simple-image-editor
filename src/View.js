export default class View {
  constructor() {
    let toolbar_container = document.getElementById("toolbar_container");

    this.stroke_color_picker = document.createElement("input");
    this.stroke_color_picker.setAttribute("type", "color");

    this.stroke_color_picker_div = document.createElement("div");
    this.stroke_color_picker_div.innerHTML = "<span>stroke</span>";
    this.stroke_color_picker_div.setAttribute("id", "stroke_color_picker");

    toolbar_container.appendChild(this.stroke_color_picker_div);

    this.stroke_color_picker_div.addEventListener("click", (evt) => {
      this.stroke_color_picker.click();
    });


    this.fill_color_picker = document.createElement("input");
    this.fill_color_picker.setAttribute("type", "color");

    this.fill_color_picker_div = document.createElement("div");
    this.fill_color_picker_div.innerHTML = "<span>fill</span>";
    this.fill_color_picker_div.setAttribute("id", "fill_color_picker");

    toolbar_container.appendChild(this.fill_color_picker_div);

    this.fill_color_picker_div.addEventListener("click", (evt) => {
      this.fill_color_picker.click();
    });

  }

  init(controller) {
    this.controller = controller;

    let svg_document = document.getElementById("toolbar").getSVGDocument()
    let toolbar = svg_document.querySelector("svg");

    toolbar.getElementById("btn_open").addEventListener("click", (evt) => {
      this.controller.open();
    });

    toolbar.getElementById("btn_save").addEventListener("click", (evt) => {
      this.controller.save();
    });

    toolbar.getElementById("btn_undo").addEventListener("click", (evt) => {
      this.controller.undo();
    });

    toolbar.getElementById("btn_redo").addEventListener("click", (evt) => {
      this.controller.redo();
    });

    let btn_line = toolbar.getElementById("btn_line");
    btn_line.addEventListener("click", (evt) => {
      select_last_tool(btn_line);

      this.controller.line_mode();
    });

    let btn_free = toolbar.getElementById("btn_free");
    btn_free.addEventListener("click", (evt) => {
      select_last_tool(btn_free);
      this.controller.free_mode();
    });
    /********************************* Solo modifiqué el id para obtenerlo y apuntar a su 
     * método en el controlador
     */
    let btn_rect = toolbar.getElementById("btn_rect");
    btn_rect.addEventListener("click", (evt) => {
      select_last_tool(btn_rect);
      this.controller.rect_mode();
    });

    let btn_rect_fill = toolbar.getElementById("btn_rect_fill");
    btn_rect_fill.addEventListener("click", (evt) => {
      select_last_tool(btn_rect_fill);
      this.controller.rect_fill_mode();
    });

    let btn_circ = toolbar.getElementById("btn_circ");
    btn_circ.addEventListener("click", (evt) => {
      select_last_tool(btn_circ);
      this.controller.circle_mode();
    });

    let btn_circ__fill = toolbar.getElementById("btn_circ_fill");
    btn_circ__fill.addEventListener("click", (evt) => {
      select_last_tool(btn_circ__fill);
      this.controller.circle_fill_mode();
    });



    this.canvas = document.getElementById("drawing");

    this.work_area = document.getElementById("work_area");

    this.aux_canvas = document.createElement("canvas");
    this.aux_canvas.addEventListener("mousedown", (evt) => {
      controller.mouse_down(evt, this.aux_canvas);
      window.addEventListener("mousemove", mouse_move);
      window.addEventListener("mouseup", mouse_up);
    });
    this.work_area.appendChild(this.aux_canvas);

    this.aux_context = this.aux_canvas.getContext("2d");

    function mouse_move(evt) {
      controller.mouse_move(evt)
    }

    let mouse_up = (evt) => {
      controller.mouse_up(this.aux_canvas);
      window.removeEventListener("mousemove", mouse_move);
      window.removeEventListener("mouseup", mouse_up);
    }

    let last_tool = null;
    function select_last_tool(current_tool) {
      current_tool.querySelector("rect").style.strokeWidth = 5;

      if (last_tool) {
        last_tool.querySelector("rect").style.stroke = "none";
      }

      last_tool = current_tool;
      current_tool.querySelector("rect").style.stroke = "#ffff00";
    }

    this.stroke_color_picker.addEventListener("change", (evt) => {
      this.stroke_color_picker_div.style.backgroundColor = this.stroke_color_picker.value;
      this.controller.setStrokeColor(this.stroke_color_picker.value);
    });

    this.fill_color_picker.addEventListener("change", (evt) => {
      this.fill_color_picker_div.style.backgroundColor = this.fill_color_picker.value;
      this.controller.setFillColor(this.fill_color_picker.value);
    });

  }

  setTitle(tit) {
    let title = document.querySelector("title");
    if (!title) {
      title = document.createElement("title");
      document.head.appendChild(title);
    }

    title.textContent = tit;
  }

  changeSize(w, h) {
    this.canvas.setAttribute("width", w);
    this.canvas.setAttribute("height", h);
    this.aux_canvas.setAttribute("width", w);
    this.aux_canvas.setAttribute("height", h);

    this.canvas.style.display = this.aux_canvas.style.display = "block";
    this.canvas.style.left = this.aux_canvas.style.left = (this.work_area.offsetWidth - w) / 2 + "px";
    this.canvas.style.top = this.aux_canvas.style.top = (this.work_area.offsetHeight - h) / 2 + "px";
  }

  setStrokeColor(color) {
    this.aux_context.lineWidth = 1;
    this.aux_context.strokeStyle = color;
  }

  setFillColor(color) {
    this.aux_context.fillStyle = color;
  }

  drawLine(x1, y1, x2, y2) {
    this.clear();
    let ctx = this.aux_context;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  /**Método que dibuja un círculo, recibe un centro y un radio */
  drawCircle(x,y,r,type) {
    this.clear();
    let ctx = this.aux_context;
    ctx.beginPath();
    ctx.arc(x,y,r, 0, 2 * Math.PI, false);
    if (type === "stroke") ctx.stroke();
    if (type === "fill") ctx.fill();//Y un modo
  }
  /**Recibe un vector y ancho y alto, además del tipo linea o relleno */
  drawRect(x1, y1, x2, y2, type) {
    this.clear();
    let ctx = this.aux_context;
    if (type === "stroke") ctx.strokeRect(x1, y1, x2, y2);
    if (type === "fill") ctx.fillRect(x1, y1, x2, y2);
    //this.clear();
  }

  clear() {
    this.aux_context.clearRect(0, 0, this.aux_canvas.width, this.aux_canvas.height);
  }

  initFree(x, y) {
    let ctx = this.aux_context;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  continueFree(x, y) {
    let ctx = this.aux_context;
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }
}
