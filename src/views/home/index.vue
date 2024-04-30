<template>
  <canvas
    ref="canvasRef"
    id="canvas"
    height="400"
    width="800"
    @mousedown.left="handleStartPaint"
    @mousemove="handleMouseMove"
    @mouseup="handleEndPaint"
  ></canvas>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, type Ref } from "vue";
import { ShapeRenderer, Drawing, type Rectangle } from "../render";

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

const rects: Rectangle[] = [
  {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  },
  {
    x: 300,
    y: 100,
    width: 100,
    height: 100,
  },
];

let drawingRect: any;

let renderer: ShapeRenderer;

let drawing: Drawing;

function handleStartPaint(e: MouseEvent) {
  startPoint.x = e.offsetX;
  startPoint.y = e.offsetY;
  console.log({ ...startPoint });
  drawingRect = drawingRect || {};
}

function handleEndPaint(e: MouseEvent) {
  if (!drawingRect) return;
  drawingRect = null;

  const width = Math.abs(e.offsetX - startPoint.x);
  const height = Math.abs(e.offsetY - startPoint.y);
  if (width < 1 && height < 1) return;

  const newRect = {
    x: Math.min(startPoint.x, e.offsetX),
    y: Math.min(startPoint.y, e.offsetY),
    width: width,
    height: height,
  };
  rects.push(newRect);

  draw();
}

function handleMouseMove(e: MouseEvent) {
  if (!drawingRect) return;
  drawingRect = {
    x: startPoint.x,
    y: startPoint.y,
    width: e.offsetX - startPoint.x,
    height: e.offsetY - startPoint.y,
  };

  draw();
}

function draw() {
  const ctx = canvasCtx.value;

  ctx.clearRect(0, 0, 800, 400);

  renderer.renderRectangles(rects, {
    strokeStyle: "red",
  });

  // 绘制
  if (drawingRect) {
    ctx.strokeRect(
      drawingRect.x,
      drawingRect.y,
      drawingRect.width,
      drawingRect.height
    );
    console.log({ ...drawingRect });
  }
}

function intCanvas() {
  const ctx = canvasRef.value?.getContext("2d")!;

  canvasCtx.value = ctx;
  drawing = new Drawing(canvasRef.value!, ctx);
  renderer = new ShapeRenderer(ctx);
}

onMounted(() => {
  intCanvas();
  draw();
});
</script>

<style scoped>
#canvas {
  border: 1px solid #000;
  margin: 100px;
}
</style>
