import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "queue" } },
  { path: "/node-editor", name: "node-editor", component: () => import("@/views/NodeEditorView.vue") },
  { path: "/library", name: "library", component: () => import("@/views/LibraryView.vue") },
  { path: "/queue", name: "queue", component: () => import("@/views/QueueView.vue") },
  { path: "/playground", name: "playground", component: () => import("@/views/PlaygroundView.vue") },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});