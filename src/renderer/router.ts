import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/node-editor", name: "node-editor", component: () => import("@/views/NodeEditor.vue") },
  { path: "/queue-list", name: "queue-list", component: () => import("@/views/QueueList.vue") },
  { path: "/playground-view", name: "playground-view", component: () => import("@/views/PlaygroundView.vue") },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});