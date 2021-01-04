<template>
  <div id="login">
    <div class="login-img">
      <img
        src="/static/bg-login.jpg"
        alt=""
      />
    </div>
    <el-form
      :model="userInfo"
      status-icon
      :rules="rules"
      ref="userInfo"
      label-width="100px"
      class="demo-userInfo"
      @keyup.enter.native="login('userInfo')"
    >
      <h1>登录</h1>
      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          v-model="userInfo.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="userInfo.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="userInfo.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger"  @click="login('userInfo')">提交</el-button>
        <el-button @click="resetForm('userInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 登录接口
import { UserLogin } from "network/login/login";

export default {
  name: "",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userInfo.checkPass !== "") {
          this.$refs.userInfo.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        username: "",
        password: "",
        checkPass: "",
      },
      submitUser: {},
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }],
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 删除用户信息中的 重复密码字段，提交信息
          // 验证通过 触发登录接口
          let res = await UserLogin(this.userInfo);
          // 登录成功跳转至首页   将信息存储在vuex 状态中
          if (res.code === 200) {
            this.$store.dispatch("changeUser", res.list);
            this.$router.push("/");
            this.$message({
              type: "success",
              message: res.msg,
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
.login-img
  width 100vw
  height 100vh
  img
    width 100%
    height 100%
.el-form
  position fixed
  left 10%
  top 20%
  width 500px
  h1
    margin-bottom 50px
    text-align center
    color #fff

</style>
