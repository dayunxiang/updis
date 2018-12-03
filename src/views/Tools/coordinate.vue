<template>
    <div class="context-box">
      <!--
        action：上传地址
        multipe：是否支持多文件上传
        data：上传的时候额外附带的参数
        name：上传文件字段名
        accept：接受上传的文件类型
        limit：最大允许上传个数

        on-remove：文件列表中移除的钩子
        on-preview ：点击文件列表中已上传的文件时的钩子函数
        on-exceed：文件超出个数限制时候的钩子函数
        file-list：上传的文件列表
      -->
      <el-upload class="uploadfile" action="" :http-request='uploadFileMethod' :show-file-list="false" multiple>
        <el-button class="custom-btn" size="small">上传shape文件</el-button>
      </el-upload>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
      name: "coordinate",
      data() {
        return {
          fileList: []
        };
      },
      methods: {
        uploadFileMethod(param){
          let fileObject = param.file;
          var formData = new FormData();
          formData.append("file",fileObject);
          axios.post('/v1/zip2geojson', formData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(this.getShapeSuccess);
        },
        getShapeSuccess(res){
          console.log(res);
        }
      }
    }
</script>

<style scoped>
</style>
<!--<template>-->
  <!--<div>-->
    <!--<div v-for="(list,index) in siYuan" class="aa" :class="{ red:changeRed == index}" @click="change(index)">{{list.a}}</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--export default {-->
    <!--name: "coordinate",-->
    <!--data(){-->
      <!--return{-->
        <!--siYuan:[-->
          <!--{"a":"田"},-->
          <!--{"a":"心"},-->
          <!--{"a":"水"},-->
          <!--{"a":"原"}-->
        <!--],-->
        <!--changeRed:-1-->
      <!--}-->
    <!--},-->
    <!--methods:{-->
      <!--change(index){-->
        <!--this.changeRed = index;-->
      <!--}-->
    <!--}-->

  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--.aa{-->
    <!--cursor: pointer;-->
  <!--}-->
  <!--.red{-->
    <!--color: red;-->
  <!--}-->
<!--</style>-->
