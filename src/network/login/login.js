
import { request } from "../request";

//管理员 登录接口
function UserLogin(data) {
  return request({
    url: "/userlogin",
    method: "post",
    data
  })
}

export {
  UserLogin
}