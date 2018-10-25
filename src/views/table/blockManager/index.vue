<template>
  <div class="point-manager">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-select v-model="formInline.region" placeholder="请选择项目名称">
          <el-option label="项目一" value="shanghai"></el-option>
          <el-option label="项目二" value="beijing"></el-option>
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
          label="地块编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="地块坐标"
          width="120">
        </el-table-column>
        <el-table-column
          prop="province"
          label="建设状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="现状用地类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="规划用地类型"
          width="300">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="最终排入河道"
          width="120">
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
          label="雨水主要排入检查井编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="污水主要排入检查井编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="是否进行海绵城市设计及类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="是否进行正本清源改造及类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="地块内排水单位名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="排水类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="是否为重点排污单位"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="历史排污量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="主要污染物"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="排污许可证编号"
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
    <!--弹出层-->
    <div>
      <div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="25%">
          <el-form ref="form" :model="tableData" label-width="150px">
            <el-form-item label="地块编号">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="地块坐标">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="规划用地类型">
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
    </div>
    <!--增加-->
    <div>
      <div>
        <el-dialog title="添加地块" :visible.sync="dialogAddVisible" width="25%">
          <el-form ref="form" :model="tableData" label-width="150px">
            <el-form-item label="请选择项目名称">
              <el-col :span="19">
                <el-select  placeholder="请选择项目名称">
                  <el-option label="项目一" value="shanghai"></el-option>
                  <el-option label="项目二" value="beijing"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="地块编号">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="地块坐标">
              <el-col :span="19">
                <el-input v-model="tableData.date"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="规划用地类型">
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

  </div>

</template>

<script>
  export default {
    name: 'blockManager',
    data(){
      return{
        formInline:{
          user:'',
          region:''
        },
        tableData: [{
          date: '345678789',
          name: 'xxxxxxx,xxxxxx',
          province: '456789',
          city: '01110222',
          address: '梅林路30号',
          zip: 200333
        }],
        dialogFormVisible: false,
        dialogAddVisible:false,
      }
    }
  }
</script>
<style>
  .point-manager{
    margin: 20px;
  }
</style>
