<template>
  <div style="width: 800px; height: 800px">
    <canvas ref="canvasRef" id="canvas" height="400" width="800"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, type Ref } from "vue";

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
    const height = canvasRef.value?.height || 0;
    const width = canvasRef.value?.width || 0;
    console.log(img.width, img.height);
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
