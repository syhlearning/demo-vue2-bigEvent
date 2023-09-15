import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
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

export default router
