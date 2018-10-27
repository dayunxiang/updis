<template>
  <div class="point-manager">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-select  placeholder="请选择项目名称">
          <el-option label="项目一" value="shanghai"></el-option>
          <el-option label="项目二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="点类型">
        <el-select  placeholder="请选择点类型">
          <el-option label="排口" ></el-option>
          <el-option label="" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编号">
        <el-input v-model="formInline.user" placeholder="请输入要查询的编号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"  @click="dialogAddVisible = true" >添加</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="onSubmit">导出</el-button>
      </el-form-item>
    </el-form>
    <!--end-->
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="date"
          label="排口编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="排口坐标"
          width="120">
        </el-table-column>
        <el-table-column
          prop="province"
          label="排入河道水质目标"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="上游管道编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="上游管道管径"
          width="300">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="所属街道"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="所属社区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="所属流域"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="所属排水分区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="出流类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="排口类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="旱季污水量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="是否进行初期雨水截流"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="是否有检测设备"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="建设时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="竣工单位编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="建设单位"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="联系人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="电话"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="业主单位/联系人/电话"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="运维单位/联系人/电话"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button  type="text" @click="dialogFormVisible = true">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="25%">
        <el-form ref="form" :model="tableData" label-width="150px">
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
            <el-button type="primary" @click="onSubmit">更新</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加-->
    <div>
      <el-dialog title="添加管线" :visible.sync="dialogAddVisible" width="25%">
        <el-form ref="form" :model="tableData" label-width="150px">
          <el-form-item label="请选择项目名称">
            <el-col :span="19">
              <el-select  placeholder="请选择项目名称">
                <el-option label="项目一" value="shanghai"></el-option>
                <el-option label="项目二" value="beijing"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="点类型">
            <el-col :span="19">
              <el-select  placeholder="请选择点类型">
                <el-option label="检查井" value="shanghai"></el-option>
                <el-option label="排口" value="beijing"></el-option>
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
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
export default {
  name: 'DynamicTable',
  data(){
    return{
      formInline:{
        user:'',
        region:''
      },
      tableData: [{
        date: '2016-05-03',
        name: 'xxxxxxx,xxxxxx',
        province: '长江',
        city: '01110222',
        address: '20m',
        zip: 200333
      }],
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
      dialogFormVisible: false,
      dialogAddVisible:false,
    }
  },
  mounted(){
    this.getProjectInfo();
  },
  methods: {
    // //请求所有项目
    // getProjectinfo(){
    //   axios('/api/projects').then(this.getProjectSuccess)
    // },
    // getProjectSuccess(res){
    //   alert(res);
    // },
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
</style>
