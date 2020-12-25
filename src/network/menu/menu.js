// 导入 封装的axios
import { request } from "network/request";

// 1.菜单添加 /menuadd
function MenuAdd(data) {
  return request({
    url: "/menuadd",
    method: "post",
    data: data
  })
}

// 菜单列表 /menulist
function MenuList(params) {
  return request({
    url: "/menulist",
    method: "get",
    params
  })
}

// 菜单删除 /menudelete  post 给一个id值 要删除哪个数据
function MenuDel(id) {
  return request({
    url: "/menudelete",
    method: "post",
    data: {
      id
    }
  })
}

// 菜单详情  id  通过id来 获取指定菜单详情   配合 菜单修改一起使用
function MenuInfo(id) {
  return request({
    url: "/menuinfo",
    params: {
      id
    }
  })
}

//POST  菜单修改，编辑菜单时，点击提交按钮 触发修改
function MenuEdit(data) {
  return request({
    url: "/menuedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  MenuAdd, MenuList, MenuDel, MenuInfo,MenuEdit
}