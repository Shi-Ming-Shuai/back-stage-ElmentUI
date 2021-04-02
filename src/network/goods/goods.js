// 导入 封装的axios
import { request } from "network/request";

// 1.商品管理添加 /Goodsadd
function GoodsAdd(data) {
  return request({
    url: "/goodsadd",
    method: "post",
    data
  })
}

// 商品总数（用于计算分页）
function GoodsTotal() {
  return request({
    url: "/goodscount",
    method: "get"
  })
}

// 商品管理列表  分页 /Goodslist
function GoodsList(params) {
  return request({
    url: "/goodslist",
    method: "get",
    params
  })
}

// 商品管理删除   id:必传  要删除哪个数据
function GoodsDel(id) {
  return request({
    url: "/goodsdelete",
    method: "post",
    data: {
      id
    }
  })
}

// 商品管理详情  uid  通过uid来 获取指定商品管理详情   配合 商品管理修改一起使用
function GoodsInfo(id) {
  return request({
    url: "/goodsinfo",
    params: {
      id
    }
  })
}

//POST  商品管理修改，编辑商品管理时，点击提交按钮 触发修改
function GoodsEdit(data) {
  return request({
    url: "/goodsedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  GoodsAdd, GoodsList, GoodsDel, GoodsInfo, GoodsEdit,GoodsTotal
}