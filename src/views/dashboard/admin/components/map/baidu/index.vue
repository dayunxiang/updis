<template>
  <div class="allmap" id="allmap"
       v-loading="isLoading"
       element-loading-text="正在查询中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
  </div>
</template>
<script>
  import BMap from 'BMap'
  import commonApi from '@/api/commonApi'
  import request from '@/utils/request'
  import _each from '@/utils/_each'
  import {geojson2cytoscape,
    getAncestorConduitsOfOutfall,
    calcAllSubcatchmentNearestNode,
    getAncestorSubcatchmentsOfOutfall,
    getDescendantConduitsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getNearestNodeOfPoint,
    getCenterPointOfSubcatchment
  } from '@/utils/mapUtil'
  import '@/utils/GeoUtils.js'
  export default {
    props: ['isHideAllSubcatchments','isHideDaolu','isHideShizheng','isHideLvdi','isHideJuzhu','isHideZhengfu','isHideGongye','isHideShangye',
      'isHideAllConduits','isHideRainConduits','isHideSewageConduits',
      'isHideAllOutfalls','isHideMergeOutfalls','isHideRainOutfalls','isHideSewageOutfalls',
      'isHideCompanys'],
    data(){
      return {
        isLoading: false,
        pipeNetwork:[],
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
    watch: {
      isHideAllSubcatchments: function() {
        this.isHideAllSubcatchments ? this.showAllSubcatchments() : this.hideAllSubcatchments()
      },
      isHideDaolu:function(){
        this.isHideDaolu ? this.showDaolu():this.hideDaolu();
      },
      isHideShizheng:function(){
        this.isHideShizheng ? this.showShizheng():this.hideShizheng()
      },
      isHideLvdi:function(){
        this.isHideLvdi ? this.showLvdi():this.hideLvdi()
      },
      isHideJuzhu:function(){
        this.isHideJuzhu? this.showJuzhu():this.hideJuzhu();
      },
      isHideZhengfu:function(){
        this.isHideZhengfu?this.showZhengfu():this.hideZhengfu();
      },
      isHideGongye:function(){
        this.isHideGongye ? this.showGongye():this.hideGongye();
      },
      isHideShangye:function(){
        this.isHideShangye ? this.showShangye():this.hideShangye();
      },
      //
      isHideAllConduits: function() {
        this.isHideAllConduits ? this.showAllConduits() : this.hideAllConduits()
      },
      isHideRainConduits: function(){
        this.isHideRainConduits ? this.showRainConduits() : this.hideRainConduits()
      },
      isHideSewageConduits: function(){
        this.isHideSewageConduits ? this.showSewageConduits():this.hideSewageConduits()
      },
      isHideAllOutfalls: function() {
        this.isHideAllOutfalls ? this.showAllOutfalls() : this.hideAllOutfalls()
      },
      isHideMergeOutfalls:function(){
        this.isHideMergeOutfalls ? this.showMergeOutfalls():this.hideMergeOutfalls()
      },
      isHideRainOutfalls:function(){
        this.isHideRainOutfalls ? this.showRainOutfalls():this.hideRainOutfalls()
      },
      isHideSewageOutfalls:function(){
        this.isHideSewageOutfalls ? this.showSewageOutfalls():this.hideSewageOutfalls()
      },
      isHideCompanys:function(){
        this.isHideCompanys ? this.showAllCompanys():this.hideAllCompanys()
      }
    },
    created(){
      this.getProjectId();
      this.getDataInfo();
      this.getGeoJson();
    },
    mounted(){
      this.createMap();
      this.UpdateData();

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
        var self = this;
        var projectId = self.projectId;
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
          self.pipeNetwork = data;
          this.getDataInfoSuccess(data);
        })
      },
      //处理请求过来的所有数据
      getDataInfoSuccess(data) {
        var self = this;
        for (var i = 0; i < data.length; i++) {
          var category = data[i].category;
          var properties = data[i].properties;
          var id = data[i].id;
          var mapData = {
            id :id,
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
        for(var i = 0;i<subcatchmentsData.length;i++){
          var subcatchment = {
            id:subcatchmentsData[i].id,
            properties:JSON.parse(subcatchmentsData[i].properties)
          }
          subcatchmens.push(subcatchment)
        }
        // 根据用地类型渲染
        self.drawSubcatchments(subcatchmens)
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
        self.drawConduits(conduits);

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
        self.drawOutfalls(outfalls);

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
        self.drawCompanys(companys);
      },
      //绘制地块
      drawSubcatchments(data){
        var self =this;
        var map = this.map
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
        _each(data, function(index,subcatchment) {
          var id = subcatchment.id;
          var lng_lat = subcatchment.properties.geometry.coordinates;
          var info = subcatchment.properties.properties
          info.type = '地块'
          info.id = id;
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
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(242,242,242)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '道路'
          }
          if(shiZhengReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,0,254)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '市政'
          }
          if(lvDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,255,1)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '绿地'
          }
          if(juZhuYongDiReg.test(YDLX)) {
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,255,1)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '居住'
          }
          if(zhengFuReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,0,255)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '政府'
          }
          if(gongYeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(127,63,1)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '工业'
          }
          if(shangyeReg.test(YDLX)){
            var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(245,0,0)',fillOpacity:0.3})
            polygon.type = info.type
            polygon.sonType = '商业'
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
            self.clearSelectConduits();
          });
        })
      },
      //绘制管线
      drawConduits(data){
        var self =this;
        var map = this.map
        _each(data, function(index,conduit) {
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
            polyline.type = '雨水管';
          }
          if(leixing == '污水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1})
            polyline.type = '污水管';
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
      //绘制排口
      drawOutfalls(data){
        var self =this;
        var map = this.map
        _each(data, function(index,outfall) {
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
            self.clearSelectConduits();
            self.$store.dispatch('getInfo',info)
            this.setFillColor('red');
            this.type = '选中的排口'
          });
        })
      },
      //绘制工业企业
      drawCompanys(data){
        var self =this;
        var map = this.map
        _each(data, function(index,company) {
          var lng_lat = company.properties.geometry.coordinates;
          var info = company.properties.properties;
          info.type = '企业'
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
          info.geos = [lng_lat[1]+0.005363,lng_lat[0]-0.00402]
          var myIcon = new BMap.Icon("/static/icon/companys_32.ico",new BMap.Size(32,32));
          var marker = new BMap.Marker(point,{icon:myIcon});
          marker.type = info.type;
          // //  渲染工业企业
          map.addOverlay(marker);

          //工业企业点击事件
          marker.addEventListener("click",function(){
            self.$store.dispatch('getInfo',info)
            self.test();
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

      },
      //所有的覆盖物的变化
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
          var type = overlay.Circle[i].type
          var leixing = overlay.Circle[i].leixing
          if(leixing == '雨水排水口'){
            overlay.Circle[i].setFillColor('rgb(193 223 255)');
          }
          if(leixing == '污水排口'){
            if(type == undefined){
              overlay.Circle[i].setFillColor('rgb(250,228,252)');
            }
          }
          if(leixing == '混流排口'){
            overlay.Circle[i].setFillColor('#E8E8E8');
          }
        }
        //   地块覆盖物
        for(var i = 0;i<overlay.Polygon.length;i++){
          overlay.Polygon[i].setFillOpacity(0.025);
          overlay.Polygon[i].setStrokeColor("rgba(128,128,128,0.1)");
        }
        //   管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var leixing = overlay.Polyline[i].type

          if(leixing == '雨水管'){
            overlay.Polyline[i].setStrokeColor('rgb(193 223 255)');
          }
          if(leixing == '污水管'){
            overlay.Polyline[i].setStrokeColor('rgb(250 228 252)');

          }
        }
        // 企业覆盖物
        for(var i = 0;i<overlay.Marker.length;i++){
          map.removeOverlay(overlay.Marker[i])
        }

      },
      //清除查询出来的管线
      clearSelectConduits(){
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
        //查出来的污水管
        for(var i = 0; i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type == '查出来的污水管'){
            map.removeOverlay(overlay.Polyline[i])
          }
          if(type == '查出来的雨水管'){
            map.removeOverlay(overlay.Polyline[i])
          }
        }
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
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:4.2, strokeOpacity:1})
            polyline.type = "查出来的污水管";
          }
          if(leixing == '雨水管'){
            var polyline = new BMap.Polyline(pointArr,{strokeColor:"blue", strokeWeight:4.2, strokeOpacity:1})
            polyline.type = "查出来的雨水管";
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
        self.clearSelectConduits();
        self.test2()
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
          var map = self.map;
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
            var info = subcatchment.properties;
            var centerLng_lat = info.center;
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
            //渲染地块
            if(YDLX == '道路' || daoluReg.test(YDLX)){
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(242,242,242)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(shiZhengReg.test(YDLX)){
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,0,254)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(lvDiReg.test(YDLX)) {
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(0,255,1)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(juZhuYongDiReg.test(YDLX)) {
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,255,1)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(zhengFuReg.test(YDLX)){
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(255,0,255)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(gongYeReg.test(YDLX)){
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(127,63,1)',fillOpacity:0.5})
              polygon.type = info.type
            }
            if(shangyeReg.test(YDLX)){
              var polygon = new BMap.Polygon(pointArr,{strokeColor:"rgba(128,128,128,1)", strokeWeight:1, strokeOpacity:1,fillColor:'rgb(245,0,0)',fillOpacity:0.5})
              polygon.type = info.type
            }
            map.addOverlay(polygon);
            //  地块点击事件
            polygon.addEventListener("click",function(){
              self.$store.dispatch('getInfo',info)
              self.test();
              //  获得地块中心点，创建 marker
              var point = new BMap.Point(centerLng_lat[1]+0.005363,centerLng_lat[0]-0.00402);
              var marker = new BMap.Marker(point);
              marker.type = '标注'
              map.addOverlay(marker);               // 将标注添加到地图中
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            });
          })

        })
      },
      //地块查下游雨水管道+排口
      handleSubcatchmentsSelectRainConduits(data){
        var self = this;
        self.test2();
        request('shapes', {
          params:{
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'id': {
                  equalTo: data
                }
              }
            }
          }
        }).then(resp => {
          var data = JSON.parse(resp.data[0].properties);
          data.businessType="SUBCATCHMENTS";
          this.SubcatchmentsSelectRainConduits(data);
        })
      },
      SubcatchmentsSelectRainConduits(data){
        var self = this;
        var map = self.map;
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '雨水管'
        let conduits = getDescendantConduitsOfSubcatchment(data, cy,ConduitsType);
        //渲染雨水管线
        var dataArr = []
        for(var i =0 ;i<conduits.length;i++){
          dataArr[i]=conduits[i].properties;
        }
        var conduitsData = dataArr;
        //渲染引导线
        var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        var centerPoint = data.properties.center
        var polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1]+ 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1]+ 0.005363, rainJunction_Lng_lat[0]- 0.00402),
        ], {strokeColor:"blue", strokeWeight:3, strokeOpacity:1,strokeStyle:'dashed'});
        map.addOverlay(polyline);
        // 渲染管线
        _each(conduitsData, function(index, conduit) {
          var lng_lat = conduit.geometry.coordinates;
          var info = conduit.properties;
          info.type = '管线'
          var leixing = info.leixing;
          var pointArr = [];
          for(var i = 0;i<lng_lat.length;i++){
            var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
            pointArr.push(point);
          }
          var polyline = new BMap.Polyline(pointArr,{strokeColor:"blue", strokeWeight:4.5, strokeOpacity:1})
          map.addOverlay(polyline);
        })
        //拿到排口 渲染排口
        var rainOutfall= getDescendantOutfallsOfSubcatchment(data,cy,ConduitsType);
        _each(rainOutfall, function(index,outfall) {
          var lng_lat = outfall.properties.geometry.coordinates;
          var info = outfall.properties.properties;
          info.type = '排口'
          var leixing = info.leixing;
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
          var  circle = new BMap.Circle(point,10,{fillColor:"rgb(111,252,243)", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
          circle.leixing = "雨水排水口"
          map.addOverlay(circle);
        })
      },
      //地块查询下游污水管道+排口
      handleSubcatchmentsSelectSewageConduits(data){
        var self = this;
        self.test2();
        request('shapes', {
          params:{
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'id': {
                  equalTo: data
                }
              }
            }
          }
        }).then(resp => {
          var data = JSON.parse(resp.data[0].properties);
          data.businessType="SUBCATCHMENTS";
          this.SubcatchmentsSelectSewageConduits(data);
        })
      },
      SubcatchmentsSelectSewageConduits(data){
        var self = this;
        var map = self.map;
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '污水管'
        let conduits = getDescendantConduitsOfSubcatchment(data, cy,ConduitsType);
        //渲染雨水管线
        var dataArr = []
        for(var i =0 ;i<conduits.length;i++){
          dataArr[i]=conduits[i].properties;
        }
        var conduitsData = dataArr;
        //渲染引导线
        var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        var centerPoint = data.properties.center
        var polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1]+ 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1]+ 0.005363, rainJunction_Lng_lat[0]- 0.00402),
        ], {strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1,strokeStyle:'dashed'});
        map.addOverlay(polyline);
        // 渲染管线
        _each(conduitsData, function(index, conduit) {
          var lng_lat = conduit.geometry.coordinates;
          var info = conduit.properties;
          info.type = '管线'
          var leixing = info.leixing;
          var pointArr = [];
          for(var i = 0;i<lng_lat.length;i++){
            var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
            pointArr.push(point);
          }
          var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:4.5, strokeOpacity:1})
          map.addOverlay(polyline);
        })
        //拿到排口 渲染排口
        var rainOutfall= getDescendantOutfallsOfSubcatchment(data,cy,ConduitsType);
        _each(rainOutfall, function(index,outfall) {
          var lng_lat = outfall.properties.geometry.coordinates;
          var info = outfall.properties.properties;
          info.type = '排口'
          var leixing = info.leixing;
          var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
          var  circle = new BMap.Circle(point,10,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
          circle.leixing = "污水排水口"
          map.addOverlay(circle);
        })
      },
      //企业查询下游污水管+去向
      handleCompanySelectSewageConduits(data){
        var self =this;
        self.test2();
        var allmap = self.map;
        var lng_lat = data;
        var overlays = []
        var arr = []
        var subcatchments = this.mapData.subcatchments;
        for(var i = 0; i< subcatchments.length;i++){
          var properties = JSON.parse(subcatchments[i].properties);
          var geos = properties.geometry.coordinates[0]
          var subcatchment = {
            id : subcatchments[i].id,
            geos:geos
          }
          arr.push(subcatchment)
        }
        for(var i = 0;i<subcatchments.length;i++){
          var point = new BMap.Point(lng_lat[0],lng_lat[1])
          overlays = [];
          for(var j=0;j<arr[i].geos.length;j++){
            var points = new BMap.Point(arr[i].geos[j][1]+0.005363,arr[i].geos[j][0]-0.00402);
            overlays.push(points)
          }
          var ply = new BMap.Polygon(overlays);
          var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
          if(result == true){
            var subcatchmenId = arr[i].id;
            request('shapes', {
              params:{
                filters: {
                  'shape': {
                    'project_id': {
                      equalTo: self.projectId
                    },
                    'id': {
                      equalTo: subcatchmenId
                    }
                  }
                }
              }
            }).then(resp => {
              var feature = JSON.parse(resp.data[0].properties);
              feature.businessType="SUBCATCHMENTS";
              var cy = geojson2cytoscape(self.geoJson);
              var ConduitsType = '污水管'
              let conduits = getDescendantConduitsOfSubcatchment(feature, cy,ConduitsType);
              var dataArr = []
              for(var i =0 ;i<conduits.length;i++){
                dataArr[i]=conduits[i].properties;
              }
              var conduitsData = dataArr;
              // //获取引导线
              var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
              var polyline = new BMap.Polyline([
                new BMap.Point(lng_lat[0],lng_lat[1]),
                new BMap.Point(rainJunction_Lng_lat[1]+ 0.005363, rainJunction_Lng_lat[0]- 0.00402)
              ],{strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1,strokeStyle:'dashed'});
              allmap.addOverlay(polyline);
              _each(conduitsData, function(index, conduit) {
                var lng_lat = conduit.geometry.coordinates;
                var info = conduit.properties;
                info.type = '管线'
                var leixing = info.leixing;
                var pointArr = [];
                for(var i = 0;i<lng_lat.length;i++){
                  var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
                  pointArr.push(point);
                }
                var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:4.5, strokeOpacity:1})
                allmap.addOverlay(polyline);
              })
              //拿到排口渲染排口
              var rainOutfall= getDescendantOutfallsOfSubcatchment(feature,cy,ConduitsType);
              _each(rainOutfall, function(index,outfall) {
                var lng_lat = outfall.properties.geometry.coordinates;
                var info = outfall.properties.properties;
                info.type = '排口'
                var leixing = info.leixing;
                var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
                var  circle = new BMap.Circle(point,10,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
                circle.leixing = "污水排水口"
                allmap.addOverlay(circle);
              })
            })
          }

        }
      },
      // 重新绘制事件
      handleReset(){
        var self = this;
        var map = self.map;
        var allOverlay   = map.getOverlays()
        for(var i =0;i<allOverlay.length;i++){
          map.removeOverlay(allOverlay[i])
        }
        map.clearOverlays();
        if(map.getOverlays() == ''){
          self.renderingSubcatchments();
          self.renderingConduits();
          self.renderringJunctions();
          self.renderringOutfalls();
          self.renderringCompanys();
        }

      },
      //  渲染查询结果
      showResult(data){
        var self = this;
        var map = self.map;
        var companys = self.mapData.companys;
        var resultData = []
        self.test2();
        var companysData = data.companys;
        var conduitsData = data.conduits;
        var outfallsData = data.outfalls;
        var subcatchmentsData = data.subcatchments;
        //开始判断
        if(subcatchmentsData.length>0){
          var subcatchmens  = [];
          for(var i = 0;i<subcatchmentsData.length;i++){
            var subcatchment = {
              id:subcatchmentsData[i].id,
              properties:JSON.parse(subcatchmentsData[i].properties)
            }
            subcatchmens.push(subcatchment)
          }
          self.drawSubcatchments(subcatchmens);
          /**
           * 1、获取所有企业数据  获取每个企业的坐标   没有转过坐标
           * 2、判断这个点是否在查询出来的地块中  没有转过
           * */
          var selectSubcatchmets = []
          var selectCompanys = [];
          for(var i=0;i<subcatchmentsData.length;i++){
            var properties = JSON.parse(subcatchmentsData[i].properties);
            var geos = properties.geometry.coordinates[0];
            var selectSubcatchmet = {
              properties:properties,
              overlays:[]
            }
            for(var j = 0;j<geos.length;j++){
              var points = new BMap.Point(geos[j][1],geos[j][0]);
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet)
            resultData.push(properties)
          }
          //工业企业
          for(var i = 0; i< companys.length;i++) {
            var properties = JSON.parse(companys[i].properties);
            var lng_lat = properties.geometry.coordinates;
            var point = new BMap.Point(lng_lat[1], lng_lat[0])
            var propertie = {
              properties:properties
            }
            var selectCompany = {
              point:point,
              properties:propertie,
            }
            selectCompanys.push(selectCompany)
          }
          var selectCompanysResult = []
          for(var i =0;i<selectCompanys.length;i++){
            var point = selectCompanys[i].point;
            for(var j = 0;j<selectSubcatchmets.length;j++){
              var overlays = selectSubcatchmets[j].overlays
              var ply = new BMap.Polygon(overlays);
              var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
              if(result == true){
                selectCompanysResult.push(selectCompanys[i].properties)
              }
            }
          }
          self.drawCompanys(selectCompanysResult)

          // 根据地块查雨水排口 并展示
          var rainOutfalls = [];
          var sewageOutfalls = [];
          for(var i=0;i < subcatchmentsData.length;i++){
            var properties = JSON.parse(subcatchmentsData[i].properties);
            console.log(properties)
            var cy = geojson2cytoscape(self.geoJson);
            var ConduitsRain = '雨水管'
            var ConduitsSewage= '污水管'
            var rainOutfall= self.getDescendantOutfallsOfSubcatchment(properties,cy,ConduitsRain);
            var conduit = self.getDescendantConduitsOfSubcatchment(properties, cy,ConduitsRain);
            var sewageOutfall = self.getDescendantOutfallsOfSubcatchment(properties,cy,ConduitsSewage);
            var sewageConduit = self.getDescendantConduitsOfSubcatchment(properties, cy,ConduitsSewage)
            if(rainOutfall.length>0){
              rainOutfalls.push(rainOutfall[0])
            }
            if(sewageOutfall.length>0){
              sewageOutfalls.push(sewageOutfall[0])
            }

            if(conduit.length>0){
              var rainJunction_Lng_lat  = conduit[0].properties.geometry.coordinates[0];
              var centerPoint= properties.properties.center;
              //渲染引导线
              var polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1]+ 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(rainJunction_Lng_lat[1]+ 0.005363, rainJunction_Lng_lat[0]- 0.00402),
              ], {strokeColor:"blue", strokeWeight:1.5, strokeOpacity:0.5,strokeStyle:'dashed'});
              map.addOverlay(polyline);
              //渲染管线
              _each(conduit, function(index, conduitData) {
                var lng_lat = conduitData.properties.geometry.coordinates;
                var pointArr = [];
                for(var i = 0;i<lng_lat.length;i++){
                  var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
                  pointArr.push(point);
                }
                var polyline = new BMap.Polyline(pointArr,{strokeColor:"blue", strokeWeight:3, strokeOpacity:1})
                map.addOverlay(polyline);
              })
            }
            if(sewageConduit.length>0){
              var sewageJunction_lng_lat = sewageConduit[0].properties.geometry.coordinates[0];
              var centerPoint= properties.properties.center
              //  渲染引导线
              var polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1]+ 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(sewageJunction_lng_lat[1]+ 0.005363, sewageJunction_lng_lat[0]- 0.00402),
              ], {strokeColor:"#e868f2", strokeWeight:1.5, strokeOpacity:0.5,strokeStyle:'dashed'});
              map.addOverlay(polyline);
              //渲染管线
              _each(sewageConduit, function(index, conduitData) {
                var lng_lat = conduitData.properties.geometry.coordinates;
                var pointArr = [];
                for(var i = 0;i<lng_lat.length;i++){
                  var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
                  pointArr.push(point);
                }
                var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1})
                map.addOverlay(polyline);
              })
            }
          }
          self.drawOutfalls(rainOutfalls);
          self.drawOutfalls(sewageOutfalls);

          //结果合并
          for(var i = 0;i<selectCompanysResult.length;i++){
            resultData.push(selectCompanysResult[i].properties)
          }
          for(var i = 0;i<rainOutfalls.length;i++){
            resultData.push(rainOutfalls[i])
          }
          for(var i = 0;i<sewageOutfalls.length;i++){
            resultData.push(sewageOutfalls[i])
          }
        }
        //排口
        if(outfallsData.length>0){
          var outfalls = [];
          for(var i = 0;i<outfallsData.length;i++){
            var outfall = {
              properties:JSON.parse(outfallsData[i].properties)
            }
            outfalls.push(outfall)
          }
          self.drawOutfalls(outfalls);

        }
        //管线
        if(conduitsData.length>0){
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
          self.drawConduits(conduits);
        }
        //企业
        if(companysData.length>0){
          var companys = [];
          var selectSubcatchmets = []
          var selectCompanysResult = [];
          var subcatchmentsData = self.mapData.subcatchments;
          //地块数据
          for(var j = 0;j<subcatchmentsData.length;j++){
            var properties = JSON.parse(subcatchmentsData[j].properties)

            var geos = properties.geometry.coordinates[0];
            var selectSubcatchmet = {
              properties:properties,
              overlays:[]
            }
            for(var i = 0;i<geos.length;i++){
              var points = new BMap.Point(geos[i][1],geos[i][0]);
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet);
          }
          //企业数据
          for(var i = 0;i<companysData.length;i++){
            var properties = JSON.parse(companysData[i].properties);
            var companyLng_lat = properties.geometry.coordinates;
            var point = new BMap.Point(companyLng_lat [1], companyLng_lat [0]);
            //作比较
            for(var j = 0;j<selectSubcatchmets.length;j++){
              var overlays = selectSubcatchmets[j].overlays
              var ply = new BMap.Polygon(overlays);
              var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
              if(result == true){
                var data = selectSubcatchmets[j].properties;
                var cy = geojson2cytoscape(self.geoJson);
                var ConduitsType = '污水管'
                let conduits = getDescendantConduitsOfSubcatchment(data, cy,ConduitsType);
                var dataArr = []
                for(var k =0 ;k<conduits.length;k++){
                  dataArr[k]=conduits[k].properties;
                }
                var conduitsData = dataArr;
                //引导线
                var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
                var polyline = new BMap.Polyline([
                  new BMap.Point(companyLng_lat[1]+ 0.005363, companyLng_lat[0] - 0.00402),
                  new BMap.Point(rainJunction_Lng_lat[1]+ 0.005363, rainJunction_Lng_lat[0]- 0.00402),
                ], {strokeColor:"#e868f2", strokeWeight:3, strokeOpacity:1,strokeStyle:'dashed'});
                map.addOverlay(polyline);
                // //渲染污水管线
                _each(conduitsData, function(index, conduit) {
                  var lng_lat = conduit.geometry.coordinates;
                  var info = conduit.properties;
                  info.type = '管线'
                  var leixing = info.leixing;
                  var pointArr = [];
                  for(var i = 0;i<lng_lat.length;i++){
                    var point = new BMap.Point(lng_lat[i][1]+0.005363,lng_lat[i][0]-0.00402);
                    pointArr.push(point);
                  }
                  var polyline = new BMap.Polyline(pointArr,{strokeColor:"#e868f2", strokeWeight:4.5, strokeOpacity:1})
                  map.addOverlay(polyline);
                  //拿到排口 渲染排口
                  var rainOutfall= getDescendantOutfallsOfSubcatchment(data,cy,ConduitsType);
                  _each(rainOutfall, function(index,outfall) {
                    var lng_lat = outfall.properties.geometry.coordinates;
                    var info = outfall.properties.properties;
                    info.type = '排口'
                    var leixing = info.leixing;
                    var point = new BMap.Point(lng_lat[1]+0.005363,lng_lat[0]-0.00402);
                    var  circle = new BMap.Circle(point,10,{fillColor:"#e868f2", strokeWeight: 1 ,fillOpacity: 0.5, strokeOpacity: 0.3})
                    circle.leixing = "污水排水口"
                    map.addOverlay(circle);
                  })
                })

                selectCompanysResult.push(selectSubcatchmets[j])

              }
            }

            var  company = {
              properties:JSON.parse(companysData[i].properties)
            }
            companys.push(company)
          }
          // 画出企业
          self.drawCompanys(companys);
          self.drawSubcatchments(selectCompanysResult)
        }
        //  统计拿到所有数据
        //  数组去重
        var newResultData = [];
        for(var i =0;i<resultData.length;i++){
          var flag = true;
          for(var j = 0;j<newResultData.length;j++){
            if(resultData[i].id ==newResultData[j].id){
              flag = false
            }
          }
          if(flag){
            newResultData.push(resultData[i]);
          }
        }
        self.$store.dispatch('getResultData',newResultData);
        console.log('查询结束');
      },
    //  隐藏排口
      hideAllOutfalls(){
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
            overlay.Circle[i].hide()
          }
          if(leixing == '污水排口'){
            overlay.Circle[i].hide()
          }
          if(leixing == '混流排口'){
            overlay.Circle[i].hide()
          }
        }
     },
      showAllOutfalls(){
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
            overlay.Circle[i].show()
          }
          if(leixing == '污水排口'){
            overlay.Circle[i].show()
          }
          if(leixing == '混流排口'){
            overlay.Circle[i].show()
          }
        }
      },
      hideMergeOutfalls(){
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
          }
          if(leixing == '污水排口'){

          }
          if(leixing == '混流排口'){
            overlay.Circle[i].hide()
          }
        }
      },
      showMergeOutfalls(){
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
          }
          if(leixing == '污水排口'){

          }
          if(leixing == '混流排口'){
            overlay.Circle[i].show()
          }
        }
      },
      hideRainOutfalls(){
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
            overlay.Circle[i].hide()
          }
          if(leixing == '污水排口'){

          }
          if(leixing == '混流排口'){
          }
        }
      },
      showRainOutfalls(){
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
            overlay.Circle[i].show()
          }
          if(leixing == '污水排口'){

          }
          if(leixing == '混流排口'){
          }
        }
      },
      hideSewageOutfalls(){
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

          }
          if(leixing == '污水排口'){
            overlay.Circle[i].hide()
          }
          if(leixing == '混流排口'){
          }
        }
      },
      showSewageOutfalls(){
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

          }
          if(leixing == '污水排口'){
            overlay.Circle[i].show()
          }
          if(leixing == '混流排口'){
          }
        }
      },
    // 隐藏管线
      hideAllConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
            overlay.Polyline[i].hide()
          }
          if(type  == '雨水管'){
            overlay.Polyline[i].hide()
          }
        }
      },
      showAllConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
            overlay.Polyline[i].show()
          }
          if(type  == '雨水管'){
            overlay.Polyline[i].show()
          }
        }
      },
      hideRainConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
          }
          if(type  == '雨水管'){
            overlay.Polyline[i].hide()
          }
        }
      },
      showRainConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
          }
          if(type  == '雨水管'){
            overlay.Polyline[i].show()
          }
        }
      },
      hideSewageConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
            overlay.Polyline[i].hide()
          }
          if(type  == '雨水管'){

          }
        }
      },
      showSewageConduits(){
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
        //  管线覆盖物
        for(var i = 0;i<overlay.Polyline.length;i++){
          var type = overlay.Polyline[i].type;
          if(type  == '污水管'){
            overlay.Polyline[i].show()
          }
          if(type  == '雨水管'){

          }
        }
      },
    //  隐藏地块
      hideAllSubcatchments(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          overlay.Polygon[i].hide();
        }
      },
      showAllSubcatchments(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          overlay.Polygon[i].show();
        }
      },
      //隐藏道路
      hideDaolu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '道路'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showDaolu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '道路'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏市政
      hideShizheng(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '市政'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showShizheng(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '市政'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏绿地
      hideLvdi(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '绿地'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showLvdi(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '绿地'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏居住
      hideJuzhu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '居住'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showJuzhu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '居住'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏政府
      hideZhengfu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '政府'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showZhengfu(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '政府'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏工业
      hideGongye(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '工业'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showGongye(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '工业'){
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏商业
      hideShangye(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '商业'){
            overlay.Polygon[i].hide();
          }
        }
      },
      showShangye(){
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
        for(var i = 0;i<overlay.Polygon.length;i++){
          var sonType = overlay.Polygon[i].sonType;
          if(sonType == '商业'){
            overlay.Polygon[i].show();
          }
        }
      },
    //  隐藏企业
      hideAllCompanys(){
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
        for(var i = 0;i<overlay.Marker.length;i++){
          overlay.Marker[i].hide();
        }
      },
      showAllCompanys(){
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
        for(var i = 0;i<overlay.Marker.length;i++){
          overlay.Marker[i].show();
        }
      },
    //  拓扑查询加快方式
    //  根据地块查下游排口 （管道类型）
      getDescendantOutfallsOfSubcatchment(feature, cy, conduitType){
        if(feature['geometry']['type'] !== 'Polygon') {
          console.warn('输入的feature不合法：feature的类型应该为Polygon')
          return []
        }
        let center = feature.properties.center;
        let subcatchmentCenterPoint = [center[1],center[0]];
        let nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)
        return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().nodes('[businessType="OUTFALLS"]'), node => {
          return node.data()
        })
      },
    //  根据地块查询下游管道
      getDescendantConduitsOfSubcatchment(feature, cy, conduitType){
        if(feature['geometry']['type'] !== 'Polygon') {
          console.warn('输入的feature不合法：feature的类型应该为Polygon')
          return []
        }
        let center = feature.properties.center;
        let subcatchmentCenterPoint = [center[1],center[0]];
        let nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)

        return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().edges(), edge => {
          return edge.data()
        })
      },
    //  测试函数
      UpdateData(){
        var self = this;
        request('shapes',{
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'category':{
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp =>{
          var data = resp.data;
          for(var i = 0;i<data.length;i++){
            var shapeid = data[i].id
            var feature = data[i].properties;
            var properties = JSON.parse(feature)
            if(properties.properties.JSZT == '现状' && properties.properties.JSZT == '已落实海绵'){
              // properties.properties.现状控制率 = properties.properties.规划控制率
              // var dataNew ={
              //   properties:JSON.stringify(properties)
              // }
              // console.log(dataNew)
              // commonApi.edit('shapes',shapeid,dataNew).then(function(){
              //   console.log('执行完成');
              // })
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .allmap{height: 100%;width: 100%;}
</style>
