
import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    menuList: [
      {
        id: 1,
        icon: "el-icon-setting",
        status: true,
        type: "目录",
        name: "系统设置",
        address: "",
      },
      {
        id: 2,
        icon: "",
        type: "菜单",
        status: false,
        name: "菜单管理",
        address: "/menu",
      },
      {
        id: 3,
        icon: "",
        type: "菜单",
        status: true,
        name: "用户管理",
        address: "/user",
      }
    ]
  }
})

// 将仓库导出  main.js 引用 挂载
export default store;