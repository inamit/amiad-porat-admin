import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/pages/Login.vue";

Vue.use(VueRouter);

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth: boolean;
    layout?: string;
  }
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, layout: "blank" },
  },

  {
    path: "/dashboard",
    name: "dashboard",
    // component: () => import("@/views/dashboard/Dashboard.vue"),
  },
  {
    path: "/typography",
    name: "typography",
    // component: () => import("@/views/typography/Typography.vue"),
  },
  {
    path: "/icons",
    name: "icons",
    // component: () => import("@/views/icons/Icons.vue"),
  },
  {
    path: "/cards",
    name: "cards",
    // component: () => import("@/views/cards/Card.vue"),
  },
  {
    path: "/simple-table",
    name: "simple-table",
    // component: () => import("@/views/simple-table/SimpleTable.vue"),
  },
  {
    path: "/form-layouts",
    name: "form-layouts",
    // component: () => import("@/views/form-layouts/FormLayouts.vue"),
  },
  {
    path: "/pages/account-settings",
    name: "pages-account-settings",
    // component: () =>
    // import("@/views/pages/account-settings/AccountSettings.vue"),
  },
  {
    path: "/pages/login",
    name: "pages-login",
    // component: () => import("@/views/pages/Login.vue"),
    // meta: {
    //   layout: "blank",
    // },
  },
  {
    path: "/pages/register",
    name: "pages-register",
    // component: () => import("@/views/pages/Register.vue"),
    // meta: {
    //   layout: "blank",
    // },
  },
  {
    path: "/error-404",
    name: "error-404",
    // component: () => import("@/views/Error.vue"),
    // meta: {
    //   layout: "blank",
    // },
  },
  {
    path: "*",
    redirect: "error-404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
