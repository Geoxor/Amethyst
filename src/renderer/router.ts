import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import NodeEditorView from "@/views/NodeEditorView.vue";
import LibraryView from "@/views/LibraryView.vue";
import QueueView from "@/views/QueueView.vue";
import Settings from "@/views/Settings/SettingsView.vue";
import AppearanceSettings from "@/views/Settings/AppearanceSettings.vue";
import MeteringSettings from "@/views/Settings/MeteringSettings.vue";
import IntegrationSettings from "@/views/Settings/IntegrationSettings.vue";
import PerformanceSettings from "@/views/Settings/PerformanceSettings.vue";
import PlaygroundView from "@/views/PlaygroundView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "queue" } },
  { path: "/node-editor", name: "node-editor", component: () => NodeEditorView },
  { path: "/library", name: "library", component: () => LibraryView },
  { path: "/queue", name: "queue", component: () => QueueView },
  { path: "/settings", name: "settings", component: () => Settings,
    children: [
      { path: "/appearance", name: "settings.appearance", component: () => AppearanceSettings },
      { path: "/metering", name: "settings.metering", component: () => MeteringSettings },
      { path: "/integration", name: "settings.integration", component: () => IntegrationSettings },
      { path: "/performance", name: "settings.performance", component: () => PerformanceSettings },
    ]
  },
  { path: "/playground", name: "playground", component: () => PlaygroundView },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(guard => {
  if (guard.name == "settings") router.push({ name: "settings.appearance" });
});