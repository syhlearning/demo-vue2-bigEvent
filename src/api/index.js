import request from '@/utils/request'
// 封装每一个具体的接口
// 原地是一个promise对象，，return这个promise对象到逻辑页面
// 必须export出这个接口方法，为了在页面引入后调用
// this.formc传过来，通过对象解构出来：{ username, password, repassword }
// es6规定当对象的key值和value值相同时可简写
export const registerApi = ({ username, password, repassword }) => {
  return request({
    // 注册接口
    url: '/api/reg',
    method: 'post',
    data: {
      // 可简写成username，password，repassword
      username,
      password,
      repassword
    }
  })
}
/**
 * 登录接口
 * @param {*} param0
 * @returns
 */
export const loginApi = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
/**
 * 获取用户用户名的接口
 * @param {*} param0
 * @returns
 */
export const getuserInfoApi = () => {
  return request({
    url: '/my/userinfo',
    method: 'get'
    // axios传参给后台：params(查询字符串query)，data(请求体body)，headers(请求头)
    // headers: {
    //   Authorization: store.state.token
    // }
  })
}

/**
 *获取侧边栏的数据
 * @returns
 */
export const getMenusApi = () => {
  // 原地是一个promise对象，内部包含了原生的 ajax 请求
  // 请求的数据需要在对应的 vue 组件中使用，所以这里需要将数据 return 出去
  return request({
    // 进行请求时，这里的 url 会与 request 中的 baseurl 进行拼接后请求
    url: '/my/menus'
    // headers: {
    //   Authorization: store.state.token
    // }
  })
}
