<template>
  <div>
    <el-container class="home">
      <el-header>
        <h4>小U商城后台管理系统</h4>
        <p>
          <!-- 用户默认头像 -->
          <img class="img" src="/static/user.jpg"  alt="">
          {{ $store.state.userInfo.username }}
          <a href="javascript:void(0)" @click="logOut">退出</a>
        </p>
      </el-header>
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
import AsideMenu from "./AsideMenu";

export default {
  name: "",
  data() {
    return {};
  },
  components: { AsideMenu },
  methods: {
    // 退出登录  跳转登录页
    logOut() {
      this.$router.push("/login");
      setTimeout(() => {
        this.$store.dispatch("changeUser", null);
      }, 500);
    },
  },
};
</script>

<style lang="stylus" scoped>
.home
  width 100vw
  height 100vh
.el-header
  display flex
  justify-content space-between
  align-items center
  color #fff
  background-color #222d32
  p
    text-align right
    font-size 12px
    // 用户默认头像
    .img 
      margin-right 15px
      width 39px
      height 39px
      border-radius 50%
      border 2px solid #cccccc
      vertical-align middle
    a
      text-decoration none
      color #fff
</style>
