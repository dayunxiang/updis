<template>
  <baidu-map
    class="map"
    :scroll-wheel-zoom="true"
    :center="map.center"
    :high-resolution="true"
    :min-zoom="13"
    :zoom="10"
    :double-click-zoom="false"
    map-type="BMAP_HYBRID_MAP">
    <bm-map-type :map-types="['BMAP_HYBRID_MAP','BMAP_NORMAL_MAP']" anchor="BMAP_ANCHOR_TOP_right"/>
    <!-------------------------------------------地块渲染------------------------------------------------>
    <!--项目二地块开始-->
    <bm-polygon
        v-if = 'projectId == 2'
        v-for="polygonPath in onePath"
        :key="polygonPath .id"
        :path="polygonPath.geos"
        strokeColor = 'red'
        strokeWeight=5
        fillColor = ""
        @click="handleDiKuai(polygonPath)"
    />
    <bm-polygon
      v-if = 'projectId == 2'
      v-for="polygonPath in twoPath"
      :key="polygonPath .id"
      :path="polygonPath.geos"
      strokeColor = 'blue'
      strokeWeight=5
      fillColor = ""
      @click="handleDiKuai(polygonPath)"
    />
    <!--end-->
    <!--其他项目-->
    <bm-polygon
      v-for="polygonPath in polygonPaths"
      :key="polygonPath .id"
      :path="polygonPath.geos"
      :stroke-opacity="polygonPath.opacity"
      :stroke-weight="5"
      :stroke-color="polygonPath.color"
      @click="handleDiKuai(polygonPath)"
    />
    <!------------------------------------------排口渲染-------------------------------------------------------------------->
    <!--<bm-marker-->
      <!--v-for="(val,index) in outFalls.rainMarkers"-->
      <!--:key="val.id"-->
      <!--:position="val.geos"-->
      <!--:icon="{url: 'src/assets/icon/20181105053820532_easyicon_net_16.ico', size: {width: 32, height: 16}}"-->
      <!--@click="handlepaikou(index,val) "-->
    <!--/>-->
    <!-----------------------------------------检查井渲染-------------------------------------------------------------------->
    <bm-marker
      v-for="marker in markers"
      :key="marker.id"
      :position="marker.geos"
      :icon="{url: 'https://www.easyicon.net//api/resizeApi.php?id=1140684&size=16', size: {width: 16, height: 16}}"
    />
    <!------------------------------------------管线渲染---------------------------------------------------------------------->
    <!--雨水管线开始-->
    <bm-polyline
      v-for="polylinePath in Conduits.rainConduits"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight="3"
      stroke-color="blue"
      @click="handleguanxian(polylinePath)"/>
    <!--污水管线开始-->
    <bm-polyline
      v-for="polylinePath in Conduits.sewageConduits"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight="3"
      stroke-color="#FF00FF"
      @click="handleguanxian(polylinePath)"/>
    <!------------------------------------------查询类-------------------------------------------------------------->
    <!-------------------------------------------管线(查询类)--------------------------------------------------------------->
    <!--查询管线开始-->
    <bm-polyline
      v-for="polylinePath in selectPolylinePaths"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight="2"
      stroke-color="red"
      @click="handleguanxian(polylinePath)"/>
    <!--查询管线结束-->
    <!--查询排口开始-->
    <bm-circle
      v-for = "(val,index) in selectCirclePaths"
      :key = "index"
      :center="val.geos"
      :radius="val.radius"
      :stroke-opacity="1"
      :stroke-weight="5"
      :stroke-color="val.color"
      @click="handlepaikou(index,val)"
    >
    </bm-circle>
    <!--查询排口结束-->
    <!--查询地块开始-->
    <bm-polygon
      v-for="polygonPath in selectPolygonPaths"
      :key="polygonPath .id"
      :path="polygonPath.geos"
      :stroke-opacity="polygonPath.opacity"
      :stroke-weight="3"
      :stroke-color="polygonPath.color"
      @click="handleDiKuai(polygonPath)"
    />
    <!--查询地块结束-->
  </baidu-map>
