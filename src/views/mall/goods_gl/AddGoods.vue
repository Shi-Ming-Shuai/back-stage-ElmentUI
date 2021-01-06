<template>
  <div>
    <!-- 添加商品 和 编辑商品 公用一个页面  根据$route中的parmas 来判断是哪个页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentPage }}商品 </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单页面 -->
    <el-form ref="newData" :rules="rules" :model="newData" label-width="80px">
      <el-form-item label="一级分类" prop="first_cateid">
        <!-- 循环商品 一级分类 -->
        <el-select
          placeholder="请选择"
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
        <el-select placeholder="请选择" v-model="newData.second_cateid">
          <!-- 根据一级分类的 pid 循环商品 二级分类 -->
          <el-option
            v-for="twoCate in secondCates"
            :label="twoCate.catename"
            :value="twoCate.id"
            :key="twoCate.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsname">
        <el-input v-model="newData.goodsname"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number
          :precision="2"
          v-model="newData.price"
          controls-position="right"
          :min="0.1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="市场价格">
        <el-input-number
          :precision="2"
          v-model="newData.market_price"
          controls-position="right"
          :min="0.1"
        ></el-input-number>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="商品图片">
        <!-- 上传文件   -->
        <el-upload
          action="#"
          :file-list="fileList"
          :on-change="handleChange"
          list-type="picture-card"
          :auto-upload="false"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 商品规格 -->

      <el-form-item label="商品规格" prop="specsid">
        <el-select
          v-model="newData.specsid"
          @change="oneSpecsCange"
          placeholder="请选择"
        >
          <!--一级分类 循环商品规格 -->
          <el-option
            v-for="oneSpecs in specsarr"
            :label="oneSpecs.specsname"
            :key="oneSpecs.id"
            :value="oneSpecs.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格属性" prop="specsattr">
        <el-select multiple v-model="newData.specsattr" placeholder="请选择">
          <!--二级分类 循环商品规格属性 -->
          <el-option
            v-for="(twoSpecs, i) in specsattrs"
            :label="twoSpecs"
            :value="twoSpecs"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否新品">
        <el-radio v-model="newData.isnew" :label="1">是</el-radio>
        <el-radio v-model="newData.isnew" :label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="是否热卖">
        <el-radio v-model="newData.ishot" :label="1">是</el-radio>
        <el-radio v-model="newData.ishot" :label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="商品描述">
        <div id="desc"></div>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="newData.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addCategory">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 获取分类联动，规格属性联动
import { CategoryList } from "network/category/category";
import { SpecsList, SpecsInfo } from "network/specs/specs";
// 添加接口  商品添加
import { GoodsAdd, GoodsInfo, GoodsEdit } from "network/goods/goods";

// 使用富文本编辑器
import Editor from "wangeditor";

