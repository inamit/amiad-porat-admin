import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import Login from "../views/pages/Login.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserByID } from "@/DAL/user.dal";
import UserRole from "@/enums/userRoles";
import { getCurrentUser } from "@/main";

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
    redirect: "/dashboard",
    // name: "Home",
    // component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, layout: "blank" },
    beforeEnter: async (to, from, next) => {
      if (to.query.signOut) {
        await getAuth().signOut();
      }

      const user = await getCurrentUser();
      if (user) {
        next("dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/dashboard/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users/add",
    name: "addAccount",
    component: () => import("../views/users/add-user/AddUser.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "listUsers",
    component: () => import("../views/users/all-users/ListUsers.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/groups",
    name: "listGroups",
    component: () => import("../views/groups/all-groups/AllGroups.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/lessons",
    name: "listLessons",
    component: () => import("../views/lessons/all-lessons/AllLessons.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/error-404",
    name: "error-404",
    // component: () => import("@/views/Error.vue"),
    // meta: {
    //   layout: "blank",
    //   requiresAuth: false,
    // },
  },
  {
    path: "*",
    redirect: "dashboard",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.meta?.requiresAuth) {
    const user = await getCurrentUser();

    if (!user) {
      next("/login");
    } else {
      const loggedInUser = await getUserByID(user.uid);

      if (!loggedInUser || loggedInUser.role < UserRole.ADMIN) {
        next({ path: "/login", query: { signOut: "t" } });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