</template>

<script>
  import axios from 'axios'
  import _each from '@/utils/_each'
  import request from '@/utils/request'
  import {geojson2cytoscape,
          getAncestorConduitsOfOutfall,
          calcAllSubcatchmentNearestNode,
          getAncestorSubcatchmentsOfOutfall,
          getDescendantConduitsOfSubcatchment,
          getDescendantOutfallsOfSubcatchment
         } from '@/utils/mapUtil'
  export default {
    props: ['isHideAllSubcatchments', 'isHideAllConduits','isHideRainConduits','isHideSewageConduits','isHideAllOutfalls'],
    data() {
      return {
        projectId: '',
        keyword: '',
        //geoJson
        geoJson: {
          "type": "FeatureCollection",
          "features":[]
        },
        map: {
          center: '深圳光明区'
        },
        // 地图数据
        mapData: {
          conduits: {
            rainConduits:[],
            sewageConduits:[],
          },
          outfalls:{
            rainOutfall: [],
            sewageOutfall: [],
            mergeOutfall: []
          },
          Junctions: [],
          subcatchments: [],
        },
        //管线类
        Conduits:{
          rainConduits:[],
          sewageConduits:[],
        },
        //排口类
        outFalls:{
          rainMarkers:[],
        },
        polygonPaths: [],
        markers: [],

        //工业入园
        onePath:[],
        twoPath:[],
        //查询类
        selectPolylinePaths:[],
        selectPolygonPaths:[],
        selectCirclePaths:[]
      }
    },
    watch: {
      isHideAllSubcatchments: function() {
        this.isHideAllSubcatchments ? this.showAllSubcatchments() : this.hideAllSubcatchments()
      },
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
      }
    },
    // 生命钩子函数
    mounted() {
      this.getProjectId();
      this.getSubcatchmentsInfo()
      this.getJunctionsinfo()
      this.getOutfalls()
      this.getConduitsInfo()
      this.showAllSubcatchments()
      //显示全部管线
      this.showAllConduits()
      //显示全部排口
      this.showAllOutfalls()

      this.showAllJunctions()

      this.getGeoJson();
      //向vuex中存储mapData
      this.sendMapDataToVuex();

    },

    methods: {
      test(){
        alert('hah')
      },
      // 获取项目工程Id
      getProjectId(){
        this.projectId = this.$route.query.projectId;
      },
      /**
       * 显示/隐藏所有地块
       */
      showAllSubcatchments() {
        this.polygonPaths = this.mapData.subcatchments
      },
      hideAllSubcatchments() {
        this.polygonPaths = []
      },
      /**
       * 显示/隐藏所有管线
       */
      showAllConduits() {
        this.Conduits.rainConduits = this.mapData.conduits.rainConduits;
        this.Conduits.sewageConduits = this.mapData.conduits.sewageConduits;
      },
      hideAllConduits() {
        this.Conduits.rainConduits = [];
        this.Conduits.sewageConduits = [];
      },
        // 隐藏/显示雨水管
      showRainConduits(){
        this.Conduits.rainConduits = this.mapData.conduits.rainConduits;
      },
      hideRainConduits(){
        this.Conduits.rainConduits = [];
      },
        //隐藏/显示污水管
      showSewageConduits(){
        this.Conduits.sewageConduits = this.mapData.conduits.sewageConduits;
      },
      hideSewageConduits(){
        this.Conduits.sewageConduits = [];
      },
      /**
       * 显示/隐藏所有排口
       */
      showAllOutfalls() {
        this.outFalls.rainMarkers = this.mapData.outfalls.rainOutfall;
      },
      hideAllOutfalls() {
        this.outFalls.rainMarkers = []
      },
      /**
       * 显示/隐藏所有检查井
       */
      showAllJunctions() {
        this.markers = this.mapData.Junctions
      },
      hideAllJunctions() {

      },
      // 每个地块点击事件
      handleDiKuai(SubcatchmentInfo) {
        //清除所有查询出来的渲染
        this.selectPolygonPaths=[];
        // this.selectCirclePaths = [];
        this.selectPolylinePaths = [];
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);

        // this.circlePaths.forEach(function(val){
        //   val.color='#26b8d0'
        // })
        this.polygonPaths.forEach(function(val){
          val.color = 'yellow';
          val.opacity = 0.1;
        })
        SubcatchmentInfo.color = 'red'
        SubcatchmentInfo.opacity = 1;
        this.selectPolylinePaths = []
      },
      // 每个排口点击事件
      handlepaikou(index,val) {
        this.$emit('getSubcatchmentInfo', val);
      },
      // 每个管线点击事件
      handleguanxian(SubcatchmentInfo) {
        //清除所有查询出来的渲染
        this.selectPolygonPaths=[];
        this.selectCirclePaths = [];
        this.selectPolylinePaths = [];
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
      },
      // 请求管线数据
      getConduitsInfo() {
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
                'category': {
                  equalTo: 'CONDUITS'
                }
              }
            }
          }
        }).then(resp => {
          this.getConduitsSuccess(resp)
        })
      },
      getConduitsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = []
        for (var i = 0; i < data.length;i++) {
          dataArr[i] = JSON.parse(data[i].properties)
        }
        var conduitsData = dataArr;
        _each(conduitsData, function(index, conduitData) {
          var conduitType = conduitData.properties.leixing;
          if(conduitType == '雨水管'){
            var lng_lat = this.geometry.coordinates
            var info = this.properties
            var lng_latArr = []
            for (var i = 0; i < lng_lat.length; i++) {
              var arr = { lng: lng_lat[i][1] + 0.005363, lat: lng_lat[i][0] - 0.00402 }
              lng_latArr.push(arr)
            }
            var conduit = {
              type: '管线',
              info: info,
              geos: lng_latArr
            }
            self.mapData.conduits.rainConduits.push(conduit)
          }
          if(conduitType == '污水管'){
            var lng_lat = this.geometry.coordinates
            var info = this.properties
            var lng_latArr = []
            for (var i = 0; i < lng_lat.length; i++) {
              var arr = { lng: lng_lat[i][1] + 0.005363, lat: lng_lat[i][0] - 0.00402 }
              lng_latArr.push(arr)
            }
            var conduit = {
              type: '管线',
              info: info,
              geos: lng_latArr
            }
            self.mapData.conduits.sewageConduits.push(conduit)
          }

        })
      },
      // 请求地块数据
      getSubcatchmentsInfo() {
        var self = this;
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
        }).then(resp => {
          this.getSubcatchmentsSuccess(resp)
        })
      },
      getSubcatchmentsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = []
        for (var i = 0 ; i < data.length; i++) {
          dataArr[i] = JSON.parse(data[i].properties)
          dataArr[i].id = data[i].id;
        }
        var subcatchmentsData = dataArr;
        if(this.projectId == 2){
          _each(subcatchmentsData, function(index, subcatchmentData) {
            var lng_lat = subcatchmentData.geometry.coordinates
            var tempArr = []
            var lng_latArr = []
            var info = subcatchmentData.properties
            info.id = subcatchmentData.id;
            if(info.type == '一级工业区块线'){
              for (var i = 0; i < lng_lat[0].length; i++) {
                tempArr.push(lng_lat[0][i])
              }
              for (var i = 0; i < tempArr.length; i++) {
                var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
                lng_latArr.push(arr)
              }
              var subcatchment = {
                type: '地块',
                info: info,
                geos: lng_latArr,
                opacity: 0.1

              }
              self.onePath.push(subcatchment);
            }else if(info.type == '二级工业区块线'){
              for (var i = 0; i < lng_lat[0].length; i++) {
                tempArr.push(lng_lat[0][i])
              }
              for (var i = 0; i < tempArr.length; i++) {
                var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
                lng_latArr.push(arr)
              }
              var subcatchment = {
                type: '地块',
                info: info,
                geos: lng_latArr,
                opacity: 0.1

              }
              self.twoPath.push(subcatchment);
            }
          })
        }else{
          _each(subcatchmentsData, function(index, subcatchmentData) {
            var lng_lat = subcatchmentData.geometry.coordinates
            var tempArr = []
            var lng_latArr = []
            var info = subcatchmentData.properties
            info.id = subcatchmentData.id;
            for (var i = 0; i < lng_lat[0].length; i++) {
              tempArr.push(lng_lat[0][i])
            }
            for (var i = 0; i < tempArr.length; i++) {
              var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
              lng_latArr.push(arr)
            }
            var subcatchment = {
              type: '地块',
              info: info,
              geos: lng_latArr,
              color: 'yellow',
              opacity: 0.1

            }
            self.mapData.subcatchments.push(subcatchment);
          })
        }


      },
      // 请求排口数据
      getOutfalls() {
        var self = this;
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.projectId
                },
                'category': {
                  equalTo: 'OUTFALLS'
                }
              }
            }
          }
        }).then(resp =>{
          this.getOutfallsSuccess(resp);
        })
      },
      getOutfallsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = [];
        for (var i = 0; i<data.length;i++){
          dataArr[i] = JSON.parse(data[i].properties)
        }
        var outFallsData = dataArr;
        _each(outFallsData, function(index, outFallData) {
          var outFallType = outFallData.properties.leixing;
          var lng_lat = outFallData.geometry.coordinates
          var info = outFallData.properties
          var OutFall = {
            id: index,
            type : '排口',
            info : info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
          }
          // 雨水排水口
          if(outFallType == '雨水排水口'){
            self.mapData.outfalls.rainOutfall.push(OutFall);
          }
          // 污水排水口
          if(outFallType == '污水排口'){
            self.mapData.outfalls.sewageOutfall.push(OutFall);
          }
          // 混流排口
          if(outFallType == '混流排口'){
            self.mapData.outfalls.mergeOutfall.push(OutFall);
          }
        })
      },
      // 请求检查井数据 JUNCTIONS
      getJunctionsinfo() {
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
                'category': {
                  equalTo: 'JUNCTIONS'
                }
              }
            }
          }
        }).then(resp =>{
          this.getJunctionsSuccess(resp)
        })
      },
      getJunctionsSuccess(res) {
        var self = this;
        var data = res.data;
        var dataArr = []
        for (var i = 0; i < data.length; i++) {
          dataArr[i] = JSON.parse(data[i].properties)
        }
        var JunctionsData = dataArr;
        _each(JunctionsData, function(index, JunctionData) {
          var lng_lat = JunctionData.geometry.coordinates;
          var info = JunctionData.properties;
          var Junction = {
            type: '检查井',
            info: info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
            radius: 50
          }
          self.mapData.Junctions.push(Junction)
        })
      },
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
      /**
       * pipeNetwork 是一个管网系统 为对象格式
       * 拓扑查询代码块
       */
    // 根据排口查上游管线
      handleSelectConduits(outFallName) {
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
        self.selectPolylinePaths = [];
        var cy = geojson2cytoscape(this.geoJson);
        let OutFallToConduits = getAncestorConduitsOfOutfall(data, cy);
        // 拿到管线渲染
        var dataArr = []
        for(var i =0 ;i<OutFallToConduits.length;i++){
          dataArr[i]=OutFallToConduits[i].properties;
        }
        var conduitsData = dataArr;
        _each(conduitsData, function(index, conduitData) {
          var lng_lat = conduitData.geometry.coordinates
          var info = conduitData.properties
          var lng_latArr = []
          for (var i = 0; i < lng_lat.length; i++) {
            var arr = { lng: lng_lat[i][1] + 0.005363, lat: lng_lat[i][0] - 0.00402 }
            lng_latArr.push(arr)
          }
          var conduit = {
            type: '管线',
            info: info,
            geos: lng_latArr
          }
          self.selectPolylinePaths.push(conduit)
        })

      },
    //  根据排口查上游地块
      handleSelectSubcatchments(outFallName){
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
          data.businessType = 'OUTFALLS'
          this.SelectSubcatchments(data);
        })
      },
      SelectSubcatchments(data){
        var self = this;
        var geoJson = this.geoJson;
        var cy = geojson2cytoscape(this.geoJson);
        let subcatchmentNearestNodes = calcAllSubcatchmentNearestNode(geoJson, cy);
        let subcatchments = getAncestorSubcatchmentsOfOutfall(data, geoJson, cy, subcatchmentNearestNodes)
        //  拿到地块后渲染
        var dataArr = []
        for (var i = 0 ; i <subcatchments.length; i++) {
          dataArr[i] = subcatchments[i];
        }
        var subcatchmentsData = dataArr;
        _each(subcatchmentsData, function(index, subcatchmentData) {
          var lng_lat = subcatchmentData.geometry.coordinates
          var tempArr = []
          var lng_latArr = []
          var info = subcatchmentData.properties
          info.id = subcatchmentData.id;
          for (var i = 0; i < lng_lat[0].length; i++) {
            tempArr.push(lng_lat[0][i])
          }
          for (var i = 0; i < tempArr.length; i++) {
            var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
            lng_latArr.push(arr)
          }
          var subcatchment = {
            type: '地块',
            info: info,
            geos: lng_latArr,
            color: 'red',
            opacity: 1

          }
          self.selectPolygonPaths.push(subcatchment);
        })

      },
    // 根据地块查询下游管道
      handleSubcatchmentsSelectConduits(data){
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
          this.SubcatchmentsSelectConduits(data);
        })
      },
      SubcatchmentsSelectConduits(feature){

        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        let conduits = getDescendantConduitsOfSubcatchment(feature, cy);
        //  // 拿到管线后渲染
        this.selectPolylinePaths = [];
        var dataArr = []
        for(var i =0 ;i<conduits.length;i++){
          dataArr[i]=conduits[i].properties;
        }
        var conduitsData = dataArr;
        _each(conduitsData, function(index, conduitData) {
          var lng_lat = conduitData.geometry.coordinates
          var info = conduitData.properties
          var lng_latArr = []
          for (var i = 0; i < lng_lat.length; i++) {
            var arr = { lng: lng_lat[i][1] + 0.005363, lat: lng_lat[i][0] - 0.00402 }
            lng_latArr.push(arr)
          }
          var conduit = {
            type: '管线',
            info: info,
            geos: lng_latArr
          }
          self.selectPolylinePaths.push(conduit);
        })
      },
    // 根据地块查下游排口
      handleSubcatchmentsSelectOutfalls(data){
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
          this.SubcatchmentsSelectOutfalls(data)
        })
      },
      SubcatchmentsSelectOutfalls(feature){
        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        var  subcatchmentToOutfall= getDescendantOutfallsOfSubcatchment(feature,cy);
        // 拿到排口后渲染
        var data = subcatchmentToOutfall;
        var dataArr = []
        for (var i = 0; i<data.length;i++){
          dataArr[i] = data[i].properties
        }
        var outFallsData = dataArr;
        _each(outFallsData, function(index, outFallData) {
          var lng_lat = outFallData.geometry.coordinates
          var info = outFallData.properties
          var outFall = {
            type: '排口',
            info: info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
            radius: 50,
            id: index,
            color:'red'
          }
          self.selectCirclePaths.push(outFall);
          console.log(self.selectCirclePaths);
        })
      },
      /**
       * 向vuex中存储数据
       * */
      sendMapDataToVuex(){
          var mapData = this.mapData;
          this.$store.dispatch('getMapData',mapData)
      }
    }

  }
</script>
<style lang="scss" scoped>
  .map{height: 100%;width: 100%;}
</style>




