<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" v-model='q' class="demo-form-inline">
          <el-form-item label="文章分类">
            <el-select placeholder="请选择分类" v-model="checkCateId">
              <el-option v-for="obj in CateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select placeholder="请选择状态" v-model="q.state">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" @click="showPubDialogFn">发表文章</el-button>
      </div>
      <!-- 文章表格 -->
      <el-table :data="ArtList" border style="width: 100%">
        <el-table-column prop="title" label="文章标题">
           <template v-slot='scoped'>
           <el-link type='primary' @click="showDetailFn(scoped.row.id)">{{scoped.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类">
        </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot='scoped'>
            <span>{{$formDate(scoped.row.pub_date)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120">
        </el-table-column>
        <el-table-column label="操作" prop="date" width="100">
          <template  v-slot='scoped'>
            <el-button type="danger" size="small" @click="deleteArticle(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      :current-page.sync="q.pagenum"
      :page-size.sync="q.pagesize"
       :page-sizes="[1, 3, 5, 8]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="dialogVisible" fullscreen :before-close="handleClose" @close='dialogCloseFn'>
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择文章分类" style="width: 100%;">
            <el-option v-for="obj in CateList" :key="obj.cate_id" :label="obj.cate_name" :value="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <!-- <img v-if='!pubForm.cover_img' src="@/assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />

          <img :src="pubForm.cover_img" alt="" class="cover-img" ref="imgRef" v-else/> -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 这里不能使用文件上传的UI -->
          <input type="file" style="display: none;" ref="iptFileRef" @change="changeCoverFn" />
          <!-- 选择封面的按钮 -->
          <el-button type="primary" @click="selCoyerFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn2('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

     <!-- 文章详情的 Dialog 对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisibleDialog" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <!-- 后端返回图片链接地址的经验:
        为何后端返回的图片地址是半截的?
        原因:因为服务器的域名可能会来回变化，所以数据库里的地址只有相对路径
        要求:前端请求此图片的时候，后端告诉你图片文件真身所在的服务器域名，前端自己拼接前缀
        解决：引入基地址，拼接图片地址，请求图片数据
      -->
      <img :src="baseURL+artDetail.cover_img" alt="" />
      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArticleListAPI, getArticleDetailAPI, delArticleAPI } from '@/api/index'
import imgobj from '../../assets/images/cover.jpg'
import { baseURL } from '@/utils/request'
export default {
  data () {
    return {
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 3, // 默认当前页需要几条数据(传递给后台，后台就发送几条数据)
        cate_id: '', // 分类ID
        state: '' // 状态
      },
      pubForm: {
        // 表单的数据对象
        title: '', // 文章分类的标题
        cate_id: '', // 文章分类的ID
        content: '', // 文章的内容
        cover_img: '', // 保存的是一个文件
        state: '' // 发布状态(发布/存为草稿)
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        // el - input等输入框的在blur事件时进行校验 trigger: 'blur'
        // 下拉菜单，单选框，复选框，是在change事件时进行校验 trigger: 'change'
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        // content对应quill - editor富文本编辑器，它不是el提供表单标签
        // quill-editor2个事件都没有，所以你输入内容也不会自动走校验
        // 解决:
        // 查看插件文档
        // 自己来给quill - editor绑定change事件(在文档里查到的它支持change事件内容改变事件)
        // 在事件处理函数中，用el-form组件内，调用某个校验规则再执行
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'change' }]
      },
      checkCateId: undefined,
      dialogVisible: false,
      // 保存文章分类的数据
      CateList: [],
      // 保存文章列表的数据
      ArtList: [],
      total: 0,
      artDetail: {},
      detailVisibleDialog: false,
      baseURL: baseURL
    }
  },
  created () {
    // 调用获取文章分类的函数
    this.getArtCateListFn()
    // 获取文章列表的函数
    this.getArticleListFn()
  },
  methods: {
    // 获取文章列表的函数
    async getArticleListFn () {
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code === 0) {
        this.ArtList = res.data
        this.total = res.total
        console.log(res)
      }
    },
    // 调用获取文章分类的函数
    async getArtCateListFn () {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) {
        this.CateList = res.data
      }
    },
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获确认框promise对象里选择取消时，拒绝状态结果'cancel'字符串，不是捕获的错误
      // $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理，点击确定它的状态为兑现成功状态返回' confirm '，
      // 如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回' cancel '字符串

      // 1. await只能用在被async修饰的函数内
      // async修饰:就是在当前函数名左边加async茫桃数，被调用，点是越面一个全新问POoni58.C//原因:async修饰的函数就是异步函数，
      // 如果此函数被调用，总是返回一个全新Promise对象
      // 而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的,等待await后面异步结果
      // 2. await只能拿到成功的结果并放行往下走，如果失败内部会向浏览器控制台抛出错误并不会让await往下走代码
      // 3. await后面的Promise的对象的拒绝状态(错误)如何捕获呢?//方法1: try{} catch(err)0}
      // 方式2:用Promise的链式调用，而且在catch里return的非Promise拒绝状态的对象值，都会当做成功的结果返回给原地新的Promise对象结果

      // 取消了关闭-阻止住, 什么都不干 提前阻止，不进行done()推出操作
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    showPubDialogFn () {
      this.dialogVisible = true
    },
    selCoyerFn () {
      this.$refs.iptFileRef.click()
    },
    changeCoverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = ''
        this.$refs.imgRef.setAttribute('src', imgobj)
      } else {
        this.pubForm.cover_img = files[0]
        // console.log(files[0])
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    pubArticleFn (str) {
      this.pubForm.state = str
      // console.log(this.pubForm)
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // console.log(this.pubForm)
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          console.log(res)
          if (res.code !== 0) return this.$message.error('发布文章失败')
          this.$message.success('发布文章成功')
          this.getArticleListFn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    pubArticleFn2 (str) {
      this.pubForm.state = str
      // console.log(this.pubForm)
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // console.log(this.pubForm)
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          console.log(res)
          if (res.code !== 0) return this.$message.error('存为草稿失败')
          this.$message.success('存为草稿成功')
          this.getArticleListFn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      this.$refs.imgRef.setAttribute('src', imgobj)
    },
    // 富文本内容改变了该方法被触发
    contentChangeFn () {
      // el-form进行局部校验
      // validateField对表单的某一项进行表单校验
      this.$refs.pubFormRef.validateField('content')
    },
    handleSizeChange (sizes) {
      this.q.pagesize = sizes
      this.getArticleListFn()
    },
    handleCurrentChange (Current) {
      this.q.pagenum = Current
      this.getArticleListFn()
    },
    // 筛选功能

    choseFn () {
      this.q.cate_id = this.checkCateId
      this.q.pagenum = 1
      this.q.pagesize = 3
      this.getArticleListFn()
    },
    resetFn () {
      this.q.pagenum = 1
      this.q.pagesize = 3
      this.checkCateId = ''
      this.q.state = ''
      this.getArticleListFn()
    },
    async showDetailFn (id) {
      // console.log(id)
      const { data: res } = await getArticleDetailAPI(id)
      if (res.code !== 0) this.$message.error('获取文章详情失败')
      this.$message.success('获取文章详情成功')
      this.artDetail = res.data
      console.log(res)
      this.detailVisibleDialog = true
    },
    async deleteArticle (id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 2. 取消了删除
      if (confirmResult === 'cancel') return

      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error('删除文章失败')
      this.$message.success('删除文章成功')
      if (this.ArtList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      this.getArticleListFn()
    }
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* // 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了 */
::v-deep .ql-editor {
  /* // 最小高度：标签高度靠内容撑开，没有内容时，标签高度为最小高度，有内容时，标签内容会被撑开，按照撑开的大小 */
  min-height: 300px;
}
.cover-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
.title{
  font-size: 30px;
  font-weight: 20px;
  color: cadetblue;
  text-align: center;
}
.info{
  display: flex;
  font-size: 20px;
  font-family: 'Courier New', Courier, monospace;
  justify-content: space-around;
}
</style>
