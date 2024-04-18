(function () {
  let pX, pY;
  let dragging = false;

  // const offset = new p5.Vector(0, 0);
  addEventListener("mousedown", function () {
    pX = mouse().x;
    pY = mouse().y;
    dragging = true;
  });


  
  addEventListener("mousemove", function () {
    if (dragging) {
      offset.add(createVector(mouse().x - pX, mouse().y - pY));
      pX = mouse().x;
      pY = mouse().y;
    }
  });

  addEventListener("mouseup", function () {
    dragging = false;
    pX = null;
    pY = null;
  });

  // p5.prototype.draggable = function () {
  //   this.translate(p5.Vector.div(offset, scl));
  // };

  // p5.prototype.registerMethod("pre", p5.prototype._translateOffset);
})();
