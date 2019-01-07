<template>
  <div style="width:100%;height:800px;overflow:auto;padding-top:30px">
    <div id="networkFigure" :style="{width: '1000px', height: '400px'}" ></div>
    <div style="width:100%" class="networkBottom">
      <div id="networkLeftFigure" :style="{width: '50%', height: '400px'}" ></div>
      <div id="networkRightFigure" :style="{width: '50%', height: '400px'}" ></div>
    </div>
    <div style="height:1000px;width: 100%"></div>
  </div>
</template>



<script>
  import commonApi from '@/api/commonApi'
  import request from '@/utils/request'
  import _ from 'lodash'
  import { isConduitInRange } from '@/utils/mapUtil'
  import '@/utils/GeoUtils.js'
  export default {
    name: 'network',
    data(){
      return {
        shapes: [],  // 获取全部数据
        SSPSFQData:[],
        sewageTube: [],  // 污水管
        rainTube: [],    // 雨水管
        sewageLength: [], // 污水管长
        rainLength: [],   // 雨水管长
        SSPSFQ1: [], // 1#排水分区
        SSPSFQ2: [], // 2#排水分区
        SSPSFQ3: [], // 3#排水分区
        SSPSFQ4: [], // 4#排水分区
        SSPSFQ5: [], // 5#排水分区
        SSPSFQ6: [], // 6#排水分区
        SSPSFQ7: [], // 7#排水分区
        SSPSFQ19: [], // 19#排水分区
      }
    },
    mounted() {
      this.init();
      // this.beforeLoading();
    },
    methods: {
      /*** 获取数据到 spapes ***/
      init(){
        const _this = this
        _this.shapes = []
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: '3'
                }
              }
            }
          }
        }).then((res) => {
          _this.shapes = JSON.parse(JSON.stringify(res.data))
          _.each(_this.shapes, function(item) { item.properties = JSON.parse(item.properties) })
          _this.middleMethod()
        })
      },
      /**** 处理数据 ****/
      middleMethod(){
        const _this = this;
        _this.rainTube = [];
        _this.sewageTube = [];
        var shapeData = _this.shapes;
        var WPReg = /WP/g
        var YPReg = /YP/g

        // var demo1 = [];
        // var demo2 = [];
        // _.each(shapeData, function (lay) {
        //   if(lay.category === 'CONDUITS') {
        //     if(lay.properties.properties.leixing === '雨水管') {
        //       demo1.push(lay.properties.properties)
        //     }
        //     if(lay.properties.properties.leixing === '污水管') {
        //       demo2.push(lay.properties.properties)
        //     }
        //   }
        // })
        // var index = 0;
        _.each(shapeData,function (lay,index) {
          if(lay.category === 'RANGE') {
            debugger
            _this.SSPSFQData.push(lay.name);
          }
         /* if( lay.properties.properties.SSPSFQ === '1#排水分区' ) {
            if(lay.properties.properties.YP !== undefined ) {
              var YPValue = lay.properties.properties.YP.substr(0,2);
              if( YPValue === 'YP' ) {
                // console.log("YP",1)
                // _this.rainTube.push(index+=1);
              }
            }else if( lay.properties.properties.WP !== undefined) {
              var WPValue = lay.properties.properties.WP.substr(0,2);
              if(WPValue === 'WP') {
                console.log("WP", index);
                // _this.sewageTube.push(index+=1);
              }
            }
            _this.SSPSFQ1.push(lay.properties.properties);
          }*/
          // if( lay.properties.properties.SSPSFQ === '2#排水分区' ) {
          //   _this.SSPSFQ2.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '3#排水分区' ) {
          //   _this.SSPSFQ3.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '4#排水分区' ) {
          //   _this.SSPSFQ4.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '5#排水分区' ) {
          //   _this.SSPSFQ5.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '6#排水分区' ) {
          //   _this.SSPSFQ6.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '7#排水分区' ) {
          //   _this.SSPSFQ7.push(lay.properties.properties);
          // }
          // if( lay.properties.properties.SSPSFQ === '19#排水分区' ) {
          //   _this.SSPSFQ19.push(lay.properties.properties);
          // }
        })
        // const conduits = isConduitInRange(shapeData, self.cy, ConduitsType)
        _.each(_this.SSPSFQData,function (item) {
          _.each(shapeData,function (lay,index) {
            if(lay.category === 'CONDUITS') {
              console.log("数据",lay.properties.properties)
              if(item === lay.properties.properties.SSPSFQ) {
                debugger
              }
            }

          })
        })


        // _.each(_this.SSPSFQ1, function (item) {
        //   _.each(demo2,function (lay) {
        //     if( item.WP === lay.name) {
        //     }
        //   })
        // })
        //
        // _.each(demo1,function (item) {
        // })
        // _.each(shapeData, function (lay) {
        //   if(lay.properties.properties.SSPSFQ === '1#排水分区'res.data[]) {
        //     debugger
        //     if( lay.properties.properties.name === lay.properties.properties.WP ) {
        //     }
        //   }
        // })


        _this.beforeLoading();
      },
      /**** 数据展示 ******/
      beforeLoading(){
        var data = this.rainTube;
        // debugger
        const _this = this;
        /******* 管网统计分析 *********/
        var networkData = _this.$echarts.init(document.getElementById("networkFigure"));  //获取标签ID
        networkData.setOption({
          /*** 表头显示的数据 ***/
          title : {
            text: '管网统计分析',
            x: 'center'
          },
          /*** 盒子工具 ***/
          toolbox: {
            show : true,   // 是否启用工具
            right:20,   // 位置
            feature: {
              mark : { show: true },
              saveAsImage: { show: true }  // 下载图片
            }
          },
          /*** 提示框组件 ***/
          tooltip : {
            show:true,
            trigger: 'axis', // 坐标轴触发
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'   // 默认为直线，可选为：'line' | 'shadow'
            }
            // formatter(params){ return params }
          },
          /*** 图例组件 ***/
          legend: {
            type: 'plain',
            orient: 'horizontal',
            top:25 ,
            data:[ '污水管', '雨水管' ]
          },
          xAxis : [
            { type : 'value' }
          ],
          yAxis : [
            {
              type : 'category',
              data : this.SSPSFQData
            }
          ],
          series : [
            {
              name:'污水管',
              type:'bar',
              data: [183, 239, 170, 131, 744, 630, 230, 134]
            },
            {
              name:'雨水管',
              type:'bar',
              data:[125, 238, 310, 134, 141, 681, 807, 170]
            }
          ]
        });
        /******* 管网统计分析左下 *********/
        var networkLeftData = _this.$echarts.init(document.getElementById("networkLeftFigure"));  //获取标签ID
        networkLeftData.setOption({
          /*** 表头显示的数据 ***/
          title : {
            text: '污水管',
            x: 'center'
          },
          /*** 盒子工具 ***/
          toolbox: {
            show : true,   // 是否启用工具
            right:20,   // 位置
            feature : {
              saveAsImage : {show: true}    // 下载图片
            }
          },
          /*** 提示框组件 ***/
          tooltip : {
            show:true,
            trigger: 'axis', // 坐标轴触发
            axisPointer: {     // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'   // 默认为直线，可选为：'line' | 'shadow'
            },
            // formatter(params){ return params }
          },
          /*** 图例组件 ***/
          legend: {
            type: 'plain',
            orient: 'horizontal',
            top:25 ,
            data:['600', '800','1000','1200','1400']
          },
          xAxis : [
            {
              type : 'value',
            }
          ],
          yAxis : [
            {
              type : 'category',
              data :  this.SSPSFQData
            }
          ],
          series : [
            {
              name:'600',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[320, 302, 301, 334, 390, 330, 320]
            },
            {
              name:'800',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'1000',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'1200',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[150, 212, 201, 154, 190, 330, 410]
            },
            {
              name:'1400',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[820, 832, 901, 934, 1290, 1330, 1320]
            }
          ]
        });
        /******* 管网统计分析右下 *********/
        var networkRightData = _this.$echarts.init(document.getElementById("networkRightFigure"));  //获取标签ID
        networkRightData.setOption({
          /*** 表头显示的数据 ***/
          title : {
            text: '雨水管',
            x: 'center'
          },
          /*** 盒子工具 ***/
          toolbox: {
            show : true,   // 是否启用工具
            right:20,   // 位置
            feature : {
              saveAsImage : {show: true}    // 下载图片
            }
          },
          /*** 提示框组件 ***/
          tooltip : {
            show:true,
            trigger: 'axis', // 坐标轴触发
            axisPointer: {     // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'   // 默认为直线，可选为：'line' | 'shadow'
            }
            // formatter(params){ return params }
          },
          /*** 图例组件 ***/
          legend: {
            type: 'plain',
            orient: 'horizontal',
            top: 25 ,
            data: ['400', '500','600','700','800']
          },
          xAxis : [
            {
              type : 'value',
            }
          ],
          yAxis : [
            {
              type : 'category',
              data : this.SSPSFQData
            }
          ],
          series : [
            {
              name:'400',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[320, 302, 301, 334, 390, 330, 320]
            },
            {
              name:'500',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'600',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'700',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[150, 212, 201, 154, 190, 330, 410]
            },
            {
              name:'800',
              type:'bar',
              stack: '总量',
              itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
              data:[820, 832, 901, 934, 1290, 1330, 1320]
            }
          ]
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #networkFigure{
    margin:auto;
  }
  .networkBottom{
    padding-top:30px;
    #networkLeftFigure{
      float: left;
    }
    #networkRightFigure{
      float: right;
    }
  }
</style>
