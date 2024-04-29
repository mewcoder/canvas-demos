<template>
  <div class="box">
    <div v-show="!show" class="loading">loading...</div>
    <img v-show="show" class="img" width="300" height="200" src="/ca.jpeg" />
    <canvas
      v-show="show"
      ref="canvasRef"
      width="300"
      height="200"
      class="canvas"
    >
    </canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, inject, onBeforeUnmount } from "vue";

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
  console.log("mounted", props.i);
  // show.value = false;
  const canvas = canvasRef.value;
  const offscreen = canvas.transferControlToOffscreen();

  // const worker = new Worker("/render-worker.js");
  workerPool.runTask(
    [{ canvas: offscreen, data: props.data }, [offscreen]],
    handleMsg
  );
  // worker.postMessage({ canvas: offscreen, data: props.data }, [offscreen]);

  // worker.onmessage = () => {
  // show.value = true;
  // emit("render", performance.now());
  // };
});

function handleMsg() {
  show.value = true;
  console.log("rendered", props.i);
  emit("render", performance.now());
}

onBeforeUnmount(() => {
  console.log("unmounted", props.i);
});
</script>
<style>
.box {
  border: 1px solid #000;
  box-sizing: content-box;
  width: 300px;
  height: 200px;
  position: relative;
}
.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img {
  position: absolute;
  top: 0;
  left: 0;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