export default {
  async created() {
    // 分类  一级分类   （根据一级分类的pid 查询二级分类）
    let firstList = await CategoryList({ pid: 0 });
    this.firstCates = firstList.list;
    // 商品规格  一级分类  （根据一级分类的pid 查询二级分类）
    let firstSpecs = await SpecsList();
    this.specsarr = firstSpecs.list;
  },
  async mounted() {
    //初始化富文本编辑器
    this.editor = new Editor("#desc");
    this.editor.config.uploadImgShowBase64 = true;
    this.editor.create();

    // 根据route 中的 params.id判断 添加页面 || 编辑页面
    let { id } = this.$route.params;
    if (id) {
      this.currentPage = "编辑";
      // 根据id 请求不同页面数据
      let info = await GoodsInfo(id);
      // 修改页面初始数据， 页面展示商品的详细信息
      this.newData = info.list;
      this.fileList = info.list.img
        ? [{ name: "商品图片", url: this.newData.img }]
        : []; // 商品图片展示, 如果有图片则赋值，如果没有 则值为空数组
      this.newData.specsattr = this.newData.specsattr
        ? this.newData.specsattr.split(",")
        : []; //将商品规格属性 转换过来
      this.editor.txt.html(this.newData.description); // 富文本框内容展示
      await this.oneCateCange(this.newData.first_cateid, false); //二级分类 随之改变   (第二个参数,一级分类发生改变是否情况二级分类)  不需要清空（因为是编辑页面）
      await this.oneSpecsCange(this.newData.specsid, false); //二级分类  商品规格属性
    } else {
      this.currentPage = "添加";
    }
  },
  name: "",
  data() {
    return {
      currentPage: "添加",
      // 图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
      // 分类 联动
      firstCates: [], //一级分类(用于 select标签 for渲染)
      secondCates: [], //二级级分类(跟随一级分类改变)
      specsarr: [], //一级 -- 商品规格
      specsattrs: [], //商品规格属性
      editor: null, //富文本编辑器
      // 提交的数据 新增
      newData: {
        first_cateid: "", //一级分类编号  (必须)
        second_cateid: "", //二级分类编号(必须)
        goodsname: "", //商品名称(必须)
        price: 0, //商品价格
        market_price: 0, //市场价格
        img: "", //商品图片（文件）  （需要加工）
        description: "", //商品描述   （需要配合 wangeditor 插件）
        specsid: "", //商品规格编号  (必须)
        specsattr: "", //商品规格属性  (必须) **提交的类型为字符串，形如: **值1,值2,值3**
        isnew: 1, // 单选框 是否新品、热卖
        ishot: 1,
        status: 1,
      },
      // 加工以后 提交的数据
      formData: {},
      // 表单验证
      rules: {
        first_cateid: [{ required: true, message: "请选择一级分类" }],
        second_cateid: [{ required: true, message: "请选择二级分类" }],
        specsid: [{ required: true, message: "请选择商品规格" }],
        specsattr: [{ required: true, message: "请选择商品规格" }],
        goodsname: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
          { min: 1, max: 100, message: "商品名称长度不符合要求" },
        ],
      },
    };
  },
  components: {},
  methods: {
    //二级分类 一级分类选项修改，随之请求二级分类
    async oneCateCange(pid, clear = true) {
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
    //二级分类 选择商品规格， 随之请求商品规格属性
    async oneSpecsCange(id, clear = true) {
      if (clear) {
        //clear,是否清空二级分类（编辑的时候，第一次不请空 传值:false） 选择的时候清空 (添加的时候影响)
        this.newData.specsattr = "";
      }
      // 请求商品规格详情页，规格属性在 [0].attrs中
      let secondList = await SpecsInfo(id);
      if (secondList.code == 200) {
        this.specsattrs = secondList.list[0].attrs;
      }
    },
    // 提交按钮
    addCategory() {
      this.$refs.newData.validate(async (valid) => {
        // 通过表单验证 才处理提交内容
        if (valid) {
          //加工 处理表单提交
          this._handleFormData();
          let res;
          // 添加商品  post提交 data 为 this.formData
          if (this.currentPage == "添加") {
            res = await GoodsAdd(this.formData);
          } else {
            //编辑商品
            this.formData.append("id", this.$route.params.id);
            res = await GoodsEdit(this.formData);
          }
          // 提示用户添加状态 ， 如果成功 跳转页面
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            // 跳转商品管理页面
            this.$router.push("/goods");
          } else {
            this.$message.error(res.msg);
          }
        } else {
          this.$message({
            message: "表单验证未通过",
            type: "warning",
          });
        }
      });
    },
    //change触发 图片上传， 将上传的图片保存到 表单中
    handleChange(file) {
      // 将File文件 存储到要提交的表单中， 需要配合原生JS 中的 FormData（）构造函数    进行提交数据
      this.newData.img = file.raw;
    },
    // 删除图片
    handleRemove() {
      this.fileList = [];
      this.newData.img = "";
    },
    // 查看图片大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 加工 提交表单数据
    _handleFormData() {
      // 处理商品规格属性，现在是数组 提交的时候以逗号隔开， 传递字符串 str1,str2
      this.newData.specsattr = this.newData.specsattr
        ? this.newData.specsattr.join(",")
        : [];
      // 处理商品描述信息， 将 wangeditor 读取出来
      this.newData.description = this.editor.txt.html();
      // 因为提交的数据包含图片， 需要使用JS原生的 FromData 构造函数 来进行提交
      this.formData = new FormData();
      // 通过append 向FormData 构造函数中 添加键名 键值
      for (const key in this.newData) {
        this.formData.append(key, this.newData[key]);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  margin 15px 0
.el-form
  width 600px
.specs-attr
  position relative
.specs-add
  position absolute
  right -100px
</style>
