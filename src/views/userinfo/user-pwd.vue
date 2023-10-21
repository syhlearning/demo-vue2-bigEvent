<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePwd">修改密码</el-button>
        <el-button  @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from '@/api/index'
export default {
  data () {
    // validator自定义校验
    // 检测新旧密码是否相同
    // rule(rules) value callback顺序不能交换
    const samePwd = (rules, value, callback) => {
      if (value === this.pwdForm.old_pwd) {
        callback(new Error('新密码和旧密码不能相同'))
      } else {
        callback()
      }
    }
    // 检测两次新密码是否一致
    const rePwd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('确认新密码与新密码必须要相同'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changePwd () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await updatePwdAPI(this.pwdForm)
          if (res.code !== 0) return this.$message.error('更新密码失败！！')
          this.$message.success('更新密码成功！！请重新登录')
          this.resetFn()
          // 修改了密码之后应该清除token和用户信息，跳转到登录也重新登录
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          this.$router.push('/login')
        } else {
          return false
        }
      })
    },
    resetFn () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang='less'>
.el-form {
  width: 500px;
}
</style>
