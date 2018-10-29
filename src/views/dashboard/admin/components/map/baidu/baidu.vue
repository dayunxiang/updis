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
      :stroke-opacity="0.5"
      :stroke-weight="2"
      stroke-color="yellow"
      @click="handleDiKuai(polygonPath)"
    />
    <!--地块结束-->
    <!--排口开始-->
    <bm-circle
      v-for = "circlePath in circlePaths"
      :key = "circlePath.id"
      :center="circlePath.geos"
      :radius="circlePath.radius"
      :stroke-opacity="0.5"
      :stroke-weight="2"
      stroke-color="red"
      @click="handlepaikou(circlePath)"
    />
    <!--排口结束-->
    <!--检查井开始-->
    <bm-marker
      v-for="marker in markers"
      :key = 'marker.id'
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
      :stroke-weight="2"
      stroke-color="blue"
      @click="handleguanxian(polylinePath)"/>
    <!--管线结束-->
  </baidu-map>
</template>

<script>
  import _each from '@/utils/_each'
  import request from '@/utils/request'
  export default {
    props: ['isHideAllSubcatchments', 'isHideAllConduits', 'isHideAllOutfalls'],
    data() {
      return {
        projectId:'',
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
        polygonPaths: [],
        circlePaths: [],
        markers:[]
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
      showAllJunctions(){
        this.markers = this.mapData.Junctions
      },
      hideAllJunctions(){

      },
      // 每个地块点击事件
      handleDiKuai(SubcatchmentInfo) {
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
      },
      handlepaikou(SubcatchmentInfo) {
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
      },
      handleguanxian(SubcatchmentInfo) {
        this.$emit('getSubcatchmentInfo', SubcatchmentInfo);
      },
      // 请求管线数据 CONDUITS
      getConduitsInfo() {
        var self =this;
        request('shapes',{
          params:{
            pageNo:1,
            pageSize:100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo:self.projectId
                },
                'category':{
                  equalTo: 'CONDUITS'
                }
              }
            }
          }
        }).then(resp =>{
          this.getConduitsSuccess(resp)
        })

      },
      getConduitsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = []
        for(var i = 0;i<data.length;i++){
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
        var self =this;
        request('shapes',{
          params:{
            pageNo:1,
            pageSize:100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo:self.projectId
                },
                'category':{
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp =>{
          this.getSubcatchmentsSuccess(resp)
        })
      },
      getSubcatchmentsSuccess(res) {
        var self = this
        var data = res.data;
        var dataArr = []
        for(var i = 0;i<data.length;i++){
          dataArr[i] = JSON.parse(data[i].properties)
        }
        var subcatchmentsData = dataArr;
        _each(subcatchmentsData, function(index, subcatchmentData) {
          var lng_lat = subcatchmentData.geometry.coordinates
          var tempArr = []
          var lng_latArr = []
          var info = subcatchmentData.properties
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
            geos: lng_latArr

          }
          self.mapData.subcatchments.push(subcatchment);
        })
      },
      // 请求排口数据
      getOutfalls() {
        var self =this;
        request('shapes',{
          params:{
            pageNo:1,
            pageSize:100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo:self.projectId
                },
                'category':{
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
        for(var i = 0;i<data.length;i++){
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
            id: index
          }
          self.mapData.outfalls.push(outFall)
        })
      },
      // 请求检查井数据 JUNCTIONS
      getJunctionsinfo() {
        var self =this;
        request('shapes',{
          params:{
            pageNo:1,
            pageSize:100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo:self.projectId
                },
                'category':{
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
        var self = this
        var data = res.data;
        var dataArr = []
        for(var i = 0;i<data.length;i++){
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
            radius: 50,
            id: index
          }
          self.mapData.Junctions.push(Junction)
        })
        console.log(this.mapData.Junctions[0].geos);
      }
      // //  请求管网数据
      // getNetWorkInfo() {
      //   // axios('api/network').then(this.getNetWorkSuccess)
      // },
      // getNetWorkSuccess(res) {
      //   // var cy = geojson2cytoscape(res.data)
      //   // console.log(cy.getElementById('JWG1').removed());
      //   // console.log(cy.collection());
      // }
    }
  }
</script>
<style lang="scss" scoped>
  .map{height: 100%;width: 100%;}
</style>

