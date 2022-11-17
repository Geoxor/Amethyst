import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/node-editor", name: "node-editor", component: () => import("@/views/NodeEditor.vue") },
  { path: "/library", name: "library", component: () => import("@/views/LibraryView.vue") },
  { path: "/queue-list", name: "queue-list", component: () => import("@/views/QueueList.vue") },
  { path: "/playground", name: "playground", component: () => import("@/views/PlaygroundView.vue") },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});