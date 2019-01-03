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
  import {
    geojson2cytoscape,
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
    props: ['isHideAllSubcatchments', 'isHideDaolu', 'isHideShizheng', 'isHideLvdi', 'isHideJuzhu', 'isHideZhengfu', 'isHideGongye', 'isHideShangye',
      'isHideAllConduits', 'isHideRainConduits', 'isHideSewageConduits',
      'isHideAllOutfalls', 'isHideMergeOutfalls', 'isHideRainOutfalls', 'isHideSewageOutfalls',
      'isHideCompanys'],
    data() {
      return {
        isLoading: false,
        map: {},
        projectId: '',
        shapes: [],
        geojson: {
          'type': 'FeatureCollection',
          'features': []
        },
        mapData: {
          conduits: [],
          outfalls: [],
          junctions: [],
          subcatchments: [],
          companies: []
        },
      }
    },
    computed: {
      companies(){
        let self = this;
        return _.reject(self.shapes, item => {
          return item.category !== 'COMPANY';
        })
      },
      outfalls() {
        let self = this;
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS';
          }),
          rainOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '雨水排水口';
          }),
          sewageOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '污水排口';
          }),
          meregeOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '混流排口';
          })
        };
      },
      conduits() {
        let self = this;
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS';
          }),
          rainConduits: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS' || item.properties.properties.leixing !== '雨水管';
          }),
          sewageConduits: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS' || item.properties.properties.leixing !== '污水管';
          })
        };
      },
      subcatchments() {
        let self = this;
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'SUBCATCHMENTS';
          }),
          road: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || (YDLX !== '道路' && !/^[S][^A-Za-z]$/.test(YDLX));
          }),
          shiZheng: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || !/^[U][^A-Za-z]$/.test(YDLX);
          }),
          lvDi: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || !/^[G,E][^A-Za-z]/.test(YDLX);
          }),
          juZhuYongDi: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[R][^A-Za-z]/.test(YDLX);
          }),
          zhengFu: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || !/^[G][I][C]/.test(YDLX);
          }),
          gongYe: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || !/^[M]/.test(YDLX);
          }),
          shangYe: _.reject(self.shapes, item => {
            let YDLX = item.properties.properties.YDLX;
            return item.category !== 'SUBCATCHMENTS' || !/^[C][^A-Za-z]/.test(YDLX);
          })
        };
      }
    },
    watch: {
      isHideAllSubcatchments: function () {
        this.isHideAllSubcatchments ? this.showAllSubcatchments() : this.hideAllSubcatchments()
      },
      isHideDaolu: function () {
        this.isHideDaolu ? this.showDaolu() : this.hideDaolu();
      },
      isHideShizheng: function () {
        this.isHideShizheng ? this.showShizheng() : this.hideShizheng()
      },
      isHideLvdi: function () {
        this.isHideLvdi ? this.showLvdi() : this.hideLvdi()
      },
      isHideJuzhu: function () {
        this.isHideJuzhu ? this.showJuzhu() : this.hideJuzhu();
      },
      isHideZhengfu: function () {
        this.isHideZhengfu ? this.showZhengfu() : this.hideZhengfu();
      },
      isHideGongye: function () {
        this.isHideGongye ? this.showGongye() : this.hideGongye();
      },
      isHideShangye: function () {
        this.isHideShangye ? this.showShangye() : this.hideShangye();
      },
      //
      isHideAllConduits: function () {
        this.isHideAllConduits ? this.showAllConduits() : this.hideAllConduits()
      },
      isHideRainConduits: function () {
        this.isHideRainConduits ? this.showRainConduits() : this.hideRainConduits()
      },
      isHideSewageConduits: function () {
        this.isHideSewageConduits ? this.showSewageConduits() : this.hideSewageConduits()
      },
      isHideAllOutfalls: function () {
        this.isHideAllOutfalls ? this.showAllOutfalls() : this.hideAllOutfalls()
      },
      isHideMergeOutfalls: function () {
        this.isHideMergeOutfalls ? this.showMergeOutfalls() : this.hideMergeOutfalls()
      },
      isHideRainOutfalls: function () {
        this.isHideRainOutfalls ? this.showRainOutfalls() : this.hideRainOutfalls()
      },
      isHideSewageOutfalls: function () {
        this.isHideSewageOutfalls ? this.showSewageOutfalls() : this.hideSewageOutfalls()
      },
      isHideCompanys: function () {
        this.isHideCompanys ? this.showAllCompanys() : this.hideAllCompanys()
      }
    },
    created() {
      this.getProjectId();
      this.getDataInfo();
    },
    mounted() {
      this.createMap();
      this.UpdateData();

    },
    methods: {
      //获取项目ID
      getProjectId() {
        this.projectId = this.$route.query.projectId;
      },
      createMap() {
        let map = new BMap.Map("allmap", {minZoom: 15, maxZoom: 25});    // 创建Map实例
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
        let self = this;
        let projectId = self.projectId;
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
          let data = resp.data;
          self.shapes = JSON.parse(JSON.stringify(resp.data));
          _.each(self.shapes, function (item) {
            item.properties = JSON.parse(item.properties)
          })
          self.geojson['features'] = _.map(self.shapes, shape => shape.properties)
          self.cy = geojson2cytoscape(self.geojson)
          this.getDataInfoSuccess(self.shapes);
        })
      },
      //处理请求过来的所有数据
      getDataInfoSuccess(data) {
        let self = this;
        for (let i = 0; i < data.length; i++) {
          let category = data[i].category;
          let properties = data[i].properties;
          let id = data[i].id;
          let mapData = {
            id: id,
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
              self.mapData.companies.push(mapData);
              break;
          }
        }
        let mapData = self.mapData
        self.$store.dispatch('getMapData', mapData)
        self.renderingSubcatchments();
        self.renderingConduits();
        self.renderringJunctions();
        self.renderringOutfalls();
        self.renderringCompanys();
      },
      //渲染地块
      renderingSubcatchments() {
        let self = this;
        let map = this.map
        let subcatchmentsData = self.mapData.subcatchments;
        let subcatchmens = [];
        for (let i = 0; i < subcatchmentsData.length; i++) {
          let subcatchment = {
            id: subcatchmentsData[i].id,
            properties: subcatchmentsData[i].properties
          }
          subcatchmens.push(subcatchment)
        }
        // 根据用地类型渲染
        self.drawSubcatchments(subcatchmens)
      },
      //渲染管线
      renderingConduits() {
        let self = this;
        let map = this.map
        let conduitsData = self.mapData.conduits;
        let conduits = [];
        for (let i = 0; i < conduitsData.length; i++) {
          let subcatchment = {
            properties: conduitsData[i].properties
          }
          conduits.push(subcatchment)
        }
        self.drawConduits(conduits);

      },
      //渲染检查井
      renderringJunctions() {
        let self = this;
        let map = this.map
        let junctionsData = self.mapData.junctions;
        let junctions = [];
        for (let i = 0; i < junctionsData.length; i++) {
          let junction = {
            properties: junctionsData[i].properties
          }
          junctions.push(junction)
        }
        //  渲染检查井
        _each(junctions, function (index, junction) {
          let lng_lat = junction.properties.geometry.coordinates;
          let info = junction.properties.properties;
          let leixing = info.leixing;
          let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);

          //  渲染管线
          let circle = null;
          if (leixing == '雨水检查井') {
            circle = new BMap.Circle(point, 3, {fillColor: "blue", strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3})
          }
          if (leixing == '污水检查井') {
            circle = new BMap.Circle(point, 3, {fillColor: "#e868f2", strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3})
          }
          map.addOverlay(circle);
        })
      },
      //渲染排口
      renderringOutfalls() {
        let self = this;
        let map = this.map
        let outfallsData = self.mapData.outfalls;
        let outfalls = [];
        for (let i = 0; i < outfallsData.length; i++) {
          let outfall = {
            properties: outfallsData[i].properties
          }
          outfalls.push(outfall)
        }
        self.drawOutfalls(outfalls);

      },
      //渲染工业企业
      renderringCompanys() {
        let self = this;
        let map = this.map
        let companysData = self.mapData.companies;
        let companies = [];
        for (let i = 0; i < companysData.length; i++) {
          let outfall = {
            properties: companysData[i].properties
          }
          companies.push(outfall)
        }
        self.drawCompanys(companies);
      },
      //绘制地块
      drawSubcatchments(data) {
        let self = this;
        let map = this.map
        //正则 匹配道路 的正则
        let daoluReg = /^[S][^A-Za-z]$/;
        // 市政公用设施用地
        let shiZhengReg = /^[U][^A-Za-z]$/;
        // 绿地
        let lvDiReg = /^[G,E][^A-Za-z]/;
        // 居住用地
        let juZhuYongDiReg = /^[R][^A-Za-z]/;
        // 政府
        let zhengFuReg = /^[G][I][C]/;
        // 工业
        let gongYeReg = /^[M]/;
        // 商业服务业设施用地
        let shangyeReg = /^[C][^A-Za-z]/;
        _each(data, function (index, subcatchment) {
          let id = subcatchment.id;
          let lng_lat = subcatchment.properties.geometry.coordinates;
          let info = subcatchment.properties.properties
          info.type = '地块'
          info.id = id;
          let YDLX = info.YDLX
          let centerLng_lat = info.center;
          let lng_lat_Arr = [];
          let pointArr = [];
          for (let i = 0; i < lng_lat[0].length; i++) {
            lng_lat_Arr.push(lng_lat[0][i])
          }
          for (let i = 0; i < lng_lat_Arr.length; i++) {
            let point = new BMap.Point(lng_lat_Arr[i][1] + 0.005363, lng_lat_Arr[i][0] - 0.00402);
            pointArr.push(point)
          }

          let polygon = null;
          if (YDLX == '道路' || daoluReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(242,242,242)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '道路'
          }
          if (shiZhengReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,0,254)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '市政'
          }
          if (lvDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,255,1)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '绿地'
          }
          if (juZhuYongDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,255,1)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '居住'
          }
          if (zhengFuReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,0,255)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '政府'
          }
          if (gongYeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(127,63,1)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '工业'
          }
          if (shangyeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(245,0,0)', fillOpacity: 0.3})
            polygon.type = info.type
            polygon.sonType = '商业'
          }
          map.addOverlay(polygon);
          //地块点击事件
          polygon.addEventListener("click", function () {
            self.$store.dispatch('getInfo', info)
            //  获得地块中心点，创建 marker
            let point = new BMap.Point(centerLng_lat[1] + 0.005363, centerLng_lat[0] - 0.00402);
            let marker = new BMap.Marker(point);
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
      drawConduits(data) {
        let self = this;
        let map = this.map
        _each(data, function (index, conduit) {
          let lng_lat = conduit.properties.geometry.coordinates;
          let info = conduit.properties.properties;
          info.type = '管线'
          let leixing = info.leixing;
          let pointArr = [];
          for (let i = 0; i < lng_lat.length; i++) {
            let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
            pointArr.push(point);
          }
          //  渲染管线
          let polyline = null;
          if (leixing == '雨水管') {
            polyline = new BMap.Polyline(pointArr, {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 1})
            polyline.type = '雨水管';
          }
          if (leixing == '污水管') {
            polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 3, strokeOpacity: 1})
            polyline.type = '污水管';
          }
          map.addOverlay(polyline);
          polyline.addEventListener("mouseover", function () {
            this.setStrokeWeight(10);

          });
          polyline.addEventListener("mouseout", function () {
            // this.setStrokeColor('blue')
            this.setStrokeWeight(3);
          });
          //管线点击事件
          polyline.addEventListener("click", function () {
            console.log('点击管线：', info)
            self.$store.dispatch('getInfo', info)
          });
        })
      },
      //绘制排口
      drawOutfalls(data) {
        let self = this;
        let map = this.map
        _each(data, function (index, outfall) {
          let lng_lat = outfall.properties.geometry.coordinates;
          let info = outfall.properties.properties;
          info.type = '排口'
          let leixing = info.leixing;
          let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
          //  渲染排口
          let circle = null;
          if (leixing == '雨水排水口') {
            circle = new BMap.Circle(point, 10, {fillColor: "rgb(111,252,243)", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
            circle.leixing = "雨水排水口"

          }
          if (leixing == '污水排口') {
            circle = new BMap.Circle(point, 20, {fillColor: "#e868f2", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
            circle.leixing = "污水排口"
          }
          if (leixing == '混流排口') {
            circle = new BMap.Circle(point, 5, {fillColor: "rgba(117,86,86,1)", strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3})
            circle.leixing = "混流排口"
          }
          map.addOverlay(circle);
          // 排口点击事件
          circle.addEventListener("click", function () {
            self.test();
            self.clearSelectConduits();
            self.$store.dispatch('getInfo', info)
            this.setFillColor('red');
            this.type = '选中的排口'
          });
        })
      },
      //绘制工业企业
      drawCompanys(data) {
        let self = this;
        let map = this.map
        _each(data, function (index, company) {
          let lng_lat = company.properties.geometry.coordinates;
          let info = company.properties.properties;
          info.type = '企业'
          let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
          info.geos = [lng_lat[1] + 0.005363, lng_lat[0] - 0.00402]
          let myIcon = new BMap.Icon("/static/icon/companys_32.ico", new BMap.Size(32, 32));
          let marker = new BMap.Marker(point, {icon: myIcon});
          marker.type = info.type;
          // //  渲染工业企业
          map.addOverlay(marker);

          //工业企业点击事件
          marker.addEventListener("click", function () {
            self.$store.dispatch('getInfo', info)
            self.test();
          });
        })
      },
      // 覆盖物分类
      test() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
            overlay.Circle[i].setFillColor('rgb(111,252,243)');
          }
          if (leixing == '污水排口') {
            overlay.Circle[i].setFillColor('#e868f2');
          }
          if (leixing == '混流排口') {
            overlay.Circle[i].setFillColor('rgba(117,86,86,1)');
          }
        }
        // 标注覆盖物
        for (let i = 0; i < overlay.Marker.length; i++) {
          let marker = overlay.Marker[i];
          let type = overlay.Marker[i].type;
          if (type == '标注') {
            map.removeOverlay(marker)
          }
        }
        //
      },
      //查询出来的覆盖物
      test1() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }

      },
      //所有的覆盖物的变化
      test2() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let type = overlay.Circle[i].type
          let leixing = overlay.Circle[i].leixing
          if (leixing == '雨水排水口') {
            overlay.Circle[i].setFillColor('rgb(193 223 255)');
          }
          if (leixing == '污水排口') {
            if (type == undefined) {
              overlay.Circle[i].setFillColor('rgb(250,228,252)');
            }
          }
          if (leixing == '混流排口') {
            overlay.Circle[i].setFillColor('#E8E8E8');
          }
        }
        //   地块覆盖物
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].setFillOpacity(0.025);
          overlay.Polygon[i].setStrokeColor("rgba(128,128,128,0.1)");
        }
        //   管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let leixing = overlay.Polyline[i].type

          if (leixing == '雨水管') {
            overlay.Polyline[i].setStrokeColor('rgb(193 223 255)');
          }
          if (leixing == '污水管') {
            overlay.Polyline[i].setStrokeColor('rgb(250 228 252)');

          }
        }
        // 企业覆盖物
        for (let i = 0; i < overlay.Marker.length; i++) {
          map.removeOverlay(overlay.Marker[i])
        }

      },
      //清除查询出来的管线
      clearSelectConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //查出来的污水管
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '查出来的污水管') {
            map.removeOverlay(overlay.Polyline[i])
          }
          if (type == '查出来的雨水管') {
            map.removeOverlay(overlay.Polyline[i])
          }
        }
      },
      //排口查询上游管线
      handleSelectConduits(outFallName) {
        let self = this;
        self.test2();
        request('shapes', {
          params: {
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
          let data = JSON.parse(resp.data[0].properties);
          this.SelectConduits(data);
        })
      },
      SelectConduits(data) {
        let self = this;
        let map = self.map;
        let OutFallToConduits = getAncestorConduitsOfOutfall(data, self.cy);
        // 拿到管线渲染
        let dataArr = []
        for (let i = 0; i < OutFallToConduits.length; i++) {
          dataArr[i] = OutFallToConduits[i];
        }
        let conduitsData = dataArr;
        _each(conduitsData, function (index, conduit) {
          let lng_lat = conduit.properties.geometry.coordinates;
          let info = conduit.properties.properties;
          info.type = '管线'
          let leixing = info.leixing;
          let pointArr = [];
          for (let i = 0; i < lng_lat.length; i++) {
            let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
            pointArr.push(point);
          }
          let polyline = null;
          if (leixing == '污水管') {
            polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 4.2, strokeOpacity: 1})
            polyline.type = "查出来的污水管";
          }
          if (leixing == '雨水管') {
            polyline = new BMap.Polyline(pointArr, {strokeColor: "blue", strokeWeight: 4.2, strokeOpacity: 1})
            polyline.type = "查出来的雨水管";
          }
          map.addOverlay(polyline);
          //管线点击事件
          polyline.addEventListener("click", function () {
            self.$store.dispatch('getInfo', info)
          });
        })
      },
      // 排口查上游地块
      handleSelectSubcatchments(outfallName) {
        let self = this;
        self.clearSelectConduits();
        self.test2()
        //正则 匹配道路 的正则
        let daoluReg = /^[S][^A-Za-z]$/;
        // 市政公用设施用地
        let shiZhengReg = /^[U][^A-Za-z]$/;
        // 绿地
        let lvDiReg = /^[G,E][^A-Za-z]/;
        // 居住用地
        let juZhuYongDiReg = /^[R][^A-Za-z]/;
        // 政府
        let zhengFuReg = /^[G][I][C]/;
        // 工业
        let gongYeReg = /^[M]/;
        // 商业服务业设施用地
        let shangyeReg = /^[C][^A-Za-z]/;
        let map = self.map;
        let subcatchmentsToOutfall = _.chain(self.subcatchments.all)
          .map(item => item.properties)
          .reject(item => {
            return item.properties.WP !== outfallName && item.properties.YP !== outfallName;
          }).value()
        // let outfallType = outfallName.substring(0, 2);
        // if (outfallType === 'WP') {
        //   for (let i = 0; i < self.subcatchments.length; i++) {
        //     if (self.subcatchments[i].properties.WP === outfallName) {
        //       subcatchmentsToOutfall.push(self.subcatchments[i])
        //     }
        //   }
        // }
        // if (outfallType === 'YP') {
        //   for (let i = 0; i <self.subcatchments.length; i++) {
        //     if (self.subcatchments[i].properties.YP === outfallName) {
        //       subcatchmentsToOutfall.push(self.subcatchments[i])
        //     }
        //   }
        // }
        // 拿到地块渲染地块
        _each(subcatchmentsToOutfall, function (index, subcatchment) {
          let lng_lat = subcatchment.geometry.coordinates;
          let info = subcatchment.properties;
          let centerLng_lat = info.center;
          info.type = '地块'
          let YDLX = info.YDLX
          let lng_lat_Arr = [];
          let pointArr = [];
          for (let i = 0; i < lng_lat[0].length; i++) {
            lng_lat_Arr.push(lng_lat[0][i])
          }
          for (let i = 0; i < lng_lat_Arr.length; i++) {
            let point = new BMap.Point(lng_lat_Arr[i][1] + 0.005363, lng_lat_Arr[i][0] - 0.00402);
            pointArr.push(point)
          }
          //渲染地块
          let polygon = null
          if (YDLX == '道路' || daoluReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(242,242,242)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (shiZhengReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,0,254)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (lvDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,255,1)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (juZhuYongDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,255,1)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (zhengFuReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,0,255)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (gongYeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(127,63,1)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          if (shangyeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, {strokeColor: "rgba(128,128,128,1)", strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(245,0,0)', fillOpacity: 0.5})
            polygon.type = info.type
          }
          map.addOverlay(polygon);
          //  地块点击事件
          polygon.addEventListener("click", function () {
            self.$store.dispatch('getInfo', info)
            self.test();
            //  获得地块中心点，创建 marker
            let point = new BMap.Point(centerLng_lat[1] + 0.005363, centerLng_lat[0] - 0.00402);
            let marker = new BMap.Marker(point);
            marker.type = '标注'
            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          });
        })
      },
      //地块查下游雨水管道+排口
      handleSubcatchmentsSelectRainConduits(data) {
        let self = this;
        self.test2();
        request('shapes', {
          params: {
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
          let data = JSON.parse(resp.data[0].properties);
          data.businessType = "SUBCATCHMENTS";
          this.SubcatchmentsSelectRainConduits(data);
        })
      },
      SubcatchmentsSelectRainConduits(data) {
        let self = this;
        let map = self.map;
        let ConduitsType = '雨水管'
        let conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType);
        //渲染雨水管线
        let dataArr = []
        for (let i = 0; i < conduits.length; i++) {
          dataArr[i] = conduits[i].properties;
        }
        let conduitsData = dataArr;
        //渲染引导线
        let rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        let centerPoint = data.properties.center
        let polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402),
        ], {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed'});
        map.addOverlay(polyline);
        // 渲染管线
        _each(conduitsData, function (index, conduit) {
          let lng_lat = conduit.geometry.coordinates;
          let info = conduit.properties;
          info.type = '管线'
          let leixing = info.leixing;
          let pointArr = [];
          for (let i = 0; i < lng_lat.length; i++) {
            let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
            pointArr.push(point);
          }
          let polyline = new BMap.Polyline(pointArr, {strokeColor: "blue", strokeWeight: 4.5, strokeOpacity: 1})
          map.addOverlay(polyline);
        })
        //拿到排口 渲染排口
        let rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType);
        _each(rainOutfall, function (index, outfall) {
          let lng_lat = outfall.properties.geometry.coordinates;
          let info = outfall.properties.properties;
          info.type = '排口'
          let leixing = info.leixing;
          let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
          let circle = new BMap.Circle(point, 10, {fillColor: "rgb(111,252,243)", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
          circle.leixing = "雨水排水口"
          map.addOverlay(circle);
        })
      },
      //地块查询下游污水管道+排口
      handleSubcatchmentsSelectSewageConduits(data) {
        let self = this;
        self.test2();
        request('shapes', {
          params: {
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
          let data = JSON.parse(resp.data[0].properties);
          data.businessType = "SUBCATCHMENTS";
          this.SubcatchmentsSelectSewageConduits(data);
        })
      },
      SubcatchmentsSelectSewageConduits(data) {
        let self = this;
        let map = self.map;
        let ConduitsType = '污水管'
        let conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType);
        //渲染雨水管线
        let dataArr = []
        for (let i = 0; i < conduits.length; i++) {
          dataArr[i] = conduits[i].properties;
        }
        let conduitsData = dataArr;
        //渲染引导线
        let rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
        let centerPoint = data.properties.center
        let polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402),
        ], {strokeColor: "#e868f2", strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed'});
        map.addOverlay(polyline);
        // 渲染管线
        _each(conduitsData, function (index, conduit) {
          let lng_lat = conduit.geometry.coordinates;
          let info = conduit.properties;
          info.type = '管线'
          let leixing = info.leixing;
          let pointArr = [];
          for (let i = 0; i < lng_lat.length; i++) {
            let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
            pointArr.push(point);
          }
          let polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 4.5, strokeOpacity: 1})
          map.addOverlay(polyline);
        })
        //拿到排口 渲染排口
        let rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType);
        _each(rainOutfall, function (index, outfall) {
          let lng_lat = outfall.properties.geometry.coordinates;
          let info = outfall.properties.properties;
          info.type = '排口'
          let leixing = info.leixing;
          let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
          let circle = new BMap.Circle(point, 10, {fillColor: "#e868f2", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
          circle.leixing = "污水排水口"
          map.addOverlay(circle);
        })
      },
      //企业查询下游污水管+去向
      handleCompanySelectSewageConduits(data) {
        let self = this;
        self.test2();
        let allmap = self.map;
        let lng_lat = data;
        let overlays = []
        let arr = []
        let subcatchments = this.mapData.subcatchments;
        for (let i = 0; i < subcatchments.length; i++) {
          let properties = subcatchments[i].properties;
          let geos = properties.geometry.coordinates[0]
          let subcatchment = {
            id: subcatchments[i].id,
            geos: geos
          }
          arr.push(subcatchment)
        }
        for (let i = 0; i < subcatchments.length; i++) {
          let point = new BMap.Point(lng_lat[0], lng_lat[1])
          overlays = [];
          for (let j = 0; j < arr[i].geos.length; j++) {
            let points = new BMap.Point(arr[i].geos[j][1] + 0.005363, arr[i].geos[j][0] - 0.00402);
            overlays.push(points)
          }
          let ply = new BMap.Polygon(overlays);
          let result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
          if (result == true) {
            let subcatchmenId = arr[i].id;
            request('shapes', {
              params: {
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
              let feature = JSON.parse(resp.data[0].properties);
              feature.businessType = "SUBCATCHMENTS";
              let ConduitsType = '污水管'
              let conduits = getDescendantConduitsOfSubcatchment(feature, self.cy, ConduitsType);
              let dataArr = []
              for (let i = 0; i < conduits.length; i++) {
                dataArr[i] = conduits[i].properties;
              }
              let conduitsData = dataArr;
              // //获取引导线
              let rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
              let polyline = new BMap.Polyline([
                new BMap.Point(lng_lat[0], lng_lat[1]),
                new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
              ], {strokeColor: "#e868f2", strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed'});
              allmap.addOverlay(polyline);
              _each(conduitsData, function (index, conduit) {
                let lng_lat = conduit.geometry.coordinates;
                let info = conduit.properties;
                info.type = '管线'
                let leixing = info.leixing;
                let pointArr = [];
                for (let i = 0; i < lng_lat.length; i++) {
                  let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
                  pointArr.push(point);
                }
                let polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 4.5, strokeOpacity: 1})
                allmap.addOverlay(polyline);
              })
              //拿到排口渲染排口
              let rainOutfall = getDescendantOutfallsOfSubcatchment(feature, self.cy, ConduitsType);
              _each(rainOutfall, function (index, outfall) {
                if (!outfall.properties.geometry) {
                  console.log(outfall)
                  return 0;
                }

                let lng_lat = outfall.properties.geometry.coordinates;
                let info = outfall.properties.properties;
                info.type = '排口'
                let leixing = info.leixing;
                let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
                let circle = new BMap.Circle(point, 10, {fillColor: "#e868f2", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
                circle.leixing = "污水排水口"
                allmap.addOverlay(circle);
              })
            })
          }

        }
      },
      // 重新绘制事件
      handleReset() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays()
        for (let i = 0; i < allOverlay.length; i++) {
          map.removeOverlay(allOverlay[i])
        }
        map.clearOverlays();
        if (map.getOverlays() == '') {
          self.renderingSubcatchments();
          self.renderingConduits();
          self.renderringJunctions();
          self.renderringOutfalls();
          self.renderringCompanys();
        }

      },
      //  渲染查询结果
      showResult(data, shapes) {
        let self = this;
        self.shapes = shapes;
        let map = self.map;
        let companies = data.companies;
        let resultData = []
        self.test2();
        let companysData = data.companies;
        let conduitsData = data.conduits;
        let outfallsData = data.outfalls;
        let subcatchmentsData = data.subcatchments;
        //开始判断
        if (subcatchmentsData.length > 0) {
          let subcatchmens = [];
          for (let i = 0; i < subcatchmentsData.length; i++) {
            let subcatchment = {
              id: subcatchmentsData[i].id,
              properties: subcatchmentsData[i].properties
            }
            subcatchmens.push(subcatchment)
          }
          self.drawSubcatchments(subcatchmens);
          /**
           * 1、获取所有企业数据  获取每个企业的坐标   没有转过坐标
           * 2、判断这个点是否在查询出来的地块中  没有转过
           * */
          let selectSubcatchmets = []
          let selectCompanys = [];
          for (let i = 0; i < subcatchmentsData.length; i++) {
            let properties = subcatchmentsData[i].properties;
            let geos = properties.geometry.coordinates[0];
            let selectSubcatchmet = {
              properties: properties,
              overlays: []
            }
            for (let j = 0; j < geos.length; j++) {
              let points = new BMap.Point(geos[j][1], geos[j][0]);
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet)
            resultData.push(properties)
          }
          //工业企业
          for (let i = 0; i < companies.length; i++) {
            let properties = companies[i].properties;

            if (!properties.geometry) {
              console.log(companies[i])
              continue;
            }
            let lng_lat = properties.geometry.coordinates;
            let point = new BMap.Point(lng_lat[1], lng_lat[0])
            let propertie = {
              properties: properties
            }
            let selectCompany = {
              point: point,
              properties: propertie,
            }
            selectCompanys.push(selectCompany)
          }
          let selectCompanysResult = []
          for (let i = 0; i < selectCompanys.length; i++) {
            let point = selectCompanys[i].point;
            for (let j = 0; j < selectSubcatchmets.length; j++) {
              let overlays = selectSubcatchmets[j].overlays
              let ply = new BMap.Polygon(overlays);
              let result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
              if (result == true) {
                selectCompanysResult.push(selectCompanys[i].properties)
              }
            }
          }
          self.drawCompanys(selectCompanysResult)

          // 根据地块查雨水排口 并展示
          let rainOutfalls = [];
          let sewageOutfalls = [];
          for (let i = 0; i < subcatchmentsData.length; i++) {
            let properties = subcatchmentsData[i].properties;
            console.log(properties)
            let ConduitsRain = '雨水管'
            let ConduitsSewage = '污水管'
            let rainOutfall = self.getDescendantOutfallsOfSubcatchment(properties, self.cy, ConduitsRain);
            let conduit = self.getDescendantConduitsOfSubcatchment(properties, self.cy, ConduitsRain);
            let sewageOutfall = self.getDescendantOutfallsOfSubcatchment(properties, self.cy, ConduitsSewage);
            let sewageConduit = self.getDescendantConduitsOfSubcatchment(properties, self.cy, ConduitsSewage)
            if (rainOutfall.length > 0) {
              rainOutfalls.push(rainOutfall[0])
            }
            if (sewageOutfall.length > 0) {
              sewageOutfalls.push(sewageOutfall[0])
            }

            if (conduit.length > 0) {
              let rainJunction_Lng_lat = conduit[0].properties.geometry.coordinates[0];
              let centerPoint = properties.properties.center;
              //渲染引导线
              let polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402),
              ], {strokeColor: "blue", strokeWeight: 1.5, strokeOpacity: 0.5, strokeStyle: 'dashed'});
              map.addOverlay(polyline);
              //渲染管线
              _each(conduit, function (index, conduitData) {
                let lng_lat = conduitData.properties.geometry.coordinates;
                let pointArr = [];
                for (let i = 0; i < lng_lat.length; i++) {
                  let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
                  pointArr.push(point);
                }
                let polyline = new BMap.Polyline(pointArr, {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 1})
                map.addOverlay(polyline);
              })
            }
            if (sewageConduit.length > 0) {
              let sewageJunction_lng_lat = sewageConduit[0].properties.geometry.coordinates[0];
              let centerPoint = properties.properties.center
              //  渲染引导线
              let polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(sewageJunction_lng_lat[1] + 0.005363, sewageJunction_lng_lat[0] - 0.00402),
              ], {strokeColor: "#e868f2", strokeWeight: 1.5, strokeOpacity: 0.5, strokeStyle: 'dashed'});
              map.addOverlay(polyline);
              //渲染管线
              _each(sewageConduit, function (index, conduitData) {
                let lng_lat = conduitData.properties.geometry.coordinates;
                let pointArr = [];
                for (let i = 0; i < lng_lat.length; i++) {
                  let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
                  pointArr.push(point);
                }
                let polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 3, strokeOpacity: 1})
                map.addOverlay(polyline);
              })
            }
          }
          self.drawOutfalls(rainOutfalls);
          self.drawOutfalls(sewageOutfalls);

          //结果合并
          for (let i = 0; i < selectCompanysResult.length; i++) {
            resultData.push(selectCompanysResult[i].properties)
          }
          for (let i = 0; i < rainOutfalls.length; i++) {
            resultData.push(rainOutfalls[i])
          }
          for (let i = 0; i < sewageOutfalls.length; i++) {
            resultData.push(sewageOutfalls[i])
          }
        }
        //排口
        if (outfallsData.length > 0) {
          let outfalls = [];
          for (let i = 0; i < outfallsData.length; i++) {
            let outfall = {
              properties: outfallsData[i].properties
            }
            outfalls.push(outfall)
          }
          self.drawOutfalls(outfalls);

        }
        //管线
        if (conduitsData.length > 0) {
          let self = this;
          let map = this.map
          let conduitsData = self.mapData.conduits;
          let conduits = [];
          for (let i = 0; i < conduitsData.length; i++) {
            let subcatchment = {
              properties: conduitsData[i].properties
            }
            conduits.push(subcatchment)
          }
          self.drawConduits(conduits);
        }
        //企业
        if (companysData.length > 0) {
          let companies = [];
          let selectSubcatchmets = []
          let selectCompanysResult = [];
          let subcatchmentsData = self.mapData.subcatchments;
          //地块数据
          for (let j = 0; j < subcatchmentsData.length; j++) {
            let properties = subcatchmentsData[j].properties

            let geos = properties.geometry.coordinates[0];
            let selectSubcatchmet = {
              properties: properties,
              overlays: []
            }
            for (let i = 0; i < geos.length; i++) {
              let points = new BMap.Point(geos[i][1], geos[i][0]);
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet);
          }
          //企业数据
          for (let i = 0; i < companysData.length; i++) {
            let properties = companysData[i].properties;
            let companyLng_lat = properties.geometry.coordinates;
            let point = new BMap.Point(companyLng_lat [1], companyLng_lat [0]);
            //作比较
            for (let j = 0; j < selectSubcatchmets.length; j++) {
              let overlays = selectSubcatchmets[j].overlays
              let ply = new BMap.Polyoverlaysgon(overlays);
              let result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
              if (result == true) {
                let data = selectSubcatchmets[j].properties;
                let ConduitsType = '污水管'
                let conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType);
                let dataArr = []
                for (let k = 0; k < conduits.length; k++) {
                  dataArr[k] = conduits[k].properties;
                }
                let conduitsData = dataArr;
                //引导线
                let rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0];
                let polyline = new BMap.Polyline([
                  new BMap.Point(companyLng_lat[1] + 0.005363, companyLng_lat[0] - 0.00402),
                  new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402),
                ], {strokeColor: "#e868f2", strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed'});
                map.addOverlay(polyline);
                // //渲染污水管线
                _each(conduitsData, function (index, conduit) {
                  let lng_lat = conduit.geometry.coordinates;
                  let info = conduit.properties;
                  info.type = '管线'
                  let leixing = info.leixing;
                  let pointArr = [];
                  for (let i = 0; i < lng_lat.length; i++) {
                    let point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402);
                    pointArr.push(point);
                  }
                  let polyline = new BMap.Polyline(pointArr, {strokeColor: "#e868f2", strokeWeight: 4.5, strokeOpacity: 1})
                  map.addOverlay(polyline);
                  //拿到排口 渲染排口
                  let rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType);
                  _each(rainOutfall, function (index, outfall) {
                    let lng_lat = outfall.properties.geometry.coordinates;
                    let info = outfall.properties.properties;
                    info.type = '排口'
                    let leixing = info.leixing;
                    let point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402);
                    let circle = new BMap.Circle(point, 10, {fillColor: "#e868f2", strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3})
                    circle.leixing = "污水排水口"
                    map.addOverlay(circle);
                  })
                })

                selectCompanysResult.push(selectSubcatchmets[j])

              }
            }

            let company = {
              properties: companysData[i].properties
            }
            companies.push(company)
          }
          // 画出企业
          self.drawCompanys(companies);
          self.drawSubcatchments(selectCompanysResult)
        }
        //  统计拿到所有数据
        //  数组去重
        let newResultData = _.uniq(resultData, 'id');
        // for(let i =0;i<resultData.length;i++){
        //   let flag = true;
        //   for(let j = 0;j<newResultData.length;j++){
        //     if(resultData[i].id == newResultData[j].id){
        //       flag = false
        //     }
        //   }
        //   if(flag){
        //     newResultData.push(resultData[i]);
        //   }
        // }
        self.$store.dispatch('getResultData', newResultData);
        console.log('查询结束');
      },
      //  隐藏排口
      hideAllOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
            overlay.Circle[i].hide()
          }
          if (leixing == '污水排口') {
            overlay.Circle[i].hide()
          }
          if (leixing == '混流排口') {
            overlay.Circle[i].hide()
          }
        }
      },
      showAllOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
            overlay.Circle[i].show()
          }
          if (leixing == '污水排口') {
            overlay.Circle[i].show()
          }
          if (leixing == '混流排口') {
            overlay.Circle[i].show()
          }
        }
      },
      hideMergeOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
          }
          if (leixing == '污水排口') {

          }
          if (leixing == '混流排口') {
            overlay.Circle[i].hide()
          }
        }
      },
      showMergeOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
          }
          if (leixing == '污水排口') {

          }
          if (leixing == '混流排口') {
            overlay.Circle[i].show()
          }
        }
      },
      hideRainOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
            overlay.Circle[i].hide()
          }
          if (leixing == '污水排口') {

          }
          if (leixing == '混流排口') {
          }
        }
      },
      showRainOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {
            overlay.Circle[i].show()
          }
          if (leixing == '污水排口') {

          }
          if (leixing == '混流排口') {
          }
        }
      },
      hideSewageOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {

          }
          if (leixing == '污水排口') {
            overlay.Circle[i].hide()
          }
          if (leixing == '混流排口') {
          }
        }
      },
      showSewageOutfalls() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          let outfallColor = overlay.Circle[i].getFillColor();
          let leixing = overlay.Circle[i].leixing;
          if (leixing == '雨水排水口') {

          }
          if (leixing == '污水排口') {
            overlay.Circle[i].show()
          }
          if (leixing == '混流排口') {
          }
        }
      },
      // 隐藏管线
      hideAllConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
            overlay.Polyline[i].hide()
          }
          if (type == '雨水管') {
            overlay.Polyline[i].hide()
          }
        }
      },
      showAllConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
            overlay.Polyline[i].show()
          }
          if (type == '雨水管') {
            overlay.Polyline[i].show()
          }
        }
      },
      hideRainConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
          }
          if (type == '雨水管') {
            overlay.Polyline[i].hide()
          }
        }
      },
      showRainConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
          }
          if (type == '雨水管') {
            overlay.Polyline[i].show()
          }
        }
      },
      hideSewageConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
            overlay.Polyline[i].hide()
          }
          if (type == '雨水管') {

          }
        }
      },
      showSewageConduits() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          let type = overlay.Polyline[i].type;
          if (type == '污水管') {
            overlay.Polyline[i].show()
          }
          if (type == '雨水管') {

          }
        }
      },
      //  隐藏地块
      hideAllSubcatchments() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].hide();
        }
      },
      showAllSubcatchments() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].show();
        }
      },
      //隐藏道路
      hideDaolu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '道路') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showDaolu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '道路') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏市政
      hideShizheng() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '市政') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showShizheng() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '市政') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏绿地
      hideLvdi() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '绿地') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showLvdi() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '绿地') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏居住
      hideJuzhu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '居住') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showJuzhu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '居住') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏政府
      hideZhengfu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '政府') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showZhengfu() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '政府') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏工业
      hideGongye() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '工业') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showGongye() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '工业') {
            overlay.Polygon[i].show();
          }
        }
      },
      //隐藏商业
      hideShangye() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '商业') {
            overlay.Polygon[i].hide();
          }
        }
      },
      showShangye() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          let sonType = overlay.Polygon[i].sonType;
          if (sonType == '商业') {
            overlay.Polygon[i].show();
          }
        }
      },
      //  隐藏企业
      hideAllCompanys() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Marker.length; i++) {
          overlay.Marker[i].hide();
        }
      },
      showAllCompanys() {
        let self = this;
        let map = self.map;
        let allOverlay = map.getOverlays();  //获得所有覆盖物
        let overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          let overlayType = allOverlay[i].toString();
          if (overlayType == '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType == '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType == '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType == '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Marker.length; i++) {
          overlay.Marker[i].show();
        }
      },
      //  拓扑查询加快方式
      //  根据地块查下游排口 （管道类型）
      getDescendantOutfallsOfSubcatchment(feature, cy, conduitType) {
        if (feature['geometry']['type'] !== 'Polygon') {
          console.warn('输入的feature不合法：feature的类型应该为Polygon')
          return []
        }
        let center = feature.properties.center;
        let subcatchmentCenterPoint = [center[1], center[0]];
        let nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)
        return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().nodes('[businessType="OUTFALLS"]'), node => {
          return node.data()
        })
      },
      //  根据地块查询下游管道
      getDescendantConduitsOfSubcatchment(feature, cy, conduitType) {
        if (feature['geometry']['type'] !== 'Polygon') {
          console.warn('输入的feature不合法：feature的类型应该为Polygon')
          return []
        }
        let center = feature.properties.center;
        let subcatchmentCenterPoint = [center[1], center[0]];
        let nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)

        return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().edges(), edge => {
          return edge.data()
        })
      },
      //  测试函数
      UpdateData() {
        let self = this;
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
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp => {
          let data = resp.data;
          for (let i = 0; i < data.length; i++) {
            let shapeid = data[i].id
            let feature = JSON.parse(data[i].properties);
            let properties = feature
            if (properties.properties.JSZT == '现状' && properties.properties.JSZT == '已落实海绵') {
              // properties.properties.现状控制率 = properties.properties.规划控制率
              // let dataNew ={
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
  .allmap {
    height: 100%;
    width: 100%;
  }
</style>
