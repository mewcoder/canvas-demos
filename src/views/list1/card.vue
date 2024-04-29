<template>
  <canvas ref="canvasRef" width="300" height="200" class="box"> </canvas>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  i: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["render"]);

const canvasRef = ref();

onMounted(() => {
  const canvas = canvasRef.value;
  const offscreen = canvas.transferControlToOffscreen();

  const worker = new Worker("/render-worker.js");

  worker.postMessage({ canvas: offscreen, data: props.data }, [offscreen]);

  worker.onmessage = () => {
    emit("render", performance.now());
  };
});
</script>
<style scoped>
.box {
  border: 1px solid #000;
}
</style>
