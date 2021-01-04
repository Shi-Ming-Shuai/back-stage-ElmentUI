<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加信息 -->
    <div class="add">
      <el-button @click="$router.push('/goods/addgoods')" type="primary"
        >添加</el-button
      >
    </div>
    <el-table :data="goodsList" style="width: 100%" stripe border row-key="id">
      <el-table-column prop="id" label="商品规格编号" width="120">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品规格名称" width="300">
      </el-table-column>
      <el-table-column prop="price" label="商品价格" width="120">
      </el-table-column>
      <el-table-column prop="market_price" label="市场价格" width="120">
      </el-table-column>
      <el-table-column prop="img" label="图片" width="180">
        <template slot-scope="item">
          <!-- 查看是否存在 -->
          <img v-if="item.row.img" class="img" :src="item.row.img" alt="" />
          <el-tag type="warning" v-else>暂无图片</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否新品" width="120">
        <template slot-scope="item">
          <!-- 判断是否为新品 -->
          <el-tag v-if="item.row.isnew == 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖" width="120">
        <template slot-scope="item">
          <!-- 判断是否为新品 -->
          <el-tag v-if="item.row.ishot == 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
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
    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalData"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
// 网络请求  商品规格列表
import { GoodsList, GoodsDel, GoodsTotal } from "network/goods/goods";

export default {
  async created() {
    // 页面创建前  请求  分页请求 size:每页数量   page页码数（必须参数） 从1开始
    // 默认请求第一页
    await this.getGoodsList(this.currentPage);
    // 获取页面总数据 数量
    let totalNum = await GoodsTotal();
    this.totalData = totalNum.list[0].total;
  },
  name: "",
  data() {
    return {
      goodsList: [],
      // 分页数据 总数据数量  一页最大展示多少条数据
      totalData: 0,
      pageSize: 3,
      // 当前所处页数 （所在的页码）默认为1
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
    // 编辑  id: 必传   修改商品规格信息
    edit(id) {
      // 跳转编辑页面 传入 对应的商品规格 id
      this.$router.push({
        name: "editGoods",
        params: {
          id,
        },
      });
    },
    // 删除指定数据  post传入一个  id=>必传
    async del(item) {
      let id = item.row.id;
      // 提示商品规格是否确认删除
      this.$confirm("此操作将永久删除该商品规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 页面删除商品规格  重新请求数据库中的数据，更新到页面 (this.GoodsList)
          let res = await GoodsDel(id);
          // 重新获取数据库中的商品规格列表数据，获取到的数据 放到初始数据中-实现页面响应(this.GoodsList = data.list;)
          if (res.code == 200) {
            // 删除以后 渲染当前所处页面数据，（不会发生错误）
            this.getGoodsList(this.currentPage);
            // 弹出框 提示商品规格
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
      // 修改当前所处页面
      this.currentPage = num;
      await this.getGoodsList(num);
    },
    // get 获取商品规格列表
    async getGoodsList(page) {
      // 获取商品规格列表数据  获取树形结构  istree ： 1  el-table 添加 row-key="id" 属性即可
      let res = await GoodsList({ size: this.pageSize, page });
      // 获取到的数据 放到初始数据中
      this.goodsList = res.list;
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
// 商品图片大小
.img
  width 100px
  height 100px
</style>
