<template>
  <div style="padding-top:20px;">
    <!--表头部分-->
    <el-form :inline="true" class="demo-form-inline" style="padding-left:10px;">
      <el-form-item label="项目名称">
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

        <div style="width:40%; height:450px; float:left;margin-top:20px; padding-top:50px;">
          <div id="optionPie" :style="{width: '100%', height: '500px'}" ></div>
        </div>

        <div style="width:57%; margin-top:20px; padding:17px;  float:right;">
          <div id="optionBar1" :style="{width: '100%', height: '300px'}"></div>
          <div id="optionBar2" :style="{width: '100%', height: '300px'}"></div>
          <div id="optionBar3" :style="{width: '100%', height: '300px'}"></div>
        </div>

      </el-tab-pane>

      <el-tab-pane align="center" label="年径流总量控制率" name="second">
        <div id="myChart2" :style="{width: '600px', height: '380px'}" style="float:left;"></div>
        <div id="myChart1" :style="{width: '600px', height: '380px'}" style="float:right;"></div>
      </el-tab-pane>

      <el-tab-pane align="center" label="海绵面积覆盖度" name="three">
        <!--<div id="myChart2" :style="{width: '600px', height: '380px'}" style="float:left;"></div>-->
        <!--<div id="myChart1" :style="{width: '600px', height: '380px'}" style="float:right;"></div>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

  var echarts = require('echarts');
  import TestData from '@/assets/json/ceshi.json'
  //  import Vuex from 'vuex'
  export default {
    name: 'figure',
    data(){
      return {
        activeNo: 'first',        // echarts图标签页
        option1: {},              // echarts图数据
        option2: {},
        option3: {},
        optionBar1: {},            //柱状图
        optionBar2: {},            //柱状图
        optionBar3: {},            //柱状图
        optionPie: {}              //饼图
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
//        self.option1 = TestData.option1;
//        self.option2 = TestData.option2;
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
        console.log("绘制图表......");
        /* 绘制柱状图 */
        var optionBar1 = self.$echarts.init(document.getElementById("optionBar1"));  //获取标签ID
        self.optionBar1 =  {
          title: {
            text: '排水分区一'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            feature : {
              magicType : { show: true, type: ['line'] },
              restore : { show: true },
              saveAsImage : { show: true }
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['建筑和小区', '公园绿地', '道路广场', '河道治理', '涉水基础设施', 'PPP项目']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              barWidth : 10,
              data: [4, 12, 12, 1, 9, 3]
            },
            {
              name: '未完成',
              type: 'bar',
              barWidth : 10,
              data: [13, 4, 3, 12, 14, 10]
            }
          ]
        };
        optionBar1.setOption(self.optionBar1);

        var optionBar2 = self.$echarts.init(document.getElementById("optionBar2"));  //获取标签ID
        self.optionBar2 =  {
          title: {
            text: '排水分区二'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            feature : {
              magicType : { show: true, type: ['line'] },
              restore : { show: true },
              saveAsImage : { show: true }
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['建筑和小区', '公园绿地', '道路广场', '河道治理', '涉水基础设施', 'PPP项目']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              barWidth : 10,
              data: [12, 2, 9, 5, 17, 13]
            },
            {
              name: '未完成',
              type: 'bar',
              barWidth : 10,
              data: [3, 14, 12, 10, 7, 8]
            }
          ]
        };
        optionBar2.setOption(self.optionBar2);

        var optionBar3 = self.$echarts.init(document.getElementById("optionBar3"));  //获取标签ID
        self.optionBar3 =  {
          title: {
            text: '排水分区三'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            feature : {
              magicType : { show: true, type: ['line'] },
              restore : { show: true },
              saveAsImage : { show: true }
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['建筑和小区', '公园绿地', '道路广场', '河道治理', '涉水基础设施', 'PPP项目']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              barWidth : 10,
              data: [12, 2, 9, 5, 17, 13]
            },
            {
              name: '未完成',
              type: 'bar',
              barWidth : 10,
              data: [3, 14, 12, 10, 7, 8]
            }
          ]
        };
        optionBar3.setOption(self.optionBar3);

        /* 绘制饼图 */
        var optionPie = self.$echarts.init(document.getElementById("optionPie"));  //获取标签ID
        /*self.optionPie = {
          title: {
            text: '项目数量完成度',
            x: 'center'
          },
          tooltip : {
            show: true,
            trigger: 'item',
            /!*formatter: "{a} <br/>{b}: {c} ({d}%)"*!/
            formatter: " {b} <br> 完成 {c} 项 <br> 完成度为： ({d}%)"
          },
          /!*tooltip : {
            trigger: 'item',
            position (p) {
              var id = document.getElementById('main');
              if ($(id).width() - p[0]- $(id).find("div .echarts-tooltip").width()-20 <0) {
                p[0] = p[0] - $(id).find("div .echarts-tooltip").width() -40;
              }
              return ['50%', '50%'];
            },
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },*!/
          legend: {
            orient : 'vertical',
            x : 'left',
            data: ['小于50%', '50% 到 80%', '80% 到 99%', '100%']
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          series : [
            {
              name:'项目数量完成度',
              type:'pie',
              selectedMode: 'single',
              center : ['50%', 200],
              radius : 110,
              label: {
                normal: {
                  position: 'inner',
                  formatter: "{b}"
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              color: ['#DAA520','#D6D6D6','#C6E2FF','#E066FF'],
              data:[
                {value:5, name:' 小于50% '},
                {value:6, name:' 50% 到 80% '},
                {value:7, name:' 80% 到 99% '},
                {value:10, name:' 100% '}
              ]
            }
          ]
        };*/
        self.optionPie = {
          title : {             // 标题
            text: '项目数量完成度',
            x:'center'
          },
          toolbox: {           // 插件
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          tooltip : {
            trigger: 'item',
            formatter:  " 区间在 {b} <br> 完成 {c} 项 <br> 完成度为： ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['小于50%', '50% 到 80%', '80% 到 99%', '100%']
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              center : ['50%', 200],
              radius : 110,
              label: {
                normal: {
                  position: 'inner',
                  formatter: "{b}"
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              color: ['#DAA520','#D6D6D6','#C6E2FF','#E066FF'],
              data:[
                {value:335, name:'小于50%'},
                {value:310, name:'50% 到 80%'},
                {value:234, name:'80% 到 99%'},
                {value:135, name:'100%'}
              ],
              /*itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }*/
            }
          ]
        };
        optionPie.setOption(self.optionPie);
      }
    }
  }
</script>


<style lang="scss">
  div.listChart {
    padding: 0px 20px 0px 10px;
  }

  .app-main {
    overflow: auto !important;
    padding-bottom: 10% !important;
  }

  div#myChart3 , div#myChart4 {
    /*float: right;*/
  }
</style>
