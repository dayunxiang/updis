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
        <el-table-column fixed prop="id" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="leixing" label="类型" width="120"
          :filters="[{ text: '雨水管', value: '雨水管' }, { text: '污水管', value: '污水管' }]" :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.leixing === '雨水管' ? 'primary' : 'success'" disable-transitions>{{scope.row.leixing}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="guanjing" label="管径(毫米)" width="100"></el-table-column>
        <el-table-column prop="lastUpdataTime" label="最后更新时间" width="200"></el-table-column>
        <el-table-column prop="" label="待更新列" width="1000"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="viewHadelClick(scope.$index, scope.row)">查看</el-button>
            <el-button type="text" @click="outfallHandleClick(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
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

          <el-form-item v-if="item.type === 'disabled' " :label="item.name">
            <el-input style="width:300px" v-model="item.nameObj" :disabled="true" ></el-input>
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
          <el-button type="primary" @click="confirmEditorClick(tableDataEditor, lineOfObj.name)">确认</el-button>
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
  import commonApi from '@/api/commonApi'
  import request from '@/utils/request'

  export default {
    name: 'DynamicTable',
    data(){
      return{
        lineOfObj: {},
        mapData: {
          conduits: [],
          outfalls: [],
          junctions: [],
          subcatchments: [],
          companies: [],
          range: [],
          isShow:true,
        },
        shapes: [],     // 获取所有项目数据
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        typeSelect: [
          { value: '0', label: '雨水管' },
          { value: '1', label: '污水管' },
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
        conduitsData:[],
        tableData:[]
      }
    },
    created(){
      this.getDataInfo()
    },
    mounted(){
      this.getProjectsInfo();
    },
    methods: {
      /****** 编辑 ********/
      outfallHandleClick(index, row){
        const _this = this;
        _this.lineOfObj = {};
        _this.tableDataEditor = [];
        _this.lineOfObj = row;
        _this.tableDataEditor = [
          { name: '名称:', nameObj: row.name, type: 'disabled' },
          { name: '类型:', nameObj: row.leixing, type: 'select' },
          { name: '管径(毫米):', nameObj: row.guanjing, type: 'nothing' },
          { name: '最后更新时间:', nameObj: row.lastUpdataTime, type: 'time' },
        ];
        _this.dialogFormVisible = true;
      },
      /**
       * 编辑确认按钮
       */
      confirmEditorClick(data, value){
        const _this = this;
        _this.dialogFormVisible = false
        let subcatData = {};
        let subChmenData = _this.mapData.conduits;
        let numMeter = ((data[2].nameObj * 1)/1000).toFixed(2)
        _.each(subChmenData, function (item) {
          if(value === item.properties.properties.name){
            item.properties.properties.name = data[0].nameObj
            item.properties.properties.leixing = data[1].nameObj
            item.properties.properties.guanjing = numMeter
            subcatData = item
          }
        })
        let objToStr = JSON.stringify(subcatData.properties)
        let objId = subcatData.id
        commonApi.edit('shapes',objId, {
          'properties': objToStr
        }).then((respon)=>{
          _this.$message({
            message: '编辑成功',
            type: 'success'
          });
          _this.handleSelect();
        })
      },
      /**
       * 获取所有项目数据
       */
      getDataInfo() {
        const _this = this
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: '3'
                }
              }
            }
          }
        }).then((resp) => {
          const data = resp.data;
        _this.shapes = JSON.parse(JSON.stringify(resp.data))
        _.each(_this.shapes, function(item) {
          item.properties = JSON.parse(item.properties)
        })
        if (!_this.$route.query.AttributeValue && !_this.$route.query.seletctType) {
          this.getDataInfoSuccess(_this.shapes)
        }
      })
      },
      getDataInfoSuccess(data){
        const _this = this
        _.each(data, item => {
          const mapData = {
            id: item.id,
            category: item.category,
            properties: item.properties
          };
        switch (item.category) {
          case 'SUBCATCHMENTS':
            _this.mapData.subcatchments.push(mapData)    // 地块
            break
          case 'CONDUITS':
            _this.mapData.conduits.push(mapData)
            break
          case 'JUNCTIONS':
            _this.mapData.junctions.push(mapData)
            break
          case 'OUTFALLS':
            _this.mapData.outfalls.push(mapData)
            break
          case 'COMPANY':
            _this.mapData.companies.push(mapData)
            break
          case 'RANGE':
            _this.mapData.range.push(mapData)
            break
        }
      })
        const mapData = _this.mapData
      },






      /**** 点击查看跳转页面 ***/
      viewHadelClick(index, data){
        this.$router.push({
          path: '/dashboard',
          query: {
            projectId: data.projectName,
            AttributeValue: data.name,
            seletctType: 'conduits'
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
        self.tableData = [];
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
                    equalTo: 'CONDUITS'
                  }
                }
              }
            }
          }).then(resp =>{
            var data = resp.data;
            for(var i = 0;i<data.length;i++){
              var properties = JSON.parse(data[i].properties);
              var lng_lat = (properties.geometry.coordinates).reverse().join();
              var conduitProperties = properties.properties;
              var conduitData = {
                id:Number(properties.id)+1,
                projectName: data[i].projectId,
                category:'管线',
                lng_lat:lng_lat,
                name:data[i].name,
                leixing:conduitProperties.leixing,
                guanjing:conduitProperties.guanjing*1000,
                lastUpdataTime:data[i].lastUpdateTime,
              }
              self.tableData.push(conduitData);
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
      //筛选
      // resetDateFilter() {
      //   this.$refs.filterTable.clearFilter('date');
      // },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        console.log('test');
        return row.leixing === value;
      },
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
</style>
