<template>
  <div style="width: 800px; height: 800px">
    <canvas
      ref="canvasRef"
      id="canvas"
      height="400"
      width="800"
      @mousedown.left="handleStartPaint"
      @mousemove="handleMouseMove"
      @mouseup="handleEndPaint"
    ></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, type Ref } from "vue";

type Point = {
  x: number;
  y: number;
};

const canvasRef = ref<HTMLCanvasElement>();

const canvasCtx =
  ref<CanvasRenderingContext2D>() as Ref<CanvasRenderingContext2D>;

const startPoint = reactive<Point>({
  x: 0,
  y: 0,
});

let painting = false;

function handleStartPaint(e: MouseEvent) {
  painting = true;

  startPoint.x = e.offsetX;
  startPoint.y = e.offsetY;
}

function handleEndPaint() {
  painting = false;
  startPoint.x = 0;
  startPoint.y = 0;
}

function handleMouseMove(e: MouseEvent) {
  if (!painting) return;

  console.log(e.offsetX, e.offsetY);

  drawLine({
    ctx: canvasCtx.value,
    start: startPoint,
    end: {
      x: e.offsetX,
      y: e.offsetY,
    },
  });
}

function drawLine({
  ctx,
  start,
  end,
  width = 1,
  color = "#000000",
}: {
  ctx: CanvasRenderingContext2D;
  start: Point;
  end: Point;
  width?: number;
  color?: string;
}) {
  ctx.clearRect(0, 0, 800, 400);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function drawRect({
  ctx,
  x,
  y,
  w,
  h,
  width = 1,
  color = "#000000",
}: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  width?: number;
  color?: string;
}) {
  ctx.save();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function init() {
  const ctx = canvasRef.value?.getContext("2d");
  if (!ctx) return;
  canvasCtx.value = ctx;
  drawImage();
}

function drawImage() {
  const img = new Image();
  img.src = "bg.jpg";
  img.onload = function () {
    const height = canvasRef.value?.height || 0;
    const width = canvasRef.value?.width || 0;
    canvasCtx.value.drawImage(img, 0, 0, width, height);
  };
}

onMounted(() => {
  init();
});
</script>

<style scoped>
#canvas {
  border: 1px solid #000;
  margin: 100px;
}
</style>
