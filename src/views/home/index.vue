<template>
  <canvas ref="canvasRef" id="canvas" height="400" width="800"></canvas>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref } from "vue";
import { Drawing } from "../render";

const canvasRef = ref<HTMLCanvasElement>();

const canvasCtx =
  ref<CanvasRenderingContext2D>() as Ref<CanvasRenderingContext2D>;

let drawing: Drawing;

function intCanvas() {
  const ctx = canvasRef.value?.getContext("2d")!;
  canvasCtx.value = ctx;
  drawing = new Drawing(canvasRef.value!, ctx);
}

onMounted(() => {
  intCanvas();
});

onBeforeUnmount(() => {
  drawing.destroy();
});
</script>

<style scoped>
#canvas {
  border: 1px solid #000;
  margin: 100px;
}
</style>
