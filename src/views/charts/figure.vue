<template>
  <div style="padding:20px 0px 0px 20px;">
    <!--表头部分-->
    <el-form :inline="true" class="demo-form-inline" style="padding-left:10px;">
      <el-form-item label="项目名称" prop="creatorId">
        <el-select v-model="project.creatorId" placeholder="请选择" style="padding-left:10px;">
          <el-option v-for="project in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="点类型" prop="type">
        <el-select v-model="project.geometry_type"  placeholder="请选择点类型" style="padding-left:10px;">
          <el-option label="排口" value="Point1"></el-option>
          <el-option label="工业企业" value="Point2" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编号">
        <el-input v-model="formInline.user" placeholder="请输入要查询的编号" style="padding-left:10px;"></el-input>
      </el-form-item>-->

      <el-form-item>
        <el-button type="primary" @click="handleSelect">查询</el-button>
      </el-form-item>

      <!--<el-form-item>
        <el-button type="primary" >添加</el-button>
      </el-form-item>-->

      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>
    <!--标签页-->
    <el-tabs class="listChart"
             tab-position="top"
             v-model="activeNo">
      <el-tab-pane align="center" label="海绵面积覆盖度" name="0">
        <div style="margin-top:2px; padding-top:5px;">
          <div id="completeDegree" :style="{width: '1200px', height: '500px'}" ></div>
        </div>
      </el-tab-pane>
      <el-tab-pane align="center" label="年径流总量控制率" name="1">

        <!--横向状柱形图-->
        <div style="margin-top:2px; padding-top:5px;">
          <div id="totalControlLeft" :style="{width: '1200px', height: '350px'}" ></div>
        </div>

        <!--纵向柱形图-->
        <div style="margin-top:20px; padding:17px;">
          <div id="totalControlRight" :style="{width: '1200px', height: '350px'}"></div>
        </div>

      </el-tab-pane>
      <el-tab-pane align="center" label="海绵项目库数量完成度" name="2">
        <!--饼图-->
        <div style="width:500px; height:450px;  margin-top:2px; padding-top:5px;  float:left;">
          <div id="optionPie" :style="{width: '500px', height: '500px'}" ></div>
        </div>
        <!--柱形图-->
        <!--<div style="width:57%; margin-top:20px; padding:17px;  float:right;">
          <div id="optionBar1" :style="{width: '700px', height: '300px'}"></div>
          <div id="optionBar2" :style="{width: '700px', height: '300px'}"></div>
          <div id="optionBar3" :style="{width: '700px', height: '300px'}"></div>
        </div>-->
        <div v-for="(item, index) in partList" :key="index" style="width:700px; margin-top:20px; padding:17px;  float:right;">
          <!--<div id="optionBar1" :style="{width: '700px', height: '300px'}"></div>-->
          <div :id='datalis + index' :style="{width: '700px', height: '300px'}"></div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
  import axios from 'axios'
  import request from '@/utils/request'
  import commonApi from '@/api/commonApi'
  import _ from 'lodash'
  import TestData from '@/assets/json/ceshi.json'
  export default {
    name: 'figure',
    data(){
      return {
        dataTotol: ['建筑小区','道路广场','公园绿地','河道治理','涉水基础设施','PPP项目'],
        datalis: 'list',
        /**
         * 表头数据
         */
        projects:[],
        project: {
          creatorId: '',
          geometry_type:''
        },
        formInline:{
          user:'',
          region:''
        },
        projectId: '',
        pageNo : 1,
        pageSize: 10,//每页的数据条数
        /**
         * 统计图数据
         */
        activeNo: 0,        // echarts图标签页
        optionBar1: {},     // echarts:项目数量完成度柱状图
        optionBar2: {},     // echarts:项目数量完成度柱状图
        optionBar3: {},     // echarts:项目数量完成度柱状图
        optionPieDraw: {},      // echarts:项目数量完成度饼图
        completeDegree: {},     // echarts:项目完成度柱状图
        DataShow:[],       // 初始数据展示
        /**
         * 海绵面积覆盖度
         */
        partition: [], // 整个分区排序
        partList: '',  // 分区排序数字排序
        xwList: [],    // 现状无海绵面积百分比
        xyList: [],    // 现状有海绵面积百分比
        zyList: [],    // 在建无海绵面积百分比
        zwList: [],    // 在建有海绵面积百分比
        ghList: [],    // 规划管控面积百分比
        /**
         * 项目数量完成度
         */
        list: 'list',  // 完成度中分区ID
        completeList: [],

      }
    },
    created() {
      this.init();
    },
    mounted() {
      this.TestData();
      this.getProjectsInfo();
    },
    methods: {
      /**
       *  表头数据
       */
      getProjectsInfo(){
        axios('/api/projects').then(this.getProjectSuccess);
      },
      getProjectSuccess(res){
        const self = this;
        self.projects = res.data;
        //console.log("表头列表: ", res.data)
      },
      // 查询事件
      handleSelect(){
        var self = this;
        var selectObject = {
          project_id: self.project.creatorId,
          geometry_type : self.project.geometry_type
        };
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
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp =>{
          self.tableData = resp.data;
        self.totall = Number(resp.headers.total);
      })
      },
      /**
       * 使用echarts统计图:项目进度表
       */
      init() {
        const self = this;
        setTimeout(function () {
          /**
           * 项目数量完成度
           */
          /*self.drawLine();*/
          self.drawPie();
          console.log("======数据获取成功======");
        }, 10);
      },
      /**
      * 统计图数据
      */
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
        }).then(res => {
          var demofen = [];
          _.each(res.data, function (mn, index) {
            var TestData = JSON.parse(mn.properties);   // 将字符串解析为对象
            var SSPSFQ = TestData.properties.SSPSFQ;
            var removeChines = SSPSFQ.replace(/[\u4e00-\u9fa5]/g, '');
            var number = removeChines.replace(/#/g, '')
            demofen.push(number);   // 获取分区数据;
            self.DataShow.push(TestData);
          })
          var demoList = _.uniq(demofen);   // 分区去重
          function sortNumber(a,b) {
            return a - b
          }
          self.partList = (demoList.sort(sortNumber)); // 排序
          this.TestList(res);
        })
      },
      TestList(res){
        const self = this;
        var baga = [];     // 排水分区列表
        _.each(self.partList, function (vm) {
          var num = vm+"#排水分区" ;
          baga.push(num);
          self.partition.push(num);
        });
        for(var i=0; i<baga.length; i++ ) {
          var XZYLSList = [];     // 现状已落实面积
          var XZWHMList = [];     // 现状无海绵面积
          var ZJYLSList = [];     // 在建已落实面积
          var ZJWUMList = [];     // 在建无海绵面积
          var GHGKList  = [];     // 规划管控面积
          _.each(res.data, function (vn) {
            var TestData = JSON.parse(vn.properties);   // 将字符串解析为对象
            if ( baga[i] == TestData.properties.SSPSFQ) {
              //ZMJ.push(TestData.properties.area);     // 获取所有面积
              if (TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵") {
                var XZYLSarea = TestData.properties.area;     // 获取现状已落实面积
                XZYLSList.push(Number(Math.abs(XZYLSarea)))
              } else
              if (TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵") {
                var XZWHMarea = TestData.properties.area;     // 获取现状无海绵面积
                XZWHMList.push(Number(Math.abs(XZWHMarea)))
              } else
              if (TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵") {
                var ZJYLSarea = TestData.properties.area;     // 获取在建已落实面积
                ZJYLSList.push(Number(Math.abs(ZJYLSarea)));
              } else
              if (TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵") {
                var ZJWUMarea = TestData.properties.area;     // 获取在建无海绵面积
                //ZJWUMarea == null ? ZJWUMarea == 0 : ZJWUMarea ;
                ZJWUMList.push(Number(Math.abs(ZJWUMarea)));
              } else
              if (TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null) {
                var GHGKarea = TestData.properties.area;     // 获取规划管控面积
                GHGKList.push(Number(Math.abs(GHGKarea)));
              }
            }
          });
          var totaXZYLS = eval(XZYLSList.join("+"));   // 现状已落实面积
          var totaXZWHM = eval(XZWHMList.join("+"));   // 现状无海绵面积
          var totaXJYLS = eval(ZJYLSList.join("+"));   // 在建已落实面积
          var totaZJWHM = eval(ZJWUMList.join("+"));   // 在建无海绵面积
          var totaGHGK  = eval(GHGKList.join("+"));    // 规划管控面积
          var numtota1 = '';   // 现状已落实面积
          var numtota2 = '';   // 现状无海绵面积
          var numtota3 = '';   // 在建已落实面积
          var numtota4 = '';   // 在建无海绵面积
          var numtota5 = '';   // 规划管控面积
          /**
           * 判断是否有数据
           */
          totaXZYLS == undefined ? numtota1 = 0 : numtota1 = totaXZYLS;
          totaXZWHM == undefined ? numtota2 = 0 : numtota2 = totaXZWHM;
          totaXJYLS == undefined ? numtota3 = 0 : numtota3 = totaXJYLS;
          totaZJWHM == undefined ? numtota4 = 0 : numtota4 = totaZJWHM;
          totaGHGK  == undefined ? numtota5 = 0 : numtota5 = totaGHGK;
          var sum = numtota1 + numtota2 + numtota3 + numtota4 + numtota5;    // 总和
          /**
           * 求出各项百分比
           */
          self.xwList.push((numtota2/sum * 100).toFixed(2));
          self.xyList.push((numtota1/sum * 100).toFixed(2));
          self.zyList.push((numtota3/sum * 100).toFixed(2));
          self.zwList.push((numtota4/sum * 100).toFixed(2));
          self.ghList.push((numtota5/sum * 100).toFixed(2));
        }
        /**
         * 项目海绵面积覆盖度
         */
        self.drawComplete();
        /**
         * 年径流总量控制率
         */
        self.drawControl();
        setTimeout(function () {
          self.drawLine(res);
        },10)
      },

      /**
       * 使用echarts统计图:项目海绵面积覆盖度
       */
      drawComplete(){
        const self = this;
        var completeDegree = self.$echarts.init(document.getElementById("completeDegree"));  //获取标签ID
        var baga = [];
        _.each(self.partList, function (vm) {
          var num = vm+"#排水分区" ;
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
            right:20,
            feature : {
              mark : {show: true},
              /*dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line']},  // 视图类型
              restore : {show: true},       // 还原*/
              saveAsImage : {show: true}    // 下载图片
            }
          },
          tooltip : {
            show:true,
            trigger: 'axis',
            axisPointer: {     // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'   // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params){
              return params[0].name + '<br/>'
                + '<span style="display:inline-block;width:180px;text-align:left;">'+ '<i style="display:inline-block;padding:5px;border-radius:50%;background:'+ params[4].color + '"></i> ' + params[4].seriesName + ': ' + params[4].value + '%' + '</span>' + '<br/>'
                + '<span style="display:inline-block;width:180px;text-align:left;">'+ '<i style="display:inline-block;padding:5px;border-radius:50%;background:'+ params[3].color + '"></i> ' + params[3].seriesName + ': ' + params[3].value + '%' + '</span>' + '<br/>'
                + '<span style="display:inline-block;width:180px;text-align:left;">'+ '<i style="display:inline-block;padding:5px;border-radius:50%;background:'+ params[2].color + '"></i> ' + params[2].seriesName + ': ' + params[2].value + '%' + '</span>' + '<br/>'
                + '<span style="display:inline-block;width:180px;text-align:left;">'+ '<i style="display:inline-block;padding:5px;border-radius:50%;background:'+ params[1].color + '"></i> ' + params[1].seriesName + ': ' + params[1].value + '%' + '</span>' + '<br/>'
                + '<span style="display:inline-block;width:180px;text-align:left;">'+ '<i style="display:inline-block;padding:5px;border-radius:50%;background:'+ params[0].color + '"></i> ' + params[0].seriesName + ': ' + params[0].value + '%' + '</span>' + '<br/>'
                ;
            },
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
              name:'现状已落实海绵',
              type:'bar',
              barGap: '90%',
              barMaxWidth:50,//最大宽度
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#1874CD',
                  barBorderRadius:2,
                  /*label : {
                    show:true,
                     position: 'top',
                     formatter: '{a}',
                     textStyle: {
                     color: '#000'
                     }
                  }*/
                },
              },
              data: self.xyList
            },

            {
              name:'在建已落实海绵',
              type:'bar',
              barGap: '90%',
              barMaxWidth:50,//最大宽度
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#1E90FF',
                  barBorderRadius:2,
                }
              },
              data: self.zyList
            },

            {
              name:'规划管控',
              type:'bar',
              barGap: '90%',
              barMaxWidth:50,//最大宽度
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#87CEFA',
                  barBorderRadius:2,
                }
              },
              data: self.ghList
            },

            {
              name:'在建无海绵',
              type:'bar',
              barGap: '90%',
              barMaxWidth:50,//最大宽度
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#7A7A7A',
                  barBorderRadius:2,
                }
              },
              data:self.zwList
            },

            {
              name:'现状无海绵',
              type:'bar',
              barGap: '90%',
              barMaxWidth:50,//最大宽度
              stack: 'sum',
              itemStyle: {
                normal: {
                  color: '#C2C2C2',
                  barBorderRadius:2,
                }
              },
              data: self.xwList
            },

          ]
        };
        completeDegree.setOption(self.completeDegree);
      },
      /**
       * 使用echarts统计图:年径流总量控制率
       */
      drawControl(){
        const self = this;
        /**
         * 横向柱形图
         */
        var colorList = ['#4876FF','#0000CD',];
        var totalControlLeft = self.$echarts.init(document.getElementById("totalControlLeft"));  //获取标签ID
        totalControlLeft.setOption({
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
        });

        /**
         * 纵向柱形图
         */
        var controlData = self.DataShow;   // 取得总的数据
        var statusControl = [];  // 现状控制率
        var plannerControl = []; // 规划控制率
        _.each(controlData, function (v) {
          statusControl.push(v.properties.现状控制率)
          plannerControl.push(v.properties.规划控制率)
        })
        var totalControlRight = self.$echarts.init(document.getElementById("totalControlRight"));  //获取标签ID
        totalControlRight.setOption({
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
              mark : {show: true},
              /*dataView : {show: true, readOnly: false},
               restore : {show: true},
               magicType : {show: true, type: ['line']},*/
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : ['1','2','3','4','5','6','7']
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
                  barBorderRadius:[3, 3, 3, 3]
                }
              },
              data:[20, 49, 50, 23.2, 25.6, 54.7, 35.6]
            },
            {
              name:'目标',
              type:'bar',
              itemStyle: {
                normal: {
                  barBorderRadius:[3, 3, 3, 3]
                }
              },
              data:[70, 70, 70, 70, 70, 70, 70]
            }
          ]
        });
      },
      /**
       * 使用echarts统计图:项目数量完成度柱状图
       */
      drawLine(res){
        const self = this;
        var totalData = self.partition;   // 分区总数据
        _.each( totalData, function (vWater, index) {
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
          var title = self.datalis + index;
          (self.$echarts.init(document.getElementById(self.datalis + index))).setOption({
            title: {
              text: vWater
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              selectedMode:false,
              data: ['已完成', '未完成']
            },
            toolbox: {
              show : true,
              right: 20,
              feature : {
                /*magicType : { show: true, type: ['line'] },
                 restore : { show: true },*/
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
                barWidth : 20,
                data: wancheng
              },
              {
                name: '未完成',
                type: 'bar',
                barWidth : 20,
                data: meiyou
              }
            ]
          });
        })
        //var optionBar1 = self.$echarts.init(document.getElementById("optionBar1"));  //获取标签ID
       /* optionBar1.setOption({
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
            selectedMode:false,
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            right: 20,
            feature : {
              /!*magicType : { show: true, type: ['line'] },
               restore : { show: true },*!/
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
              barWidth : 20,
              data: wancheng
            },
            {
              name: '未完成',
              type: 'bar',
              barWidth : 20,
              data: meiyou
            }
          ]
        });*/
        /*var optionBar2 = self.$echarts.init(document.getElementById("optionBar2"));  //获取标签ID
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
            selectedMode:false,
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            right: 20,
            feature : {
              /!*magicType : { show: true, type: ['line'] },
              restore : { show: true },*!/
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
            selectedMode:false,
            data: ['已完成', '未完成']
          },
          toolbox: {
            show : true,
            right: 20,
            feature : {
              /!*magicType : { show: true, type: ['line'] },
              restore : { show: true },*!/
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
        optionBar3.setOption(self.optionBar3);*/
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
        self.optionPieDraw = {
          title : {             // 标题
            text: '海绵项目库数量完成度',
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
            /*formatter:  " 区间在 {b} <br> 完成 {c} 项"*/
          },
          legend: {
            selectedMode:false,
            orient: 'vertical',
            left: 'left',
            data: ['小于50%', '50% 到 80%', '80% 到 99%', '100%']
          },
          series : [
            {
              name: '项目数量完成度',
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
        optionPie.setOption(self.optionPieDraw);
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
    padding: 0px 20px 0px 10px ;
  }

  .app-main {
    overflow: auto !important;
    padding-bottom: 10% !important;
  }

</style>
