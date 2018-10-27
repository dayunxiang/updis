<template>
    <div class="context-box">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList">
        <el-button size="small" type="primary">上传shp文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
</template>

<script>
    export default {
      name: "coordinate",
      data() {
        return {
          sizeForm: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          }
        };
      },
      methods: {
        onSubmit() {
          console.log('submit!');
        }
      }
    }
</script>

<style scoped>
.context-box{
  position:fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  margin:auto;
  width: 500px;
  height: 300px;
  border: 1px solid black;
}
</style>
