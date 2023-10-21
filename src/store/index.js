import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import { getuserInfoApi } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    updateToken (state, newToken) {
      state.token = newToken
    },
    updateUserInfo (state, newinfo) {
      state.userInfo = newinfo
    }
  },
  actions: {
    async initUserInfo (store) {
      const res = await getuserInfoApi()
      // console.log(res)
      if (res.data.code === 0) {
        store.commit('updateUserInfo', res.data.data)
      }
    }
  },
  getters: {
    username: state => state.userInfo.username, // 用户名
    nickname: state => state.userInfo.nickname, // 用户昵称
    user_pic: state => state.userInfo.user_pic// 头像
  },
  modules: {
  },
  plugins: [
    createPersistedstate({
      key: 'syh_token' // 存数据的key名   自定义的  要有语义化
    })
  ]
})
