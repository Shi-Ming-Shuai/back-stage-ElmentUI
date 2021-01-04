// 导入 封装的axios
import { request } from "network/request";

// 1.角色添加 /Roleadd
function RoleAdd(data) {
  return request({
    url: "/roleadd",
    method: "post",
    data: data
  })
}

// 角色列表 /Rolelist
function RoleList(params) {
  return request({
    url: "/rolelist",
    method: "get",
    params
  })
}

// 角色删除 /Roledelete  post 给一个id值 要删除哪个数据
function RoleDel(id) {
  return request({
    url: "/roledelete",
    method: "post",
    data: {
      id
    }
  })
}

// 角色详情  id  通过id来 获取指定角色详情   配合 角色修改一起使用
function RoleInfo(id) {
  return request({
    url: "/roleinfo",
    params: {
      id
    }
  })
}

//POST  角色修改，编辑角色时，点击提交按钮 触发修改
function RoleEdit(data) {
  return request({
    url: "/roleedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  RoleAdd, RoleList, RoleDel, RoleInfo,RoleEdit
}