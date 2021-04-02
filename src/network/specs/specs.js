// 导入 封装的axios
import { request } from "network/request";

// 1.用户(管理员)添加 /Specsadd
function SpecsAdd(data) {
  return request({
    url: "/specsadd",
    method: "post",
    data: data
  })
}

// 管理员总数（用于计算分页）
function SpecsTotal() {
  return request({
    url: "/specscount",
    method: "get"
  })
}

// 用户(管理员)列表  分页 /Specslist
function SpecsList(params) {
  return request({
    url: "/specslist",
    method: "get",
    params
  })
}

// 用户(管理员)删除   id:必传  要删除哪个数据
function SpecsDel(id) {
  return request({
    url: "/specsdelete",
    method: "post",
    data: {
      id
    }
  })
}

// 用户(管理员)详情  id  通过id来 获取指定用户(管理员)详情   配合 用户(管理员)修改一起使用
function SpecsInfo(id) {
  return request({
    url: "/specsinfo",
    params: {
      id
    }
  })
}

//POST  用户(管理员)修改，编辑用户(管理员)时，点击提交按钮 触发修改
function SpecsEdit(data) {
  return request({
    url: "/specsedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  SpecsAdd, SpecsList, SpecsDel, SpecsInfo, SpecsEdit, SpecsTotal
}