// 导入 封装的axios
import { request } from "network/request";

// 1.用户(管理员)添加 /Useradd
function UserAdd(data) {
  return request({
    url: "/useradd",
    method: "post",
    data: data
  })
}

// 管理员总数（用于计算分页）
function UserTotal() {
  return request({
    url: "/usercount",
    method: "get"
  })
}

// 用户(管理员)列表  分页 /Userlist
function UserList(params) {
  return request({
    url: "/userlist",
    method: "get",
    params
  })
}

// 用户(管理员)删除   uid:必传  要删除哪个数据
function UserDel(uid) {
  return request({
    url: "/userdelete",
    method: "post",
    data: {
      uid
    }
  })
}

// 用户(管理员)详情  uid  通过uid来 获取指定用户(管理员)详情   配合 用户(管理员)修改一起使用
function UserInfo(uid) {
  return request({
    url: "/userinfo",
    params: {
      uid
    }
  })
}

//POST  用户(管理员)修改，编辑用户(管理员)时，点击提交按钮 触发修改
function UserEdit(data) {
  return request({
    url: "/Useredit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  UserAdd, UserList, UserDel, UserInfo, UserEdit,UserTotal
}