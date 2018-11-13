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

      <el-tab-pane align="center" label="海绵面积覆盖度" name="0">
        <div style="margin-top:2px; padding-top:5px;">
          <div id="completeDegree" :style="{width: '1200px', height: '500px'}" ></div>
        </div>
      </el-tab-pane>

      <el-tab-pane align="center" label="年径流总量控制率" name="1">

        <!--横向状柱形图-->
        <div style="width:460px; height:350px; margin-top:2px; padding-top:5px; float:left;">
          <div id="totalControlLeft" :style="{width: '460px', height: '350px'}" ></div>
        </div>

        <!--纵向柱形图-->
        <div style="width:760px; margin-top:20px; padding:17px;  float:right;">
          <div id="totalControlRight" :style="{width: '760px', height: '350px'}"></div>
        </div>

      </el-tab-pane>

      <el-tab-pane align="center" label="项目数量完成度" name="2">

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
        optionBar1: {},     // echarts:项目数量完成度柱状图
        optionBar2: {},     // echarts:项目数量完成度柱状图
        optionBar3: {},     // echarts:项目数量完成度柱状图
        optionPie: {},      // echarts:项目数量完成度饼图
        completeDegree: {},    // echarts:项目完成度柱状图
        totalControlLeft: {},  // echarts:年径流总量控制率
        totalControlRight: {}, // echarts:年径流总量控制率
        drainagePartition: [],    // 排水分区下面#的数据
        areaData: [],
      }
    },
    created() {
      this.init();
    },
    mounted() {
      this.TestData();
    },
    methods: {
      TestData() {
        const self = this;
        request('shapes', {
          params: {
            pageSize: 1000000,
            filters: {
              'shape': {
                'category': {
                  equalTo: "SUBCATCHMENTS"
                },
                'projectId': {
                  equalTo: '3'
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
        var numList = [];
        var ZMJ = [];           // 总面积
        var XZYLSList = [];     // 现状已落实面积
        var XZWHMList = [];     // 现状无海绵面积
        var ZJYLSList = [];     // 在建已落实面积
        var ZJWUMList = [];     // 在建无海绵面积
        var GHGKList  = [];     // 规划管控面积

        var demo = {};
        var aaa = _.uniq(demo);
        var bbb = [];

        //console.log("Product=3: ", res.data);
        _.each(res.data, function (vn,index) {
          var TestData = JSON.parse(vn.properties);   // 将字符串解析为对象
          var SSPSFQ = TestData.properties.SSPSFQ;    // 获取分区数据
          demo.SSPSFQ = SSPSFQ;
          var removeChines = SSPSFQ.replace(/[\u4e00-\u9fa5]/g, '');
          var number = removeChines.replace(/#/g, '')
          numList.push(number);

          /*console.log("数据列表: ",TestData.properties);
          console.log("位置: ",index);
          console.log("demo: ",demo);*/

          console.log(aaa)
          if( SSPSFQ === aaa.SSPSFQ ) {
            console.log("相同")
          }
          var areaAll = Math.abs(TestData.properties.area);     // 获取所有面积
          ZMJ.push(areaAll);
          if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
            var XZYLSarea = Math.abs(TestData.properties.area);     // 获取现状已落实面积
            XZYLSList.push(XZYLSarea)
          }
          if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
            var XZWHMarea = Math.abs(TestData.properties.area);     // 获取现状无海绵面积
            XZWHMList.push(XZWHMarea)
          }
          if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
            var ZJYLSarea = Math.abs(TestData.properties.area);     // 获取在建已落实面积
            ZJYLSList.push(ZJYLSarea);
          }
          if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
            var ZJWUMarea = Math.abs(TestData.properties.area);     // 获取在建无海绵面积
            ZJWUMList.push(ZJWUMarea);
          }
          if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
            var GHGKarea  = Math.abs(TestData.properties.area);     // 获取规划管控面积
            GHGKList.push(GHGKarea)
          }

          /*switch ( TestData.properties ) {
            case demo.SSPSFQ:

            break
          }*/

          /*if(number == 1 ) {
            var areaAll = Math.abs(TestData.properties.area);     // 获取所有面积
            ZMJ.push(areaAll);
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              var XZYLSarea = Math.abs(TestData.properties.area);     // 获取现状已落实面积
              XZYLSList.push(XZYLSarea)
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              var XZWHMarea = Math.abs(TestData.properties.area);     // 获取现状无海绵面积
              XZWHMList.push(XZWHMarea)
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              var ZJYLSarea = Math.abs(TestData.properties.area);     // 获取在建已落实面积
              ZJYLSList.push(ZJYLSarea);
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              var ZJWUMarea = Math.abs(TestData.properties.area);     // 获取在建无海绵面积
              ZJWUMList.push(ZJWUMarea);
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              var GHGKarea  = Math.abs(TestData.properties.area);     // 获取规划管控面积
              GHGKList.push(GHGKarea)
            }
          }*/

          /*if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
            console.log(TestData.properties)
          }
          if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
            console.log(TestData.properties)
          }*/
          /*if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
            RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            RoadTest.ZLKZL = "";
          }
          if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
            RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
            RoadTest.ZLKZL = "";
          }*/
          /*var letter = ( TestData.properties.YDLX ).substr(0, 1);    // 截取字符首字母
          var threeTest = ( TestData.properties.YDLX ).substr(0, 3);    // 截取字符首字母
          /!**
           * 道路广场
           *!/
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
            /!**
             * 判断海绵建设情况
             *!/
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
          /!**
           * 建筑小区
           *!/
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
            /!**
             * 判断海绵建设情况
             *!/
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
          /!**
           * 公园绿地
           *!/
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
            /!**
             * 判断海绵建设情况
             *!/
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
          //demo.push(TestData.properties);*/
        });
        
        _.each(res.data, function (mn) {
          
        })
        
        
        
        
        
        
        var sortList = _.uniq(numList);
        function sortNumber(a,b) {
          return a - b
        }
        self.drainagePartition = (sortList.sort(sortNumber));
        //console.log("分区: ", self.drainagePartition);
        /**
         * 项目海绵面积覆盖度
         */
        self.drawComplete();
        /*console.log("道路广场: ", self.roadSquare);
        console.log("建筑小区: ", self.buildSquare);
        console.log("公园绿地: ", self.parkSquare);
        console.log("获取数据", demo);*/

        var demo = {};
        demo.abc = sortList;
        console.log(demo);
        for(var i=0; i<sortList.length; i++ ){

        }

        var totalArea = eval(ZMJ.join("+"));   //总面积
        var totaXZYLS = eval(XZYLSList.join("+")); //现状已落实面积
        var totaXZWHM = eval(XZWHMList.join("+")); //现状无海绵面积
        var totaXJYLS = eval(ZJYLSList.join("+")); //在建已落实面积
        var totaZJWHM = eval(ZJWUMList.join("+")); //在建无海绵面积
        var totaGHGK  = eval(GHGKList.join("+"));  //规划管控面积
        console.log("总面积: ", totalArea)
        console.log("现状已落实面积: ", totaXZYLS);
        console.log("现状无海绵面积: ", totaXZWHM);
        console.log("在建已落实面积: ", totaXJYLS);
        console.log("在建无海绵面积: ", totaZJWHM);
        console.log("规划管控面积:   ", totaGHGK);

        console.log("在建已落实面积百分比", totaXJYLS/totalArea * 100)

      },
      /**
       * 使用echarts统计图:项目进度表
       */
      init() {
        const self = this;
        setTimeout(function () {
          /**
           * 年径流总量控制率
           */
          self.drawControl();
          /**
           * 项目数量完成度
           */
          //self.drawComplete();
          /**
           * 项目海绵面积覆盖度
           */
          self.drawLine();
          self.drawPie();
          console.log("数据获取成功");
        }, 10);
      },


      /**
       * 使用echarts统计图:项目海绵面积覆盖度
       */
      drawComplete(){
        const self = this;
        var completeDegree = self.$echarts.init(document.getElementById("completeDegree"));  //获取标签ID
        var baga = [];
        //console.log("数据: ", baga);
        _.each(self.drainagePartition, function (vm) {
          var num = vm+"#" ;
          baga.push(num);
        });
        self.completeDegree =  {
          title : {
            text: '海绵面积覆盖度',
            x: 'left'
          },
          grid: {y: 70, y2:30, x2:20},   // 大标题的位置
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
            show:false,
            trigger: 'axis',
            axisPointer: {     // 坐标轴指示器，坐标轴触发有效
              type: 'line'   // 默认为直线，可选为：'line' | 'shadow'
            },
            /*formatter: '{a}<br> {c} <br/> {b} ',*/
            /*formatter(params){
              console.log("11111111",params);
              return params[0].name + '<br/>'
                + params[0].seriesName + ' : ' + params[0].value + '<br/>'
                + params[1].seriesName + ' : ' + (params[1].value + params[0].value);
            },*/

          },
          legend: {
            /*orient: 'horizontal',
             right: 'center',*/
            selectedMode:false,
            data: ['现状无海绵', '在建无海绵','规划管控','在建已落实海绵', '现状已落实海绵']
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : baga
            },
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
              name:'现状无海绵',
              type:'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#C2C2C2',
                  barBorderColor: '#C2C2C2',
                  barBorderWidth: 7,
                  barBorderRadius:3,
                  label : {
                    show:false,
                    position: 'top',
                    formatter: '{a}',
                    textStyle: {
                      color: '#000'
                    },
                  }
                }
              },
              /*barGap: '90%',
              barMaxWidth:50,//最大宽度
              xAxisIndex:4,
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color:'#C2C2C2',
                  label:{
                    show:false,   // 柱状中的文字
                    labelLine :{show:true},
                    position: ['48%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },*/
              data:[10,10,10]
            },

            {
              name:'在建无海绵',
              type:'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#7A7A7A',
                  barBorderColor: '#7A7A7A',
                  barBorderWidth: 6,
                  barBorderRadius:3,
                  label : {
                    show:false,
                    position: 'top',
                    formatter: '{a}',
                    textStyle: {
                      color: '#000'
                    }
                  }
                }
              },
              /*barMaxWidth:50,//最大宽度
              barGap: '90%',
              xAxisIndex:3,
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color:'#7A7A7A',
                  label:{
                    show:false,   // 柱状中的文字
                    position: ['48%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },*/
              data:[20,30,20]
            },

            {
              name:'规划管控',
              type:'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#87CEFA',
                  barBorderColor: '#87CEFA',
                  barBorderWidth: 6,
                  barBorderRadius:3,
                  label : {
                    show:false,
                    position: 'top',
                    formatter: '{a} ',
                    textStyle: {
                      color: '#000'
                    }
                  }
                }
              },
              /*barMaxWidth:50,//最大宽度
              xAxisIndex:2,
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color:'#87CEFA',
                  label:{
                    show:false,   // 柱状中的文字
                    position: ['48%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                    /!*formatter(p){
                     console.log("这个P是什么: ", p);
                     return p.value > 0 ? (p.value +'') : '';
                     }*!/
                  }
                }
              },*/
              data:[30,20,20]
            },

            {
              name:'在建已落实海绵',
              type:'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#1E90FF',
                  barBorderColor: '#1E90FF',
                  barBorderWidth: 6,
                  barBorderRadius:3,
                  label : {
                    show:false,
                    position: 'top',
                    formatter: '{a}',
                    textStyle: {
                      color: '#000'
                    }
                  }
                }
              },
              /*barMaxWidth:50,//最大宽度
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color:'#1E90FF',
                  label:{
                    show:false,   // 柱状中的文字
                    position: ['48%' , 5 ],
                    textStyle: {
                      color: "#454545"
                    }
                  }
                }
              },*/
              data:[25,15,20]
            },

            {
              name:'现状已落实海绵',
              type:'bar',
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#1874CD',
                  barBorderColor: '#1874CD',
                  barBorderWidth: 6,
                  barBorderRadius:3,
                  label : {
                    show:false,
                    position: 'top',
                    formatter: '{a}',
                    textStyle: {
                      color: '#000'
                    }
                  }
                }
              },
              /*barMaxWidth:50,//最大宽度
              xAxisIndex:1,
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color:'#1874CD',
                  label:{
                    show:false,   // 柱状中的文字
                    position: ['48%' , 5 ],
                    textStyle: {
                      color: "#454545",
                      fontWeight: 'bolder'
                    }
                  }
                }
              },*/
              data:[15,25,30]
            }

          ]
        };
        completeDegree.setOption(self.completeDegree);
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
      },

      /**
       * 使用echarts统计图:年径流总量控制率
       */
      drawControl(){
        const self = this;
        /**
         * 纵向柱形图
         */
        var colorList = ['#4876FF','#0000CD',];
        var totalControlLeft = self.$echarts.init(document.getElementById("totalControlLeft"));  //获取标签ID
        self.totalControlLeft = {
          title: {
            text: '年径流总量控制率',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            /*formatter: '{b} <br> {c} % <br/> {a}',*/
            formatter: '{b} <br> {c} % <br/>',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show : true,
            right:20,
            iconStyle:{
              normal:{
                textPosition:'left'
              },
              emphasis:{
                textPosition:'bottom'
              }
            },
            feature : {
              /*mark : {show: true},
               dataView : {show: true, readOnly: false},
              restore : {show: true},
              magicType : {show: true, type: ['line']},*/
              saveAsImage : {show: true}
            }
          },
          legend: {
            data: ['目标', '实际']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type : 'value',
            max : 100 ,
            axisLabel:{
              formatter:'{value} %'
            }
          },
          yAxis: {
            type: 'category',
            max: 2,
            data: ['目标','实际']
          },
          series: [
            {
              type: 'bar',
              barWidth: '50',
              barCategoryGap: 2,
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5],
                  color(params) {
                    if (params.dataIndex < 0) {
                      // for legend
                      return
                      colorList[colorList.length - 1]
                    }
                    else {
                      // for bar
                      return  colorList[params.dataIndex]
                    }

                  }
                }
              },
              data: [70, 56]
            }
          ]
        };
        totalControlLeft.setOption(self.totalControlLeft);

        /**
         * 横向柱形图
         */
        var totalControlRight = self.$echarts.init(document.getElementById("totalControlRight"));  //获取标签ID
        self.totalControlRight = {
          color:['#0000CD','#EE7600'],
          title : {
            text: '排水分区年径流总量控制率',
            x: 'center'
          },
          tooltip : {
            /*formatter: '{b} <br> {c} % ',*/
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            left:'left',
            data:['实际','目标']
          },
          toolbox: {
            show : true,
            right:20,
            iconStyle:{
              normal:{
                textPosition:'left'
              },
              emphasis:{
                textPosition:'bottom'
              }
            },
            feature : {
              /*mark : {show: true},
              dataView : {show: true, readOnly: false},*/
              restore : {show: true},
              magicType : {show: true, type: ['line']},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : ['1#','2#','3#','4#','5#','6#','7#']
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
              name:'实际',
              type:'bar',
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5]
                }
              },
              data:[20, 49, 50, 23.2, 25.6, 54.7, 35.6]
              /*markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }*/
            },
            {
              name:'目标',
              type:'bar',
              itemStyle: {
                normal: {
                  barBorderRadius:[5, 5, 5, 5]
                }
              },
              data:[70, 70, 70, 70, 70, 70, 70]
              /*markPoint : {
                data : [
                  {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                  {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name : '平均值'}
                ]
              }*/
            }
          ]
        };
        totalControlRight.setOption(self.totalControlRight);
      },
















      /**
       * 使用echarts统计图:项目数量完成度柱状图
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
       * 使用echarts统计图:项目数量完成度饼图
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
              center : ['48%', 200],
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
