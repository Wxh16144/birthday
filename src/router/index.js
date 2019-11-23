import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/index",
    name: "index",
    component: () =>
      import("../views/index.vue" /* webpackChunkName: "index" */)
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("../views/login.vue" /* webpackChunkName: "login" */)
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
