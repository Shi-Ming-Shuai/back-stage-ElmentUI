<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加信息 -->
    <div class="add">
      <el-button @click="$router.push('/user/adduser')" type="primary"
        >添加</el-button
      >
    </div>
    <el-table :data="userList" style="width: 100%" stripe border row-key="id">
      <el-table-column prop="id" label="管理员编号" width="120">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色" width="180">
      </el-table-column>
      <el-table-column prop="username" label="管理员名称"> </el-table-column>
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
          <el-button type="primary" @click="edit(item.row.uid)">编辑</el-button>
          <el-button type="danger" @click="del(item)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalPage"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
// 网络请求  管理员列表
import { UserList, UserDel, UserTotal } from "network/user/user";

export default {
  async created() {
    // 页面创建前  请求  分页请求 size:每页数量   page页码数（必须参数） 从1开始
    // 默认请求第一页
    await this.getUserList(this.currentPage);
    // 获取页面总数据 数量
    let totalNum = await UserTotal();
    this.totalPage = totalNum.list[0].total;
  },
  name: "",
  data() {
    return {
      userList: [],
      // 分页数据 总数据数量  一页最大展示多少条数据
      totalPage: 0,
      pageSize: 3,
      // 当前所在页数 （当前的页码数） 默认为1
      currentPage: 1,
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
    // 编辑  uid: 必传   修改管理员信息
    edit(uid) {
      // 跳转编辑页面 传入 对应的管理员 id
      this.$router.push({
        name: "editUser",
        params: {
          uid,
        },
      });
    },
    // 删除指定数据  post传入一个  uid=>必传
    async del(item) {
      let uid = item.row.uid;

      // 提示管理员是否确认删除
      this.$confirm("此操作将永久删除该管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 页面删除管理员  重新请求数据库中的数据，更新到页面 (this.userList)
          let res = await UserDel(uid);

          // 重新获取数据库中的管理员列表数据，获取到的数据 放到初始数据中-实现页面响应(this.userList = data.list;)
          if (res.code == 200) {
            // 删除以后 重新—___渲染当前所处页
            this.getUserList(this.currentPage);
            // 弹出框 提示管理员
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
    // 分页 切换页面 请求不同页面的数据
    async changePage(num) {
      //当前所处页  切换页面以后-修改全局
      this.currentPage = num;
      await this.getUserList(num);
    },
    // get 获取管理员列表
    async getUserList(page) {
      // 获取管理员列表数据  获取树形结构  istree ： 1  el-table 添加 row-key="id" 属性即可
      let res = await UserList({ size: this.pageSize, page });
      // 获取到的数据 放到初始数据中
      this.userList = res.list;
    },
  },
};
</script>

<style lang="stylus" scoped>
.add
  margin 10px
.el-breadcrumb
  margin 15px 0
.el-pagination
  float right
  margin 20px
</style>
