<template>
  <div class="reg-container">
    <div class="reg-box">
      <div class="reg-title"></div>
      <el-form :model="ruleForm" ref="ruleForm" :rules="ruleObj">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="ruleForm.repassword" type="password" placeholder="再次确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class='reg-btn' @click="registerFn">注册</el-button>
          <el-link type='info'>去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerApi } from '@/api/index'
export default {
  data () {
    const samePassword = (rules, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        repassword: ''
      },
      ruleObj: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // 通过正则表达式自定义用户名范围
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10大小写字母', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6到15位非空字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6到15位非空字符,相同与上一栏密码', trigger: 'blur' },
          // validator是自定义规则校验
          { validator: samePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerFn () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log(this.ruleForm)
          const { data: res } = await registerApi(this.ruleForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.$router.push('/login')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center no-repeat;
  background-size: cover;
  height: 100%;
}
.reg-box {
  width: 400px;
  height: 335px;
  padding: 0px 30px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
}
.reg-title {
  background: url('../../assets/images/login_title.png') no-repeat center;
  height: 60px;
}
.reg-btn {
  width: 100%;
}
</style>
