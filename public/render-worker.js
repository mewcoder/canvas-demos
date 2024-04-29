self.onmessage = async function (event) {
  const { canvas, data } = event.data;
  const context = canvas.getContext("2d");
  drawRectanglesFromData(context, data);
  self.postMessage("rendered");
};

function drawRectanglesFromData(ctx, rectangles) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  rectangles.forEach((rect) => {
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
  });
  ctx.strokeStyle = "red";
  ctx.stroke();
}
