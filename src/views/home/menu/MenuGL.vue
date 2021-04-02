<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加信息 -->
    <div class="add">
      <el-button @click="$router.push('/menu/addmenu')" type="primary"
        >添加</el-button
      >
    </div>
    <el-table :data="menuList" style="width: 100%" stripe border row-key="id">
      <el-table-column prop="id" label="菜单编号" width="80"> </el-table-column>
      <el-table-column prop="title" label="菜单名称" width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="item">
          <!-- 根据类型 展示对应标签 -->
          <el-tag v-if="item.row.type == 1">目录</el-tag>
          <el-tag type="success" v-if="item.row.type == 2">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="180">
        <template slot-scope="item">
          <i :class="item.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="地址"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <!-- 状态按钮  判断status 的值  1为启用 0为禁用 -->
        <template slot-scope="item">
          <el-button
            v-if="item.row.status == 1"
            type="primary"
            @click="statusBtn(item)"
            >启用</el-button
          >
          <el-button v-else type="primary" disabled @click="statusBtn(item)"
            >禁用</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <!-- 使用作用域插槽 将数据接收过来 -->
        <template slot-scope="item">
          <el-button type="primary" @click="edit(item.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(item)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 网络请求  菜单列表
import { MenuList, MenuDel } from "network/menu/menu";

export default {
  async created() {
    // 页面创建前  请求树状 目录，渲染
   await this.getMenuList();
  },
  name: "",
  data() {
    return {
      menuList: [],
    };
  },
  components: {},
  computed: {
    // 将vuex 中的 state状态 通过助手函数展示出来
  },
  methods: {
    // 状态按钮
    statusBtn(item) {
      console.log(item);
    },
    // 编辑
    edit(id) {
      // 跳转编辑页面 传入 对应的菜单 id
      this.$router.push({
        name: "editMenu",
        params: {
          id,
        },
      });
    },
    // 删除指定数据  post传入一个 id
    async del(item) {
      let id = item.row.id;
      // 提示用户是否确认删除
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 页面删除菜单  重新请求数据库中的数据，更新到页面 (this.menuList)
          let res = await MenuDel(id);

          // 重新获取数据库中的菜单列表数据，获取到的数据 放到初始数据中-实现页面响应(this.menuList = data.list;)
          if (res.code == 200) {
            this.getMenuList();
            // 弹出框 提示用户
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // get 获取菜单列表
    async getMenuList() {
      // 获取菜单列表数据  获取树形结构  istree ： 1  el-table 添加 row-key="id" 属性即可
      let res = await MenuList({ istree: 1 });
      // 获取到的数据 放到初始数据中
      this.menuList = res.list;
    },
  },
};
</script>

<style lang="stylus" scoped>
.add
  margin 10px
.el-breadcrumb
  margin 15px 0
</style>
