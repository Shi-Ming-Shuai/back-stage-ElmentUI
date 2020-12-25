<template>
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :default-active="routerPath"
  >
    <el-menu-item index="/"><i class="el-icon-s-home"></i>首页</el-menu-item>
    <el-submenu v-for="item in catalog" :index="item.title" :key="item.id">
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

export default {
  async created() {
    // 请求修改目录结构   el-submenu 循环渲染导航菜单
    let res = await MenuList({ istree: 1 });
    this.catalog = res.list;
  },
  name: "",
  data() {
    return {
      // catalog 树桩 目录结构
      catalog: [],
      routerPath: "/",
    };
  },
  components: {},

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
  background-color #545c64
  height 100%
</style>
