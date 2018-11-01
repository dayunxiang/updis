<template>
  <div>
    <div class="manager-select">
      <el-form :inline="true" :model="formInline" class="demo-form-inline select-form">
        <el-form-item label="项目名称">
          <el-input v-model="formInline.user" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleSelectProject">查询</el-button>
        </el-form-item>
      </el-form>
      <!--新建项目-->
      <el-button class="btn-createProject" type="success" @click="dialogFormVisible = true">新建项目</el-button>
    </div>
    <!--表格-->
    <el-row class="project-list">
      <el-col :span="24">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            fixed
            prop="id"
            label="项目编号"
            width="300">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="项目创建时间"
            width="300">
          </el-table-column>
          <!--项目使用人-->
          <el-table-column
            prop="lastUpdateTime"
            label="项目最后更新时间"
            width="300">
          </el-table-column>

          <el-table-column
            label="项目使用人"
            width="300">
          </el-table-column>

          <el-table-column
            label="项目创建人"
            width="300">
          </el-table-column>
          <!--end-->
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="dialogEdit = true">编辑</el-button>
              <el-button  @click.native.prevent="deleteRow(scope.$index, tableData)"type="text" size="small">删除</el-button>
              <el-button @click="handleToDashboard(scope.row)">进入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页-->
    <div class="project-paging">
      <el-pagination
        :page-sizes="[10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total=tableData.length>
      </el-pagination>
    </div>
    <!--表格弹出层-->
    <div>
      <el-dialog title="项目弹出层" :visible.sync="dialogTableVisible">
       需要修改的内容待定
      </el-dialog>
    </div>
    <!--新建项目弹出层-->
    <div>
      <el-dialog title="新建项目" :visible.sync="dialogFormVisible" width="40%">
        <el-form ref="form" :model="form" label-width="200px" width="100%">
          <el-form-item label="项目编号">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-col :span="12">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="项目使用人">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目使用人账户">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目使用人密码">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目文件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传此项目所用到的文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="项目备注" >
            <el-input type="textarea" v-model="form.desc" width="100px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--编辑项目弹出层-->
    <div>
      <el-dialog title="编辑项目" :visible.sync="dialogEdit" width="40%">
        <el-form ref="form" :model="tableData" label-width="200px" width="100%">
          <el-form-item label="项目编号">
            <el-col :span="12">
              <el-input v-model="tableData.name" value="fdsfsfadf"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目使用人">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目管理人">
            <el-col :span="12">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目文件">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false">
              <div class="upload-file-box">
                <el-button slot="trigger" size="small" type="primary">排口文件</el-button>
                <el-button slot="trigger" size="small" type="primary">地块文件</el-button>
                <el-button slot="trigger" size="small" type="primary">管线文件</el-button>
                <el-button slot="trigger" size="small" type="primary">检查井文件</el-button>
                <el-button slot="trigger" size="small" type="primary" style="margin-left: 0px">工业企业文件</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">只能上传.zip文件</div>
            </el-upload>
            <el-button  size="small" type="success" @click="submitUpload">点击上传</el-button>
            <!--<el-upload-->
              <!--class="upload-demo"-->
              <!--action="https://jsonplaceholder.typicode.com/posts/">-->
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
              <!--<div slot="tip" class="el-upload__tip">请上传此项目所用到的文件</div>-->
            <!--</el-upload>-->
          </el-form-item>
          <el-form-item label="项目备注" >
            <el-input type="textarea" v-model="form.desc" width="100px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success">提交</el-button>
            <el-button @click="dialogEdit = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import request from 'request'
    export default {
      name: "manager",
      data() {
        return {
          dialogEdit:false,
          fileList: [],
          tableData: [],
          formInline: {
            user: '',
            region: ''
          },
          gridData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }],
          dialogTableVisible: false,
          dialogFormVisible: false,
          dialogEditVisible:false,
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          formLabelWidth: '120px',
          addForm: [{
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          }],
          firstIndex: true,
          indexList: false,
        }
      },
      methods: {
        // 请求项目数据
        getProjectInfo() {
          axios('api/projects').then(this.getSuccessProjectInfo);
        },
        getSuccessProjectInfo(res){
          var ProjectData = res.data;
          this.tableData = ProjectData;

        },
        // 进入项目事件
        handleToDashboard(data) {
          var id= data.id;
          this.$router.push({
            path: '/dashboard',
            query: { projectId: id}
          })
        },
        // 查询项目点击事件
        handleSelectProject(){
          console.log('我被点击了');
        },
        // 删除项目按钮
        deleteRow(index, rows) {
          rows.splice(index, 1);
        },
        // 编辑项目按钮
        handleEdit(data) {
          this.dialogTableVisible = true
        },
        onSubmit() {
          console.log('submit!');
        },
        addTab(item, index) {
          const self = this;
          this.addForm.push(self.form);
        },
        submitUpload() {
          this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        }
      },
      mounted(){
        this.getProjectInfo();
      }
    }
</script>

<style>
.cell{
  text-align: center;
}
  .project-paging{
    margin-top: 40px;
  }
  .select-form{
    display: inline-block;
  }
  .btn-createProject{
    display: inline-block;
    position: relative;
    top: 9px;
  }
  /*上传文件*/
.upload-file-box{
  text-align: left;
}
  /**/
.el-textarea{
  width:80%;
}
.proName {
  display: inline-block;
}
.addBtn {
  margin-left:85px;
}
.deleteBtn {
  margin-left:0px;
}
.proInput {
  width:150px;
}
</style>
