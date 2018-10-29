<template>
  <div>
    <!--标签页-->
    <el-tabs class="tongName"
    tab-position="top"
    v-model="activeNo"
    type="card">
    <el-tab-pane align="center" label="项目数量完成度" name="first">
    <div id="myChart1" class="figure"></div>
    </el-tab-pane>
    <el-tab-pane align="center" label="径流总量控制率" name="second">
    <div id="myChart2" class="figure"></div>
    </el-tab-pane>
    <el-tab-pane align="center" label="面积覆盖度" name="three">
    <div id="myChart3" class="figure"></div>
    </el-tab-pane>
    </el-tabs>
    <!--标签页-->
    <div class="label">
      <el-button class="AddButton" type="primary" icon="el-icon-plus" circle @click="handleAddTab(activeNameTest)"></el-button>
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               type="card">
        <el-tab-pane v-for="item in tongName"
                     :key="item.id"
                     align="center"
                     :label="item.name"
                     :name="item.id">
          <!--表格-->
          <el-table :data="item.mingcheng" style="width: 100%" border>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="percentage" label="百分比"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="target" label="目标"></el-table-column>
            <el-table-column prop="shape" label="形状"></el-table-column>
            <el-table-column prop="area" label="面积"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--获取信息-->
      <el-dialog :title="this.hodelView === ''?'查看信息':'编辑信息'" :visible.sync="dialogVisible" data="listData" @click="dialogVisible = false">
        <el-form :label-position="labelPosition" label-width="100px" :model="listData">
          <h2>{{listTitle}}</h2>
          <el-form-item label="名称" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px;" v-model="listData.name"></el-input>
          </el-form-item>
          <el-form-item label="百分比" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="listData.percentage"></el-input>
          </el-form-item>
          <el-form-item label="状态" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="listData.state"></el-input>
          </el-form-item>
          <el-form-item label="目标" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="listData.target"></el-input>
          </el-form-item>
          <el-form-item label="形状" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="listData.shape"></el-input>
          </el-form-item>
          <el-form-item label="面积" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="listData.area"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? false : true" type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加信息-->
      <el-dialog title="添加信息" :visible.sync="dialogAdd" data="testData"  @click="dialogAdd = false">
        <el-form :label-position="labelPosition" label-width="100px" >
          <el-form-item label="名称" align="center">
            <el-input class="elementMadel"
                      style="width:160px;" v-model="testData.name"></el-input>
          </el-form-item>
          <el-form-item label="百分比" align="center">
            <el-input class="elementMadel"
                      style="width:160px"
                      v-model="testData.percentage"></el-input>
          </el-form-item>
          <el-form-item label="状态" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="testData.state"></el-input>
          </el-form-item>
          <el-form-item label="目标" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="testData.target"></el-input>
          </el-form-item>
          <el-form-item label="形状" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="testData.shape"></el-input>
          </el-form-item>
          <el-form-item label="面积" align="center">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:160px"
                      v-model="testData.area"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import TestData from '@/assets/json/ceshi.json'
  export default {
    name: 'keyboard',
    data(){
      return {
        ifDemo: '',
        testData: [],
        dialogVisible: false,
        dialogAdd: false,
        labelPosition: 'right',
        activeNo: 'first',
        activeNameTest: '0',
        hodelView: '',
        listTitle: '',
        listData: '',
        tongName: [],
        option1: {},
        option2: {},
        option3: {},
        option4: {
          name: "测试数据",
          mingcheng: []
        },
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleCheck (row) {
        const self = this;
        self.hodelView = "";
        this.listTitle = self.tongName[row.id].name;
        self.dialogVisible = true;
        self.listData = row;
      },
      handleEditor(row) {
        const self = this;
        self.hodelView = "view";
        this.listTitle = self.tongName[row.id].name;
        self.dialogVisible = true;
        self.listData = row;
      },
      handleSubmit() {
        console.log("提交失败：", this);
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },

      /**
       * 点击添加类型
       */
      handleAddTab() {
        const self = this;
        self.hodelView = "view";
        self.dialogAdd = true;
        console.log("数据1: ", this);

      },
      /**
       * 获取项目进度数据
       */
      init() {
        const self = this;
        self.tongName = TestData.tongName;
        self.option1 = TestData.option1;
        self.option2 = TestData.option2;
        self.option3 = TestData.option3;
        setTimeout(function () {
          self.drawLine();
        }, 10);

      },
      /**
       * 使用echarts统计图
       */
      drawLine(){
        const self = this;
        var myChart1 = self.$echarts.init(document.getElementById("myChart1"));
        var myChart2 = self.$echarts.init(document.getElementById("myChart2"));
        var myChart3 = self.$echarts.init(document.getElementById("myChart3"));
        myChart1.setOption(self.option1);
        myChart2.setOption(self.option2);
        myChart3.setOption(self.option3);
        console.log("绘制图表", self.tongName);
      },
      handleClick(tab, event) {
        //console.log(tab, event);
      }
    }

  }
</script>
<style lang="scss">
  div.tongName {
    padding: 8px 12px 0px 12px;
  }

  div.label {
    position: relative;
  }

  div.label > button.el-button {
    position: absolute;
    top: 8px;
    right: 40px;
    z-index: 1;
  }

  div.figure {
    width: 1000px;
    height: 300px;
  }

  div.figure > div {
    padding: 12px;
  }

  .el-table__expand-column .cell {
    display: none;
  }
  div.elementMadel>input{
    color: #666 !important;
  }
</style>
