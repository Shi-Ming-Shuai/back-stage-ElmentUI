
import Vuex from 'vuex';
import Vue from 'vue';

// 导入数据持久化
import PersistedState from "vuex-persistedstate";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {},
    menuList: []
  },
  mutations: {
    //登录/退出登录 修改用户信息
    changeUser(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    // 修改用户信息
    changeUser({ commit }, payload) {
      commit("changeUser", payload)
    }
  },
  // 使用插件 数据持久化 放入Session Storeage中
  plugins: [PersistedState({
    storage: window.sessionStorage
  })]
})

// 将仓库导出  main.js 引用 挂载
export default store;