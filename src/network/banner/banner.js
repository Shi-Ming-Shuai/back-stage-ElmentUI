// 导入 封装的axios
import { request } from "network/request";

// 1.轮播图添加 /Banneradd
function BannerAdd(data) {
  return request({
    url: "/banneradd",
    method: "post",
    data: data
  })
}

// 轮播图列表 /Bannerlist
function BannerList(params) {
  return request({
    url: "/bannerlist",
    method: "get",
    params
  })
}

// 轮播图删除 /Bannerdelete  post 给一个id值 要删除哪个数据
function BannerDel(id) {
  return request({
    url: "/bannerdelete",
    method: "post",
    data: {
      id
    }
  })
}

// 轮播图详情  id  通过id来 获取指定轮播图详情   配合 轮播图修改一起使用
function BannerInfo(id) {
  return request({
    url: "/bannerinfo",
    params: {
      id
    }
  })
}

//POST  轮播图修改，编辑轮播图时，点击提交按钮 触发修改
function BannerEdit(data) {
  return request({
    url: "/banneredit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  BannerAdd, BannerList, BannerDel, BannerInfo,BannerEdit
}