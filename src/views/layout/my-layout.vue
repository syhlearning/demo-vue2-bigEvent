<template>
  <el-container class="main-container">
    <el-header>
      <img src="@/assets/images/logo.png" alt="" />
      <el-menu class="el-menu-top" mode="horizontal">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" v-if="user_pic" class="avatar">
            <img src="@/assets/images/head.png" alt="" v-else class="avatar">
            <!-- <img src="@/assets/images/head.png" alt="" class="avatar" /> -->
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic">
          <img src="@/assets/images/head.png" alt="" v-else>
          <span>你好 {{ nickname||username}}</span>
        </div>
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#23262e" text-color="#fff" active-text-color="#ffd04b" :default-active="$route.path" router>
          <template v-for="item in menus">

            <el-menu-item :index="item.indexPath" v-if="!item.children" :key='item.indexPath'>
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>

            <el-submenu :index="item.indexPath" :key='item.indexPath' v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>

              <el-menu-item-group>
                <el-menu-item v-for="obj in item.children" :key='obj.indexPath' :index="obj.indexPath">
                  <i :class="obj.icon">
                    {{obj.title}}
                  </i>
                </el-menu-item>
              </el-menu-item-group>

            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenusApi } from '@/api'
export default {
  data () {
    return {
      menus: []
    }
  },
  methods: {
    quitFn () {
      this.$confirm('确认退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消成功'
          })
        })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created () {
    getMenusApi().then(res => {
      // console.log(res)
      this.menus = res.data.data
    })
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  }
}
</script>

<style lang='less' scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;

    .user-box {
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      user-select: none;

      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 15px;
        object-fit: cover;
      }

      span {
        color: aqua;
        font-size: 12px;
      }
    }
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
.el-menu-top {
  background-color: #000;
}
.el-menu-vertical-demo span {
  font-size: 20px;
}
</style>
