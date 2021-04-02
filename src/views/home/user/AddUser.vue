<template>
  <div>
    <!-- 添加管理员 和 编辑管理员 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }"
        >管理员列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ currentPage }}管理员 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="80px" :rules="rules">
      <el-form-item label="所属角色">
        <!-- 循环管理员角色信息 -->
        <el-select v-model="newData.roleid" placeholder="请选择">
          <el-option
            v-for="item in roleArr"
            :key="item.id"
            :label="item.rolename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="newData.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="newData.password"></el-input>
        <span style="color: #ccc">如果密码为空 则不修改密码</span>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  UserInfo,UserEdit  如果是修改页面 才会使用这个两个方法
import { UserAdd, UserEdit, UserInfo } from "network/user/user";
// 获取管理员 角色信息
import { RoleList } from "network/role/role";

export default {
  async mounted() {
    // 获取角色信息
    let roleList = await RoleList();
    this.roleArr = roleList.list;
    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { uid } = this.$route.params;
    if (uid) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await UserInfo(uid);
      this.newData = info.list;
      // 因为密码是加密的 不需要展示在页面 设置为空，（提交的时候如果密码为空 则不修改密码）
      this.newData.password = "";
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      roleArr: [],
      newData: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      // 条件验证
      rules: {
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择管理员状态" }],
      },
    };
  },
  components: {},
  methods: {
    // 向数据库中 添加数据
    addUser() {
      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            this.newData.id = this.$route.params.id;
            res = await UserEdit(this.newData);
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await UserAdd(this.newData);
          }
          // 如果添加成功 则跳转页面,提示用于 成功 或 失败
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.$router.push({
              path: "/user",
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        } else {
          // 验证失败  则不跳转，取消默认事件
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  margin 15px 0
.el-form
  width 500px
</style>
