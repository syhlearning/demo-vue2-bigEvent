import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL
})

// 定义请求拦截器
myAxios.interceptors.request.use(function (config) {
  // config配置对象(要请求后台的参数都落在这个对象上)
  // 在请求前会被触发一次，这个return交给axios源码，根据配置项发起请求
  // 在发起前，为请求头挂载 Authorization 字段
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 请求发起前的代码，如果有异常报错，会直接进入这里
  // 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
  // 此函数类似catch函数()里return
  // 口诀: return非Promise对象值，会作为成功的结果，返回给下一个Promise对象(axios留在原地)
  // 口诀: returnPromise对象，这个Promise对象状态，返回给下一个Promise对象
  // Promise.reject()原地留下一个新的Promise对象(状态为失败)它是Promise的类方法reject()
  return Promise.reject(error)
})

// 响应拦截器
myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // console.dir(error)
  // 响应状态码为4xx，5xx时触发失败的回调，形参中的 error是f失败的结果”
  // return到axios原地Promise对象位置，作为失败拒绝的状态(如果那边用try+catch或者catch函数捕获，可以捕获到我们传递过去的这个error变量的值)
  if (error.response.status === 401) {
    // 因为这个文件是js文件，不是一个vue所以不能用this.$router.push()和this.$store.commit
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    router.push('/login')
    Message.error('你的身份已过期,请重新登录')
  }
  return Promise.reject(error)
})

export default myAxios
