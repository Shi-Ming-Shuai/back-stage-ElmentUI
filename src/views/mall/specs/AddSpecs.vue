<template>
  <div>
    <!-- 添加商品规格 和 编辑商品规格 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/specs' }"
        >商品规格列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ currentPage }}商品规格 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="80px" :rules="rules">
      <el-form-item prop="specsname" label="规格名称">
        <el-input
          placeholder="请输入商品规格名称"
          v-model="newData.specsname"
        ></el-input>
      </el-form-item>
      <el-form-item v-for="(item, i) in attrLength" :key="i" label="规格属性">
        <el-input
          class="specs-attr"
          placeholder="请输入商品规格属性"
          v-model="item.value"
        ></el-input>

        <el-button v-if="i == 0" @click="addAttr()" class="specs-add"
          >增加属性</el-button
        >
        <el-button type="danger" v-else @click="reduceAttr(i)" class="specs-add"
          >删&nbsp;&nbsp;除</el-button
        >
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSpecs">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  SpecsInfo,SpecsEdit  如果是修改页面 才会使用这个两个方法
import { SpecsAdd, SpecsEdit, SpecsInfo } from "network/specs/specs";
// 获取商品规格 角色信息
import { RoleList } from "network/role/role";

export default {
  async mounted() {
    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await SpecsInfo(id);
      // 展示 对应 规格 （规格属性 需要处理一下才能展示）
      this.newData = info.list[0];
      //处理规格属性 展示对应属性
      let newArr = info.list[0].attrs;
      newArr.forEach((item, i) => {
        //因为数组本身就有第一条数据 如果是第一项的话  就修改第一项的内容，其余的向末尾插入
        if (i == 0) {
          this.attrLength[0].value = item;
        } else {
          this.attrLength.push({ value: item });
        }
      });
      // 因为密码是加密的 不需要展示在页面 设置为空，（提交的时候如果密码为空 则不修改密码）
      this.newData.attrs = "";
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      newData: {
        specsname: "",
        attrs: "",
        status: 1,
      },
      attrLength: [{ value: "" }],
      // 条件验证
      rules: {
        specsname: [
          { required: true, message: "请输入商品规格名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择商品规格状态" }],
      },
    };
  },
  components: {},
  methods: {
    // 向数据库中 添加数据
    addSpecs() {
      // 存储 attrs 未转换字符串时的形态
      let Arr = [];
      // 将数组 每一项 中 value属性值 取出，加工放到 newData 中，（接口只接受 字符串1,字符串2）形式的数据
      this.attrLength.forEach((item) => {
        Arr.push(item.value);
      });
      // 将属性存储到 newData中
      this.newData.attrs = Arr.join();

      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            this.newData.id = this.$route.params.id;
            res = await SpecsEdit(this.newData);
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await SpecsAdd(this.newData);
          }
          // 如果添加成功 则跳转页面,提示用于 成功 或 失败
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.$router.push({
              path: "/specs",
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
    // 新增属性按钮   新增规格属性。
    addAttr() {
      // 一件商品最多增加至五个属性
      // 利用v-for循环机制  增加规格属性 标签
      if (this.attrLength.length < 5) {
        this.attrLength.push({ value: "" });
        console.log(this.attrLength.length);
      }else{
        this.$message({
          type:"info",
          message:"一件商品最多增加五个属性"
        })
      }
    },
    // 删除属性
    reduceAttr(i) {
      console.log(i);
      this.attrLength.splice(i, 1);
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  margin 15px 0
.el-form
  width 500px
.specs-attr
  position relative
.specs-add
  position absolute
  right -100px
</style>
