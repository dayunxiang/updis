<template>
  <baidu-map
    class="map"
    :scroll-wheel-zoom="true"
    :center="map.center"
    :min-zoom="15"
    :double-click-zoom="false"
    map-type="BMAP_HYBRID_MAP"
    @zoomend="test"
  >
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
    <!--其他项目-->
    <!--道路-->
    <bm-polygon
      v-for="polygonPath in subcatchments.road"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity=polygonPath.fillOpacity
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity=polygonPath.strokeOpacity
      :stroke-weight=polygonPath.strokeWeight
      @click="handleSubcatchment(polygonPath)"
    />
    <!--市政-->
    <bm-polygon
      v-for="polygonPath in subcatchments.shiZheng"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight="polygonPath.strokeWeight"
      @click="handleSubcatchment(polygonPath)"
    />
    <!--绿地-->
    <bm-polygon
      v-for="polygonPath in subcatchments.lvDi"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight="polygonPath.strokeWeight"
      @click="handleSubcatchment(polygonPath)"
    />
    <!--居住用地-->
    <bm-polygon
      v-for="polygonPath in subcatchments.juZhuYongDi"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight="polygonPath.strokeWeight"
      @click="handleSubcatchment(polygonPath)"
    />
    <!--政府-->
    <bm-polygon
      v-for="polygonPath in subcatchments.zhengFu"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight=polygonPath.strokeWeight
      @click="handleSubcatchment(polygonPath)"
    />
    <!--工业-->
    <bm-polygon
      v-for="polygonPath in subcatchments.gongYe"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight=polygonPath.strokeWeight
      @click="handleSubcatchment(polygonPath)"
    />
    <bm-polygon
      v-for="polygonPath in subcatchments.shangYe"
      :key="polygonPath.id"
      :path="polygonPath.geos"
      :fill-color="polygonPath.fillColor"
      :fill-opacity="polygonPath.fillOpacity"
      :stroke-color="polygonPath.strokeColor"
      :stroke-opacity="polygonPath.strokeOpacity"
      :stroke-weight=polygonPath.strokeWeight
      @click="handleSubcatchment(polygonPath)"
    />
    <!--地块中心点-->
    <bm-marker
      v-for=" subcatchmentsCenter  in subcatchmentsCenterMarks"
      :position="subcatchmentsCenter.geos"
      :dragging="true"
      animation="BMAP_ANIMATION_BOUNCE"
    />
    <!------------------------------------------排口渲染-------------------------------------------------------------------->
    <!--雨水排口-->
    <bm-marker
      v-for=" rainOutfall in outFalls.rainMarkers"
      :key="rainOutfall.id"
      :position="rainOutfall.geos"
      :icon="{url: '/static/icon/rainOutfall_48.ico', size: {width:48 , height: 48}}"
      @click="handlepaikou(rainOutfall) "
    />
    <!--污水排口-->
    <bm-marker
      style="transform:rotate(90deg)"
      v-for="sewageOutfall in outFalls.sewageMarkers"
      :key="sewageOutfall.id"
      :position="sewageOutfall.geos"
      :icon="{url: '/static/icon/sewageOutfall_48.ico', size: {width: 32, height: 32,}}"
      @click="handlepaikou(sewageOutfall) "
    />
    <!--混流排口-->
    <bm-marker
      v-for="mergeOutfall in outFalls.mergeMarkers"
      :key="mergeOutfall.id"
      :position="mergeOutfall.geos"
      :icon="{url: '/static/icon/mergeOutfall_48.ico', size: {width: 32, height: 32}}"
      @click="handlepaikou(mergeOutfall) "
    />
    <!-----------------------------------------检查井渲染-------------------------------------------------------------------->
    <!--雨水检查井-->
    <bm-circle
      v-for="val in Junctions.rainJunctions"
      :center="val.geos"
      :radius="2"
      :stroke-opacity="1"
      :stroke-weight="7"
      fillColor="blue"
      stroke-color="blue"
    />
    <!--污水检查井-->
    <bm-circle
      v-for="val in Junctions.sewageJunctions"
      :center="val.geos"
      :radius="2"
      :stroke-opacity="1"
      :stroke-weight="7"
      fillColor="rgb(242,73,248)"
      stroke-color="rgb(242,73,248)"
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
    <!-------------------------------------------工业企业---------------------------------------------------------------------->
    <bm-marker
      v-for="company in companys"
      :key="company.id"
      :position="company.geos"
      :icon="company.icon"
      @click="handleCompany(company)"
    />
    <!------------------------------------------查询类-------------------------------------------------------------->
    <!-------------------------------------------管线(查询类)--------------------------------------------------------------->
    <!--查询管线开始-->
    <!--查询雨水管线-->
    <bm-polyline
      v-for="polylinePath in selectConduits.rainConduits"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight=10
      stroke-color="blue"
      @click="handleguanxian(polylinePath)"/>
    <!--查询污水管线-->
    <bm-polyline
      v-for="polylinePath in selectConduits.sewageConduits"
      :key="polylinePath.id"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight=10
      stroke-color="#FF00FF"
      @click="handleguanxian(polylinePath)"/>
    <!--雨水引导线：-->
    <bm-polyline
      :path="guideLine.rainLine"
      stroke-color="blue"
      :stroke-opacity="1"
      :stroke-weight="5"
      strokeStyle = 'dashed'
    />
    <!--污水引导线：-->
    <bm-polyline
      :path="guideLine.sewageLine"
      stroke-color="#FF00FF"
      :stroke-opacity="1"
      :stroke-weight="5"
      strokeStyle = 'dashed'
    />
    <!--排口查询地块开始-->
    <bm-polygon
      v-for="polygonPath in selectPolygonPaths"
      :key="polygonPath .id"
      :path="polygonPath.geos"
      :stroke-opacity="polygonPath.opacity"
      :stroke-weight="3"
      :stroke-color="polygonPath.color"
      @click="handleDiKuai(polygonPath)"
    />
    <!--排口查上游管道-->
    <bm-polyline
      v-for="polylinePath in selectPolylinePaths"
      :path="polylinePath.geos"
      :clicking = "true"
      :stroke-opacity="1"
      :stroke-weight="3"
      stroke-color="red"
      @click="handleguanxian(polylinePath)"/>
    <!--查询雨水去向-->
    <bm-circle
      v-for = "(val,index) in selectCirclePaths"
      :key = "index"
      :center="val.geos"
      :radius="val.radius"
      :stroke-opacity="1"
      :stroke-weight="5"
      :stroke-color="val.color"
      @click="handlepaikou(index,val)"
    />
    <bm-circle
      v-for = "(val,index) in selectCirclePaths.rainOutfall"
      :key = "index"
      :center="val.geos"
      :radius="val.radius"
      :stroke-opacity="1"
      :stroke-weight="5"
      :stroke-color="val.color"
      @click="handlepaikou(index,val)"
    />
    <bm-circle
      v-for = "(val,index) in selectCirclePaths.sewageOutfall"
      :key = "index"
      :center="val.geos"
      :radius="val.radius"
      :stroke-opacity="1"
      :stroke-weight="5"
      :stroke-color="val.color"
      @click="handlepaikou(index,val)"
    />
  </baidu-map>
