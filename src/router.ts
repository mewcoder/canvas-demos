import Home from "./views/home.vue";
import Canvas from "./views/canvas.vue";
import Image from "./views/image.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/canvas", component: Canvas },
  { path: "/image", component: Image },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
