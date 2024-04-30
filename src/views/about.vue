<template>
  <canvas ref="canvasRef" id="canvas" height="400" width="800"></canvas>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ShapeRenderer } from "./render";

const canvasRef = ref();

function init() {
  const ctx = canvasRef.value?.getContext("2d");
  if (!ctx) return;

  draw(ctx);
}

const rects = [
  {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  },
  {
    x: 200,
    y: 200,
    width: 100,
    height: 100,
  },
  {
    x: 300,
    y: 300,
    width: 100,
    height: 100,
  },
];

const circles = [
  {
    x: 100,
    y: 100,
    radius: 50,
  },
  {
    x: 200,
    y: 200,
    radius: 50,
  },
  {
    x: 300,
    y: 300,
    radius: 50,
  },
];

const lines = [
  {
    x1: 500,
    y1: 100,
    x2: 500,
    y2: 200,
  },
  {
    x1: 500,
    y1: 100,
    x2: 600,
    y2: 100,
  },
];

const polygons = [
  {
    points: [
      { x: 600, y: 100 },
      { x: 600, y: 200 },
      { x: 500, y: 200 },
    ],
  },
  {
    points: [
      { x: 400, y: 100 },
      { x: 500, y: 200 },
      { x: 300, y: 300 },
    ],
  },
];

function draw(ctx) {
  const render = new ShapeRenderer(ctx, {
    strokeStyle: "red",
    lineWidth: 2,
  });
  render.renderRectangles(rects);
  render.renderPolygons(polygons, {
    strokeStyle: "blue",
  });
  render.renderLines(lines, { strokeStyle: "green" });
  render.renderCircles(circles, { strokeStyle: "orange" });
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
