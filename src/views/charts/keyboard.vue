<template>
  <div>
    <!--标签页-->
    <el-tabs class="tongName"
             tab-position="top"
             v-model="activeName"
             @tab-click="handleClick" >
      <el-tab-pane v-for="item in tongName"
                   :key="item.id"
                   align="center"
                   :label="item.name"
                   :name="item.id" >
        <!--表格-->
        <el-table :data="item.mingcheng"  style="width: 100%"  border>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="percentage" label="百分比"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="target" label="目标"></el-table-column>
          <el-table-column prop="shape" label="形状"></el-table-column>
          <el-table-column prop="area" label="面积"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
    <!--标签页-->
    <!--<el-tabs class="tongName"-->
             <!--tab-position="top"-->
             <!--v-model="activeName"-->
             <!--@tab-click="handleClick" >-->
      <!--<el-tab-pane align="center" label="项目数量完成度" name="firsst">-->
        <!--<div id="myChart1" style="width:750px;height:300px;" ></div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane align="center" label="径流总量控制率" name="second">-->
        <!--<div id="myChart2" style="width:750px;height:300px;" ></div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane align="center" label="面积覆盖度" name="three">-->
        <!--<div id="myChart3" style="width:750px;height:300px;" ></div>-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  </div>
</template>
<script>
import _ from 'lodash'
import namelist from '@/assets/json/new.json'
export default {
  name: 'arrTable',
  data(){
    return {
      activeName: '0',
      tongName: [],
//      xitongtu: [],
//      option1: {},
//      option2: {},
//      option3: {},
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      self.xitongtu = namelist.features[0].tongjitu;
      self.tongName = namelist.features[0].coordinates;
//      self.option1 = namelist.features[0].tongjitu[0].option1;
//      self.option2 = namelist.features[0].tongjitu[1].option2;
//      self.option3 = namelist.features[0].tongjitu[2].option3;
      //console.log(self.option1);
//      setTimeout(function () {
//        self.drawLine();
//      },10);
      //console.log(self.tongName);
    },
//    drawLine(){
      // 基于准备好的dom，初始化echarts实例
//      var myChart1 = this.$echarts.init(document.getElementById("myChart1"));
//      var myChart2 = this.$echarts.init(document.getElementById("myChart2"));
//      var myChart3 = this.$echarts.init(document.getElementById("myChart3"));
//      // 绘制图表
//      myChart1.setOption(this.option1);
//      // 绘制图表
//      myChart2.setOption(this.option2);
//      // 绘制图表
//      myChart3.setOption(this.option3);
//    },
    handleClick(tab, event) {
      //console.log(tab, event);
    },
  }
};
</script>
<style lang="scss" scoped>
  div.tongName  {
    padding:8px 12px 0px 12px;
  }
</style>
