<template>
  <div style="padding-top:20px;">
    <!--表头部分-->
    <el-form :inline="true"  class="demo-form-inline" style="padding-left:10px;">
      <el-form-item label="项目名称" >
        <el-input placeholder="请输入要查询的编号"></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input placeholder="请输入要查询的编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>
    <!--标签页-->
    <el-tabs class="listChart"
             tab-position="top"
             v-model="activeNo"
             type="card">
      <el-tab-pane align="center" label="项目数量完成度" name="first">
        <div id="myChart1" class="figure"></div>
      </el-tab-pane>
      <el-tab-pane align="center" label="年径流总量控制率" name="second">
        <div id="myChart2" class="figure"></div>
      </el-tab-pane>
      <el-tab-pane align="center" label="海绵面积覆盖度" name="three">
        <div id="myChart3" class="figure"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import TestData from '@/assets/json/ceshi.json'
  import Vuex from 'vuex'
  export default {
    name: 'figure',
    data(){
      return {
        activeNo: 'first',        // echarts图标签页
        option1: {},              // echarts图数据
        option2: {},
        option3: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      /**
       * 获取项目进度数据
       */
      init() {
        const self = this;
        self.option1 = TestData.option1;
        self.option2 = TestData.option2;
        self.option3 = TestData.option3;
        setTimeout(function () {
          self.drawLine();
          console.log("数据获取成功");
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
        console.log("绘制图表", myChart1);
      }
    }
  }
</script>



<style lang="scss">
  div.listChart {
    padding: 8px 12px 0px 12px;
  }
</style>
