// 导入 封装的axios
import { request } from "network/request";

// 1.商品分类添加 /categoryadd
function CategoryAdd(data) {
  return request({
    url: "/cateadd",
    method: "post",
    data: data
  })
}



// 商品分类列表 [pid] [istree] /categorylist
function CategoryList(params) {
  return request({
    url: "/catelist",
    method: "get",
    params
  })
}

// 商品分类删除   uid:必传  要删除哪个数据
function CategoryDel(id) {
  return request({
    url: "/catedelete",
    method: "post",
    data: {
      id
    }
  })
}

// 商品分类详情  uid  通过uid来 获取指定商品分类详情   配合 商品分类修改一起使用
function CategoryInfo(id) {
  return request({
    url: "/cateinfo",
    params: {
      id
    }
  })
}

//POST  商品分类修改，编辑商品分类时，点击提交按钮 触发修改
function CategoryEdit(data) {
  return request({
    url: "/cateedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  CategoryAdd, CategoryList, CategoryDel, CategoryInfo, CategoryEdit,CategoryTotal
}