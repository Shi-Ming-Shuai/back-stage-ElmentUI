<template>
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#222d32"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :default-active="routerPath"
  >
    <!-- 用户 管理人员头像 -->
    <div id="user">
      <div class="userimg">
        <img src="/static/user.jpg" alt="" />
      </div>
      <p class="greet">你好!&nbsp;&nbsp;{{ $store.state.userInfo.username }}&nbsp;&nbsp;欢迎回来</p>
    </div>
    <!-- 点击首页 跳转到 echarts图表 -->
    <el-menu-item index="/echarts"
      ><i class="el-icon-s-home"></i>首页</el-menu-item
    >
    <el-submenu
      v-for="item in userInfo.menus"
      :index="item.title"
      :key="item.id"
    >
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item-group>
        <!-- 渲染树桩结构中的 子菜单 children -->
        <el-menu-item
          v-for="child in item.children"
          :key="child.id"
          :index="child.url"
          >{{ child.title }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { MenuList } from "network/menu/menu";
import { mapState } from "vuex";
export default {
  // 请求所有菜单 目录结构渲染
  // 通过userInfo.menus  每个用户都有自己的目录，权限不一样。所能展示的后台管理菜单目录也不一样（）
  // async created() {
  //   // 请求修改目录结构   el-submenu 循环渲染导航菜单
  //   let res = await MenuList({ istree: 1 });
  //   this.catalog = res.list;
  // },
  name: "",
  data() {
    return {
      // catalog 树桩 目录结构  渲染全部页面，（修改为vuex中用户所能看到的菜单）
      // catalog: [],
      routerPath: "/",
    };
  },
  components: {},
  computed: {
    // 通过userInfo.menus  每个用户都有自己的目录，权限不一样。所能展示的后台管理菜单目录也不一样（）
    ...mapState(["userInfo"]),
  },
  watch: {
    // 根据路由的改变  修改左侧菜单导航 的选中  （解决刷新页面  则刷新页面也会保持这个页面亮）
    $route: {
      handler(newVal) {
        let newPath = newVal.meta.rootRouter;
        this.routerPath = newPath;
      },
      // 页面一加载就触发一次  刷新页面  左侧菜单 也会随之变化
      immediate: true,
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-menu
  height 100%
// 用户头像
#user
  text-align center
  .userimg
    margin 0 auto
    margin-bottom 15px
    width 80px
    height 80px
    border-radius 50%
    border 4px solid #44576b
    overflow hidden
    img
      width 100%
      height 100%
  p
    font-size 14px
    color #fff
</style>
