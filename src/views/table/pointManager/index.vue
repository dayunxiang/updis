<template>
  <div class="point-manager">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="项目名称" prop="creatorId">
        <el-select v-model="project.creatorId" placeholder="请选择">
          <el-option v-for="project in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点类型" prop="type">
        <el-select v-model="project.geometry_type"  placeholder="请选择点类型">
          <el-option label="排口" value="Point1" @click="paiko()"></el-option>
          <el-option label="工业企业" value="Point2" @click="gongye"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编号">
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
    <!--============排口===============-->
    <div v-if="paikou">
        <!--end-->
        <div >

          <el-table :data="tableData" border max-height="500" style="width: 100%;">
            <el-table-column
              fixed
              prop="id"
              label="排口编号"
              width="150">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
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
          </el-table :visible.sync="d">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage2"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totall">
          </el-pagination>
        </div>
        <!--编辑-->
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
                <el-button type="primary">更新</el-button>
                <el-button @click="dialogFormVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
    </div>
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
    <!--===========工业企业===============-->
    <div v-if="gongye">
      <!--end-->
      <div>
        <el-table :data="tableData" border  style="width: 100%;" fit="true">
          <el-table-column
            fixed
            prop="X_cor"
            label="x坐标"
            width="">
          </el-table-column>
          <el-table-column
            prop="Y_cor"
            label="Y坐标"
            width="120">
          </el-table-column>
          <el-table-column
            prop="QYMC"
            label="企业名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="JDMC"
            label="街道"
            width="120">
          </el-table-column>
          <el-table-column
            prop="SQMC"
            label="社区"
            width="300">
          </el-table-column>
          <el-table-column
            prop="SCJYDZ"
            label="地址"
            width="120">
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
            prop="JZMJ"
            label="建筑面积"
            width="120">
          </el-table-column>
          <el-table-column
            prop="QYLXR"
            label="联系人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="LXDH"
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
            prop="zip"
            label="规模"
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
            label="主要生产工艺 "
            width="120">
          </el-table-column>
          <el-table-column
            prop="CPZL"
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
            prop="FSLL"
            label="废水类型"
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
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-sizes="[20, 40, 60, 80]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totall">
        </el-pagination>
      </div>
      <!--修改-->
      <div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="25%">
          <el-form ref="form" :model="tableData" label-width="150px">
            <el-form-item label="X坐标">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="Y坐标">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="街道">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="社区">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="地址">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="法人代表">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="建筑面积">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="联系人">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="企业人数">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="行业类别">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="规模">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="生产用水量">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="排水量">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="主要生产工艺">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="产品">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="环评">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="环评有效性">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="排污许可证">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="废水处理方式">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="废水类型">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">更新</el-button>
              <el-button @click="dialogFormVisible=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <!--=================================-->
  </div>

</template>

<script>
  import axios from 'axios'
  import request from '@/utils/request'
  export default {
    name: 'DynamicTable',
    data(){
      return{
        paikou:true,
        gongye:false,
        projects:[],
        project: {
          creatorId: '',
          geometry_type:''
        },
        pageNo:1,
        totall: 0,
        pageSize:20,
        tableData: [],


        formInline:{
          user:'',
          region:''
        },
        dialogTableVisible: false,
        dialogFormVisible: false,

        formLabelWidth: '120px',
        dialogFormVisible: false,
        dialogAddVisible:false,
      }
    },
    mounted(){
      this.getProjectsInfo();
    },
    methods: {
      //请求所有项目
      getProjectsInfo(){
        axios('/api/projects').then(this.getProjectSuccess);
      },
      getProjectSuccess(res){
        this.projects = res.data;
        console.log(res);
      },
      // 查询事件
      handleSelect(){
        var self = this;
        var selectObject = {
          project_id: self.project.creatorId,
          geometry_type : self.project.geometry_type
        }
        console.log("事件：", selectObject.geometry_type);
        if(selectObject.geometry_type === "Point1") {
            this.gongye = false;
            this.paikou = true;
        }
        if(selectObject.geometry_type === "Point2") {
          this.gongye = true;
          this.paikou = false;
        }
        // 向后端发起请求接口为 /shapes 拿到数据
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
                  equalTo: 'OUTFALLS'
                }
              }
            }
          }
        }).then(resp =>{
          this.tableData = resp.data;
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
</style>
