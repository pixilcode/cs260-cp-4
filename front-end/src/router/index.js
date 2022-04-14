import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import PlanningView from "../views/PlanningView.vue";
import StoriesView from "../views/StoriesView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/planning",
    name: "planning",
    component: PlanningView,
  },
  {
    path: "/stories",
    name: "stories",
    component: StoriesView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
