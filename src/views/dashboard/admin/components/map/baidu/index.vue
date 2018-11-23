<template>
  <div class="allmap" id="allmap">
  </div>
</template>
<script>
  import BMap from 'BMap'
  import request from '@/utils/request'
  import _each from '@/utils/_each'
  import {geojson2cytoscape,
    getAncestorConduitsOfOutfall,
    calcAllSubcatchmentNearestNode,
    getAncestorSubcatchmentsOfOutfall,
    getDescendantConduitsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getNearestNodeOfPoint
  } from '@/utils/mapUtil'
  export default {
    data(){
      return {
        map:{},
        geoJson: {
          "type": "FeatureCollection",
          "features":[]
        },
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
      this.getGeoJson();
    },
    mounted(){
      this.createMap();


    },
    methods: {
      //请求geoJson数据
      getGeoJson(){
        var self = this;
        request('shapes',{
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                }
              }
            }
          }
        }).then(resp =>{
          var data = resp.data;
          this.getGeoJsonSuccess(data);
        })
      },
      getGeoJsonSuccess(data){
        var self = this;
        for(var i = 0; i < data.length; i++){
          self.geoJson.features.push(JSON.parse(data[i].properties));
        }
      },
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
          var centerLng_lat = info.center;
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
            polygon.type = info.type
          }
          if(shiZhengReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,0,254)',fillOpacity:0.3})
            polygon.type = info.type
          }
          if(lvDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,255,1)',fillOpacity:0.3})
            polygon.type = info.type
          }
          if(juZhuYongDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,255,1)',fillOpacity:0.3})
            polygon.type = info.type
          }
          if(zhengFuReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,0,255)',fillOpacity:0.3})
            polygon.type = info.type
          }
          if(gongYeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(127,63,1)',fillOpacity:0.3})
            polygon.type = info.type
          }
          if(shangyeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"#808080", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(245,0,0)',fillOpacity:0.3})
            polygon.type = info.type
          }
          map.addOverlay(polygon);
          //地块点击事件
          polygon.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
            //  获得地块中心点，创建 marker
            var point = new BMap.Point(centerLng_lat[1]+0.005363,centerLng_lat[0]-0.00402);
            var marker = new BMap.Marker(point);
            self.test();
            self.test1();
            marker.type = '标注'
            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
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
            polyline.type = info.type;
          }
          if(leixing == '污水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1})
            polyline.type = info.type;
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
        var findObj;
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
          //  渲染排口
          if(leixing == '雨水排水口'){
            var  circle = new BMap.Circle(point,10,{fillColor:"rgb(111,252,243)", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
            circle.leixing = "雨水排水口"

          }
          if(leixing == '污水排口'){
            var  circle = new BMap.Circle(point,20,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
            circle.leixing = "污水排口"
          }
          if(leixing == '混流排口'){
            var  circle = new BMap.Circle(point,5,{fillColor:"rgba(117,86,86,1)", strokeWeight: 1 ,fillOpacity:1, strokeOpacity: 0.3})
            circle.leixing = "混流排口"
          }
          map.addOverlay(circle);
          // 排口点击事件
          circle.addEventListener("click",function(){
            self.test();
            self.$store.dispatch('getInfo',info)
            this.setFillColor('red');
            this.type = '选中的排口'
            console.log(this.type);
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
          marker.type = info.type;
          // //  渲染工业企业
          map.addOverlay(marker);

          //工业企业点击事件
          marker.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })

      },
      // 覆盖物分类
      test(){
        var self = this;
        var map = self.map;
        var allOverlay = map.getOverlays();  //获得所有覆盖物
        var overlay = {
          Polygon:[],
          Polyline:[],
          Circle:[],
          Marker:[]
        }
        for(var i = 0; i<allOverlay.length;i++){
          var overlayType = allOverlay[i].toString();
          if(overlayType == '[object Polygon]'){
            overlay.Polygon.push(allOverlay[i])
          }
          if(overlayType == '[object Polyline]'){
            overlay.Polyline.push(allOverlay[i])
          }
          if(overlayType == '[object Circle]'){
            overlay.Circle.push(allOverlay[i])
          }
          if(overlayType == '[object Marker]'){
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for(var i = 0;i<overlay.Circle.length;i++){
          var outfallColor = overlay.Circle[i].getFillColor();
          var leixing = overlay.Circle[i].leixing;
          if(leixing == '雨水排水口'){
            overlay.Circle[i].setFillColor('rgb(111,252,243)');
          }
          if(leixing == '污水排口'){
            overlay.Circle[i].setFillColor('#e868f2');
          }
          if(leixing == '混流排口'){
            overlay.Circle[i].setFillColor('rgba(117,86,86,1)');
          }
        }
        // 标注覆盖物
        for(var i = 0;i<overlay.Marker.length;i++){
          var marker= overlay.Marker[i];
          var type = overlay.Marker[i].type;
          if(type == '标注'){
            map.removeOverlay(marker)
          }
        }
        //
      },
      //查询出来的覆盖物
      test1(){
        var self = this;
        var map = self.map;
        var allOverlay = map.getOverlays();  //获得所有覆盖物
        var overlay = {
          Polygon:[],
          Polyline:[],
          Circle:[],
          Marker:[]
        }
        for(var i = 0; i<allOverlay.length;i++){
          var overlayType = allOverlay[i].toString();
          if(overlayType == '[object Polygon]'){
            overlay.Polygon.push(allOverlay[i])
          }
          if(overlayType == '[object Polyline]'){
            overlay.Polyline.push(allOverlay[i])
          }
          if(overlayType == '[object Circle]'){
            overlay.Circle.push(allOverlay[i])
          }
          if(overlayType == '[object Marker]'){
            overlay.Marker.push(allOverlay[i])
          }
        }
      //  查询出来的关线
        console.log(overlay.Polyline)

      },
      //所有的覆盖物变灰
      test2(){
        var self = this;
        var map = self.map;
        var allOverlay = map.getOverlays();  //获得所有覆盖物
        var overlay = {
          Polygon:[],
          Polyline:[],
          Circle:[],
          Marker:[]
        }
        for(var i = 0; i<allOverlay.length;i++){
          var overlayType = allOverlay[i].toString();
          if(overlayType == '[object Polygon]'){
            overlay.Polygon.push(allOverlay[i])
          }
          if(overlayType == '[object Polyline]'){
            overlay.Polyline.push(allOverlay[i])
          }
          if(overlayType == '[object Circle]'){
            overlay.Circle.push(allOverlay[i])
          }
          if(overlayType == '[object Marker]'){
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for(var i = 0;i<overlay.Circle.length;i++){
          var outfallColor = overlay.Circle[i].getFillColor();
          console.log(overlay.Circle[i]);
          if(leixing == '雨水排水口'){
            overlay.Circle[i].setFillColor('#E8E8E8');
          }
          if(leixing == '污水排口'){
            overlay.Circle[i].setFillColor('#E8E8E8');
          }
          if(leixing == '混流排口'){
            overlay.Circle[i].setFillColor('#E8E8E8');
          }
        }
       //   地块覆盖物
        for(var i = 0;i<overlay.Circle.length)

      },
      //排口查询上游管线
      handleSelectConduits(outFallName) {
        var self = this;
        self.test2();
        request('shapes', {
          params:{
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'name': {
                  equalTo: outFallName
                }
              }
            }
          }
        }).then(resp => {
          var data = JSON.parse(resp.data[0].properties);
          this.SelectConduits(data);
        })
      },
      SelectConduits(data){
        var self = this;
        var map = self.map;
        var cy = geojson2cytoscape(this.geoJson);
        let OutFallToConduits = getAncestorConduitsOfOutfall(data, cy);
        // 拿到管线渲染
        var dataArr = []
        for(var i =0 ;i<OutFallToConduits.length;i++){
          dataArr[i]=OutFallToConduits[i];
        }
        var conduitsData = dataArr;
        _each(conduitsData, function(index, conduit) {
          var lng_lat = conduit.properties.geometry.coordinates;
          var info = conduit.properties.properties;
          info.type = '管线'
          var leixing = info.leixing;
          var pointArr = [];
          for(var i = 0;i<lng_lat.length;i++){
            var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
            pointArr.push(point);
          }
          if(leixing == '污水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"red", strokeWeight:3, strokeOpacity:1})
            polyline.type = info.type;
          }
          map.addOverlay(polyline);
          //管线点击事件
          polyline.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
          });
        })
      },
      // 排口查上游地块
      handleSelectSubcatchments(outfallName){
        var self = this;
        var map = self.map;
        request('shapes', {
          params:{
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'category': {
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp =>{
          var data = resp.data;
          var subcatchments = []
          var subcatchmentsToOutfall =[]
          for(var i = 0;i<data.length;i++){
            var properties = data[i].properties;
            subcatchments.push(JSON.parse(properties))
          }
          var outfallType = outfallName.substring(0,2);

          if(outfallType == 'WP'){
            for(var i = 0;i < subcatchments.length;i++){
              if(subcatchments[i].properties.WP == outfallName){
                subcatchmentsToOutfall.push(subcatchments[i])
              }
            }
          }
          if(outfallType == 'YP'){
            for(var i = 0;i < subcatchments.length;i++){
              if(subcatchments[i].properties.YP == outfallName){
                subcatchmentsToOutfall.push(subcatchments[i])
              }
            }
          }
          // 拿到地块渲染地块
          _each(subcatchmentsToOutfall, function(index, subcatchment) {
            var lng_lat = subcatchment.geometry.coordinates;
            // var info = subcatchment.properties.properties
            // info.type = '地块'
            // var YDLX = info.YDLX
            var lng_lat_Arr = [];
            var pointArr = [];
            for(var i = 0 ;i<lng_lat[0].length;i++){
              lng_lat_Arr.push(lng_lat[0][i])
            }
            for(var i = 0;i<lng_lat_Arr.length;i++){
              var point = new BMap.Point(lng_lat_Arr[i][1]+0.005363,lng_lat_Arr[i][0]-0.00402);
              pointArr.push(point)
            }
            //渲染地块
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"red", strokeWeight:1, strokeOpacity:1,fillColor:'',fillOpacity:0.3})
            polygon.type = '查询出来的地块'
            map.addOverlay(polygon);
          })

        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .allmap{height: 100%;width: 100%;}
</style>
