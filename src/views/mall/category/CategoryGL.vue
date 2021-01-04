<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加信息 -->
    <div class="add">
      <el-button @click="$router.push('/category/addcategory')" type="primary"
        >添加</el-button
      >
    </div>
    <el-table
      :data="categoryList"
      style="width: 100%"
      stripe
      border
      row-key="id"
    >
      <el-table-column prop="id" label="商品分类编号" width="120">
      </el-table-column>
      <el-table-column prop="catename" label="商品分类名称"> </el-table-column>
      <el-table-column label="图片" width="180">
        <!-- 图片如果存在 则展示img标签 -->
        <template slot-scope="item">
          <img v-if="item.row.img" class="img" :src="item.row.img" alt="" />
        </template>
      </el-table-column>
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
// 网络请求  商品分类列表
import { CategoryList, CategoryDel } from "network/category/category";

export default {
  async created() {
    // 页面创建前  请求  分类请求 size:每页数量   page页码数（必须参数） 从1开始
    // 默认请求第一页
    await this.getCategoryList();
  },
  name: "",
  data() {
    return {
      categoryList: [],
    };
  },
  components: {},
  computed: {
    // 将vuex 中的 state状态 通过助手函数展示出来
  },
  methods: {
    img(w) {
      console.log(w);
    },
    // 状态按钮
    statusBtn(item) {
      console.log(item);
    },
    // 编辑  uid: 必传   修改商品分类信息
    edit(id) {
      // 跳转编辑页面 传入 对应的商品分类 id
      this.$router.push({
        name: "editCategory",
        params: {
          id,
        },
      });
    },
    // 删除指定数据  post传入一个  uid=>必传
    async del(item) {
      let id = item.row.id;
      // 提示商品分类是否确认删除
      this.$confirm("此操作将永久删除该商品分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 页面删除商品分类  重新请求数据库中的数据，更新到页面 (this.CategoryList)
          let res = await CategoryDel(id);

          // 重新获取数据库中的商品分类列表数据，获取到的数据 放到初始数据中-实现页面响应(this.CategoryList = data.list;)
          if (res.code == 200) {
            // 删除以后 默认渲染第一页
            this.getCategoryList();
            // 弹出框 提示商品分类
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

    // get 获取商品分类列表
    async getCategoryList() {
      // 获取商品分类列表数据  获取树形结构  istree ： 1  el-table 添加 row-key="id" 属性即可
      let res = await CategoryList({ istree: 1 });
      // 获取到的数据 放到初始数据中
      this.categoryList = res.list;
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-table
  height 500px
  overflow-y auto
.add
  margin 10px
.el-breadcrumb
  margin 15px 0
.el-pagination
  float right
  margin 20px
.img
  width 80px
</style>
