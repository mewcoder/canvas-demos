<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="nav">
    <RouterLink to="/">home</RouterLink>
    <RouterLink to="/demo1">图片</RouterLink>
    <RouterLink to="/demo2">缩放</RouterLink>
    <RouterLink to="/demo3">绘制</RouterLink>
  </div>
  <RouterView />
</template>

<style scoped>
.nav {
  height: 28px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;
  a {
    margin-right: 10px;
  }
}
</style>
