<template>
  <div class="allmap" id="allmap">
  </div>
</template>
<script>
  import BMap from 'BMap'
  import request from '@/utils/request'
  import _each from '@/utils/_each'
  export default {
    data(){
      return {
        map:{},
        data:'hahha',
        projectId:'',
        mapData: {
          conduits: [],
          outfalls:[],
          junctions: [],
          subcatchments:[],
          companys:[]
        },
      }
    },
    created(){
      this.getProjectId();
      this.getDataInfo();
    },
    mounted(){
      this.createMap();


    },
    methods: {
      //获取项目ID
      getProjectId() {
        this.projectId = this.$route.query.projectId;
      },
      createMap() {
       var map = new BMap.Map("allmap", { minZoom: 15, maxZoom: 25 });    // 创建Map实例
       map.centerAndZoom("深圳光明区", 15);  // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
       map.addControl(new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }));
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.disableDoubleClickZoom();        //禁用双击放大
        this.map = map;
      },
        //根据ID获取所有项目数据
      getDataInfo() {
        var projectId = this.projectId;
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: projectId
                },
              }
            }
          }
        }).then(resp => {
          var data = resp.data;
          this.getDataInfoSuccess(data);
        })
      },
        //处理请求过来的所有数据
      getDataInfoSuccess(data) {
        var self = this;
        for (var i = 0; i < data.length; i++) {
          var category = data[i].category;
          var properties = data[i].properties;
          var mapData = {
            category: category,
            properties: properties
          }
          switch (category) {
            case 'SUBCATCHMENTS':
              self.mapData.subcatchments.push(mapData);
              break;
            case 'CONDUITS':
              self.mapData.conduits.push(mapData);
              break;
            case 'JUNCTIONS':
              self.mapData.junctions.push(mapData);
              break;
            case 'OUTFALLS':
              self.mapData.outfalls.push(mapData);
              break;
            case 'COMPANY':
              self.mapData.companys.push(mapData);
              break;
          }
        }
        var mapData = self.mapData
        self.$store.dispatch('getMapData',mapData)
        self.renderingSubcatchments();
        self.renderingConduits();
        self.renderringJunctions();
        self.renderringOutfalls();
        self.renderringCompanys();
      },
    //渲染地块
      renderingSubcatchments(){
        var self =this;
        var map = this.map
        var subcatchmentsData = self.mapData.subcatchments;
        var subcatchmens  = [];
        //正则 匹配道路 的正则
        var daoluReg = /^[S][^A-Za-z]$/;
        // 市政公用设施用地
        var shiZhengReg = /^[U][^A-Za-z]$/;
        // 绿地
        var lvDiReg = /^[G,E][^A-Za-z]/;
        // 居住用地
        var juZhuYongDiReg = /^[R][^A-Za-z]/;
        // 政府
        var zhengFuReg = /^[G][I][C]/;
        // 工业
        var gongYeReg = /^[M]/;
        // 商业服务业设施用地
        var shangyeReg = /^[C][^A-Za-z]/;
        for(var i = 0;i<subcatchmentsData.length;i++){
            var subcatchment = {
              properties:JSON.parse(subcatchmentsData[i].properties)
            }
            subcatchmens.push(subcatchment)
        }
        // 根据用地类型渲染
        _each(subcatchmens, function(index,subcatchment) {
          var lng_lat = subcatchment.properties.geometry.coordinates;
          var info = subcatchment.properties.properties
          info.type = '地块'
          var YDLX = info.YDLX
          var lng_lat_Arr = [];
          var pointArr = [];
          for(var i = 0 ;i<lng_lat[0].length;i++){
            lng_lat_Arr.push(lng_lat[0][i])
          }
          for(var i = 0;i<lng_lat_Arr.length;i++){
             var point = new BMap.Point(lng_lat_Arr[i][1]+0.005363,lng_lat_Arr[i][0]-0.00402);
             pointArr.push(point)
          }
          if(YDLX == '道路' || daoluReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(242,242,242)',fillOpacity:0.3})
          }
          if(shiZhengReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,0,254)',fillOpacity:0.3})
          }
          if(lvDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,255,1)',fillOpacity:0.3})
          }
          if(juZhuYongDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,255,1)',fillOpacity:0.3})
          }
          if(zhengFuReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,0,255)',fillOpacity:0.3})
          }
          if(gongYeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(127,63,1)',fillOpacity:0.3})
          }
          if(shangyeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(245,0,0)',fillOpacity:0.3})
          }
          map.addOverlay(polygon);
          //地块点击事件
          polygon.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })

      },
    //渲染管线
      renderingConduits(){
        var self =this;
        var map = this.map
        var conduitsData = self.mapData.conduits;
        var conduits  = [];
        for(var i = 0;i<conduitsData.length;i++){
          var subcatchment = {
            properties:JSON.parse(conduitsData[i].properties)
          }
          conduits.push(subcatchment)
        }
        _each(conduits, function(index,conduit) {
          var lng_lat = conduit.properties.geometry.coordinates;
          var info = conduit.properties.properties;
          info.type = '管线'
          var leixing = info.leixing;
          var pointArr = [];
          for(var i = 0;i<lng_lat.length;i++){
            var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
            pointArr.push(point);
          }
        //  渲染管线
          if(leixing == '雨水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"blue", strokeWeight:3, strokeOpacity:1})
          }
          if(leixing == '污水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1})
          }
          map.addOverlay(polyline);
          polyline.addEventListener("mouseover",function(){
            this.setStrokeWeight(10);

          });
          polyline.addEventListener("mouseout",function(){
            // this.setStrokeColor('blue')
            this.setStrokeWeight(3);
          });
          //管线点击事件
          polyline.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })
      },
    //渲染检查井
      renderringJunctions(){
        var self =this;
        var map = this.map
        var junctionsData = self.mapData.junctions;
        var junctions = [];
        for(var i = 0;i<junctionsData.length;i++){
          var junction = {
            properties:JSON.parse(junctionsData[i].properties)
          }
          junctions.push(junction)
        }
      //  渲染检查井
        _each(junctions, function(index,junction) {
          var lng_lat = junction.properties.geometry.coordinates;
          var info = junction.properties.properties;
          var leixing = info.leixing;
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);

          //  渲染管线
          if(leixing == '雨水检查井'){
            var  circle = new BMap.Circle(point,3,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 1, strokeOpacity: 0.3})
          }
          if(leixing == '污水检查井'){
            var  circle = new BMap.Circle(point,3,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 1, strokeOpacity: 0.3})
          }
          map.addOverlay(circle);
        })
      },
    //渲染排口
      renderringOutfalls(){
        var self =this;
        var map = this.map
        var outfallsData = self.mapData.outfalls;
        var outfalls = [];
        for(var i = 0;i<outfallsData.length;i++){
          var outfall = {
            properties:JSON.parse(outfallsData[i].properties)
          }
          outfalls.push(outfall)
        }
        _each(outfalls, function(index,outfall) {
          var lng_lat = outfall.properties.geometry.coordinates;
          var info = outfall.properties.properties;
          info.type = '排口'
          var leixing = info.leixing;
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
          //
          //  渲染排口
          if(leixing == '雨水排水口'){
            var  circle = new BMap.Circle(point,10,{fillColor:"rgb(111,252,243)", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})

          }
          if(leixing == '污水排口'){
            var  circle = new BMap.Circle(point,20,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
          }
          if(leixing == '混流排口'){
            var  circle = new BMap.Circle(point,5,{fillColor:"rgba(117,86,86,1)", strokeWeight: 1 ,fillOpacity:1, strokeOpacity: 0.3})
          }
          map.addOverlay(circle);
          //排口点击事件
          circle.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })
      },
    //渲染工业企业
      renderringCompanys(){
        var self =this;
        var map = this.map
        var companysData = self.mapData.companys;
        var companys = [];
        for(var i = 0;i<companysData.length;i++){
          var outfall = {
            properties:JSON.parse(companysData[i].properties)
          }
          companys.push(outfall)
        }

        _each(companys, function(index,company) {
          var lng_lat = company.properties.geometry.coordinates;
          var info = company.properties.properties;
          info.type = '企业'
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
          var myIcon = new BMap.Icon("/static/icon/companys_32.ico",new BMap.Size(32,32));
          var marker = new BMap.Marker(point,{icon:myIcon});
          // //  渲染工业企业
          map.addOverlay(marker);

          //排口点击事件
          marker.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })

      }
    },
  }
</script>
<style lang="scss" scoped>
  .allmap{height: 100%;width: 100%;}
</style>
