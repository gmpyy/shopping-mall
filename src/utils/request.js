import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index'
// 创建一个实例
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api', // 修改基地址
  timeout: 5000
})

// 请求拦截器
// 添加请求拦截器
// 将axios改成实例instance
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  Toast.loading({
    message: '请求中...',
    forbidClick: true, // 禁止背景点击
    loadingType: 'spinner', // 配置loading图标
    duration: 0 // 不会自动消失
  })
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 修改一下，返回响应所获取的数据
  const res = response.data
  if (res.status !== 200) {
    // 提示错误信息
    Toast(res.message)
    // 抛出一个错误，就不会再执行下面的代码
    return Promise.reject(res.message)
  } else {
    // 清除 loading 中的效果
    Toast.clear()
  }
  // 对响应数据做点什么
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出
export default instance
