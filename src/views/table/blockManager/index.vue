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
      <el-table :data="tableData" border max-height="500" style="width: 100%;" key="conduitData">
        <el-table-column
          fixed
          prop="id"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="编号"
          sortable
          width="120">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="area"-->
          <!--label="面积(平方米)"-->
          <!--sortable-->
          <!--width="250">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="YDLX"
          label="用地类型"
          sortable
          :filters="[{ text: '道路', value: '道路' }, { text: '市政公用设施用地', value: '市政公用设施用地' },{ text: '绿地', value: '绿地' },{ text: '居住用地', value: '居住用地' },{ text: '政府社团用地', value: '政府社团用地' },{ text: '工业用地', value: '工业用地' },{text:'商业服务业设施用地',value:'商业服务业设施用地'}]"
          filter-placement="bottom-end"
          :filter-method="filterYDLX"
          width="200">
        </el-table-column>
        <el-table-column
          prop="JSZT"
          label="建设状态"
          sortable
          :filters="[{ text: '规划', value: '规划' }, { text: '在建', value: '在建'},{ text: '现状', value: '现状'}]"
          filter-placement="bottom-end"
          :filter-method="filterJSZT"
          width="200">
        </el-table-column>
        <el-table-column
          prop="XMMC"
          label="项目名称"
          sortable
          width="250">
        </el-table-column>
        <el-table-column
          prop="PRHD"
          label="排入河道"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="SSLY"
          label="所属流域"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="SSPSFQ"
          label="所属排水分区"
          sortable
          :filters="[{ text: '1#排水分区', value: '1#排水分区' },{ text: '2#排水分区', value: '2#排水分区' },{ text: '3#排水分区', value: '3#排水分区' },{ text: '4#排水分区', value: '4#排水分区' },{ text: '5#排水分区', value: '5#排水分区' },{ text: '6#排水分区', value: '6#排水分区' },{ text: '7#排水分区', value: '7#排水分区' },{ text: '8#排水分区', value: '8#排水分区' },{ text: '9#排水分区', value: '9#排水分区' },{ text: '10#排水分区', value: '10#排水分区' },{ text: '11#排水分区', value: '11#排水分区' },{ text: '12#排水分区', value: '12#排水分区' },{ text: '13#排水分区', value: '13#排水分区' },{ text: '14#排水分区', value: '14#排水分区' },{ text: '15#排水分区', value: '15#排水分区' },{ text: '16#排水分区', value: '16#排水分区' },{ text: '17#排水分区', value: '17#排水分区' },{ text: '18#排水分区', value: '18#排水分区' },{ text: '19#排水分区', value: '19#排水分区' }]"
          filter-placement="bottom-end"
          :filter-method="filterSSPSFQ"
          width="200">
        </el-table-column>
        <el-table-column
          prop="ZBQY"
          label="是否为正本清源项目"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="HMCS"
          label="是否为海绵项目"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="HMLX"
          label="海绵类型"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="lastUpdataTime"
          label="最后更新时间"
          sortable
          width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="viewHadelClick(scope.$index, scope.row)">查看</el-button>
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
    name: 'DynamicTable',
    data(){
      return{
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        typeSelect: [
          { value: '0', label: '规划' },
          { value: '1', label: '在建' },
          { value: '2', label: '现状' },
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
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogAddVisible:false,
        // 显示顺序
        isPointType:false,
        Types:[],
        //当前选择类型
        type:'',
        //数据
        conduitsData:[],
        tableData:[]
      }
    },
    mounted(){
      this.getProjectsInfo();
    },
    methods: {
      /****** 编辑 ********/
      outfallHandleClick(index, row){
        const _this = this;
        _this.dialogFormVisible = true;
        _this.tableDataEditor = [
          { name: '编号:', nameObj: row.name, type: 'nothing' },
          { name: '用地类型:', nameObj: row.YDLX, type: 'nothing' },
          { name: '建设状态:', nameObj: row.JSZT, type: 'select' },
          { name: '项目名称:', nameObj: row.XMMC, type: 'nothing' },
          { name: '排入河道:', nameObj: row.PRHD, type: 'nothing' },
          { name: '所属流域:', nameObj: row.SSLY, type: 'nothing' },
          { name: '所属排水分区:', nameObj: row.SSPSFQ, type: 'nothing' },
          { name: '是否为正本清源项目:', nameObj: row.ZBQY, type: 'nothing' },
          { name: '是否为海绵项目:', nameObj: row.HMLX, type: 'nothing' },
          { name: '海绵类型:', nameObj: row.HMLX, type: 'nothing' },
          { name: '最后更新时间:', nameObj: row.lastUpdataTime, type: 'time' },
        ]
      },
      /**** 点击查看跳转页面 ***/
      viewHadelClick(index, data) {
        console.log('index, data', index, data)
        this.$router.push({
          path: '/dashboard',
          query: {
            projectId: data.projectName,
            AttributeValue: data.name,
            seletctType: 'subcatchments'
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
        var self = this;
        self.tableData = []
        var selectObject = {
          project_id: self.project.id,
          category : self.type ,
        }
        if(selectObject.category == 0){
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
                    equalTo: 'SUBCATCHMENTS'
                  }
                }
              }
            }
          }).then(resp =>{
            var data = resp.data;
            for(var i = 0;i<data.length;i++){
              var daoluReg = /^[S][^A-Za-z]$/;
              // 市政公用设施用地
              var shiZhengReg = /^[U][^A-Za-z]$/;
              // 绿地
              var lvDiReg = /^[G,E][^A-Za-z]/;
              // 居住用地
              var juZhuYongDiReg = /^[R][^A-Za-z]/;
              // 政府
              var zhengFuReg = /^[G][I][C]/;
              // 工业
              var gongYeReg = /^[M]/;
              // 商业服务业设施用地
              var shangyeReg = /^[C][^A-Za-z]/;
              var properties = JSON.parse(data[i].properties);
              var lng_lat = (properties.geometry.coordinates).reverse().join();
              var subcatchmentProperties = properties.properties;
              var subcatchmentData = {
                id:Number(properties.id)+1,
                projectName: data[i].projectId,
                lng_lat:lng_lat,
                name:data[i].name,
                area:subcatchmentProperties.area,
                YDLX:subcatchmentProperties.YDLX,
                JSZT:subcatchmentProperties.JSZT,
                XMMC:subcatchmentProperties.XMMC,
                PRHD:subcatchmentProperties.PRHD,
                SSLY:subcatchmentProperties.SSLY,
                SSPSFQ:subcatchmentProperties.SSPSFQ,
                ZBQY:subcatchmentProperties.ZBQY,
                HMCS:subcatchmentProperties.HMCS,
                HMLX:subcatchmentProperties.HMLX,
                lastUpdataTime:data[i].lastUpdateTime,
              }
              var YDLX = subcatchmentData.YDLX
              if(YDLX == '道路' || daoluReg.test(YDLX)){
                subcatchmentData.YDLX = '道路'
              }
              if(shiZhengReg.test(YDLX)){
                subcatchmentData.YDLX = '市政公用设施用地'
              }
              if(lvDiReg.test(YDLX)) {
                subcatchmentData.YDLX = '绿地'
              }
              if(juZhuYongDiReg.test(YDLX)){
                subcatchmentData.YDLX = '居住用地'
              }
              if(zhengFuReg.test(YDLX)){
                subcatchmentData.YDLX = '政府社团用地'
              }
              if(gongYeReg.test(YDLX)){
                subcatchmentData.YDLX = '工业用地'
              }
              if(shangyeReg.test(YDLX)){
                subcatchmentData.YDLX = '商业服务业设施用地'
              }
              self.tableData.push(subcatchmentData);
            }
            self.totall = Number(resp.headers.total);
          })
        }
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
      },
    //  筛选查询,
      // resetDateFilter() {
      //   this.$refs.filterTable.clearFilter('date');
      // },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row, column) {
        return row.address;
      },
      filterYDLX(value, row) {

        return row.YDLX === value;
      },
      filterJSZT(value,row) {
        return row.JSZT === value;
      },
      filterSSPSFQ(value,row){
        return row.SSPSFQ === value;
      }
      // filterHandler(value, row, column) {
      //   const property = column['property'];
      //   return row[property] === value;
      // },
      //  筛选结束
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
