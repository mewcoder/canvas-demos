import Home from "./views/home/index.vue";
import About from "./views/about.vue";
import Canvas from "./views/canvas.vue";

import List from "./views/list/index.vue";
import List0 from "./views/list0/index.vue";
import List1 from "./views/list1/index.vue";
import List2 from "./views/list2/index.vue";

import demo1 from "./views/demos/1.vue";
import demo2 from "./views/demos/2.vue";
import demo3 from "./views/demos/3.vue";

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/canvas", component: Canvas },
  { path: "/demo1", component: demo1 },
  { path: "/demo2", component: demo2 },
  { path: "/demo3", component: demo3 },

  { path: "/list", component: List },
  { path: "/list0", component: List0 },
  { path: "/list1", component: List1 },
  { path: "/list2", component: List2 },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
