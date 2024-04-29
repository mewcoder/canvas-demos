<template>
  <canvas v-show="show" ref="canvasRef" width="300" height="200" class="box">
  </canvas>
</template>

<script setup>
import { onMounted, ref, nextTick, inject } from "vue";

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

const show = ref(true);

const workerPool = inject("workerPool");

onMounted(() => {
  const canvas = canvasRef.value;
  const offscreen = canvas.transferControlToOffscreen();

  workerPool.runTask(
    [{ canvas: offscreen, data: props.data }, [offscreen]],
    handleMsg
  );
});

function handleMsg() {
  console.log("render", props.i);
  emit("render", performance.now());
}
</script>
<style>
.box {
  border: 1px solid #000;
}
</style>
