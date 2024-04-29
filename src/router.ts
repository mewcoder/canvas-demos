import Home from "./views/home.vue";
import Canvas from "./views/canvas.vue";
import Image from "./views/image.vue";
import List from './views/list/index.vue'
import List0 from './views/list0/index.vue'
import List1 from './views/list1/index.vue'
import List2 from './views/list2/index.vue'


import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/canvas", component: Canvas },
  { path: "/image", component: Image },
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
