import axios from 'axios'

//导出自己封装的方法

export function request(config) {
  //创建axios实例
  const instance = axios.create({
    // http://localhost:3000/api
    baseURL: '/api',
    timeout: 5000
  })
  //axios拦截器
  //1.请求拦截
  instance.interceptors.request.use(config => {
    return config
  }, error => {
    console.log('错误' + error)
  })
  //2. 响应拦截
  instance.interceptors.response.use(resolve => {
    // 将结果 中的data 返回出去，省的外边在使用.data取数据
    return resolve.data
  }, error => {
    console.log('失败' + error);

  })

  //把实例传递出去
  return instance(config)
}