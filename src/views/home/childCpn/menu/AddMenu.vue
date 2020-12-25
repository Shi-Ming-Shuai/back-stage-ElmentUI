<template>
  <div>
    <!-- 添加菜单 和 编辑菜单 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/menu' }">菜单列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentPage }}菜单 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="80px" :rules="rules">
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="newData.title"></el-input>
      </el-form-item>
      <el-form-item label="上传菜单" prop="pid">
        <el-select
          v-model="newData.pid"
          placeholder="请选择"
          @change="pidChange"
        >
          <el-option label="顶层目录" :value="0"></el-option>
          <el-option
            v-for="item in catalog"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="newData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="icon" v-if="newData.type == 1" label="菜单图标">
        <el-input v-model="newData.icon"></el-input>
      </el-form-item>
      <el-form-item prop="url" v-if="newData.type == 2" label="菜单地址">
        <el-input v-model="newData.url"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addMenu">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  MenuInfo,MenuEdit  如果是修改页面 才会使用这个两个方法
import { MenuAdd, MenuList, MenuInfo, MenuEdit } from "network/menu/menu";

export default {
  async mounted() {
    // 获取顶层目录
    let res = await MenuList({ pid: 0 });
    this.catalog = res.list;

    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await MenuInfo(id);
      this.newData = info.list;
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      catalog: [],
      newData: {
        title: "",
        pid: "",
        status: 1,
        type: 1,
        icon: "",
        url: "",
      },
      rules: {
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        pid: [{ required: true, message: "请选择上传菜单" }],
        status: [{ required: true, message: "请选择菜单状态" }],
        type: [{ required: true, message: "请选择类型" }],
        icon: [{ required: true, message: "请输入目录图标" }],
        url: [{ required: true, message: "请输入菜单地址" }],
      },
    };
  },
  components: {},
  methods: {
    // 当上传菜单 选中值发生变化时触发
    pidChange() {
      // 选中顶级菜单 则目录按钮选中，选中别的 则 菜单按钮选中
      this.newData.type = this.newData.pid == 0 ? 1 : 2;
    },
    // 向数据库中 添加数据
    addMenu() {
      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            this.newData.id = this.$route.params.id;
            res = await MenuEdit(this.newData);
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await MenuAdd(this.newData);
          }
          // 如果添加成功 则跳转页面
          if (res.code == 200) {
            this.$router.push({
              path: "/menu",
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
