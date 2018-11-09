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

      <el-tab-pane align="center" label="项目数量完成度" name="0">
        <div style="margin-top:2px; padding-top:5px;">
          <div id="completeDegree" :style="{width: '1200px', height: '500px'}" ></div>
        </div>
      </el-tab-pane>

      <el-tab-pane align="center" label="年径流总量控制率" name="1">

      </el-tab-pane>

      <el-tab-pane align="center" label="海绵面积覆盖度" name="2">
        <!--饼图-->
        <div style="width:500px; height:450px; float:left; margin-top:2px; padding-top:5px;">
          <div id="optionPie" :style="{width: '500px', height: '500px'}" ></div>
        </div>
        <!--柱形图-->
        <div style="width:57%; margin-top:20px; padding:17px;  float:right;">
          <div id="optionBar1" :style="{width: '500px', height: '300px'}"></div>
          <div id="optionBar2" :style="{width: '500px', height: '300px'}"></div>
          <div id="optionBar3" :style="{width: '500px', height: '300px'}"></div>
        </div>

      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>

  //var echarts = require('echarts');
  var echarts = require('echarts-gl');
  import axios from 'axios'
  import request from '@/utils/request'
  import commonApi from '@/api/commonApi'
  import _ from 'lodash'
  import TestData from '@/assets/json/ceshi.json'
  //  import Vuex from 'vuex'
  export default {
    name: 'figure',
    data(){
      return {
        roadSquare: [],
        parkSquare: [],
        buildSquare: [],
        activeNo: 0,        // echarts图标签页
        optionBar1: {},     // echarts:面积覆盖度柱状图
        optionBar2: {},     // echarts:面积覆盖度柱状图
        optionBar3: {},     // echarts:面积覆盖度柱状图
        optionPie: {},      // echarts:面积覆盖度饼图
        completeDegree: {}  // echarts:项目完成度柱状图
      }
    },
    created() {
      this.init();
    },
    mounted() {
      //this.TestData();
    },
    methods: {
      TestData() {
        const self = this;
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 200000,
            filters: {
              'shape': {
                'category': {
                  equalTo: "SUBCATCHMENTS"
                },
                'projectId': {
                  equalTo: '4'
                }
              }
            }
          }
        }).then(resp => {
          this.TestList(resp);
        })
      },
      TestList(res){
        const self = this;
        var demo = [];
        _.each(res.data, function (vn) {
          var TestData = ( JSON.parse(vn.properties));
          var letter = ( TestData.properties.YDLX ).substr(0, 1);    // 截取字符首字母
          var threeTest = ( TestData.properties.YDLX ).substr(0, 3);    // 截取字符首字母
          /**
           * 道路广场
           */
          if ( TestData.properties.YDLX === "道路" || letter === "S" ) {
            var RoadTest = {};
            RoadTest.name = TestData.properties.name;
            RoadTest.YDLX = TestData.properties.YDLX;
            RoadTest.JSZT = TestData.properties.JSZT;
            RoadTest.XMMC = TestData.properties.XMMC;
            RoadTest.HMLX = TestData.properties.HMLX;
            RoadTest.PRHD = TestData.properties.PRHD;
            RoadTest.SSLY = TestData.properties.SSLY;
            RoadTest.SSPSFQ = TestData.properties.SSPSFQ;
            RoadTest.ZBQY = TestData.properties.ZBQY;
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "40%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = TestData.properties.JSZT + '';
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "65%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "40%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = TestData.properties.JSZT + '';
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = "规划管控" + '';
              RoadTest.ZLKZL = "65%";
            }
            self.roadSquare.push(RoadTest);
          } else
          /**
           * 建筑小区
           */
          if ( letter === "R" || letter === "M" || letter === "C" || threeTest === "GIC" ) {
            var builTest = {};
            builTest.name = TestData.properties.name;
            builTest.YDLX = TestData.properties.YDLX;
            builTest.JSZT = TestData.properties.JSZT;
            builTest.XMMC = TestData.properties.XMMC;
            builTest.HMLX = TestData.properties.HMLX;
            builTest.PRHD = TestData.properties.PRHD;
            builTest.SSLY = TestData.properties.SSLY;
            builTest.SSPSFQ = TestData.properties.SSPSFQ;
            builTest.ZBQY = TestData.properties.ZBQY;
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "65%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "50%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "70%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "50%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              builTest.JSQK = "规划管控" + '';
              builTest.ZLKZL = "65%";
            }
            self.buildSquare.push(builTest);
          } else
          /**
           * 公园绿地
           */
          if ( letter === "G"  ) {
            var parkTest = {};
            parkTest.name = TestData.properties.name;
            parkTest.YDLX = TestData.properties.YDLX;
            parkTest.JSZT = TestData.properties.JSZT;
            parkTest.XMMC = TestData.properties.XMMC;
            parkTest.HMLX = TestData.properties.HMLX;
            parkTest.PRHD = TestData.properties.PRHD;
            parkTest.SSLY = TestData.properties.SSLY;
            parkTest.SSPSFQ = TestData.properties.SSPSFQ;
            parkTest.ZBQY = TestData.properties.ZBQY;
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "70%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "80%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = "" + '';
              parkTest.ZLKZL = "80%";
            }
            self.parkSquare.push(parkTest);
          }
          demo.push(TestData.properties);
        });
        /*console.log("道路广场: ", self.roadSquare);
        console.log("建筑小区: ", self.buildSquare);
        console.log("公园绿地: ", self.parkSquare);*/
        console.log("获取数据", demo);
      },
      /**
       * 获取项目进度数据
       */
      init() {
        const self = this;
        setTimeout(function () {
          /**
           * 项目数量完成度
           */
          self.drawComplete();
          /**
           * 项目海绵面积覆盖度
           */
          self.drawLine();
          self.drawPie();
          console.log("数据获取成功");
        }, 10);
      },
      /**
       * 使用echarts统计图:绘制项目数量完成度柱状图
       */
      drawComplete(){
        const self = this;
        var completeDegree = self.$echarts.init(document.getElementById("completeDegree"));  //获取标签ID
        /*self.completeDegree = {
          title : {
            text: 'ECharts2 vs ECharts1',
            subtext: 'Chrome下测试数据'
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:[
              'ECharts1 - 2k数据','ECharts1 - 2w数据','ECharts1 - 20w数据','',
              'ECharts2 - 2k数据','ECharts2 - 2w数据','ECharts2 - 20w数据'
            ]
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          grid: {y: 70, y2:30, x2:20},
          xAxis : [
            {
              type : 'category',
              data : ['Line','Bar','Scatter','K','Map']
            },
            {
              type : 'category',
              axisLine: {show:false},
              axisTick: {show:false},
              axisLabel: {show:false},
              splitArea: {show:false},
              splitLine: {show:false},
              data : ['Line','Bar','Scatter','K','Map']
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel:{formatter:'{value} ms'}
            }
          ],
          series : [
            {
              name:'ECharts2 - 2k数据',
              type:'bar',
              itemStyle: {normal: {color:'rgba(193,35,43,1)', label:{show:true}}},
              data:[40,155,95,75, 0]
            },
            {
              name:'ECharts2 - 2w数据',
              type:'bar',
              itemStyle: {normal: {color:'rgba(181,195,52,1)', label:{show:true,textStyle:{color:'#27727B'}}}},
              data:[100,200,105,100,156]
            },
            {
              name:'ECharts2 - 20w数据',
              type:'bar',
              itemStyle: {normal: {color:'rgba(252,206,16,1)', label:{show:true,textStyle:{color:'#E87C25'}}}},
              data:[906,911,908,778,0]
            },

            {
              name:'ECharts1 - 2k数据',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {normal: {color:'rgba(193,35,43,0.5)', label:{show:true,formatter:function(p){return p.value > 0 ? (p.value +'\n'):'';}}}},
              data:[96,224,164,124,0]
            },
            {
              name:'ECharts1 - 2w数据',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {normal: {color:'rgba(181,195,52,0.5)', label:{show:true}}},
              data:[491,2035,389,955,347]
            },
            {
              name:'ECharts1 - 20w数据',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {normal: {color:'rgba(252,206,16,0.5)', label:{show:true,formatter:function(p){return p.value > 0 ? (p.value +'+'):'';}}}},
              data:[3000,3000,2817,3000,0]
            }
          ]
        };*/
        self.completeDegree =  {
          title : {
            text: '项目完成度',
            x: 'center'
          },
          // grid: {y: 70, y2:30, x2:20},   // 大标题的位置
          toolbox: {
            show : true,   // 是否启用工具
            feature : {
              //mark : {show: true},
              //dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line']},  // 视图类型
              restore : {show: true},       // 还原
              saveAsImage : {show: true}    // 下载图片
            }
          },
          tooltip : {
            formatter: '{b} <br> {c} <br/> {a}',
            trigger: 'axis',
            /*axisPointer : {    // 坐标轴指示器，坐标轴触发有效
              type : 'shadow',   // 默认为直线，可选为：'line' | 'shadow'
            }*/
          },
          legend: {
            data:[
              'ECharts1 - 2k数据',
              'ECharts1 - 2w数据',
              'ECharts1 - 20w数据',
              '',
              'ECharts2 - 2k数据',
              'ECharts2 - 2w数据',
              'ECharts2 - 20w数据'
            ]
            //data: ['现在无海绵', '在建无海绵','规划管控','在建已落实海绵', '现状已落实海绵']
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : ['#1','#2','#3']
            },
            {
              type : 'category',
              data : ['#1','#2','#3']
            },
            {
              type : 'category',
              data : ['#1','#2','#3']
            },
            {
              type : 'category',
              data : ['#1','#2','#3']
            },
            {
              type : 'category',
              axisLine : {show:false},   // 坐标轴线
              axisTick : {show:false},   // 坐标轴刻度
              axisLabel: {show:false},   // 刻度标签
              splitArea: {show:false},   // 分隔区域
              splitLine: {show:false},   // 分隔线
              data : ['#1','#2','#3']
            }
          ],
          yAxis : [
            {
              type : 'value',
              max : 100 ,
              axisLabel:{
                formatter:'{value} %'
              }
            }
          ],
          series : [

            {
              name:'现在无海绵',
              type:'bar',
              xAxisIndex:4,
              itemStyle: {
                normal: {
                  color:'#C2C2C2',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[95,96,97]
            },
            {
              name:'现在无海绵',
              type:'bar',
              xAxisIndex:4,
              itemStyle: {
                normal: {
                  color:'#C2C2C2',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[85,86,87]
            },
            {
              name:'现在无海绵',
              type:'bar',
              xAxisIndex:4,
              itemStyle: {
                normal: {
                  color:'#C2C2C2',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[75,76,77]
            },

            {
              name:'在建无海绵',
              type:'bar',
              xAxisIndex:3,
              itemStyle: {
                normal: {
                  color:'#7A7A7A',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[45,46,47]
            },
            {
              name:'在建无海绵',
              type:'bar',
              xAxisIndex:3,
              itemStyle: {
                normal: {
                  color:'#7A7A7A',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[35,36,37]
            },
            {
              name:'在建无海绵',
              type:'bar',
              xAxisIndex:3,
              itemStyle: {
                normal: {
                  color:'#7A7A7A',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[25,26,27]
            },

            {
              name:'规划管控',
              type:'bar',
              xAxisIndex:2,
              itemStyle: {
                normal: {
                  color:'#87CEFA',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    },
                    /*formatter(p){
                      console.log("这个P是什么: ", p);
                      return p.value > 0 ? (p.value +'') : '';
                    }*/
                  }
                }
              },
              data:[25,26,27]
            },
            {
              name:'规划管控',
              type:'bar',
              xAxisIndex:2,
              itemStyle: {
                normal: {
                  color:'#87CEFA',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    },
                    /*formatter(p){
                     console.log("这个P是什么: ", p);
                     return p.value > 0 ? (p.value +'') : '';
                     }*/
                  }
                }
              },
              data:[15,16,17]
            },
            {
              name:'规划管控',
              type:'bar',
              xAxisIndex:2,
              itemStyle: {
                normal: {
                  color:'#87CEFA',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    },
                    /*formatter(p){
                     console.log("这个P是什么: ", p);
                     return p.value > 0 ? (p.value +'') : '';
                     }*/
                  }
                }
              },
              data:[31,32,33]
            },

            {
              name:'在建已落实海绵',
              type:'bar',
              itemStyle: {
                normal: {
                  color:'#1E90FF',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[15,16,17]
            },
            {
              name:'在建已落实海绵',
              type:'bar',
              itemStyle: {
                normal: {
                  color:'#1E90FF',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[9,10,11]
            },
            {
              name:'在建已落实海绵',
              type:'bar',
              itemStyle: {
                normal: {
                  color:'#1E90FF',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },
              data:[15,16,17]
            },

            {
              name:'现状已落实海绵',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {
                normal: {
                  color:'#1874CD',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545",
                      fontWeight: 'bolder'
                    }
                  }
                }
              },
              data:[5,6,7]
            },
            {
              name:'现状已落实海绵',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {
                normal: {
                  color:'#1874CD',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545",
                      fontWeight: 'bolder'
                    }
                  }
                }
              },
              data:[5,6,7]
            },
            {
              name:'现状已落实海绵',
              type:'bar',
              xAxisIndex:1,
              itemStyle: {
                normal: {
                  color:'#1874CD',
                  label:{
                    show:true,
                    position: ['40%' , 5 ],
                    textStyle: {
                      color: "#454545",
                      fontWeight: 'bolder'
                    }
                  }
                }
              },
              data:[5,6,7]
            }

          ]
        };
        completeDegree.setOption(self.completeDegree);
      },
      /**
       * 使用echarts统计图:绘制面积覆盖度柱状图
       */
      drawLine(){
        const self = this;
        var nameData = TestData.tongName;
        var DataTest = [];   // 获取列表
        _.each(nameData , function (Test) {
          DataTest.push(Test.name)
        });
        var wancheng = [];  //完成的个数
        var meiyou = [];    //未完成的个数
        _.each(nameData , function (TestData) {
          var sum = 0;
          var ed = 0;
          _.each(TestData.mingcheng , function (Dongdong) {
            if(Dongdong.state === "已完成") {
              sum++
            } else {
              ed++
            }
          })
          wancheng.push(sum)
          meiyou.push(ed)
        });
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
            data: DataTest
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '已完成',
              type: 'bar',
              barWidth : 10,
              data: wancheng
            },
            {
              name: '未完成',
              type: 'bar',
              barWidth : 10,
              data: meiyou
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
            data: DataTest
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
            data: DataTest
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
      },
      /**
       * 使用echarts统计图:绘制面积覆盖度饼图
       */
      drawPie() {
        const self = this;
        var nameData = TestData.tongName;
        var x = 0;   //区间一
        var y = 0;   //区间二
        var z = 0;   //区间三
        var k = 0;   //区间四
        _.each(nameData , function (TestData) {
          _.each(TestData.mingcheng, function (Dongdong) {
            if ( 50 > parseInt(Dongdong.percentage) && parseInt(Dongdong.percentage) >= 0 ) {
              x++
            }
            if ( 50 < parseInt(Dongdong.percentage) && parseInt(Dongdong.percentage) < 80 ) {
              y++
            }
            if (80 < parseInt(Dongdong.percentage) && parseInt(Dongdong.percentage) < 100) {
              z++
            }
            if ( parseInt(Dongdong.percentage) == 100 ) {
              k++
            }
          });
        });
        var optionPie = self.$echarts.init(document.getElementById("optionPie"));  //获取标签ID
        self.optionPie = {
          title : {             // 标题
            text: '项目数量完成度',
            x:'center'
          },
          toolbox: {           // 插件
            show : true,
            feature : {
              mark : {show: true},
              saveAsImage : {show: true}
            }
          },
          tooltip : {
            trigger: 'item',
            formatter:  " 区间在 {b} <br> 完成 {c} 项"
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
              center : ['40%', 200],
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
              color: ['#DAA520','#71C671','#BA55D3','#708090'],
              data:[
                {value:x, name:'小于50%'},
                {value:y, name:'50% 到 80%'},
                {value:z, name:'80% 到 99%'},
                {value:k, name:'100%'}
              ]
            }
          ]
        };
        optionPie.setOption(self.optionPie);
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
         return [, ];
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
         center : [, 200],
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
      },
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
