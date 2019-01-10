<template>
  <div style="width:100%;height:800px;overflow:auto;padding-top:30px">

    <div id="networkFigure" :style="{width: '1000px', height: '400px'}" ></div>
    <div id="networkLeftFigure" :style="{width: '1000px', height: '400px'}" ></div>
    <div id="networkRightFigure" :style="{width: '1000px', height: '400px'}" ></div>

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
        SSPSFQData:[],  // 所属排水分区
        sewageTube: [],  // 污水管
        rainTube: [],    // 雨水管
        sewageLength: [], // 污水管长
        rainLength: [],   // 雨水管长
        rainScope: ['≤600mm', '800mm','1000mm','1200mm','1400mm', '1600mm', '≥2000mm'],   // 雨水管范围
        sewageScope: [ '400mm', '500mm', '550mm', '600mm', '800mm', '1000mm', '2400mm'],   // 污水管范围
        rainColorData: [ '#D2E9FF', '#C4E1FF', '#ACD6FF','#97CBFF','#84C1FF','#66B3FF','#46A3FF' ], // 雨水管渐变色
        sewageColorData: [ '#FFE4CA','#FFDCB9', '#FFD1A4','#FFC78E','#FFBB77', '#FFAF60','#FFA042' ],  // 污水管渐变色
        sixRain: [],   // ≤600mm的雨水管
        eightRain: [], // =800mm的雨水管
        tenRain: [], // =1000mm的雨水管
        twelveRain: [], // =1200mm的雨水管
        fourteenRain: [], // =1400mm的雨水管
        sixteenRain: [], // =1600mm的雨水管
        twentyRain: [], // ≥2000mm的雨水管
        fourSewage: [], // ≤400mm的污水管
        fiveSewage: [], // 500mm的污水管
        fiveFiveSewage: [], // 550mm的污水管
        sixSewage: [], // 600mm的污水管
        eightSewage: [], // 800mm的污水管
        tenSewage: [], // 1000mm的污水管
        twentyFourSewage: [], // 2400mm的污水管
        rainTowArray: [],   // 雨水的series
        sewageTowArray: [], // 污水的series
      }
    },
    mounted() {
      this.init();
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

        var other = _.fill([4, 6, 8, 10], '*', 1, 3);
        debugger



        const _this = this;
        _this.SSPSFQData = [];  // 所属排水分区
        _this.rainTube = [];    // 雨水管数量
        _this.sewageTube = [];  // 污水管数量
        let shapeData = [];     // 总数据
        let partitionData = []; // 分区数据
        /**** 获取分区数据 ****/
        _.each(_this.shapes,function (lay) {
          if(lay.category === 'RANGE') {
            _this.SSPSFQData.push(lay.name);
            partitionData.push(lay)
          }
          shapeData.push(lay.properties.properties)
        })
        /*** 查询分区对应的管线数据 ****/
        _.each(partitionData,function (item, index) {
          let sewage = [];  // 所有污水管数量
          let rain = [];    // 所有雨水管数量

          let sixR = []; // ≤600mm的雨水管
          let eightR = []; // =800mm的雨水管
          let tenR = []; // =1000mm的雨水管
          let twelveR = []; // =1200mm的雨水管
          let fourteenR = []; // =1400mm的雨水管
          let sixteenR = []; // =1600mm的雨水管
          let twentyR = []; // ≥2000mm的雨水管

          let fourS = []; // ≤400mm的污水管
          let fiveS = []; // =500mm的污水管
          let fiveFiveS = []; // =550mm的污水管
          let sixS = []; // =600mm的污水管
          let eightS = []; // =800mm的污水管
          let tenS = []; // =1000mm的污水管
          let twentyFourS = []; // =2400mm的污水管
          let maxS = [];

          _.each(_this.shapes,function (lay) {
            if(lay.category === 'CONDUITS' && isConduitInRange(lay, item)) {
              if(lay.properties.properties.leixing === '污水管') {
                var numS = Number((lay.properties.properties.guanjing*1000).toFixed(2));  // 管径
                const polylineSewageData = lay.properties.geometry.coordinates;
                var plylineSewage = [];
                _.each(polylineSewageData, function (com) {
                  var lyn = new BMap.Point(com[1], com[0])
                  plylineSewage.push(lyn)
                })
                var plySewage = new BMap.Polyline(plylineSewage);
                var pipelineMeterSewage = BMapLib.GeoUtils.getPolylineDistance(plySewage);   // 管线长度
                var numSewage = Number(pipelineMeterSewage)
                // debugger

                if( numS <= 400 ) {
                  fourS.push(numSewage)
                }
                if(400 < numS && numS <= 500 ) {
                  fiveS.push(numSewage)
                }
                if(500 < numS && numS <= 550 ) {
                  fiveFiveS.push(numSewage)
                }
                if(550 < numS && numS <= 600 ) {
                  sixS.push(numSewage)
                }
                if(600 < numS && numS <= 800 ) {
                  eightS.push(numSewage)
                }
                if(800 < numS && numS <= 1000 ) {
                  tenS.push(numSewage)
                }
                if(1000 < numS && numS <= 2400 ) {
                  twentyFourS.push(numSewage)
                }
                sewage.push(lay.properties.properties);
              } else
              if( lay.properties.properties.leixing === '雨水管' ) {
                const polylineRainData = lay.properties.geometry.coordinates;
                var plylineRain = [];
                _.each(polylineRainData, function (com) {
                  var lyn = new BMap.Point(com[1], com[0])
                  plylineRain.push(lyn)
                })
                var plyRain = new BMap.Polyline(plylineRain);
                var pipelineMeterRain = BMapLib.GeoUtils.getPolylineDistance(plyRain);   // 管线长度
                var numRain = Number(pipelineMeterRain)


                var numR = Number((lay.properties.properties.guanjing*1000).toFixed(2))

                if( numR <= 600){
                  sixR.push(numRain)
                }else
                if( 600 < numR && numR <= 800) {
                  eightR.push(numRain)
                }else
                if( 800 < numR && numR <= 1000 ) {
                  tenR.push(numRain)
                }else
                if( 1000 < numR && numR <= 1200 ) {
                  twelveR.push(numRain)
                }else
                if( 1200 < numR && numR <= 1400 ) {
                  fourteenR.push(numRain)
                }else
                if( 1400 < numR && numR <= 1600 ) {
                  sixteenR.push(numRain)
                }else
                if( 2000 < numR ) {
                  twentyR.push(numRain)
                }
                rain.push(lay.properties.properties);
              }
            }
          })
          _this.rainTube[index] = rain.length;     // 所有雨水管数量
          _this.sewageTube[index] = sewage.length; // 所有污水管数量

          /**** 雨水管 *****/
          sixR.length      === 0 ? _this.sixRain[index]      = 0 : _this.sixRain[index]      = (eval(sixR.join("+"))).toFixed(2);
          eightR.length    === 0 ? _this.eightRain[index]    = 0 : _this.eightRain[index]    = (eval(eightR.join("+"))).toFixed(2);
          tenR.length      === 0 ? _this.tenRain[index]      = 0 : _this.tenRain[index]      = (eval(tenR.join("+"))).toFixed(2);
          twelveR.length   === 0 ? _this.twelveRain[index]   = 0 : _this.twelveRain[index]   = (eval(twelveR.join("+"))).toFixed(2);
          fourteenR.length === 0 ? _this.fourteenRain[index] = 0 : _this.fourteenRain[index] = (eval(fourteenR.join("+"))).toFixed(2);
          sixteenR.length  === 0 ? _this.sixteenRain[index]  = 0 : _this.sixteenRain[index]  = (eval(sixteenR.join("+"))).toFixed(2);
          twentyR.length   === 0 ? _this.twentyRain[index]   = 0 : _this.twentyRain[index]   = (eval(twentyR.join("+"))).toFixed(2);

          /**** 污水管 *****/
          fourS.length       === 0 ? _this.fourSewage[index]       = 0 : _this.fourSewage[index]       = (eval(fourS.join("+"))).toFixed(2)
          fiveS.length       === 0 ? _this.fiveSewage[index]       = 0 : _this.fiveSewage[index]       = (eval(fiveS.join("+"))).toFixed(2)
          fiveFiveS.length   === 0 ? _this.fiveFiveSewage[index]   = 0 : _this.fiveFiveSewage[index]   = (eval(fiveFiveS.join("+"))).toFixed(2)
          sixS.length        === 0 ? _this.sixSewage[index]        = 0 : _this.sixSewage[index]        = (eval(sixS.join("+"))).toFixed(2)
          eightS.length      === 0 ? _this.eightSewage[index]      = 0 : _this.eightSewage[index]      = (eval(eightS.join("+"))).toFixed(2)
          tenS.length        === 0 ? _this.tenSewage[index]        = 0 : _this.tenSewage[index]        = (eval(tenS.join("+"))).toFixed(2)
          twentyFourS.length === 0 ? _this.twentyFourSewage[index] = 0 : _this.twentyFourSewage[index] = (eval(twentyFourS.join("+"))).toFixed(2)
        })
        _this.beforeLoading();
      },
      /**** 数据展示 ******/
      beforeLoading(){
        const _this = this;
        /****** 整理雨水数据 *******/
        _this.rainTowArray = [];
        var rainData = [_this.sixRain,_this.eightRain,_this.tenRain, _this.twelveRain, _this.fourteenRain,_this.sixteenRain,_this.twentyRain]
        _.each(rainData,function (item, index) {
          _this.rainTowArray.push({
            name:  _this.rainScope[index],
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { color: _this.rainColorData[index], label : {show: false, position: 'insideRight'}}},
            data: item
          })
        });
        /****** 整理污水数据 *******/
        _this.sewageTowArray = [];
        var sewageData = [_this.fourSewage, _this.fiveSewage, _this.fiveFiveSewage, _this.sixSewage, _this.eightSewage, _this.tenSewage, _this.twentyFourSewage];
        _.each(sewageData,function (item, index) {
          _this.sewageTowArray.push({
            name:  _this.sewageScope[index],
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { color: _this.sewageColorData[index], label : {show: false, position: 'insideRight'}}},
            data: item
          })
        });
        /******* 管网统计分析 ******/
        var networkData = _this.$echarts.init(document.getElementById("networkFigure"));  //获取标签ID
        var networkFenxi = {
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
              data : _this.SSPSFQData
            }
          ],
          series : [
            {
              name:'污水管',
              type:'bar',
              itemStyle : { normal: { color: '#FFA042', label : {show: false, position: 'insideRight'}}},
              data: _this.sewageTube
            },
            {
              name:'雨水管',
              type:'bar',
              itemStyle : { normal: { color: '#46A3FF', label : {show: false, position: 'insideRight'}}},
              data:_this.rainTube
            }
          ]
        };
        networkData.setOption(networkFenxi);
        /******* 雨水管 *********/
        var networkLeftData = _this.$echarts.init(document.getElementById("networkLeftFigure"));  //获取标签ID
        var netWorkLeftRain = {
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
            },
            // formatter(params){ return params }
          },
          /*** 图例组件 ***/
          legend: {
            type: 'plain',
            orient: 'horizontal',
            top:25 ,
            data: _this.rainScope
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
          series: _this.rainTowArray
        }
        networkLeftData.setOption(netWorkLeftRain);
        /******* 污水管 *********/
        var networkRightData = _this.$echarts.init(document.getElementById("networkRightFigure"));  //获取标签ID
        var netWorkLeftSewage = {
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
            }
            // formatter(params){ return params }
          },
          /*** 图例组件 ***/
          legend: {
            type: 'plain',
            orient: 'horizontal',
            top: 25 ,
            data: _this.sewageScope
          },
          xAxis : [
            {
              type : 'value',
            }
          ],
          yAxis : [
            {
              type : 'category',
              data : _this.SSPSFQData
            }
          ],
          series: _this.sewageTowArray
        }
        networkRightData.setOption(netWorkLeftSewage);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #networkFigure{
    margin:auto;
  }
  #networkLeftFigure{
    margin:auto;
  }
  #networkRightFigure{
    margin:auto;
  }
</style>
