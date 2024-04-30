<template>
  <div>
    <canvas ref="canvasRef" id="canvas" width="800" height="400"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref } from "vue";

const canvasRef = ref<HTMLCanvasElement>();

const canvasCtx =
  ref<CanvasRenderingContext2D>() as Ref<CanvasRenderingContext2D>;

let scale = 1;
let scaleX = 0;
let scaleY = 0;
let translateX = 0;
let translateY = 0;

let rects = [
  {
    x: 100,
    y: 200,
    width: 100,
    height: 100,
    isEditing: false,
    rotatable: true,
    rotateAngle: 30,
  },
];

let drawingRect = null;
let startX = 0;
let startY = 0;

const img = new Image();

function init() {
  const ctx = canvasRef.value?.getContext("2d");
  if (!ctx) return;
  canvasCtx.value = ctx;
  drawImage();
}

function drawImage() {
  img.src = "bg.jpg";
  img.onload = function () {
    draw();
  };
}

function draw() {
  canvasCtx.value.clearRect(0, 0, 800, 400);
  canvasCtx.value.save();
  canvasCtx.value.translate(scaleX, scaleY); // 定位平移
  canvasCtx.value.scale(scale, scale); // 缩放
  canvasCtx.value.translate(-scaleX, -scaleY); // 定位平移

  canvasCtx.value.translate(translateX, translateY); // 平移

  canvasCtx.value.drawImage(img, 0, 0, 800, 400);

  drawRect(); // 在 restore 之前跟随一起缩放

  canvasCtx.value.restore(); // 撤销了缩放变换
}
function computexy(x, y) {
  const xy = {
    // x: x / scale - translateX,
    // y: y / scale - translateY,
    x: (x - scaleX * (1 - scale) - translateX * scale) / scale,
    y: (y - scaleY * (1 - scale) - translateY * scale) / scale,
  };
  return xy;
}
function computewh(width, height) {
  return {
    width: width / scale,
    height: height / scale,
  };
}
function computeRect(rect) {
  const cr = {
    ...computexy(rect.x, rect.y),
    ...computewh(rect.width, rect.height),
  };
  // console.log("computeRect", rect, cr);
  return cr;
}

function handleMouseDown(e) {
  startX = e.offsetX;
  startY = e.offsetY;
  const { x, y } = computexy(e.offsetX, e.offsetY);

  console.log("mousedown", e.offsetX, e.offsetY, x, y);

  drawingRect = drawingRect || {};
}

function handleMouseMove(e) {
  if (drawingRect) {
    drawingRect = computeRect({
      x: startX,
      y: startY,
      width: e.offsetX - startX,
      height: e.offsetY - startY,
    });
    draw();
    return;
  }
}

function handleMouseUp(e) {
  if (drawingRect) {
    drawingRect = null;
    // 如果绘制的矩形太小，则不添加，防止原地点击时添加矩形
    // 如果反向绘制，则调整为正向
    const width = Math.abs(e.offsetX - startX);
    const height = Math.abs(e.offsetY - startY);
    if (width > 1 || height > 1) {
      const newrect = computeRect({
        x: Math.min(startX, e.offsetX),
        y: Math.min(startY, e.offsetY),
        width,
        height,
      });
      rects.push(newrect);
      draw();
    }
    return;
  }
}

function drawRect() {
  const ctx1 = canvasCtx.value;
  rects.forEach((r) => {
    ctx1.strokeStyle = r.isEditing ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0)";

    ctx1.save();
    if (r.rotatable) {
      ctx1.translate(r.x + r.width / 2, r.y + r.height / 2);
      ctx1.rotate((r.rotateAngle * Math.PI) / 180);
      ctx1.translate(-(r.x + r.width / 2), -(r.y + r.height / 2));
    }
    // vx = x * scale + scaleX - scaleX * scale + translateX * scale
    // vx = x * scale + scaleX * (1 - scale) + translateX * scale
    // x = (vx - scaleX * (1 - scale) - translateX * scale) / scale
    ctx1.strokeRect(r.x, r.y, r.width, r.height);
    ctx1.restore();
  });

  // 绘制
  if (drawingRect) {
    ctx1.strokeRect(
      drawingRect.x,
      drawingRect.y,
      drawingRect.width,
      drawingRect.height
    );
  }
}

function handleZoom(event) {
  if (event.ctrlKey) {
    // detect pinch
    event.preventDefault(); // prevent zoom
    scaleX = event.offsetX;
    scaleY = event.offsetY;
    if (event.deltaY < 0) {
      console.log("Pinching in");
      if (scale < 3) {
        scale = Math.min(scale + 0.1, 3);
        draw();
      }
    } else {
      console.log("Pinching out");
      if (scale > 1) {
        scale = Math.max(scale - 0.1, 1);
        draw();
      }
    }
  } else {
    event.preventDefault();
    translateX -= event.deltaX;
    translateY -= event.deltaY;
    draw();
  }
}

onMounted(() => {
  init();
  // wheel、事件的 passive 默认值更改为 true 当你想要覆盖这一行为需要设为 false
  document.addEventListener("wheel", handleZoom, { passive: false });
  canvasRef.value?.addEventListener("mousedown", handleMouseDown);
  canvasRef.value?.addEventListener("mousemove", handleMouseMove);
  canvasRef.value?.addEventListener("mouseup", handleMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("wheel", handleZoom);
  canvasRef.value?.removeEventListener("mousedown", handleMouseDown);
  canvasRef.value?.removeEventListener("mousemove", handleMouseMove);
  canvasRef.value?.removeEventListener("mouseup", handleMouseUp);
});
</script>

<style scoped>
#canvas {
  border: 1px solid #000;
  margin: 100px;
}
</style>
