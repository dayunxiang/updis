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
        <div id="myChart3" :style="{width: '1200px', height: '700px'}"></div>
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
        option: {}
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
        console.log("绘制图表", myChart2);
        self.option = {
          backgroundColor: '#061B47',
          legend: {
            top: 20,
            textStyle: {
              color: '#fff'
            },
            data: ['建筑小区', '公园绿地', '道路广场', '河道治理', '涉水基础设施', 'PPP项目']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)', // 背景
//            padding: [8, 10], //内边距
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
            formatter(params) {
//              if (params.seriesIndex == "9" || params.seriesIndex == "11" || params.seriesIndex == "15") {
                return params.name + '<br>' + params.seriesName + ' : 完成 ' + params.value + ' 项任务';
//              }
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#363e83',
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#363e83 ',
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: '12'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#363e83',
                }
              },
              axisLabel: {
                inside: false,
                textStyle: {
                  color: '#fff',
                  fontWeight: 'normal',
                  fontSize: '12',
                }
              },
              data: ['区间一', '区间二', '区间三', '区间四', '区间五', '区间六']
            },
            {
              type: 'category',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitArea: {
                show: false
              },
              splitLine: {
                show: false
              },
              data: ['区间一', '区间二', '区间三', '区间四', '区间五', '区间六']
            }
          ],
          series: [
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              zlevel: 1,
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2
                  }
                }
              },
              barWidth: '5%',
              data: [100, 100, 100, 100, 100, 100]
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              data: [100, 100, 100, 100, 100, 100],
              zlevel: 1,
              barWidth: '5%',
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                  },
                }
              },
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              data: [100, 100, 100, 100, 100, 100],
              zlevel: 1,
              barWidth: '5%',
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                  },
                }
              },
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              data: [100, 100, 100, 100, 100, 100],
              zlevel: 1,
              barWidth: '5%',
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                  },
                }
              },
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              data: [100, 100, 100, 100, 100, 100],
              zlevel: 1,
              barWidth: '5%',
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                  },
                }
              },
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              barGap: '100%',
              data: [100, 100, 100, 100, 100, 100],
              zlevel: 1,
              barWidth: '5%',
              itemStyle: {
                normal: {
                  color: '#174172',
                  borderWidth: 0,
                  shadowBlur: {
                    shadowColor: 'rgba(255,255,255,0.31)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 2,
                  },
                }
              },
            },


            {
              name: '建筑小区',
              type: 'bar',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#FFEC8B'
                  }, {
                    offset: 1,
                    color: '#FFD700'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barWidth: '5%',
              data: [8, 15, 10, 43, 54, 23]
            },
            {
              name: '公园绿地',
              type: 'bar',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#C0FF3E'
                  }, {
                    offset: 1,
                    color: '#7CFC00'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barWidth: '5%',
              data: [9, 67, 19, 32, 12, 29]
            },
            {
              name: '道路广场',
              type: 'bar',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8B8682'
                  }, {
                    offset: 1,
                    color: '#8A8A8A'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barWidth: '5%',
              data: [21, 9, 37, 87, 29, 67]
            },
            {
              name: '河道治理',
              type: 'bar',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00BFFF'
                  }, {
                    offset: 1,
                    color: '#4876FF'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barWidth: '5%',
              data: [67, 39, 47, 63, 29, 10]
            },
            {
              name: '涉水基础设施',
              type: 'bar',
              barWidth: '5%',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#ABDCFF'
                  }, {
                    offset: 1,
                    color: '#0396FF'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barGap: '100%',
              data: [18, 83, 39, 30, 66, 35]
            },
            {
              name: 'PPP项目',
              type: 'bar',
              barWidth: '5%',
              itemStyle: {
                normal: {
                  show: true,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#AB82FF'
                  }, {
                    offset: 1,
                    color: '#912CEE'
                  }]),
                  barBorderRadius: 50,
                  borderWidth: 0,
                }
              },
              zlevel: 2,
              barGap: '100%',
              data: [46, 48, 73, 29, 48, 63]
            }
          ]
        };
        myChart3.setOption(self.option);

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
</style>
