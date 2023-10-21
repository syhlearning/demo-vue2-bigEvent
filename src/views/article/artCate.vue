<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button size="large" type="primary" @click="addCateShowDialogBtnFn">添加分类</el-button>
      </div>
      <el-table :data="catelist" style="width: 100%">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot='scope'>
            <el-button size="mini" @click="updateCateList(scope.row)" type="primary">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @closed="dialogClosedFn">

      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">添加</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api/index'
export default {
  data () {
    return {
      catelist: [],
      dialogVisible: false,
      isEdit: false, // 控制开关，true为编辑状态，false为新增状态
      editId: '', // 编辑状态时保存编辑行的id值
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'change' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getArtCateList()
  },
  methods: {
    async getArtCateList () {
      const res = await getArtCateListAPI()
      this.catelist = res.data.data
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addCateShowDialogBtnFn () {
      this.isEdit = false
      this.editId = ''
      this.dialogVisible = true
    },
    cancelFn () {
      this.dialogVisible = false
    },
    confirmFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            // isedit是true 是修改状态
            this.addForm.id = this.editId
            const res = await updateArtCateAPI(this.addForm)
            if (res.data.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.success)
            this.getArtCateList()
          } else {
            // false为添加状态
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message + '请重新添加')
            this.$message.success(res.message)
            this.getArtCateList()
          }
        } else {
          return this.$message.error('参数错误,请重新添加')
        }
      })
      this.dialogVisible = false
    },
    dialogClosedFn () {
      this.$refs.addRef.resetFields()
    },
    updateCateList (obj) {
      // 数据回显，通过scope.row得到obj，obj是点击修改时的那一行数据
      this.dialogVisible = true
      this.isEdit = true
      this.editId = obj.id
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    async del (obj) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 2. 取消了删除
      if (confirmResult === 'cancel') return
      const { data: res } = await delArtCateAPI(obj.id)
      if (res.code !== 0) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getArtCateList()
    }
  }
}
</script>

<style scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
span {
  font-size: 25px;
  font-weight: bold;
}
</style>
