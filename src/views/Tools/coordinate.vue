<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="深圳坐标转换经纬坐标(GPS)" name="1">
      <el-upload ref="upload"
                 :limit="1"
                 :auto-upload="false"
                 drag
                 :http-request="uploadFile"
                 action="customize">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
         <div class="el-upload__tip" slot="tip">目前只支持shape文件的zip压缩包</div>
      </el-upload>
      <div>
        <el-button @click="submitUpload">确认上传</el-button>
        <el-input v-model="DowloadURL" placeholder="转换完成后请复制此链接下载"></el-input>
      </div>
    </el-collapse-item>
    <el-collapse-item title="(GPS)经纬坐标转换深圳坐标" name="2">
        <el-upload ref="upload"
                   :limit="1"
                   :auto-upload="false"
                   drag
                   :http-request="uploadFileGPS"
                   action="customize">
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
    export default {
      name: "coordinate",
      data() {
        return {
          DowloadURL: '',
          DowloadGPSURL:''
        }
      },
      methods: {
        //确认上传
        submitUpload() {
          console.log('Test');
          this.$refs.upload.submit();

        },
        // 文件上传
        uploadFile(params) {
          const _file = params.file;
          console.log(_file);
          var formData = new FormData();
          formData.append("file",_file);
          formData.append('method','sz2gps')
          axios.post('/v1/shp/convert', formData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(this.getShapeSuccess);
        },
        getShapeSuccess(res){
          var self = this;
          self.DowloadURL = ''
          self.DowloadURL = res.data.file;
          // console.log('成功了');
          console.log(res.data.file)
        },
      // 文件上传GPS
        uploadFileGPS(params){
          const _file = params.file;
          console.log(_file);
          var formData = new FormData();
          formData.append("file",_file);
          formData.append('method','sz2gps')
          axios.post('/v1/shp/convert', formData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(this.getShapeGPSSuccess);
        },
        getShapeGPSSuccess(res){
          var self = this;
          self.DowloadGPSURL = '';
          self.DowloadGPSURL = res.data.file;
          // console.log('成功了');
        }
      }
    }
</script>

<style scoped>

</style>
