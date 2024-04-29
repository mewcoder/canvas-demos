<template>
  <div>
    canvasNum:
    <input v-model="canvasNum" />
    rectNum:
    <input v-model="rectNum" />

    <button @click="getList">render</button>

    <button @click="() => num++">测试是否阻塞点击：{{ num }}</button>
  </div>
  <div>{{ costTime.toFixed(2) }} 毫秒</div>

  <div class="canvas-list">
    <Card
      v-for="(item, index) in list"
      :key="item.id"
      :i="index"
      :data="item.rect"
      @render="handleRendered"
    >
    </Card>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  shallowRef,
  nextTick,
  provide,
  onBeforeUnmount,
} from "vue";

import Card from "./card.vue";

const num = ref(0);

const canvasNum = ref(20);

const rectNum = ref(20000);

const list = shallowRef([]);

const costTime = ref(-1);

const isRender = ref(false);

let startTime = 0;

let renderCount = 0;

function getList() {
  if (costTime.value === 0) return;

  startTime = performance.now();

  console.log("startTime", startTime);

  renderCount = 0;

  costTime.value = 0;

  isRender.value = true;

  const allRectangles = prepareRectangles(canvasNum.value, rectNum.value);

  list.value = allRectangles;
}

getList();

function prepareRectangles(canvasNum, rectNum) {
  const allRectangles = [];
  for (let i = 0; i < canvasNum; i++) {
    const canvasRectangles = [];
    for (let j = 0; j < rectNum; j++) {
      const x = Math.random() * 300;
      const y = Math.random() * 200;
      const width = Math.random() * 10;
      const height = Math.random() * 10;
      const strokeStyle =
        "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color
      canvasRectangles.push({ x, y, width, height, strokeStyle });
    }
    allRectangles.push({
      id: Math.random(),
      rect: canvasRectangles,
    });
  }
  return allRectangles;
}

function handleRendered(timeStamp) {
  renderCount++;
  if (list.value.length === renderCount) {
    costTime.value = timeStamp - startTime;
    console.log("costTime", costTime.value);
  }
}
</script>

<style>
.canvas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 12px;
}
</style>
