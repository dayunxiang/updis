<template>
  <el-collapse accordion
               v-loading.fullscreen.lock="loading"
               element-loading-text="转换中......"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.7)" v-model="value">
    <el-collapse-item title="深圳坐标转换经纬坐标(GPS)" name="1">
      <el-upload ref="upload1"
                 :limit="1"
                 accept=".zip"
                 :auto-upload="false"
                 :http-request="fileOnReq"
                 :on-change="fileOnChange"
                 :on-remove="fileOnRemove"
                 :action="action"
                 drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">目前只支持shape文件的zip压缩包</div>
      </el-upload>
      <div>
        <el-button @click="submitUpload" >确认上传</el-button>
        <el-input v-model="DowloadURL" placeholder="转换完成后请复制此链接下载"></el-input>
      </div>
    </el-collapse-item>
    <el-collapse-item title="(GPS)经纬坐标转换深圳坐标" name="2">
      <el-upload ref="upload2"
                 :limit="1"
                 accept=".zip"
                 :auto-upload="false"
                 :http-request="fileOnReq"
                 :on-change="fileOnChange"
                 :on-remove="fileOnRemove"
                 :action="action"
                 drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">目前只支持shape文件的zip压缩包</div>
      </el-upload>
      <div>
        <el-button @click="submitUpload">确认上传</el-button>
        <el-input v-model="DowloadGPSURL" placeholder="转换完成后请复制此链接下载"></el-input>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import axios from 'axios'
  import { Loading } from 'element-ui'
export default {
    name: 'coordinate',
    data() {
      return {
        value: '', // 当前展开的页面
        fileName: '', // 文件名称
        fileUrlName: '', // 服务器的文件名称
        action: '/v1/shp/convert', // 文件上传接口
        DowloadURL: '', // 深圳坐标转换经纬坐标：下载网址
        DowloadGPSURL: '', // 经纬坐标转换深圳坐标：下载网址
        loading: false // 是否显示加载中
      }
    },
    methods: {
      // 文件发生改变
      fileOnChange(file, fileList) {
        this.fileName = file.name
        this.fileUrlName = file.raw.lastModified
      },
      // 文件删除
      fileOnRemove(file, fileList) {
        this.fileName = ''
        this.fileUrlName = ''
        if (this.value === '1') {
          this.DowloadURL = ''
        } else {
          this.DowloadGPSURL = ''
        }
      },
      // 自定义上传
      fileOnReq(params) {
        const self = this
        var formData = new FormData()
        formData.append('file', params.file)
        if (this.value === '1') {
          formData.append('method', 'sz2gps')
        } else {
          formData.append('method', 'gps2sz')
        }
        axios.post('/v1/shp/convert', formData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
          if (this.value === '1') {
            self.DowloadURL = res.data.file
          } else {
            self.DowloadGPSURL = res.data.file
          }
        })
      },
      // 确认上传
      submitUpload() {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
          if (this.value === '1') {
            this.$refs.upload1.submit()
            this.DowloadURL = 'http://updis.haomo-studio.com/data/zip/' + this.fileUrlName + '/' + this.fileName
          } else {
            this.$refs.upload2.submit()
            this.DowloadGPSURL = 'http://updis.haomo-studio.com/data/zip/' + this.fileUrlName + '/' + this.fileName
          }
      }
    }
  }
</script>

<style scoped>

</style>
