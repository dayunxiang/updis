<template>
  <baidu-map
    :scroll-wheel-zoom="true"
    :center="map.center"
    :high-resolution="true"
    :min-zoom="13"
    :zoom="10"
    class="map"
    map-type="BMAP_HYBRID_MAP">
    <bm-map-type :map-types="['BMAP_HYBRID_MAP','BMAP_NORMAL_MAP']" anchor="BMAP_ANCHOR_TOP_right"/>
    <!--地块开始-->
      <bm-polygon
        v-for="polygonPath in polygonPaths"
        :key="polygonPath .id"
        :path="polygonPath.geos"
        :stroke-opacity="polygonPath.opacity"
        :stroke-weight="5"
        :stroke-color="polygonPath.color"
        @click="handleDiKuai(polygonPath)"
      />
    <!--地块结束-->
    <!--排口开始-->
    <bm-circle
      v-for = "(val,index) in circlePaths"
      :key = "index"
      :center="val.geos"
      :radius="val.radius"
      :stroke-opacity="1"
      :stroke-weight="5"
      :stroke-color="val.color"
      @click="handlepaikou(index,val)"
    >
    </bm-circle>
    <!--排口结束-->
    <!--检查井开始-->
    <bm-marker
      v-for="marker in markers"
      :key="marker.id"
      :position="marker.geos"
      :icon="{url: 'https://www.easyicon.net//api/resizeApi.php?id=1140684&size=16', size: {width: 16, height: 16}}"
    />
    <!--检查井结束-->
    <!--管线开始-->
    <bm-polyline
      v-for="polylinePath in polylinePaths"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight="3"
      stroke-color="blue"
      @click="handleguanxian(polylinePath)"/>
    <!--管线结束-->
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
  </baidu-map>
</template>

