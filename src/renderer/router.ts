import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import NodeEditor from "@/views/NodeEditor.vue";
import QueueList from "@/views/QueueList.vue";
import PlaygroundView from "@/views/PlaygroundView.vue";
import { DefineComponent } from "vue";

const defineRoute = (component: DefineComponent<any, any, any>): RouteRecordRaw => {
  const name = component.__name?.split(/(?=[A-Z])/).join("-").toLowerCase();
  return { path: `/${name}`, name, component };
};

const routes = [
  defineRoute(NodeEditor),
  defineRoute(QueueList),
  defineRoute(PlaygroundView),
];

console.log(routes);

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});