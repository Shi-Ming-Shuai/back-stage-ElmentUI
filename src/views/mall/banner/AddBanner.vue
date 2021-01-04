<template>
  <div>
    <!-- 添加轮播图 和 编辑轮播图 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/banner' }"
        >轮播图列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ currentPage }}轮播图 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="newData" :model="newData" label-width="120px" :rules="rules">

      <el-form-item label="轮播图名称">
        <el-input v-model="newData.title"></el-input>
      </el-form-item>
      <el-form-item  label="轮播图图片">
        <!-- 上传文件   -->
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleChange"
          :multiple="true"
          :file-list="fileList"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <!-- 大图展示   （对话框） -->
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <!-- （删除图片） -->
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <!-- 点击图片 放大展示 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item prop="status" label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBanner">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  UserInfo,UserEdit  如果是修改页面 才会使用这个两个方法
import {
  BannerAdd,
  BannerEdit,
  BannerInfo,
  BannerList,
} from "network/banner/banner";
// 获取轮播图 角色信息
import { RoleList } from "network/role/role";

export default {
  async mounted() {
    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await BannerInfo(id);
      this.newData = info.list;
      // 轮播图图片展示
      this.fileList = [{ name: "轮播图图片", url: info.list.img }];
    } else {
      this.currentPage = "添加";
    }
    // 渲染下拉菜单 添加轮播图信息,轮播图模块
    let list = await BannerList({ pid: 0 });
    this.bannerList = list.list;
  },
  name: "",
  data() {
    return {
      // 文件上传
      dialogImageUrl: "", //是否放大展示图片  图片地址
      dialogVisible: false, //是否放大展示图片  对话框
      disabled: false,
      fileList: [],
      currentPage: "添加",
      newData: {
        title: "",
        img: "",
        status: 1,
      },
      bannerList: [],
      // 条件验证
      rules: {
        title: [
          { required: true, message: "请输入轮播图名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择轮播图状态" }],
      },
    };
  },
  components: {},
  methods: {
    // 提交文件就会触发  file:当前上传的文件(一个轮播图：只能提交一个图片)   fileList（上传的所有文件列表）
    handleChange(file) {
      this.newData.img = file.raw;
    },
    // 点击打开对话框   图片显示大图
    handlePictureCardPreview(file) {
      // dialogVisible 状态修改为 true  ---大图展示
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    // 删除图片
    handleRemove() {
      this.fileList = [];
    },
    // 向数据库中 添加数据
    addBanner() {
      console.log(this.newData);
      //因为包含了文件提交 所以使用 FormData原生的构造函数  用于js 表单提交（自动添加了）
      let formData = new FormData();
      // 通过append 向FormData 构造函数中 添加键名 键值
      for (const key in this.newData) {
        formData.append(key, this.newData[key]);
      }
      // 表单验证  是否都符合 rules中的规则
      this.$refs.newData.validate(async (valid) => {
        // 验证通过
        if (valid) {
          // res  添加 注册状态
          let res = {};
          // 如果是编辑页面 则 调用编辑页面 API
          if (this.currentPage == "编辑") {
            // id 必传， 获取编辑页面 的id号（修改指定id）
            formData.append("id", this.$route.params.id);
            res = await BannerEdit(formData); //提交FromData构造函数（因为提交包含了文件）
          } else {
            // 如果是添加页面 则 调用添加页面 API
            res = await BannerAdd(formData);
          }
          // 如果添加成功 则跳转页面
          // 提示用户 添加成功  如果失败 提示用户失败信息
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.$router.push({
              path: "/banner",
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
