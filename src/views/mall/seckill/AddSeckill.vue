<template>
  <div>
    <!-- 添加活动场次 和 编辑活动场次 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/seckill' }"
        >活动场次列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ currentPage }}活动场次 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="80px" :rules="rules">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="newData.title"></el-input>
      </el-form-item>
      <!--秒杀倒计时 日期时间选择器 -->
      <el-form-item label="活动期限">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          align="right"
          range-separator="至"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @blur="changeTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="一级分类" prop="first_cateid">
        <!-- 循环商品 一级分类 -->
        <el-select
          placeholder="请选择分类"
          @change="oneCateCange"
          v-model="newData.first_cateid"
        >
          <el-option
            v-for="oneCate in firstCates"
            :label="oneCate.catename"
            :key="oneCate.id"
            :value="oneCate.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="second_cateid">
        <el-select
          @change="twoCateCange"
          placeholder="请选择分类"
          v-model="newData.second_cateid"
        >
          <!-- 根据一级分类的 pid 循环商品 二级分类 -->
          <el-option
            v-for="twoCate in secondCates"
            :label="twoCate.catename"
            :value="twoCate.id"
            :key="twoCate.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品" prop="goodsid">
        <el-select placeholder="请选择商品" v-model="newData.goodsid">
          <!-- 根据 一级分类和二级分类 请求到三级分类 -->
          <el-option
            v-for="twoCate in goodsCates"
            :label="twoCate.goodsname"
            :value="twoCate.id"
            :key="twoCate.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSeckill">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 1. 分类列表（下拉菜单） 2. 商品列表(商品 下拉菜单)
import { CategoryList } from "network/category/category";
import { GoodsList } from "network/goods/goods";
// 3. 添加秒杀场次 / 修改秒杀场次
import { SeckillAdd, SeckillEdit, SeckillInfo } from "network/seckill/seckill";

export default {
  async mounted() {
    // 分类  一级分类   （根据一级分类的pid 查询二级分类）
    let firstList = await CategoryList({ pid: 0 });
    this.firstCates = firstList.list;
    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await SeckillInfo(id);
      this.newData = info.list;
      // 开始/结束时间戳 放到数组  用于列表展示
      this.time.push(this.newData.begintime);
      this.time.push(this.newData.endtime);
      // 二级分类随之改变
      await this.oneCateCange(this.newData.first_cateid, false); //二级分类 随之改变   (第二个参数,一级分类发生改变是否情况二级分类)  不需要清空（因为是编辑页面）
      let ThreeList = await GoodsList({
        fid: this.newData.first_cateid,
        sid: this.newData.second_cateid,
      });
      if (ThreeList) {
        this.goodsCates = ThreeList.list;
      }
      // 转换为 数值类型
      this.newData.goodsid = Number(this.newData.goodsid);
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      firstCates: [], //一级分类 下拉菜单（用于页面展示）
      secondCates: [], //二级分类 下拉菜单（用于页面展示）
      goodsCates: [], //三级分类 下拉菜单（用于页面展示）
      time: [], //日期时间选择器 数组 起始时间 -- 结束时间
      oneId: "", //一级分类 id
      twoId: "", //二级分类 id
      newData: {
        title: "", //限时秒杀名称
        begintime: "", //开始时间  提交时间戳
        endtime: "", //结束时间  提交时间戳
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1, //状态1正常2禁用
      },
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    // 离开日期选择器触发, 修改 提交表单中的开始时间 和 结束时间
    changeTime() {
      // 如果时间存在
      if (this.time) {
        (this.newData.begintime = this.time[0]), //开始时间  提交时间戳
          (this.newData.endtime = this.time[1]); //结束时间  提交时间戳
      }
    },
    //二级分类 一级分类选项修改，随之请求二级分类
    async oneCateCange(pid, clear = true) {
      // 将一级id 保存下来(用于配合二级id 请求三级分类-商品)
      this.oneId = pid;
      //clear,是否清空二级分类（编辑的时候，第一次不请空） 选择的时候清空 (添加的时候影响)
      if (clear) {
        this.newData.second_cateid = "";
      }
      //请求二级分类 第一个参数,不传递。默认为select 标签中的:value 值。
      let secondList = await CategoryList({ pid });
      if (secondList) {
        this.secondCates = secondList.list;
      }
    },
    //商品列表 三级分类 二级分类选项修改，随之请求三级分类
    async twoCateCange(pid, clear = true) {
      // 将二级id 保存下来(用于配合保存下来的一级id 请求三级分类-商品)
      this.twoId = pid;
      //clear,是否清空三级分类（编辑的时候，第一次不请空） 选择的时候清空 (添加的时候影响)
      // if (clear) {
      //   this.newData.goodsid = "";
      // }
      // 获取商品列表的时候，请求商品列表接口需要传入  **{fid:一级分类,sid:二级分类id}
      let ThreeList = await GoodsList({ fid: this.oneId, sid: this.twoId });
      if (ThreeList) {
        this.goodsCates = ThreeList.list;
      }
    },
    //提交-- 向数据库中 添加数据
    addSeckill() {
      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            this.newData.id = this.$route.params.id;
            res = await SeckillEdit(this.newData);
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await SeckillAdd(this.newData);
          }
          // 如果添加成功 则跳转页面,提示用户成功 或失败
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.$router.push({
              path: "/seckill",
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
