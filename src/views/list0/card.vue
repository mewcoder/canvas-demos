<template>
  <canvas class="box" ref="canvasRef" width="300" height="200"></canvas>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { ShapeRenderer } from "../render";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["render"]);

const canvasRef = ref();

onMounted(() => {
  const ctx = canvasRef.value.getContext("2d");
  // drawRectanglesFromData2(ctx, props.data);
  const renderer = new ShapeRenderer(ctx, {
    strokeStyle: "red",
  });
  renderer.renderRectangles(props.data);
  nextTick(() => {
    emit("render", performance.now());
  });
});

function drawRectanglesFromData(context, rectangles) {
  rectangles.forEach((rect) => {
    context.strokeStyle = "red";
    // context.strokeStyle = rectangles[0].strokeStyle || "red";
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  });
  nextTick(() => {
    emit("render", performance.now());
  });
}

function drawRectanglesFromData2(context, rectangles) {
  context.beginPath(); // 开始一个新的路径
  rectangles.forEach((rect) => {
    context.rect(rect.x, rect.y, rect.width, rect.height); // 添加矩形路径，不立即绘制
  });
  context.strokeStyle = "red";
  // context.strokeStyle = rectangles[0].strokeStyle || "red"; // 共享一个strokeStyle，避免频繁设置（如果允许的话）
  context.stroke(); // 批量绘制所有矩形
  nextTick(() => {
    emit("render", performance.now());
  });
}
</script>
<style scoped>
.box {
  border: 1px solid #000;
}
</style>
