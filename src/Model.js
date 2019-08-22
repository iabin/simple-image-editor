export default class Model {
  constructor() { }

  init(controller) {
    this.canvas = document.getElementById("drawing");
    this.context = this.canvas.getContext("2d");

    this.controller = controller;
  }

  setImage(image) {
    this.context.drawImage(image, 0, 0);

    this.undo_step = 0;
    this.undo_list = [image];
  }

  getImage() {
    return this.canvas.toDataURL("image/png");
  }

  putImage(image) {
    this.context.drawImage(image, 0, 0);

    let img = document.createElement("img");
    img.src = this.canvas.toDataURL("image/png");

    this.undo_step++;
    this.undo_list[this.undo_step] = img;

    /**
     * Esta comprobacion es para que cuando haya un cambio y la longitud 
     * sea mayor, significa que estamos aquí porque se hizo un undo
     * eso significa que debería eliminarse las operaciones 
     * numericamente posteriores a ti, para que con redo, no puedas volver a acceder
     * a ellas.
     */
    if (this.undo_step <= this.undo_list.length){
      this.undo_list = this.undo_list.slice(0,this.undo_step+1);
    }
  }

  redo(){
    //Si no hay nada que rehacer, no hago nada.
    if(this.undo_step+1 >= this.undo_list.length ) return;

    this.undo_step++;//Aumento el paso en el que voy
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);//Limpio el canvas
    this.context.drawImage(this.undo_list[this.undo_step], 0, 0);//Dibujo el siguiente paso
  }

  undo() {
    if (this.undo_step > 0) {
      this.undo_step--;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.undo_list[this.undo_step], 0, 0);
    }
  }
}