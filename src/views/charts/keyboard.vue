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
      <el-button class="AddButton" type="primary" icon="el-icon-plus" circle
                 @click="handleAddTab(activeNameTest)"></el-button>

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
                <!--<el-button @click="handleCheck(scope.row)" type="text" size="small">查看</el-button>-->
                <el-button @click="dialogVisible = true" type="text" size="small">查看</el-button>
                <el-button @click="dialogVisible = true" type="text" size="small">编辑</el-button>
                <el-button @click="dialogVisible = true" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!--获取信息-->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <h2>这里是获取的数据</h2>


        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        dialogVisible: false,
        activeNo: 'first',
        activeNameTest: '0',
        tongName: [],
        option1: {},
        option2: {},
        option3: {},
        option4: {
          name: "测试数据",
          mingcheng: []
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
//      handleCheck(row) {
//        const $table = this.$refs.table
//
//        $table.toggleRowExpansion(row)
//        $table.toggleRowSelection(row)
//      },
//      handleClose(done) {
//        this.$confirm('确认关闭？').then().catch();
//      },

      /**
       * 点击添加类型
       */
      handleAddTab(targetName) {
        const self = this;
        console.log("数据1: ", targetName);
        let newTabName = ++self.tabIndex + '';
        this.tongName.push(self.option4);
        this.activeNameTest = newTabName;
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
<style lang="scss" scoped>
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
</style>
