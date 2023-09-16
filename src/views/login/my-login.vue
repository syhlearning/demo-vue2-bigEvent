<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title"></div>
      <el-form :model="loginForm" ref="loginRef" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class='login-btn' @click="loginFn">登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api/index'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    loginFn () {
      this.$refs.loginRef.validate(async valid => {
        // 如果校验失败
        if (!valid) return this.$message.error('用户名或密码错误')
        // 校验成功，向后台请求数据
        const { data: res } = await loginApi(this.loginForm)
        // 登陆失败
        if (res.code !== 0) return this.$message.error(res.message)
        // 登陆成功
        this.$message.success(res.message)
        this.updateToken(res.token)
        // 跳转到布局页
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-image: url("@/assets/images/login_bg.jpg");

  .login-box {
    box-sizing: border-box;
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    padding: 0 30px;
    // 绝对定位
    position: absolute;
    top: 50%;
    left: 50%;
    // 偏移
    transform: translate(-50%, -50%);

    .login-title {
      height: 60px;
      background: url("@/assets/images/login_title.png") center no-repeat;
    }

    .login-btn {
      width: 100%;
    }
  }

}
</style>
