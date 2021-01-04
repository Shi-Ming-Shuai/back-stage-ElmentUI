<template>
  <div>
    <!-- 添加角色 和 编辑角色 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentPage }}角色 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="80px" :rules="rules">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="newData.rolename"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          check-strictly
          :props="{ label: 'title' }"
          :default-expanded-keys="treeArr"
          :default-checked-keys="treeArr"
        >
        </el-tree>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  RoleInfo,RoleEdit  如果是修改页面 才会使用这个两个方法
import { RoleAdd, RoleList, RoleInfo, RoleEdit } from "network/role/role";
import { MenuList } from "network/menu/menu";

export default {
  async mounted() {
    // 获取树桩结构  角色权限
    let res = await MenuList({ istree: 1 });
    this.treeData = res.list;

    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await RoleInfo(id);
      this.newData = info.list;
      // 将角色权限字段（字符串） menus 转换成数组（默认展示） :default-expanded-keys="treeArr"
      this.treeArr = this.newData.menus.split(",");
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      newData: {
        rolename: "",
        menus: "",
        status: 1,
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      treeData: [],
      // 用于默认展开树桩结构
      treeArr: [],
    };
  },
  components: {},
  methods: {
    // 当上传角色 选中值发生变化时触发
    pidChange() {
      // 选中顶级角色 则目录按钮选中，选中别的 则 角色按钮选中
      this.newData.type = this.newData.pid == 0 ? 1 : 2;
    },
    // 向数据库中 添加数据
    addRole() {
      // 将默认选中的 展开权限列表（菜单列表）  this.$refs.tree.getCheckedKeys() 获取勾选的菜单列表 id
      this.treeArr = this.$refs.tree.getCheckedKeys();
      this.newData.menus = this.treeArr.join(); //将值附给 menus （提交数据时需要使用，字符串方式提交）

      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            this.newData.id = this.$route.params.id;
            res = await RoleEdit(this.newData);
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await RoleAdd(this.newData);
          }
          // 如果添加成功 则跳转页面,提示用户成功 或失败
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.$router.push({
              path: "/role",
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
