import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Login from "../views/Login.vue";
import StockList from "../views/StockList.vue";
import BulkStock from "../views/BulkStock.vue";
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { path: "/login", component: Login },
  {
    path: "/",
    component: StockList,
    meta: { requiresAuth: true },
  },
  {
    path: "/bulk",
    component: BulkStock,
    meta: { requiresAuth: true },
  },
  {
    path: "/stocks",
    component: () => import("../views/StockList.vue"),
    meta: { requiresAuth: true }
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});
export default router;
