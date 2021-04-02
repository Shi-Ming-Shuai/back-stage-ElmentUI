import Vue from 'vue'
import Router from 'vue-router'
import sotre from '../store'
Vue.use(Router)

// 使用到的组件
// 登录页面
let Login = () => import("views/login/Login");
// 404页面
let NotFind = () => import("@/components/NotFind")

// 图标页面  首页
let Echarts = () => import("views/home/Echarts");

// 主页 后台管理页面
let Home = () => import("views/home/Home");
let MenuGL = () => import("views/home/menu/MenuGL");
let AddMenu = () => import("views/home/menu/AddMenu");
// 管理员管理
let UserGL = () => import("views/home/user/UserGL");
let AddUser = () => import("views/home/user/AddUser");
// 角色管理
let RoleGL = () => import("views/home/role/RoleGL");
let AddRole = () => import("views/home/role/AddRole");

/**
 * 商城管理
 */
// 商品分类管理
let AddCategory = () => import("views/mall/category/AddCategory");
let CategoryGL = () => import("views/mall/category/CategoryGL");
// 商品规格管理
let AddSpecs = () => import("views/mall/specs/AddSpecs");
let SpecsGL = () => import("views/mall/specs/SpecsGL");
// 商品管理页面
let AddGoods = () => import("views/mall/goods_gl/AddGoods");
let GoodsGL = () => import("views/mall/goods_gl/GoodsGL");
// 限时秒杀管理页面
let AddSeckill = () => import("views/mall/seckill/AddSeckill");
let SeckillGL = () => import("views/mall/seckill/SeckillGL");
// 轮播图管理页面
let AddBanner = () => import("views/mall/banner/AddBanner");
let BannerGL = () => import("views/mall/banner/BannerGL");

const router = new Router({
  routes: [
    {
      path: "/", component: Home,
      meta: { rootRouter: "/" },
      children: [
        // 图表
        // 点击首页 展示图标页面
        { path: "/echarts", name: "echarts", component: Echarts, meta: { rootRouter: "/echarts" } },
        // 菜单管理
        { path: "menu", name: "MenuGL", component: MenuGL, meta: { rootRouter: "/menu" } },
        { path: "menu/addmenu", name: "AddMenu", component: AddMenu, meta: { rootRouter: "/menu" } },
        { path: "menu/addmenu/:id", name: "editMenu", component: AddMenu, meta: { rootRouter: "/menu" } },
        // 管理员管理
        { path: "user", name: "UserGL", component: UserGL, meta: { rootRouter: "/user" } },
        { path: "user/adduser", name: "AddUser", component: AddUser, meta: { rootRouter: "/user" } },
        { path: "user/adduser/:uid", name: "editUser", component: AddUser, meta: { rootRouter: "/user" } },
        // 角色管理
        { path: "role", name: "RoleGL", component: RoleGL, meta: { rootRouter: "/role" } },
        { path: "role/addrole", name: "AddRole", component: AddRole, meta: { rootRouter: "/role" } },
        { path: "role/addrole/:id", name: "editRole", component: AddRole, meta: { rootRouter: "/role" } },
        // 商品管理
        // 商品分类管理
        { path: "category", name: "CategoryGL", component: CategoryGL, meta: { rootRouter: "/category" } },
        { path: "category/addcategory", name: "AddCategory", component: AddCategory, meta: { rootRouter: "/category" } },
        { path: "category/addcategory/:id", name: "editCategory", component: AddCategory, meta: { rootRouter: "/category" } },
        // 商品规格管理
        { path: "specs", name: "SpecsGL", component: SpecsGL, meta: { rootRouter: "/specs" } },
        { path: "specs/addspecs", name: "AddSpecs", component: AddSpecs, meta: { rootRouter: "/specs" } },
        { path: "specs/addspecs/:id", name: "editSpecs", component: AddSpecs, meta: { rootRouter: "/specs" } },
        // 商品管理
        { path: "goods", name: "GoodsGL", component: GoodsGL, meta: { rootRouter: "/goods" } },
        { path: "goods/addgoods", name: "AddGoods", component: AddGoods, meta: { rootRouter: "/goods" } },
        { path: "goods/addgoods/:id", name: "editGoods", component: AddGoods, meta: { rootRouter: "/goods" } },
        // 限时秒杀管理
        { path: "seckill", name: "SeckillGL", component: SeckillGL, meta: { rootRouter: "/seckill" } },
        { path: "seckill/addseckill", name: "AddSeckill", component: AddSeckill, meta: { rootRouter: "/seckill" } },
        { path: "seckill/addseckill/:id", name: "editSeckill", component: AddSeckill, meta: { rootRouter: "/seckill" } },
        // 轮播图管理
        { path: "banner", name: "BannerGL", component: BannerGL, meta: { rootRouter: "/banner" } },
        { path: "banner/addbanner", name: "AddBanner", component: AddBanner, meta: { rootRouter: "/banner" } },
        { path: "banner/addbanner/:id", name: "editBanner", component: AddBanner, meta: { rootRouter: "/banner" } },

      ]
    },
    { path: "/login", name: "Login", component: Login, meta: { rootRouter: "/login" } },
    // 404页面 使用 *
    { path: "*", component: NotFind }
  ],
  mode: 'history'
})
// 全局路由前置导航    验证是否登录---用户访问权限
router.beforeEach((to, from, next) => {
  // 如果是登录页面 则进入，其他页面进入导航守卫
  if (to.fullPath == "/login") {
    next();
  } else {
    // 判断是否登录 如果没登录 跳转到 login页面
    let username = '';
    // 判断仓库中是否有用户数据，如果没有赋值为空-跳转注册页
    if (sotre.state.userInfo !== null && Object.keys(sotre.state.userInfo).length !== 0) {
      username = sotre.state.userInfo
    }
    // 检测用户是否登录
    if (username) {
      // 设置全选 跳转之前，查看是否有访问目标页面的权限， 如果没有权限 那么则不能访问。。。
      let targetPath = to.meta.rootRouter;
      let allowPath = username.menus_url;
      // 向权限路径中添加 根路径（任何权限都可以访问根路径的）  添加根路径之前判断，如果存在 则不添加
      if (allowPath.indexOf('/') == -1) {
        allowPath.push("/");   //任何人都有访问根目录都权限
        allowPath.push("/echarts"); //任何人都有访问首页图标页面的权限
      }
      // 判断是否有权限（allowPath 包不包括访问的目标路径）  如果没权限则跳转跟路由
      if (allowPath.indexOf(targetPath) == -1) {
        // 提示用户没有权限  跳转跟路由，结束代码不再向下运行
        alert("权限不足,无法访问目标页面")
        next('/');
        return
      }
      next();
    } else {
      next('/login');
    }
  }
})
export default router;
