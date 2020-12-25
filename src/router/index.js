import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 使用到的组件
let Home = () => import("@/views/home/Home");
let MenuGL = () => import("@/views/home/childCpn/menu/MenuGL");
let AddMenu = () => import("@/views/home/childCpn/menu/AddMenu");

// 404页面
let NotFind = () => import("@/components/NotFind")
const router = new Router({
  routes: [
    {
      path: "/", component: Home,
      meta: { rootRouter: "/" },
      children: [
        { path: "menu", name: "MenuGL", component: MenuGL, meta: { rootRouter: "/menu" } },
        { path: "menu/addmenu", name: "AddMenu", component: AddMenu, meta: { rootRouter: "/menu" } },
        { path: "menu/addmenu/:id", name: "editMenu", component: AddMenu, meta: { rootRouter: "/menu" } }
      ]
    },
    // 404页面 使用 *
    { path: "*", component: NotFind }

  ],
  mode: 'history'
})

export default router;
