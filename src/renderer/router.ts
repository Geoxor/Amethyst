import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "queue" } },
  { path: "/node-editor", name: "node-editor", component: () => import("@/views/NodeEditorView.vue") },
  { path: "/library", name: "library", component: () => import("@/views/LibraryView.vue") },
  { path: "/queue", name: "queue", component: () => import("@/views/QueueView.vue") },
  { path: "/settings", name: "settings", component: () => import("@/views/Settings/SettingsView.vue"),
    children: [
      { path: "/appearance", name: "settings.appearance", component: () => import("@/views/Settings/AppearanceSettings.vue") },
      { path: "/metering", name: "settings.metering", component: () => import("@/views/Settings/MeteringSettings.vue") },
      { path: "/behaviour", name: "settings.behaviour", component: () => import("@/views/Settings/BehaviourSettings.vue") },
      { path: "/integration", name: "settings.integration", component: () => import("@/views/Settings/IntegrationSettings.vue") },
      { path: "/performance", name: "settings.performance", component: () => import("@/views/Settings/PerformanceSettings.vue") },
    ]
  },
  { path: "/playground", name: "playground", component: () => import("@/views/PlaygroundView.vue") },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(guard => {
  if (guard.name == "settings") router.push({ name: "settings.appearance" });
});