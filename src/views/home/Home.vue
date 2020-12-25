<template>
  <div>
    <el-container class="home">
      <el-header>头部</el-header>
      <el-container>
        <el-aside>
          <!-- 侧边导航菜单 -->
          <aside-menu></aside-menu>
        </el-aside>
        <el-main>
          <!-- 路由页面  保持页面不销毁，不用重新加载请求-->
          <router-view></router-view>
          <!-- <keep-alive> </keep-alive> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsideMenu from "./childCpn/AsideMenu";

export default {
  name: "",
  data() {
    return {};
  },
  components: { AsideMenu },
};
</script>

<style lang="stylus" scoped>
.home
  width 100vw
  height 100vh
.el-header
  background-color pink
</style>
