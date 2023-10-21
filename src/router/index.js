import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/my-layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/my-home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/userinfo/my-userinfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/userinfo/user-avatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/userinfo/user-pwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'art-list',
        component: () => import('@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register/my-register')
  },
  {
    path: '/login',
    component: () => import('@/views/login/my-login')
  }
]

const router = new VueRouter({
  routes
})
// 白名单，方式跳转到登录页面或者注册页面时因为无token发生死循环
const whiteList = ['/login', '/reg']

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      store.dispatch('initUserInfo')
    }
    next()
  } else {
    // 未登录
    // 数组.includes()表示判断括号里的数据是否在数组中，如果在，就返回一个true
    if (whiteList.includes(to.path)) {
      // 表示访问的目标地址是在白名单中，没有token就可以访问
      next()
    } else {
      next('/login')
    }
  }
})

export default router
