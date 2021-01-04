// 导入 封装的axios
import { request } from "network/request";

// 1.限时秒杀添加 /seckadd
function SeckillAdd(data) {
  return request({
    url: "/seckadd",
    method: "post",
    data
  })
}



// 限时秒杀列表 [pid] [istree] /Secklist
function SeckillList(params) {
  return request({
    url: "/secklist",
    method: "get",
    params
  })
}

// 限时秒杀删除   uid:必传  要删除哪个数据
function SeckillDel(id) {
  return request({
    url: "/seckdelete",
    method: "post",
    data: {
      id
    }
  })
}

// 限时秒杀详情  uid  通过uid来 获取指定限时秒杀详情   配合 限时秒杀修改一起使用
function SeckillInfo(id) {
  return request({
    url: "/seckinfo",
    params: {
      id
    }
  })
}

//POST  限时秒杀修改，编辑限时秒杀时，点击提交按钮 触发修改
function SeckillEdit(data) {
  return request({
    url: "/seckedit",
    method: "post",
    data
  })
}

// 统一暴露出去
export {
  SeckillAdd, SeckillList, SeckillDel, SeckillInfo, SeckillEdit,SeckillTotal
}