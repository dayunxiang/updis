<template>
  <div class="point-manager">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="项目名称" prop="creatorId">
        <el-select v-model="project.id" placeholder="请选择项目名称" @change="changeProjectValue(project)">
          <el-option v-for="project in projects" :label="project.name" :value="project.id" :key="project.id" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编号" v-show="isPointType">
        <el-input v-model="formInline.user" placeholder="请输入要查询的编号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSelect">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"  @click="dialogAddVisible = true" >添加</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" border max-height="500" style="width: 100%;" key="companyTable">
        <el-table-column
          fixed
          prop="id"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="category"
          label="类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="JDMC"
          label="街道名称"
          width="300">
        </el-table-column>
        <el-table-column
          prop="SQMC"
          label="社区名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="SCJYDZ"
          label="地址"
          width="400">
        </el-table-column>
        <el-table-column
          prop="FDDBR"
          label="法人代表"
          width="120">
        </el-table-column>
        <el-table-column
          prop="LXFS"
          label="联系方式"
          width="120">
        </el-table-column>
        <el-table-column
          prop="QYRS"
          label="企业人数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="HYLB"
          label="行业类别"
          width="120">
        </el-table-column>
        <el-table-column
          prop="SCYSL"
          label="生产用水量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="PSL"
          label="排水量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ZYSCGY"
          label="主要生产工艺"
          width="120">
        </el-table-column>
        <el-table-column
          prop="GPZL"
          label="产品"
          width="120">
        </el-table-column>
        <el-table-column
          prop="HPPFWJ"
          label="环评"
          width="120">
        </el-table-column>
        <el-table-column
          prop="HPPFWJYXX"
          label="环评有效性"
          width="120">
        </el-table-column>
        <el-table-column
          prop="PWXKZ"
          label="排污许可证"
          width="120">
        </el-table-column>
        <el-table-column
          prop="FSCLFS"
          label="废水处理方式"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button  type="text" @click="viewHadelClick(scope.$index, scope.row)">查看</el-button>
            <el-button  type="text" @click="outfallHandleClick(scope.$index, scope.row)">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totall">
      </el-pagination>
    </div>
    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="form" label-width="150px" style="width: 500px; margin: auto; text-align: left;">
        <template v-for="(item, index) in tableDataEditor">
          <el-form-item v-if="item.type === 'nothing' " :label="item.name">
            <el-input style="width:300px" v-model="item.nameObj"></el-input>
          </el-form-item>
          <el-form-item v-if="item.type === 'select' " :label="item.name">
            <el-select style="width:300px" v-model="item.nameObj" placeholder="请选择">
              <el-option v-for="item in typeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.type === 'time' " :label="item.name">
            <el-date-picker style="width:300px" v-model="item.nameObj" type="datetime"
                            placeholder="选择日期时间" align="right" format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </template>

        <el-form-item style="margin-left:150px">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加-->
    <div>
      <el-dialog title="添加管线" :visible.sync="dialogAddVisible" width="25%">
        <el-form ref="form" :model="tableData" label-width="150px">
          <el-form-item label="请选择项目名称">
            <el-col :span="19">
              <el-select  placeholder="请选择项目名称">
                <el-option label="项目一"></el-option>
                <el-option label="项目二"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="点类型">
            <el-col :span="19">
              <el-select  placeholder="请选择点类型">
                <el-option label="检查井" ></el-option>
                <el-option label="排口" ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="排口编号">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="排口坐标">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="排入河道水质目标">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="最终排入河道">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属排水分区">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="下游道路名称">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属街道">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属社区">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属流域">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属排水分区">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="管道类型">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="管长">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="管径">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="建设时间">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="竣工单位编号">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="建设单位">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系人">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="电话">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="业主单位/联系人/电话">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="运维单位/联系人/电话">
            <el-col :span="19">
              <el-input v-model="tableData.date"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">提交</el-button>
            <el-button @click="dialogAddVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import request from '@/utils/request'
  export default {
    name: 'index',
    data(){
      return{
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        typeSelect: [
          { value: '0', label: '有' },
          { value: '1', label: '无' },
        ],
        tableDataEditor: [],  // 编辑
        projects:[],
        project: {
          creatorId: '',
          geometry_type:''
        },
        pageNo:1,
        totall: 0,
        pageSize:20,
        formInline:{
          user:'',
          region:''
        },
        dialogTableVisible: false,
        formLabelWidth: '120px',
        dialogFormVisible: false,
        dialogAddVisible:false,
        // 显示顺序
        isPointType:false,
        Types:[],
        //当前选择类型
        type:'',
        //数据
        tableData:[]
      }
    },
    mounted(){
      this.getProjectsInfo();
    },
    methods: {
      /**** 编辑按钮 *****/
      outfallHandleClick(index, row){
        const _this = this;
        _this.dialogFormVisible = true;
        _this.tableDataEditor = [
          { name: '项目编号:', nameObj: row.projectName, type: 'nothing'},
          { name: '类型:', nameObj: row.leixing, type: 'nothing'},
          { name: '街道名称:', nameObj: row.JDMC, type: 'nothing'},
          { name: '社区名称:', nameObj: row.SQMC, type: 'nothing'},
          { name: '地址:', nameObj: row.SCJYDZ, type: 'nothing'},
          { name: '法人代表:', nameObj: row.FDDBR, type: 'nothing'},
          { name: '联系方式:', nameObj: row.LXFS, type: 'nothing'},
          { name: '企业人数:', nameObj: row.QYRS, type: 'nothing'},
          { name: '行业类别:', nameObj: row.HYLB, type: 'nothing'},
          { name: '生产用水量:', nameObj: row.SCYSL, type: 'nothing'},
          { name: '排水量:', nameObj: row.PSL, type: 'nothing'},
          { name: '主要生产工艺:', nameObj: row.ZYSCGY, type: 'nothing'},
          { name: '产品:', nameObj: row.GPZL, type: 'nothing'},
          { name: '环评:', nameObj: row.HPPFWJ, type: 'select'},
          { name: '环评有效性:', nameObj: row.HPPFWJYXX, type: 'nothing'},
          { name: '排污许可证:', nameObj: row.PWXKZ, type: 'select'},
          { name: '废水处理方式:', nameObj: row.FSCLFS, type: 'nothing'}
        ]
      },
      /**** 点击查看跳转页面 ***/
      viewHadelClick(index, data){
        this.$router.push({
          path: '/dashboard',
          query: {
            projectId: data.projectName,
            name: data.name
          }
        })
      },
      //项目下拉框发生变化的时候
      changeProjectValue(data){
        var project = data;
        this.isPointType = true;
        // 获取这个项目下所有的点类型
        this.getPointTypeToProjectID(project);
      },
      getPointTypeToProjectID(project){
        var self = this;
        self.Types = [];
        var projectId = project.id;
        request('shapes',{
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: projectId
                },
                'geometry_type':{
                  equalTo: 'LineString'
                },
              }
            }
          }
        }).then(resp => {
          var data = resp.data;
          var pointTypesArr = [];
          var pointTypes=[];
          //数组去重
          for(let i = 0;i<data.length;i++){
            var pointType = data[i].category;
            pointTypesArr.push(pointType)
          }
          for(var i = 0;i<pointTypesArr.length;i++){
            if(pointTypesArr.indexOf(pointTypesArr[i])==i){
              pointTypes.push(pointTypesArr[i]);
            }
          }

          for(var i=0;i<pointTypes.length;i++){
            var pointType = {
              id : i,
              type:pointTypes[i]
            }
            self.Types.push(pointType)
          }
        })
      },
      //点类型下拉选项发生变化的时候
      //管线是0
      changePointType(data){
        this.isPointType = true;
        this.type = data.name;
      },
      //请求所有项目
      getProjectsInfo(){
        axios('/api/projects').then(this.getProjectSuccess);
      },
      getProjectSuccess(res){
        this.projects = res.data;
      },
      // 查询事件
      handleSelect(){
        console.log('Test');
        var self = this;
        self.tableData = []
        var selectObject = {
          project_id: self.project.id,
        }
          // 拿到管线数据
          request('shapes',{
            params:{
              pageNo: self.pageNo,
              pageSize:self.pageSize,
              filters: {
                'shape': {
                  'project_id': {
                    equalTo: selectObject.project_id
                  },
                  'category':{
                    equalTo: 'COMPANY'
                  }
                }
              }
            }
          }).then(resp =>{
            var data = resp.data;
            for(var i = 0;i<data.length;i++){
              var properties = JSON.parse(data[i].properties);
              var lng_lat = (properties.geometry.coordinates).reverse().join();
              var companyProperties = properties.properties;
              var companyData = {
                id:Number(properties.id)+1,
                projectName: data[i].projectId,
                category:'企业',
                lng_lat:lng_lat,
                name:data[i].name,
                JDMC:companyProperties.JDMC,
                SQMC:companyProperties.SQMC,
                SCJYDZ:companyProperties.SCJYDZ,
                FDDBR:companyProperties.FDDBR,
                LXFS:companyProperties.LXFS,
                QYRS:companyProperties.QYRS,
                HYLB:companyProperties.HYLB,
                SCYSL:companyProperties.SCYSL,
                PSL:companyProperties.PSL,
                ZYSCGY:companyProperties.ZYSCGY,
                GPZL:companyProperties.GPZL,
                HPPFWJ:companyProperties.HPPFWJ,
                HPPFWJYXX:companyProperties.HPPFWJYXX,
                PWXKZ:companyProperties.PWXKZ,
                FSCLFS:companyProperties.FSCLFS,
                lastUpdataTime:data[i].lastUpdateTime,
              }
              self.tableData.push(companyData);
            }
            self.totall = Number(resp.headers.total);
          })
      },
      //分页条数切换
      handleSizeChange(val) {
        this.pageSize = val;
        this.handleSelect();
      },
      // 页码切换
      handleCurrentChange(val) {
        this.pageNo = val;
        this.handleSelect();
      },
      //编辑项目按钮
      handleEdit(data){
        this.dialogTableVisible = true
      },
      //删除项目按钮
      handleClick(data){
        this.$alert(data.name, '删除项目', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      }
    }
  }
</script>
<style>
  .point-manager{
    margin: 20px;
  }
  .el-form-item__label{
    text-align: center;
    padding: 0px;
  }
  .cell{
    text-align: center;
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: #a4a4a4;
    top: 5px;
  }
  .el-table .sort-caret.descending {
    border-top-color: #a4a4a4;
    bottom: 7px;
  }
</style>
