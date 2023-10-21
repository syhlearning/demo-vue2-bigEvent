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

/**
 * 更新基本资料
 * @param {*} param0
 * @returns
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'put',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 *更新用户头像
 * @param {*} avatar
 * @returns
 */
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64位地址
    }
  })
}
/**
 *修改密码
 * @param {*} param0    old_pwd旧密码, new_pwd新密码, re_pwd确认密码
 * @returns
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'post',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 *  修改分类
 * @param {*} param0 { id:数据id值, cate_name：列表名, cate_alias：列表别名 }
 * @returns
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'post',
    // {}如果是应该普通对象，axios会将其转换成json格式字符串在请求体传给后台
    // 这个发布接口的文档请求体里是一个FormData类型（表单数据类型）携带文件给后台
    data: fd
  })
}

/**
 * 获取文章列表
 * @param {*} param0    pagenum当前页码, pagesize当前页需要的数据条数, cate_id文章的分类ID, state文章的状态
 * @returns
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    method: 'get',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} param0
 * @returns
 */
export const getArticleDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id 文章id
 * @returns
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