<script>
  import axios from 'axios'
  import _each from '@/utils/_each'
  import request from '@/utils/request'
  import {geojson2cytoscape,getAncestorConduitsOfOutfall,calcAllSubcatchmentNearestNode,getAncestorSubcatchmentsOfOutfall,getDescendantConduitsOfSubcatchment,getDescendantOutfallsOfSubcatchment} from '@/utils/mapUtil'
  export default {
    props: ['isHideAllSubcatchments', 'isHideAllConduits', 'isHideAllOutfalls'],
    components:{

    },
    data() {
      return {
        projectId: '',
        keyword: '',
        map: {
          center: '深圳光明区'
        },
        mapData: {
          subcatchments: [],
          conduits: [],
          outfalls: [],
          Junctions:[]
        },
        polylinePaths: [],
        selectPolylinePaths:[],
        selectCirclePaths:[],
        polygonPaths: [],
        circlePaths: [],
        markers: [],
        geoJson: {},

        isActive:false
      }
    },
    watch: {
      isHideAllSubcatchments: function() {
        this.isHideAllSubcatchments ? this.showAllSubcatchments() : this.hideAllSubcatchments()
      },
      isHideAllConduits: function() {
        this.isHideAllConduits ? this.showAllConduits() : this.hideAllConduits()
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
      this.showAllConduits()
      this.showAllOutfalls()
      this.showAllJunctions()
      // 请求geoJson数据
      this.getNetWorkInfo()

    },

    methods: {
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
        this.polylinePaths = this.mapData.conduits
      },
      hideAllConduits() {
        this.polylinePaths = []
      },
      /**
       * 显示/隐藏所有排口
       */
      showAllOutfalls() {
        this.circlePaths = this.mapData.outfalls
      },
      hideAllOutfalls() {
        this.circlePaths = []
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
        this.circlePaths.forEach(function(val){
          val.color='#26b8d0'
        })
        this.polygonPaths.forEach(function(val){
          val.color = 'yellow';
          val.opacity = '0.1';
        })
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
        SubcatchmentInfo.color = 'red'
        SubcatchmentInfo.opacity = 1;
        this.selectPolylinePaths = []
      },
      // 每个排口点击事件
      handlepaikou(index,val) {
        //当点击排口的时候，当前排口的颜色发生变化
        this.polygonPaths.forEach((function(val){
          val.color='yellow';
          val.opacity = '0.1';
        }))
        this.circlePaths.forEach(function(val){
          val.color='#26b8d0'
        })
        val.color = 'red'
        this.$emit('getSubcatchmentInfo', val);
        this.selectPolylinePaths = []
      },
      handleguanxian(SubcatchmentInfo) {
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
      },
      // 请求管线数据 CONDUITS
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
          self.mapData.conduits.push(conduit)
        })
      },
      // 请求地块数据 Subcatchments
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
          this.getOutfallsSuccess(resp)
        })
      },
      getOutfallsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = []
        for (var i = 0; i<data.length;i++){
          dataArr[i] = JSON.parse(data[i].properties)
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
            color:'#26b8d0'
          }
          self.selectCirclePaths.push(outFall)
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
      // 请求geoJson数据
      getNetWorkInfo() {
        axios('/datas/geoJson.json').then(this.getNetWorkSuccess)
      },
      getNetWorkSuccess(res) {
        this.geoJson = res.data.network;
      },


      /**
       * pipeNetwork 是一个管网系统 为对象格式
       *
       * 查询排口 HDOUT
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
          this.SelectSubcatchments(data);
        })
      },
      SelectSubcatchments(data){
        var self = this;
        var geoJson = this.geoJson;
        let feature = {
          "type": "Feature",
          "properties": {
            "name": "WSCLC",
            "Elevation": "9",
            "Type": "FREE",
            "Stage": "NO"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              22.760309343371674,
              113.91681078161338
            ]
          }
        }

        var cy = geojson2cytoscape(geoJson);
        let subcatchmentNearestNodes = calcAllSubcatchmentNearestNode(geoJson, cy);
        console.log('测试开始');
        console.log(geoJson);
        // let subcatchments = getAncestorSubcatchmentsOfOutfall(data, this.geoJson, cy, subcatchmentNearestNodes)
        //  拿到管线后渲染
        // this.polygonPaths= [];
        // var dataArr = []
        // for(var i =0 ;i<subcatchments.length;i++){
        //   dataArr[i]=subcatchments[i].properties;
        // }
        // var subcatchmentsData = dataArr;
        // _each(subcatchmentsData, function(index, subcatchmentData) {
        //   var lng_lat = subcatchmentData.geometry.coordinates
        //   var tempArr = []
        //   var lng_latArr = []
        //   var info = subcatchmentData.properties
        //   for (var i = 0; i < lng_lat[0].length; i++) {
        //     tempArr.push(lng_lat[0][i])
        //   }
        //   for (var i = 0; i < tempArr.length; i++) {
        //     var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
        //     lng_latArr.push(arr)
        //   }
        //   var subcatchment = {
        //     type: '地块',
        //     info: info,
        //     geos: lng_latArr
        //
        //   }
        //   self.polygonPaths.push(subcatchment);
        // })
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
                'name': {
                  equalTo: data
                }
              }
            }
          }
        }).then(resp => {
          var data = JSON.parse(resp.data[0].properties);
          this.SubcatchmentsSelectConduits(data);
        })
      },
      SubcatchmentsSelectConduits(feature){
        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        let conduits = getDescendantConduitsOfSubcatchment(feature, cy);
         // 拿到管线后渲染
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
        console.log(this.selectPolylinePaths);
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
        console.log(this.selectCirclePaths)
        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        var  subcatchmentToOutfall= getDescendantOutfallsOfSubcatchment(feature,cy);
        // 拿到排口后渲染
        var data = subcatchmentToOutfall;
        console.log(data);
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
          self.selectCirclePaths.push(outFall)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map{height: 100%;width: 100%;}
</style>




