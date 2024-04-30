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
  canvasCtx.value.restore(); // 撤销了缩放变换
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
});

onBeforeUnmount(() => {
  document.removeEventListener("wheel", handleZoom);
});
</script>

<style scoped>
#canvas {
  border: 1px solid #000;
  margin: 100px;
}
</style>
