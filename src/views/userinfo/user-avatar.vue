<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更换头像</span>
      </div>
      <img v-if='!avatar' src="../../assets/images/avatar.jpg" class="the_img" alt="">
      <img v-else :src="avatar" alt="" class="the_img">
      <div class="btn-box">
        <input type="file" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
          <el-button type="danger"  @click="reSetImg">清空图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { updateUserAvatarAPI } from '@/api/index'
export default {
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      // 目的：为了让input[type=file]标签，让他可以通过 JS代码来触发他的点击事件(导致他默认行为给一个文件选择窗口)
      // 原因：input[type=file]是原生标签，样式不好改
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
    // 第一种方法：文件->内存临时地址(这个地址只能在js里内存里不能发给后台)
      const fs = e.target.files
      // // eslint-disable-next-line no-empty
      // if (fs.length === 0) {
      //   this.avatar = ''
      // } else {
      //   this.avatar = URL.createObjectURL(fs[0])
      // }

      // 第二种方法：文件——>base64位字符串，此字符串可以发送给后台
      // 1. 创建 FileReader 对象   H5 新标签
      const fr = new FileReader()
      // 2. 调用 readAsDataURL 函数，读取文件内容
      fr.readAsDataURL(fs[0])
      // 3. 监听 fr 的 onload 事件
      fr.onload = e => { // onload函数会等文件读成base64位字符串后被触发
        // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
        this.avatar = e.target.result
        // 调用接口，向后台传递数据
      }
    },
    reSetImg () {
      this.avatar = ''
    },
    async uploadFn () {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error('头像更换失败')
      this.$message.success('头像更换成功')
      this.$store.dispatch('initUserInfo')
      this.reSetImg()
    }
  }
}
</script>

<style scoped>
.btn-box {
  margin-top: 10px;
}

.preview {
  object-fit: cover;
}

.the_img {
  width: 350px;
  height: 350px;
}
</style>
