<template>
  <el-container class="main-container">
    <el-header>
      <img src="@/assets/images/logo.png" alt="" />
      <el-menu :default-active="activeIndex" class="el-menu-top" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="@/assets/images/head.png" alt="" class="avatar" />
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
          <span>你好  {{ nickname||username}}</span>
        </div>
      </el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
    }
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
</style>
