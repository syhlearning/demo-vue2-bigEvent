<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户修改信息</span>
      </div>
      <el-form :model="userForm" :rules="userRules" ref="userRef" class="demo-ruleForm" >
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="userForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="登录邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateUserInfoAPI } from '@/api/index'
export default {
  data () {
    return {
      userForm: {
        username: this.$store.state.userInfo.username,
        nickname: '',
        email: ''
      },
      userRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.userRef.validate(async valid => {
        if (valid) {
          this.userForm.id = this.$store.state.userInfo.id
          const res = await updateUserInfoAPI(this.userForm)
          console.log(res)
          if (res.data.code !== 0) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.$store.dispatch('initUserInfo')
          this.resetForm()
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.userRef.resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.box-card{
width: 100%;
}
.clearfix{
font-size: 35px;
color: aqua;
}
</style>
