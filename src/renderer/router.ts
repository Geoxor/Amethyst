import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "home",
		component: () => import("./views/Home.vue"),
	},
	{
		path: "/preferences",
		name: "preferences",
		component: () => import("./views/Preferences.vue"),
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
