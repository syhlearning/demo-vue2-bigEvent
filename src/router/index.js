import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/my-layout')
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

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    store.dispatch('initUserInfo')
  }
  next()
})

export default router
