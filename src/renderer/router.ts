import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "queue" } },
  { path: "/node-editor", name: "node-editor", component: () => import("@/views/NodeEditorView.vue") },
  { path: "/library", name: "library", component: () => import("@/views/LibraryView.vue") },
  { path: "/queue", name: "queue", component: () => import("@/views/QueueView.vue") },
  { path: "/media", name: "media", component: () => import("@/views/MediaView.vue") },
  { path: "/playground", name: "playground", component: () => import("@/views/PlaygroundView.vue") },
  { path: "/audio-monitor", name: "audio-monitor", component: () => import("@/views/AudioMonitorView.vue") },
  { path: "/favorites", name: "favorites", component: () => import("@/views/FavoritesView.vue") },
  { path: "/settings", name: "settings", component: () => import("@/views/Settings/SettingsView.vue"),
    children: [
      { path: "/appearance", name: "settings.appearance", component: () => import("@/views/Settings/AppearanceSettings.vue") },
      { path: "/performance", name: "settings.performance", component: () => import("@/views/Settings/PerformanceSettings.vue") },
      { path: "/metering", name: "settings.metering", component: () => import("@/views/Settings/MeteringSettings.vue") },
      { path: "/audio", name: "settings.audio", component: () => import("@/views/Settings/AudioSettings.vue") },
      { path: "/media-sources", name: "settings.media_sources", component: () => import("@/views/Settings/MediaSourceSettings.vue") },
      { path: "/keybinds", name: "settings.keybinds", component: () => import("@/views/Settings/KeybindSettings.vue") },
      { path: "/integration", name: "settings.integrations", component: () => import("@/views/Settings/IntegrationSettings.vue") },
      { path: "/application", name: "settings.application", component: () => import("@/views/Settings/ApplicationSettings.vue") },
    ]
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(guard => {
  if (guard.name == "settings") router.push({ name: "settings.appearance" });
});