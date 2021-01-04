<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀场次列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加信息 -->
    <div class="add">
      <el-button @click="$router.push('/seckill/addseckill')" type="primary"
        >添加</el-button
      >
    </div>
    <el-table :data="seckList" style="width: 100%" stripe border row-key="id">
      <el-table-column prop="title" label="活动名称" width="200">
      </el-table-column>
      <el-table-column prop="begintime" label="开始时间" min-width="140">
        <template slot-scope="item">
          <el-tag>{{ item.row.begintime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="endtime" label="结束时间" min-width="140">
        <template slot-scope="item">
          <el-tag>{{ item.row.endtime }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" min-width="120">
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
// 网络请求  秒杀场次列表
import { SeckillList, SeckillDel } from "network/seckill/seckill";
// 导入时间戳转换工具
import moment from "moment";
export default {
  async created() {
    // 页面创建前  请求树状 目录，渲染
    await this.getSeckillList();
  },
  name: "",
  data() {
    return {
      seckList: [],
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
      // 跳转编辑页面 传入 对应的秒杀场次 id
      this.$router.push({
        name: "editSeckill",
        params: {
          id,
        },
      });
    },
    // 删除指定数据  post传入一个 id
    async del(item) {
      let id = item.row.id;
      // 提示是否确认删除
      this.$confirm("此操作将永久删除该秒杀场次, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 页面删除秒杀场次  重新请求数据库中的数据，更新到页面 (this.SeckillList)
          let res = await SeckillDel(id);

          // 重新获取数据库中的秒杀场次列表数据，获取到的数据 放到初始数据中-实现页面响应(this.SeckillList = data.list;)
          if (res.code == 200) {
            this.getSeckillList();
            // 弹出框 提示秒杀场次
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
    // get 获取秒杀场次列表
    async getSeckillList() {
      // 获取秒杀场次列表数据  获取树形结构  istree ： 1  el-table 添加 row-key="id" 属性即可
      let res = await SeckillList();
      // 获取到的数据 放到初始数据中
      this.seckList = res.list;
      // 循环将每一项都修改为指定事件对象
      this.seckList.forEach((item, i) => {
        // 将字符串时间戳转换为 number类型
        let start = Number(item.begintime);
        let end = Number(item.endtime);
        // 将时间戳 转换为指定格式的 日期时间
        this.seckList[i].begintime = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.seckList[i].endtime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      });
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