</template>

<script>
  import axios from 'axios'
  import BMap from 'BMap'
  import _each from '@/utils/_each'
  import request from '@/utils/request'
  import {geojson2cytoscape,
    getAncestorConduitsOfOutfall,
    calcAllSubcatchmentNearestNode,
    getAncestorSubcatchmentsOfOutfall,
    getDescendantConduitsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getNearestNodeOfPoint
  } from '@/utils/mapUtil'
  import {getArea} from '@/utils/map'
  import '@/utils/GeoUtils.js'
  // import mapData from '../../../../../../store/modules/mapData'

  export default {
    props: ['isHideAllSubcatchments','isHideDaolu','isHideShizheng','isHideLvdi','isHideJuzhu','isHideZhengfu','isHideGongye','isHideShangye',
      'isHideAllConduits','isHideRainConduits','isHideSewageConduits',
      'isHideAllOutfalls','isHideMergeOutfalls','isHideRainOutfalls','isHideSewageOutfalls',
      'isHideCompanys',],
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
          Junctions: {
            rainJunctions:[],
            sewageJunctions:[]
          },
          subcatchments:{
            road : [],
            shiZheng:[],
            lvDi:[],
            juZhuYongDi:[],
            zhengFu:[],
            gongYe:[],
            shangYe:[]
          },

          companys:[]
        },
        //管线类
        Conduits:{
          rainConduits:[],
          sewageConduits:[],
        },
        //排口类
        outFalls:{
          rainMarkers:[],
          sewageMarkers:[],
          mergeMarkers:[]
        },
        //地块类
        subcatchments:{
          road : [],
          shiZheng:[],
          lvDi:[],
          juZhuYongDi:[],
          zhengFu:[],
          gongYe:[],
          shangYe:[]
        },
        //企业类
        companys:[],
        //检查井
        Junctions: {
          rainJunctions:[],
          sewageJunctions:[]
        },
        // //地块中心点
        subcatchmentsCenterMarks:[],
        //工业入园
        onePath:[],
        twoPath:[],
        //查询类
        //管线
        selectConduits:{
          rainConduits :[],
          sewageConduits:[]
        },
        //引导线
        guideLine:{
          rainLine:[],
          sewageLine:[]
        },
        //排口查上游管道
        selectPolylinePaths:[],
        selectPolygonPaths:[],
        selectCirclePaths:{
          rainOutfall:[],
          sewageOutfall:[],
        }
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
    // 生命钩子函数
    mounted() {
      this.getProjectId();
      this.getSubcatchmentsInfo()
      this.getJunctionsinfo()
      this.getOutfalls()
      this.getConduitsInfo()
      this.getCompanysInfo()
      //显示全部地块
      this.showAllSubcatchments()
      //显示全部管线
      this.showAllConduits()
      //显示全部排口
      this.showAllOutfalls()
      //显示全部检查井
      this.showAllJunctions()
      //显示全部企业
      this.showAllCompanys();
      this.getGeoJson();
      //向vuex中存储mapData
      this.sendMapDataToVuex();

    },

    methods: {
      test(e) {
        var self = this;
        if (e.target.getZoom() <= 15) {
          this.outFalls.rainMarkers = [];
          this.outFalls.sewageMarkers = [];
          this.outFalls.mergeMarkers = [];
        }
        if (e.target.getZoom()>15) {
          this.outFalls.rainMarkers = this.mapData.outfalls.rainOutfall;
          this.outFalls.sewageMarkers = this.mapData.outfalls.sewageOutfall;
          this.outFalls.mergeMarkers = this.mapData.outfalls.mergeOutfall;
        }
      },
      // 获取项目工程Id
      getProjectId(){
        this.projectId = this.$route.query.projectId;
      },
      /**
       * 显示/隐藏所有地块
       */
      showAllSubcatchments() {
        this.subcatchments.road = this.mapData.subcatchments.road;
        this.subcatchments.shiZheng = this.mapData.subcatchments.shiZheng
        this.subcatchments.lvDi = this.mapData.subcatchments.lvDi;
        this.subcatchments.juZhuYongDi = this.mapData.subcatchments.juZhuYongDi;
        this.subcatchments.zhengFu = this.mapData.subcatchments.zhengFu
        this.subcatchments.gongYe = this.mapData.subcatchments.gongYe
        this.subcatchments.shangYe = this.mapData.subcatchments.shangYe
      },
      hideAllSubcatchments() {
        this.subcatchments.road = []
        this.subcatchments.shiZheng = [];
        this.subcatchments.lvDi = [];
        this.subcatchments.juZhuYongDi = [];
        this.subcatchments.zhengFu = [];
        this.subcatchments.gongYe = [];
        this.subcatchments.shangYe = [];
      },
      //显示隐藏/道路
      showDaolu(){;
        this.subcatchments.road = this.mapData.subcatchments.road;
      },
      hideDaolu(){
        this.subcatchments.road = []
      },
      //显示隐藏/市政
      showShizheng(){
        this.subcatchments.shiZheng = this.mapData.subcatchments.shiZheng
      },
      hideShizheng(){
        this.subcatchments.shiZheng = [];
      },
      // 显示隐藏/绿地
      showLvdi(){
        this.subcatchments.lvDi = this.mapData.subcatchments.lvDi;
      },
      hideLvdi(){
        this.subcatchments.lvDi = [];
      },
      //显示隐藏/居住用地
      showJuzhu(){
        this.subcatchments.juZhuYongDi = this.mapData.subcatchments.juZhuYongDi;
      },
      hideJuzhu(){
        this.subcatchments.juZhuYongDi = [];
      },
      //显示隐藏/政府
      showZhengfu(){
        this.subcatchments.zhengFu = this.mapData.subcatchments.zhengFu
      },
      hideZhengfu(){
        this.subcatchments.zhengFu = [];
      },
      //显示/隐藏工业
      showGongye(){
        this.subcatchments.gongYe = this.mapData.subcatchments.gongYe
      },
      hideGongye(){
        this.subcatchments.gongYe = [];
      },
      //显示/隐藏商业
      showShangye(){
        this.subcatchments.shangYe = this.mapData.subcatchments.shangYe
      },
      hideShangye(){
        this.subcatchments.shangYe = [];
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
        this.outFalls.sewageMarkers = this.mapData.outfalls.sewageOutfall;
        this.outFalls.mergeMarkers = this.mapData.outfalls.mergeOutfall;
      },
      hideAllOutfalls() {
        this.outFalls.rainMarkers = [];
        this.outFalls.sewageMarkers = [];
        this.outFalls.mergeMarkers = [];
      },
      //  显示/隐藏合流排口
      showMergeOutfalls(){
        this.outFalls.mergeMarkers = this.mapData.outfalls.mergeOutfall;
      },
      hideMergeOutfalls(){
        this.outFalls.mergeMarkers = [];
      },
      // 显示/隐藏雨水排口
      showRainOutfalls(){
        this.outFalls.rainMarkers = this.mapData.outfalls.rainOutfall;
      },
      hideRainOutfalls(){
        this.outFalls.rainMarkers = [];
      },
      //显示/隐藏污水排口
      showSewageOutfalls(){
        this.outFalls.sewageMarkers = this.mapData.outfalls.sewageOutfall;
      },
      hideSewageOutfalls(){
        this.outFalls.sewageMarkers = [];
      },
      /**
       * 显示/隐藏所有检查井
       */
      showAllJunctions() {
        this.Junctions.rainJunctions = this.mapData.Junctions.rainJunctions;
        this.Junctions.sewageJunctions = this.mapData.Junctions.sewageJunctions;
      },
      hideAllJunctions() {
      },
      /**
       * 显示所有企业
       * */
      showAllCompanys(){
        this.companys = this.mapData.companys;
      },
      hideAllCompanys(){
        this.companys =[]
      },
      //清除地图上所有的查询信息
      clearSelect(){
        this.subcatchmentsCenterMarks = [];
        this.selectConduits.rainConduits = [];
        this.selectConduits.sewageConduits = [];
        this.guideLine.rainLine = [];
        this.guideLine.sewageLine = [];
        this.selectPolylinePaths = [];
        this.selectCirclePaths.rainOutfall = [];
        this.selectCirclePaths.sewageOutfall =[];
        this.companys.forEach(function(val){
          val.icon.url = '/static/icon/companys_32.ico';
          val.icon.size ={ width: 32, height: 32 }
        })
      },
      // 每个地块点击事件
      handleSubcatchment(SubcatchmentInfo) {
        this.clearSelect();
        this.$emit('getInfo', SubcatchmentInfo);
        var info = SubcatchmentInfo.info;
        var lng_lat = info.center;
        var center = {
          geos : { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402}
        }
        this.$data.subcatchmentsCenterMarks.push(center)
        //
      },
      // 每个排口点击事件
      handlepaikou(data) {
        this.clearSelect();
        this.$emit('getInfo', data);

      },
      // 每个管线点击事件
      handleguanxian(data) {
        //清除所有查询出来的渲染
        this.selectPolygonPaths=[];
        this.selectCirclePaths = [];
        this.selectPolylinePaths = [];
        this.$emit('getInfo',data);
      },
      // 每个企业点击事件
      handleCompany(companyInfo){
        this.$emit('getInfo',companyInfo);
        this.clearSelect();
        companyInfo.icon.url  = '/static/icon/companys_32_red.ico',
          companyInfo.icon.size = { width: 32, height: 32 }
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
          if(conduitType == '雨水管'){
            self.mapData.conduits.rainConduits.push(conduit)
          }
          if(conduitType == '污水管'){
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
        //正则 匹配道路 的正则
        var daoluReg = /^[S][^A-Za-z]$/gi;
        // 市政公用设施用地
        var shiZhengReg = /^[U][^A-Za-z]$/gi;
        // 绿地
        var lvDiReg = /^[G,E][^A-Za-z]/gi
        // 居住用地
        var juZhuYongDiReg = /^[R][^A-Za-z]/gi
        // 政府
        var zhengFuReg = /^[G][I][C][^A-Za-z]/gi
        // 工业
        var gongYeReg = /^[M][^A-Za-z]/gi
        // 商业服务业设施用地
        var shangyeReg = /^[C][^A-Za-z]/gi;

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
            var id = subcatchmentData.id;
            var lng_lat = subcatchmentData.geometry.coordinates
            var tempArr = []
            var lng_latArr = []
            var info = subcatchmentData.properties
            info.id = id;
            var YDLX = info.YDLX;
            var properties = subcatchmentData.properties;
            for (var i = 0; i < lng_lat[0].length; i++) {
              tempArr.push(lng_lat[0][i])
            }
            for (var i = 0; i < tempArr.length; i++) {
              var arr = { lng: tempArr[i][1] + 0.005363, lat: tempArr[i][0] - 0.00402 }
              lng_latArr.push(arr)
            }
            //道路
            if(YDLX == '道路' || daoluReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(242,242,242)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1

              }
              self.mapData.subcatchments.road.push(subcatchment);
            }
            //市政公用设施用地
            if(shiZhengReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(0,0,254)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.shiZheng.push(subcatchment);
            }
            //绿地
            if(lvDiReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(0,255,1)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.lvDi.push(subcatchment);
            }
            //居住用地
            if(juZhuYongDiReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(255,255,1)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.juZhuYongDi.push(subcatchment);
            }
            //政府用地
            if(zhengFuReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(255,0,255)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.zhengFu.push(subcatchment);
            }
            //工业用地
            if(gongYeReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(127,63,1)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.gongYe.push(subcatchment);
            }
            //商业用地
            if(shangyeReg.test(YDLX)){
              var subcatchment = {
                type: '地块',
                properties:properties,
                info: info,
                geos: lng_latArr,
                fillColor:'rgb(245,0,0)',
                fillOpacity:0.3,
                strokeColor:'#808080',
                strokeOpacity:1,
                strokeWeight:1
              }
              self.mapData.subcatchments.shangYe.push(subcatchment);
            }
          })
          // console.log(self.mapData.subcatchments.lvDi);
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
          var id = JunctionData.id;
          var Junction = {
            id:id,
            type: '检查井',
            info: info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
          }
          if(info.leixing == '雨水检查井'){
            self.mapData.Junctions.rainJunctions.push(Junction);
          }else if(info.leixing == '污水检查井'){
            self.mapData.Junctions.sewageJunctions.push(Junction);
          }
        })
      },
      // 请求企业数据
      getCompanysInfo(){
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
                  equalTo: 'COMPANY'
                }
              }
            }
          }
        }).then(resp =>{
          this.getCompanysSuccess(resp)
        })
      },
      getCompanysSuccess(resp){
        var self = this;
        var data = resp.data;
        var dataArr = []
        for (var i = 0; i < data.length; i++) {
          dataArr[i] = JSON.parse(data[i].properties)
          dataArr[i].id = data[i].id;
        }
        var companysData = dataArr;
        _each(companysData, function(index, companysData) {
          var lng_lat = companysData.geometry.coordinates;
          var info = companysData.properties;
          var id = companysData.id;
          info.id = id;
          info.lng_lat = lng_lat;
          var company = {
            type: '企业',
            info: info,
            geos: { lng: lng_lat[1] + 0.005363, lat: lng_lat[0] - 0.00402 },
            icon:{
              url :'/static/icon/companys_16.ico',
              size:{ width: 16, height: 16 }
            }
          }
          self.mapData.companys.push(company)
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
        console.log(subcatchmentsData)
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
      // 根据地块查询下游雨水管道
      handleSubcatchmentsSelectRainConduits(data){
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
      SubcatchmentsSelectRainConduits(feature){
        var self = this;
        var centerPoint = feature.properties.center
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '雨水管'
        let conduits = getDescendantConduitsOfSubcatchment(feature, cy,ConduitsType);
        //拿到管线后渲染
        var dataArr = []
        for(var i =0 ;i<conduits.length;i++){
          dataArr[i]=conduits[i].properties;
        }
        var conduitsData = dataArr;
        //获取引导线
        var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        var rainGuideLine = [{lng:centerPoint[1]+ 0.005363,lat:centerPoint[0] - 0.00402},{lng:rainJunction_Lng_lat[1]+ 0.005363,lat:rainJunction_Lng_lat[0]- 0.00402}];
        this.guideLine.rainLine = rainGuideLine;
        //渲染管线
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
          self.selectConduits.rainConduits.push(conduit);
        })
      },
      //根据地块查污水管道
      handleSubcatchmentsSelectSewageConduits(data){
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
      SubcatchmentsSelectSewageConduits(feature){
        var self = this;
        var centerPoint = feature.properties.center
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '污水管'
        let conduits = getDescendantConduitsOfSubcatchment(feature, cy,ConduitsType);
        // 拿到管线后渲染
        var dataArr = []
        for(var i =0 ;i<conduits.length;i++){
          dataArr[i]=conduits[i].properties;
        }
        var conduitsData = dataArr;
        //引导线
        var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        var rainGuideLine = [{lng:centerPoint[1]+ 0.005363,lat:centerPoint[0] - 0.00402},{lng:rainJunction_Lng_lat[1]+ 0.005363,lat:rainJunction_Lng_lat[0]- 0.00402}];
        this.guideLine.sewageLine = rainGuideLine;
        //渲染管线
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
          self. selectConduits.sewageConduits.push(conduit);
        })
      },
      // 根据地块查下游雨水排口
      handleSubcatchmentsSelectRainOutfalls(data){
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
          this.SubcatchmentsSelectRainOutfalls(data)
        })
      },
      SubcatchmentsSelectRainOutfalls(feature){
        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '雨水管'
        var  subcatchmentToOutfall= getDescendantOutfallsOfSubcatchment(feature,cy,ConduitsType);
        // 拿到排口后渲染
        var data = subcatchmentToOutfall;
        var dataArr = []
        console.log(subcatchmentToOutfall)
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
            color:'blue'
          }
          self.selectCirclePaths.rainOutfall.push(outFall);
        })
      },
      // 根据地块查下游污水去向
      handleSubcatchmentsSelectSewageOutfalls(data){
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
          this.SubcatchmentsSelectSewageOutfalls(data)
        })
      },
      SubcatchmentsSelectSewageOutfalls(feature){
        var self = this;
        var cy = geojson2cytoscape(this.geoJson);
        var ConduitsType = '污水管'
        var  subcatchmentToOutfall= getDescendantOutfallsOfSubcatchment(feature,cy,ConduitsType);
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
          self.selectCirclePaths.rainOutfall.push(outFall);
        })
      },
      // 根据企业查下游污水去向
      handleCompanySelectSewageOutfall(data){
        var self =this;
        var map = new BMap.Map("map");
        var lng_lat = data;
        var subcatchments = this.mapData.subcatchments;
        var arr = []
        var overlays = []
        for(let item in subcatchments){
          for(var i = 0;i<subcatchments[item].length;i++){
            arr.push(subcatchments[item][i])
          }
        }
        for(var i = 0; i<=arr.length;i++) {
          var point = new BMap.Point(lng_lat.lng,lng_lat.lat);
          overlays = [];
          for (var j = 0; j < arr[i].geos.length; j++) {
            var points = new BMap.Point(arr[i].geos[j].lng,arr[i].geos[j].lat);
            overlays.push(points)
          }
          var ply = new BMap.Polygon(overlays);
          var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
          if(result==true){
            var subcatchmenId = arr[i].info.id;
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
              //开始拓扑查询
              var cy = geojson2cytoscape(self.geoJson);
              var ConduitsType = '污水管'
              var  sewageOutfall= getDescendantOutfallsOfSubcatchment(feature,cy,ConduitsType);
              var data = sewageOutfall;
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
                self.selectCirclePaths.rainOutfall.push(outFall);
              })
            })
            return true;
          }
        }
      },
      // 根据企业查下游污水管
      handleCompanySelectSewageConduits(data){
        var self =this;
        var map = new BMap.Map("map");
        var lng_lat = data;
        var subcatchments = this.mapData.subcatchments;
        var arr = []
        var overlays = []
        for(let item in subcatchments){
          for(var i = 0;i<subcatchments[item].length;i++){
            arr.push(subcatchments[item][i])
          }
        }
        for(var i = 0; i<=arr.length;i++) {
          var point = new BMap.Point(lng_lat.lng,lng_lat.lat);
          overlays = [];
          for (var j = 0; j < arr[i].geos.length; j++) {
            var points = new BMap.Point(arr[i].geos[j].lng,arr[i].geos[j].lat);
            overlays.push(points)
          }
          var ply = new BMap.Polygon(overlays);
          var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
          if(result==true){
            var subcatchmenId = arr[i].info.id;
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
              //开始拓扑查询
              var cy = geojson2cytoscape(self.geoJson);
              var ConduitsType = '污水管'
              let conduits = getDescendantConduitsOfSubcatchment(feature, cy,ConduitsType);
              var dataArr = []
              for(var i =0 ;i<conduits.length;i++){
                dataArr[i]=conduits[i].properties;
              }
              var conduitsData = dataArr;
              //获取引导线
              var rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
              var rainGuideLine = [{lng:lng_lat.lng,lat:lng_lat.lat},{lng:rainJunction_Lng_lat[1]+ 0.005363,lat:rainJunction_Lng_lat[0]- 0.00402}];
              self.guideLine.sewageLine = rainGuideLine;
              //开始渲染
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
                self. selectConduits.sewageConduits.push(conduit);
              })
            })
            return true;
          }
        }
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



