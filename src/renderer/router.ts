import type { RouteRecordRaw } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "home",
		component: () => import("@/views/Home.vue"),
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
