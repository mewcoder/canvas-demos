<template>
  <div>
    <canvas ref="canvasRef" id="canvas" width="800" height="400"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";

const canvasRef = ref<HTMLCanvasElement>();

const canvasCtx =
  ref<CanvasRenderingContext2D>() as Ref<CanvasRenderingContext2D>;

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
    canvasCtx.value.drawImage(img, 0, 0, 800, 400);
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
