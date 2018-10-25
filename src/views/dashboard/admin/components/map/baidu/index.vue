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
    <bm-marker :position="{lng: 113.93862592543796, lat:22.76126424490421}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" />
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
  import axios from 'axios'
  export default {
    props: ['isHideAllSubcatchments', 'isHideAllConduits', 'isHideAllOutfalls'],
    data() {
      return {
        keyword: '',
        map: {
          center: '深圳光明区'
        },
        mapData: {
          subcatchments: [],
          conduits: [],
          outfalls: []
        },
        polylinePaths: [],
        polygonPaths: [],
        circlePaths: []
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
    created(){
    },
    mounted() {
      this.getSubcatchmentsInfo()
      this.getJunctionsinfo()
      this.getOutfalls()
      this.getConduitsInfo()
      this.showAllSubcatchments()
      this.showAllConduits()
      this.showAllOutfalls()
    },

    methods: {
      /**
       * 显示所有地块
       */
      showAllSubcatchments() {
        this.polygonPaths = this.mapData.subcatchments
      },
      hideAllSubcatchments() {
        this.polygonPaths = []
      },
      /**
       * 显示所有管线
       */
      showAllConduits() {
        this.polylinePaths = this.mapData.conduits
      },
      /**
       * 隐藏所有管线
       *
       */
      hideAllConduits() {
        this.polylinePaths = []
      },
      /**
       * 显示所有排口
       */
      showAllOutfalls() {
        this.circlePaths = this.mapData.outfalls
      },
      /**
       *隐藏所有排口
       */
      hideAllOutfalls() {
        this.circlePaths = []
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
      /**
       * 取得页面上所有的地块*/
      // 请求管线数据
      getConduitsInfo() {
        axios('json/conduits').then(this.getConduitsSuccess)
      },
      getConduitsSuccess(res) {
        var self = this
        var conduitsData = res.data.features
        _each(conduitsData, function(index, conduitData) {
          var lng_lat = conduitData.geometry.coordinates
          var info = conduitData.properties
          var lng_latArr = []
          for (var i = 0; i < lng_lat.length; i++) {
            var arr = { lng: lng_lat[i][1] + 0.005363, lat: lng_lat[i][0] - 0.00402 }
            lng_latArr.push(arr)
          }
          var conduit = {
            type:'管线',
            info: info,
            geos: lng_latArr
          }
          self.mapData.conduits.push(conduit)
        })
      },
      // 请求地块数据
      getSubcatchmentsInfo() {
        axios('json/subcatchments').then(this.getSubcatchmentsSuccess)
      },
      getSubcatchmentsSuccess(res) {
        var self = this
        var subcatchmentsData = res.data.features
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
            type:'地块',
            info: info,
            geos: lng_latArr

          }
          self.mapData.subcatchments.push(subcatchment);
        })
      },
      // 请求排口数据
      getOutfalls() {
        axios('json/outfalls').then(this.getOutfallsSuccess)
      },
      getOutfallsSuccess(res) {
        var self = this
        var outFallsData = res.data.features
        _each(outFallsData, function(index, outFallData) {
          var lng_lat = outFallData.geometry.coordinates
          var info = outFallData.properties
          var outFall = {
            type:'排口',
            info: info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
            radius: 50,
            id: index
          }
          self.mapData.outfalls.push(outFall)
        })
      },
      // 请求检查井数据
      getJunctionsinfo() {
        axios('json/junctions').then(this.getJunctionsSuccess)
      },
      getJunctionsSuccess(res) {
      },
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

