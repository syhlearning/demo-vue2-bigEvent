import requset from '@/utils/request'
// 封装每一个具体的接口
// 原地是一个promise对象，，return这个promise对象到逻辑页面
// 必须export出这个接口方法，为了在页面引入后调用
// this.formc传过来，通过对象解构出来：{ username, password, repassword }
// es6规定当对象的key值和value值相同时可简写
export const registerApi = ({ username, password, repassword }) => {
  return requset({
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