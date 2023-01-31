import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "gate" } },
  { path: "/gate", name: "gate", component: () => import("@/views/GateView.vue") },
  { path: "/app", name: "app", component: () => import("@/views/AppView.vue"), children: [
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
  ]},
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const isElectron = navigator.userAgent.includes("Electron");

let isFirstLoad = true;

console.log(isElectron);

router.beforeEach((to, from, next) => {
  if (isElectron && isFirstLoad) {
    router.push({ name: "app" });
  }

  if (!isElectron && isFirstLoad && to.name !== "gate") {
    router.push({ name: "gate" });
  }

  isFirstLoad = false;

  if (to.name == "app") {
    console.log("Pushing to \"queue\"");
    router.push({ name: "queue" });
  }
  if (to.name == "settings") {
    console.log("Pushing to \"settings.appearance\"");
    router.push({ name: "settings.appearance" });
  }

  next();
});