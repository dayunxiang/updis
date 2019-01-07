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
  import _ from 'lodash'

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
          companies: [],
          range: []
        }
      }
    },
    computed: {
      companies() {
        const self = this
        return _.reject(self.shapes, item => {
          return item.category !== 'COMPANY'
        })
      },
      outfalls() {
        const self = this
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS'
          }),
          rainOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '雨水排水口'
          }),
          sewageOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '污水排口'
          }),
          meregeOutfalls: _.reject(self.shapes, item => {
            return item.category !== 'OUTFALLS' || item.properties.properties.leixing !== '混流排口'
          })
        }
      },
      conduits() {
        const self = this
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS'
          }),
          rainConduits: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS' || item.properties.properties.leixing !== '雨水管'
          }),
          sewageConduits: _.reject(self.shapes, item => {
            return item.category !== 'CONDUITS' || item.properties.properties.leixing !== '污水管'
          })
        }
      },
      subcatchments() {
        const self = this
        return {
          all: _.reject(self.shapes, item => {
            return item.category !== 'SUBCATCHMENTS'
          }),
          road: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || (YDLX !== '道路' && !/^[S][^A-Za-z]$/.test(YDLX))
          }),
          shiZheng: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[U][^A-Za-z]$/.test(YDLX)
          }),
          lvDi: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[G,E][^A-Za-z]/.test(YDLX)
          }),
          juZhuYongDi: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[R][^A-Za-z]/.test(YDLX)
          }),
          zhengFu: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[G][I][C]/.test(YDLX)
          }),
          gongYe: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[M]/.test(YDLX)
          }),
          shangYe: _.reject(self.shapes, item => {
            const YDLX = item.properties.properties.YDLX
            return item.category !== 'SUBCATCHMENTS' || !/^[C][^A-Za-z]/.test(YDLX)
          })
        }
      }
    },
    watch: {
      isHideAllSubcatchments: function() {
        this.isHideAllSubcatchments ? this.showAllSubcatchments() : this.hideAllSubcatchments()
      },
      isHideDaolu: function() {
        this.isHideDaolu ? this.showDaolu() : this.hideDaolu()
      },
      isHideShizheng: function() {
        this.isHideShizheng ? this.showShizheng() : this.hideShizheng()
      },
      isHideLvdi: function() {
        this.isHideLvdi ? this.showLvdi() : this.hideLvdi()
      },
      isHideJuzhu: function() {
        this.isHideJuzhu ? this.showJuzhu() : this.hideJuzhu()
      },
      isHideZhengfu: function() {
        this.isHideZhengfu ? this.showZhengfu() : this.hideZhengfu()
      },
      isHideGongye: function() {
        this.isHideGongye ? this.showGongye() : this.hideGongye()
      },
      isHideShangye: function() {
        this.isHideShangye ? this.showShangye() : this.hideShangye()
      },
      //
      isHideAllConduits: function() {
        this.isHideAllConduits ? this.showAllConduits() : this.hideAllConduits()
      },
      isHideRainConduits: function() {
        this.isHideRainConduits ? this.showRainConduits() : this.hideRainConduits()
      },
      isHideSewageConduits: function() {
        this.isHideSewageConduits ? this.showSewageConduits() : this.hideSewageConduits()
      },
      isHideAllOutfalls: function() {
        this.isHideAllOutfalls ? this.showAllOutfalls() : this.hideAllOutfalls()
      },
      isHideMergeOutfalls: function() {
        this.isHideMergeOutfalls ? this.showMergeOutfalls() : this.hideMergeOutfalls()
      },
      isHideRainOutfalls: function() {
        this.isHideRainOutfalls ? this.showRainOutfalls() : this.hideRainOutfalls()
      },
      isHideSewageOutfalls: function() {
        this.isHideSewageOutfalls ? this.showSewageOutfalls() : this.hideSewageOutfalls()
      },
      isHideCompanys: function() {
        this.isHideCompanys ? this.showAllCompanys() : this.hideAllCompanys()
      }
    },
    created() {
      this.getProjectId()
      this.getDataInfo()
  },
    mounted() {
      this.createMap()
      this.UpdateData()
  },
    methods: {
      // 获取项目ID
      getProjectId() {
        this.projectId = this.$route.query.projectId
      },
      createMap() {
        const map = new BMap.Map('allmap', { minZoom: 15, maxZoom: 25 }) // 创建Map实例
        map.centerAndZoom('深圳光明区', 15) // 初始化地图,设置中心点坐标和地图级别
        // 添加地图类型控件
        map.addControl(new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }))
        map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        map.disableDoubleClickZoom() // 禁用双击放大
        this.map = map
      },
      // 根据ID获取所有项目数据
      getDataInfo() {
        const self = this
        const projectId = self.projectId
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: projectId
                }
              }
            }
          }
        }).then(resp => {
          const data = resp.data
          self.shapes = JSON.parse(JSON.stringify(resp.data))
          _.each(self.shapes, function(item) {
            item.properties = JSON.parse(item.properties)
          })
          self.geojson['features'] = _.map(self.shapes, shape => shape.properties)
          self.cy = geojson2cytoscape(self.geojson)
          this.getDataInfoSuccess(self.shapes)
        })
      },
      // 处理请求过来的所有数据
      getDataInfoSuccess(data) {
        const self = this
        for (let i = 0; i < data.length; i++) {
          const category = data[i].category
          const properties = data[i].properties
          const id = data[i].id
          const mapData = {
            id: id,
            category: category,
            properties: properties
          }
          switch (category) {
            case 'SUBCATCHMENTS':
              self.mapData.subcatchments.push(mapData)
              break
            case 'CONDUITS':
              self.mapData.conduits.push(mapData)
              break
            case 'JUNCTIONS':
              self.mapData.junctions.push(mapData)
              break
            case 'OUTFALLS':
              self.mapData.outfalls.push(mapData)
              break
            case 'COMPANY':
              self.mapData.companies.push(mapData)
              break
            case 'RANGE':
              self.mapData.range.push(mapData)
              break
          }
        }
        const mapData = self.mapData
        self.$store.dispatch('getMapData', mapData)
        self.renderingRange(self.mapData.range) // 分区
        self.renderingSubcatchments(self.mapData.subcatchments) // 地块
        self.renderingConduits(self.mapData.conduits) // 管线
        self.renderingJunctions(self.mapData.junctions) // 井
        self.renderingOutfalls(self.mapData.outfalls) // 排口
        self.renderingCompanys(self.mapData.companies) // 公司
      },
      // 渲染地块
      renderingSubcatchments() {
        const self = this
        const subcatchmens = []
        _.each(self.mapData.subcatchments, item => {
          subcatchmens.push({
            id: item.id,
            properties: item.properties
          })
        })
        // 根据用地类型渲染
        self.drawSubcatchments(subcatchmens)
      },
      // 查询范围
      renderingRange(data) {
        const self = this
        const range = []
        _.each(data, item => {
          range.push({
            id: item.id,
            properties: item.properties
          })
        })
        _.each(range, function(subcatchment) {
          const pointArr = []
          _.each(subcatchment.properties.geometry.coordinates[0], item => {
            pointArr.push(new BMap.Point(item[0] + 0.005363, item[1] - 0.00402))
          })
          self.map.addOverlay(new BMap.Polygon(pointArr, {
            strokeColor: 'red',
            strokeStyle: 'dashed',
            strokeWeight: 3,
            strokeOpacity: 1,
            fillOpacity: 0
          }))
        })
      },
      // 渲染管线
      renderingConduits(data) {
        const self = this
        const conduits = []
        _.each(data, item => {
          conduits.push({
            properties: item.properties
          })
        })
        self.drawConduits(conduits)
      },
      // 渲染检查井
      renderingJunctions() {
        const self = this
        const map = this.map
        const junctionsData = self.mapData.junctions
        const junctions = []
        for (let i = 0; i < junctionsData.length; i++) {
          const junction = {
            properties: junctionsData[i].properties
          }
          junctions.push(junction)
        }
        //  渲染检查井
        _each(junctions, function(index, junction) {
          const lng_lat = junction.properties.geometry.coordinates
          const info = junction.properties.properties
          const leixing = info.leixing
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)

          //  渲染管线
          let circle = null
          if (leixing === '雨水检查井') {
            circle = new BMap.Circle(point, 3, { fillColor: 'blue', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
          }
          if (leixing === '污水检查井') {
            circle = new BMap.Circle(point, 3, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
          }
          map.addOverlay(circle)
        })
      },
      // 渲染排口
      renderingOutfalls() {
        const self = this
        const map = this.map
        const outfallsData = self.mapData.outfalls
        const outfalls = []
        for (let i = 0; i < outfallsData.length; i++) {
          const outfall = {
            properties: outfallsData[i].properties
          }
          outfalls.push(outfall)
        }
        self.drawOutfalls(outfalls)
      },
      // 渲染工业企业
      renderingCompanys() {
        const self = this
        const map = this.map
        const companysData = self.mapData.companies
        const companies = []
        for (let i = 0; i < companysData.length; i++) {
          const outfall = {
            properties: companysData[i].properties
          }
          companies.push(outfall)
        }
        self.drawCompanys(companies)
      },
      // 绘制地块
      drawSubcatchments(data) {
        const self = this
        const map = this.map
        // 正则 匹配道路 的正则
        const daoluReg = /^[S][^A-Za-z]$/
        // 市政公用设施用地
        const shiZhengReg = /^[U][^A-Za-z]$/
        // 绿地
        const lvDiReg = /^[G,E][^A-Za-z]/
        // 居住用地
        const juZhuYongDiReg = /^[R][^A-Za-z]/
        // 政府
        const zhengFuReg = /^[G][I][C]/
        // 工业
        const gongYeReg = /^[M]/
        // 商业服务业设施用地
        const shangyeReg = /^[C][^A-Za-z]/
        _.each(data, (subcatchment, index) => {
          subcatchment.properties.properties.type = '地块'
          subcatchment.properties.properties.id = subcatchment.id
          const YDLX = subcatchment.properties.properties.YDLX
          const pointArr = []
          _.each(subcatchment.properties.geometry.coordinates[0], item => {
            pointArr.push(new BMap.Point(item[1] + 0.005363, item[0] - 0.00402))
          })

          let polygon = null
          if (YDLX === '道路' || daoluReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(242,242,242)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '道路'
          }
          if (shiZhengReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,0,254)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '市政'
          }
          if (lvDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,255,1)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '绿地'
          }
          if (juZhuYongDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,255,1)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '居住'
          }
          if (zhengFuReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,0,255)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '政府'
          }
          if (gongYeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(127,63,1)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '工业'
          }
          if (shangyeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(245,0,0)', fillOpacity: 0.3 })
            polygon.type = subcatchment.properties.properties.type
            polygon.sonType = '商业'
          }
          map.addOverlay(polygon)
          // 地块点击事件
          polygon.addEventListener('click', function() {
            self.$store.dispatch('getInfo', subcatchment.properties.properties)
            //  获得地块中心点，创建 marker
            const point = new BMap.Point(subcatchment.properties.properties.center[1] + 0.005363, subcatchment.properties.properties.center[0] - 0.00402)
            const marker = new BMap.Marker(point)
            self.test()
            self.test1()
            marker.type = '标注'
            map.addOverlay(marker) // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
            self.clearSelectConduits()
          })
        })
      },
      // 绘制管线
      drawConduits(data) {
        const self = this
        const map = this.map
        _.each(data, conduit => {
          conduit.properties.properties.type = '管线'
          const pointArr = []
          _.each(conduit.properties.geometry.coordinates, (item) => {
            console.log('🙃')
            pointArr.push(new BMap.Point(item[1] + 0.005363, item[0] - 0.00402))
          })
          //  渲染管线
          let polyline = null
          if (conduit.properties.properties.leixing === '雨水管') {
            polyline = new BMap.Polyline(pointArr, { strokeColor: 'blue', strokeWeight: 3, strokeOpacity: 1 })
            polyline.type = '雨水管'
          }
          if (conduit.properties.properties.leixing === '污水管') {
            polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 3, strokeOpacity: 1 })
            polyline.type = '污水管'
          }
          map.addOverlay(polyline)
          polyline.addEventListener('mouseover', function() {
            this.setStrokeWeight(10)
          })
          polyline.addEventListener('mouseout', function() {
            // this.setStrokeColor('blue')
            this.setStrokeWeight(3)
          })
          // 管线点击事件
          polyline.addEventListener('click', function() {
            console.log('点击管线：', conduit.properties.properties)
            self.$store.dispatch('getInfo', conduit.properties.properties)
          })
        })
      },
      // 绘制排口
      drawOutfalls(data) {
        const self = this
        const map = this.map
        _each(data, function(index, outfall) {
          const lng_lat = outfall.properties.geometry.coordinates
          const info = outfall.properties.properties
          info.type = '排口'
          const leixing = info.leixing
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
          //  渲染排口
          let circle = null
          if (leixing === '雨水排水口') {
            circle = new BMap.Circle(point, 10, { fillColor: 'rgb(111,252,243)', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
            circle.leixing = '雨水排水口'
          }
          if (leixing === '污水排口') {
            circle = new BMap.Circle(point, 20, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
            circle.leixing = '污水排口'
          }
          if (leixing === '混流排口') {
            circle = new BMap.Circle(point, 5, { fillColor: 'rgba(117,86,86,1)', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
            circle.leixing = '混流排口'
          }
          map.addOverlay(circle)
          // 排口点击事件
          circle.addEventListener('click', function() {
            self.test()
            self.clearSelectConduits()
            self.$store.dispatch('getInfo', info)
            this.setFillColor('red')
            this.type = '选中的排口'
          })
        })
      },
      // 绘制工业企业
      drawCompanys(data) {
        const self = this
        const map = this.map
        _each(data, function(index, company) {
          const lng_lat = company.properties.geometry.coordinates
          const info = company.properties.properties
          info.type = '企业'
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
          info.geos = [lng_lat[1] + 0.005363, lng_lat[0] - 0.00402]
          const myIcon = new BMap.Icon('/static/icon/companys_32.ico', new BMap.Size(32, 32))
          const marker = new BMap.Marker(point, { icon: myIcon })
          marker.type = info.type
          // //  渲染工业企业
          map.addOverlay(marker)

          // 工业企业点击事件
          marker.addEventListener('click', function() {
            self.$store.dispatch('getInfo', info)
            self.test()
          })
        })
      },
      // 覆盖物分类
      test() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].setFillColor('rgb(111,252,243)')
          }
          if (leixing === '污水排口') {
            overlay.Circle[i].setFillColor('#e868f2')
          }
          if (leixing === '混流排口') {
            overlay.Circle[i].setFillColor('rgba(117,86,86,1)')
          }
        }
        // 标注覆盖物
        for (let i = 0; i < overlay.Marker.length; i++) {
          const marker = overlay.Marker[i]
          const type = overlay.Marker[i].type
          if (type === '标注') {
            map.removeOverlay(marker)
          }
        }
        //
      },
      // 查询出来的覆盖物
      test1() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
      },
      // 所有的覆盖物的变化
      test2() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const type = overlay.Circle[i].type
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].setFillColor('rgb(193 223 255)')
          }
          if (leixing === '污水排口') {
            if (type === undefined) {
              overlay.Circle[i].setFillColor('rgb(250,228,252)')
            }
          }
          if (leixing === '混流排口') {
            overlay.Circle[i].setFillColor('#E8E8E8')
          }
        }
        //   地块覆盖物
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].setFillOpacity(0.025)
          overlay.Polygon[i].setStrokeColor('rgba(128,128,128,0.1)')
        }
        //   管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const leixing = overlay.Polyline[i].type

          if (leixing === '雨水管') {
            overlay.Polyline[i].setStrokeColor('rgb(193 223 255)')
          }
          if (leixing === '污水管') {
            overlay.Polyline[i].setStrokeColor('rgb(250 228 252)')
          }
        }
        // 企业覆盖物
        for (let i = 0; i < overlay.Marker.length; i++) {
          map.removeOverlay(overlay.Marker[i])
        }
      },
      // 清除查询出来的管线
      clearSelectConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        // 查出来的污水管
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '查出来的污水管') {
            map.removeOverlay(overlay.Polyline[i])
          }
          if (type === '查出来的雨水管') {
            map.removeOverlay(overlay.Polyline[i])
          }
        }
      },
      // 排口查询上游管线
      handleSelectConduits(outFallName) {
        const self = this
        self.test2()
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
          const data = JSON.parse(resp.data[0].properties)
          this.SelectConduits(data)
        })
      },
      SelectConduits(data) {
        const self = this
        const map = self.map
        const OutFallToConduits = getAncestorConduitsOfOutfall(data, self.cy)
        // 拿到管线渲染
        const dataArr = []
        for (let i = 0; i < OutFallToConduits.length; i++) {
          dataArr[i] = OutFallToConduits[i]
        }
        const conduitsData = dataArr
        _each(conduitsData, function(index, conduit) {
          const lng_lat = conduit.properties.geometry.coordinates
          const info = conduit.properties.properties
          info.type = '管线'
          const leixing = info.leixing
          const pointArr = []
          for (let i = 0; i < lng_lat.length; i++) {
            const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
            pointArr.push(point)
          }
          let polyline = null
          if (leixing === '污水管') {
            polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 4.2, strokeOpacity: 1 })
            polyline.type = '查出来的污水管'
          }
          if (leixing === '雨水管') {
            polyline = new BMap.Polyline(pointArr, { strokeColor: 'blue', strokeWeight: 4.2, strokeOpacity: 1 })
            polyline.type = '查出来的雨水管'
          }
          map.addOverlay(polyline)
          // 管线点击事件
          polyline.addEventListener('click', function() {
            self.$store.dispatch('getInfo', info)
          })
        })
      },
      // 排口查上游地块
      handleSelectSubcatchments(outfallName) {
        const self = this
        self.clearSelectConduits()
        self.test2()
        // 正则 匹配道路 的正则
        const daoluReg = /^[S][^A-Za-z]$/
        // 市政公用设施用地
        const shiZhengReg = /^[U][^A-Za-z]$/
        // 绿地
        const lvDiReg = /^[G,E][^A-Za-z]/
        // 居住用地
        const juZhuYongDiReg = /^[R][^A-Za-z]/
        // 政府
        const zhengFuReg = /^[G][I][C]/
        // 工业
        const gongYeReg = /^[M]/
        // 商业服务业设施用地
        const shangyeReg = /^[C][^A-Za-z]/
        const map = self.map
        const subcatchmentsToOutfall = _.chain(self.subcatchments.all)
          .map(item => item.properties)
          .reject(item => {
            return item.properties.WP !== outfallName && item.properties.YP !== outfallName
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
        _each(subcatchmentsToOutfall, function(index, subcatchment) {
          const lng_lat = subcatchment.geometry.coordinates
          const info = subcatchment.properties
          const centerLng_lat = info.center
          info.type = '地块'
          const YDLX = info.YDLX
          const lng_lat_Arr = []
          const pointArr = []
          for (let i = 0; i < lng_lat[0].length; i++) {
            lng_lat_Arr.push(lng_lat[0][i])
          }
          for (let i = 0; i < lng_lat_Arr.length; i++) {
            const point = new BMap.Point(lng_lat_Arr[i][1] + 0.005363, lng_lat_Arr[i][0] - 0.00402)
            pointArr.push(point)
          }
          // 渲染地块
          let polygon = null
          if (YDLX === '道路' || daoluReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(242,242,242)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (shiZhengReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,0,254)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (lvDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(0,255,1)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (juZhuYongDiReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,255,1)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (zhengFuReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(255,0,255)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (gongYeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(127,63,1)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          if (shangyeReg.test(YDLX)) {
            polygon = new BMap.Polygon(pointArr, { strokeColor: 'rgba(128,128,128,1)', strokeWeight: 1, strokeOpacity: 1, fillColor: 'rgb(245,0,0)', fillOpacity: 0.5 })
            polygon.type = info.type
          }
          map.addOverlay(polygon)
          //  地块点击事件
          polygon.addEventListener('click', function() {
            self.$store.dispatch('getInfo', info)
            self.test()
            //  获得地块中心点，创建 marker
            const point = new BMap.Point(centerLng_lat[1] + 0.005363, centerLng_lat[0] - 0.00402)
            const marker = new BMap.Marker(point)
            marker.type = '标注'
            map.addOverlay(marker) // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
          })
        })
      },
      // 地块查下游雨水管道+排口
      handleSubcatchmentsSelectRainConduits(data) {
        const self = this
        self.test2()
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
          const data = JSON.parse(resp.data[0].properties)
          data.businessType = 'SUBCATCHMENTS'
          this.SubcatchmentsSelectRainConduits(data)
        })
      },
      SubcatchmentsSelectRainConduits(data) {
        const self = this
        const map = self.map
        const ConduitsType = '雨水管'
        const conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType)
        // 渲染雨水管线
        const dataArr = []
        for (let i = 0; i < conduits.length; i++) {
          dataArr[i] = conduits[i].properties
        }
        const conduitsData = dataArr
        // 渲染引导线
        const rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0]
        const centerPoint = data.properties.center
        const polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
        ], { strokeColor: 'blue', strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed' })
        map.addOverlay(polyline)
        // 渲染管线
        _each(conduitsData, function(index, conduit) {
          const lng_lat = conduit.geometry.coordinates
          const info = conduit.properties
          info.type = '管线'
          const leixing = info.leixing
          const pointArr = []
          for (let i = 0; i < lng_lat.length; i++) {
            const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
            pointArr.push(point)
          }
          const polyline = new BMap.Polyline(pointArr, { strokeColor: 'blue', strokeWeight: 4.5, strokeOpacity: 1 })
          map.addOverlay(polyline)
        })
        // 拿到排口 渲染排口
        const rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType)
        _each(rainOutfall, function(index, outfall) {
          const lng_lat = outfall.properties.geometry.coordinates
          const info = outfall.properties.properties
          info.type = '排口'
          const leixing = info.leixing
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
          const circle = new BMap.Circle(point, 10, { fillColor: 'rgb(111,252,243)', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
          circle.leixing = '雨水排水口'
          map.addOverlay(circle)
        })
      },
      // 地块查询下游污水管道+排口
      handleSubcatchmentsSelectSewageConduits(data) {
        const self = this
        self.test2()
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
          const data = JSON.parse(resp.data[0].properties)
          data.businessType = 'SUBCATCHMENTS'
          this.SubcatchmentsSelectSewageConduits(data)
        })
      },
      SubcatchmentsSelectSewageConduits(data) {
        const self = this
        const map = self.map
        const ConduitsType = '污水管'
        const conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType)
        // 渲染雨水管线
        const dataArr = []
        for (let i = 0; i < conduits.length; i++) {
          dataArr[i] = conduits[i].properties
        }
        const conduitsData = dataArr
        // 渲染引导线
        const rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0]
        const centerPoint = data.properties.center
        const polyline = new BMap.Polyline([
          new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
          new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
        ], { strokeColor: '#e868f2', strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed' })
        map.addOverlay(polyline)
        // 渲染管线
        _each(conduitsData, function(index, conduit) {
          const lng_lat = conduit.geometry.coordinates
          const info = conduit.properties
          info.type = '管线'
          const leixing = info.leixing
          const pointArr = []
          for (let i = 0; i < lng_lat.length; i++) {
            const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
            pointArr.push(point)
          }
          const polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 4.5, strokeOpacity: 1 })
          map.addOverlay(polyline)
        })
        // 拿到排口 渲染排口
        const rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType)
        _each(rainOutfall, function(index, outfall) {
          const lng_lat = outfall.properties.geometry.coordinates
          const info = outfall.properties.properties
          info.type = '排口'
          const leixing = info.leixing
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
          const circle = new BMap.Circle(point, 10, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
          circle.leixing = '污水排水口'
          map.addOverlay(circle)
        })
      },
      // 企业查询下游污水管+去向
      handleCompanySelectSewageConduits(data) {
        const self = this
        self.test2()
        const allmap = self.map
        const lng_lat = data
        let overlays = []
        const arr = []
        const subcatchments = this.mapData.subcatchments
        for (let i = 0; i < subcatchments.length; i++) {
          const properties = subcatchments[i].properties
          const geos = properties.geometry.coordinates[0]
          const subcatchment = {
            id: subcatchments[i].id,
            geos: geos
          }
          arr.push(subcatchment)
        }
        for (let i = 0; i < subcatchments.length; i++) {
          const point = new BMap.Point(lng_lat[0], lng_lat[1])
          overlays = []
          for (let j = 0; j < arr[i].geos.length; j++) {
            const points = new BMap.Point(arr[i].geos[j][1] + 0.005363, arr[i].geos[j][0] - 0.00402)
            overlays.push(points)
          }
          const ply = new BMap.Polygon(overlays)
          const result = BMapLib.GeoUtils.isPointInPolygon(point, ply)
          if (result === true) {
            const subcatchmenId = arr[i].id
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
              const feature = JSON.parse(resp.data[0].properties)
              feature.businessType = 'SUBCATCHMENTS'
              const ConduitsType = '污水管'
              const conduits = getDescendantConduitsOfSubcatchment(feature, self.cy, ConduitsType)
              const dataArr = []
              for (let i = 0; i < conduits.length; i++) {
                dataArr[i] = conduits[i].properties
              }
              const conduitsData = dataArr
              // //获取引导线
              const rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0]
              const polyline = new BMap.Polyline([
                new BMap.Point(lng_lat[0], lng_lat[1]),
                new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
              ], { strokeColor: '#e868f2', strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed' })
              allmap.addOverlay(polyline)
              _each(conduitsData, function(index, conduit) {
                const lng_lat = conduit.geometry.coordinates
                const info = conduit.properties
                info.type = '管线'
                const leixing = info.leixing
                const pointArr = []
                for (let i = 0; i < lng_lat.length; i++) {
                  const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
                  pointArr.push(point)
                }
                const polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 4.5, strokeOpacity: 1 })
                allmap.addOverlay(polyline)
              })
              // 拿到排口渲染排口
              const rainOutfall = getDescendantOutfallsOfSubcatchment(feature, self.cy, ConduitsType)
              _each(rainOutfall, function(index, outfall) {
                if (!outfall.properties.geometry) {
                  console.log(outfall)
                  return 0
                }

                const lng_lat = outfall.properties.geometry.coordinates
                const info = outfall.properties.properties
                info.type = '排口'
                const leixing = info.leixing
                const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
                const circle = new BMap.Circle(point, 10, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
                circle.leixing = '污水排水口'
                allmap.addOverlay(circle)
              })
            })
          }
        }
      },
      // 重新绘制事件
      handleReset() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays()
        for (let i = 0; i < allOverlay.length; i++) {
          map.removeOverlay(allOverlay[i])
        }
        map.clearOverlays()
        if (map.getOverlays() === '') {
          self.renderingSubcatchments()
          self.renderingConduits()
          self.renderingJunctions()
          self.renderingOutfalls()
          self.renderingCompanys()
        }
      },
      //  渲染查询结果
      showResult(data, shapes) {
        const self = this
        self.shapes = shapes
        const map = self.map
        const companies = data.companies
        const resultData = []
        self.test2()
        const companysData = data.companies
        const conduitsData = data.conduits
        const outfallsData = data.outfalls // 排口
        const subcatchmentsData = data.subcatchments
        // 分区
        if (data.range.length) {
          self.renderingRange(data.range)
        }
        // 开始判断
        if (subcatchmentsData.length > 0) {
          const subcatchmens = []
          for (let i = 0; i < subcatchmentsData.length; i++) {
            const subcatchment = {
              id: subcatchmentsData[i].id,
              properties: subcatchmentsData[i].properties
            }
            subcatchmens.push(subcatchment)
          }
          self.drawSubcatchments(subcatchmens)
          /**
         * 1、获取所有企业数据  获取每个企业的坐标   没有转过坐标
         * 2、判断这个点是否在查询出来的地块中  没有转过
         * */
          const selectSubcatchmets = []
          const selectCompanys = []
          for (let i = 0; i < subcatchmentsData.length; i++) {
            const properties = subcatchmentsData[i].properties
            const geos = properties.geometry.coordinates[0]
            const selectSubcatchmet = {
              properties: properties,
              overlays: []
            }
            for (let j = 0; j < geos.length; j++) {
              const points = new BMap.Point(geos[j][1], geos[j][0])
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet)
            resultData.push(properties)
          }
          // 工业企业
          for (let i = 0; i < companies.length; i++) {
            const properties = companies[i].properties

            if (!properties.geometry) {
              console.log(companies[i])
              continue
            }
            const lng_lat = properties.geometry.coordinates
            const point = new BMap.Point(lng_lat[1], lng_lat[0])
            const propertie = {
              properties: properties
            }
            const selectCompany = {
              point: point,
              properties: propertie
            }
            selectCompanys.push(selectCompany)
          }
          const selectCompanysResult = []
          for (let i = 0; i < selectCompanys.length; i++) {
            const point = selectCompanys[i].point
            for (let j = 0; j < selectSubcatchmets.length; j++) {
              const overlays = selectSubcatchmets[j].overlays
              const ply = new BMap.Polygon(overlays)
              const result = BMapLib.GeoUtils.isPointInPolygon(point, ply)
              if (result === true) {
                selectCompanysResult.push(selectCompanys[i].properties)
              }
            }
          }
          self.drawCompanys(selectCompanysResult)

          // 根据地块查雨水排口 并展示
          const rainOutfalls = []
          const sewageOutfalls = []
          for (let i = 0; i < subcatchmentsData.length; i++) {
            const properties = subcatchmentsData[i].properties
            console.log(properties)
            const ConduitsRain = '雨水管'
            const ConduitsSewage = '污水管'
            const rainOutfall = self.getDescendantOutfallsOfSubcatchment(properties, self.cy, ConduitsRain)
            const conduit = self.getDescendantConduitsOfSubcatchment(properties, self.cy, ConduitsRain)
            const sewageOutfall = self.getDescendantOutfallsOfSubcatchment(properties, self.cy, ConduitsSewage)
            const sewageConduit = self.getDescendantConduitsOfSubcatchment(properties, self.cy, ConduitsSewage)
            if (rainOutfall.length > 0) {
              rainOutfalls.push(rainOutfall[0])
            }
            if (sewageOutfall.length > 0) {
              sewageOutfalls.push(sewageOutfall[0])
            }

            if (conduit.length > 0) {
              const rainJunction_Lng_lat = conduit[0].properties.geometry.coordinates[0]
              const centerPoint = properties.properties.center
              // 渲染引导线
              const polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
              ], { strokeColor: 'blue', strokeWeight: 1.5, strokeOpacity: 0.5, strokeStyle: 'dashed' })
              map.addOverlay(polyline)
              // 渲染管线
              _each(conduit, function(index, conduitData) {
                const lng_lat = conduitData.properties.geometry.coordinates
                const pointArr = []
                for (let i = 0; i < lng_lat.length; i++) {
                  const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
                  pointArr.push(point)
                }
                const polyline = new BMap.Polyline(pointArr, { strokeColor: 'blue', strokeWeight: 3, strokeOpacity: 1 })
                map.addOverlay(polyline)
              })
            }
            if (sewageConduit.length > 0) {
              const sewageJunction_lng_lat = sewageConduit[0].properties.geometry.coordinates[0]
              const centerPoint = properties.properties.center
              //  渲染引导线
              const polyline = new BMap.Polyline([
                new BMap.Point(centerPoint[1] + 0.005363, centerPoint[0] - 0.00402),
                new BMap.Point(sewageJunction_lng_lat[1] + 0.005363, sewageJunction_lng_lat[0] - 0.00402)
              ], { strokeColor: '#e868f2', strokeWeight: 1.5, strokeOpacity: 0.5, strokeStyle: 'dashed' })
              map.addOverlay(polyline)
              // 渲染管线
              _each(sewageConduit, function(index, conduitData) {
                const lng_lat = conduitData.properties.geometry.coordinates
                const pointArr = []
                for (let i = 0; i < lng_lat.length; i++) {
                  const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
                  pointArr.push(point)
                }
                const polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 3, strokeOpacity: 1 })
                map.addOverlay(polyline)
              })
            }
          }

          // 结果合并
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
        // 排口
        if (outfallsData.length > 0) {
          const outfalls = []
          for (let i = 0; i < outfallsData.length; i++) {
            const outfall = {
              properties: outfallsData[i].properties
            }
            outfalls.push(outfall)
          }
          self.drawOutfalls(outfalls)
        }
        // 管线
        if (conduitsData.length > 0) {
          const self = this
          const map = this.map
          const conduitsData = self.mapData.conduits
          const conduits = []
          for (let i = 0; i < conduitsData.length; i++) {
            const subcatchment = {
              properties: conduitsData[i].properties
            }
            conduits.push(subcatchment)
          }
          self.drawConduits(conduits)
        }
        // 企业
        if (companysData.length > 0) {
          const companies = []
          const selectSubcatchmets = []
          const selectCompanysResult = []
          const subcatchmentsData = self.mapData.subcatchments
          // 地块数据
          for (let j = 0; j < subcatchmentsData.length; j++) {
            const properties = subcatchmentsData[j].properties

            const geos = properties.geometry.coordinates[0]
            const selectSubcatchmet = {
              properties: properties,
              overlays: []
            }
            for (let i = 0; i < geos.length; i++) {
              const points = new BMap.Point(geos[i][1], geos[i][0])
              selectSubcatchmet.overlays.push(points)
            }
            selectSubcatchmets.push(selectSubcatchmet)
          }
          // 企业数据
          for (let i = 0; i < companysData.length; i++) {
            const properties = companysData[i].properties
            const companyLng_lat = properties.geometry.coordinates
            const point = new BMap.Point(companyLng_lat[1], companyLng_lat[0])
            // 作比较
            for (let j = 0; j < selectSubcatchmets.length; j++) {
              const overlays = selectSubcatchmets[j].overlays
              const ply = new BMap.Polygon(overlays)
              const result = BMapLib.GeoUtils.isPointInPolygon(point, ply)
              if (result === true) {
                const data = selectSubcatchmets[j].properties
                const ConduitsType = '污水管'
                const conduits = getDescendantConduitsOfSubcatchment(data, self.cy, ConduitsType)
                const dataArr = []
                for (let k = 0; k < conduits.length; k++) {
                  dataArr[k] = conduits[k].properties
                }
                const conduitsData = dataArr
                // 引导线
                const rainJunction_Lng_lat = dataArr[0].geometry.coordinates[0]
                const polyline = new BMap.Polyline([
                  new BMap.Point(companyLng_lat[1] + 0.005363, companyLng_lat[0] - 0.00402),
                  new BMap.Point(rainJunction_Lng_lat[1] + 0.005363, rainJunction_Lng_lat[0] - 0.00402)
                ], { strokeColor: '#e868f2', strokeWeight: 3, strokeOpacity: 1, strokeStyle: 'dashed' })
                map.addOverlay(polyline)
                // //渲染污水管线
                _each(conduitsData, function(index, conduit) {
                  const lng_lat = conduit.geometry.coordinates
                  const info = conduit.properties
                  info.type = '管线'
                  const leixing = info.leixing
                  const pointArr = []
                  for (let i = 0; i < lng_lat.length; i++) {
                    const point = new BMap.Point(lng_lat[i][1] + 0.005363, lng_lat[i][0] - 0.00402)
                    pointArr.push(point)
                  }
                  const polyline = new BMap.Polyline(pointArr, { strokeColor: '#e868f2', strokeWeight: 4.5, strokeOpacity: 1 })
                  map.addOverlay(polyline)
                  // 拿到排口 渲染排口
                  const rainOutfall = getDescendantOutfallsOfSubcatchment(data, self.cy, ConduitsType)
                  _each(rainOutfall, function(index, outfall) {
                    const lng_lat = outfall.properties.geometry.coordinates
                    const info = outfall.properties.properties
                    info.type = '排口'
                    const leixing = info.leixing
                    const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
                    const circle = new BMap.Circle(point, 10, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
                    circle.leixing = '污水排水口'
                    map.addOverlay(circle)
                  })
                })

                selectCompanysResult.push(selectSubcatchmets[j])
              }
            }

            const company = {
              properties: companysData[i].properties
            }
            companies.push(company)
          }
          // 画出企业
          self.drawCompanys(companies)
          self.drawSubcatchments(selectCompanysResult)
        }
        //  统计拿到所有数据
        //  数组去重
        const newResultData = _.uniq(resultData, 'id')
        // for(let i =0;i<resultData.length;i++){
        //   let flag = true;
        //   for(let j = 0;j<newResultData.length;j++){
        //     if(resultData[i].id === newResultData[j].id){
        //       flag = false
        //     }
        //   }
        //   if(flag){
        //     newResultData.push(resultData[i]);
        //   }
        // }
        self.$store.dispatch('getResultData', newResultData)
        console.log('查询结束')
      },
      //  隐藏排口
      hideAllOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].hide()
          }
          if (leixing === '污水排口') {
            overlay.Circle[i].hide()
          }
          if (leixing === '混流排口') {
            overlay.Circle[i].hide()
          }
        }
      },
      showAllOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].show()
          }
          if (leixing === '污水排口') {
            overlay.Circle[i].show()
          }
          if (leixing === '混流排口') {
            overlay.Circle[i].show()
          }
        }
      },
      hideMergeOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
          }
          if (leixing === '污水排口') {

          }
          if (leixing === '混流排口') {
            overlay.Circle[i].hide()
          }
        }
      },
      showMergeOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
          }
          if (leixing === '污水排口') {

          }
          if (leixing === '混流排口') {
            overlay.Circle[i].show()
          }
        }
      },
      hideRainOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].hide()
          }
          if (leixing === '污水排口') {

          }
          if (leixing === '混流排口') {
          }
        }
      },
      showRainOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {
            overlay.Circle[i].show()
          }
          if (leixing === '污水排口') {

          }
          if (leixing === '混流排口') {
          }
        }
      },
      hideSewageOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {

          }
          if (leixing === '污水排口') {
            overlay.Circle[i].hide()
          }
          if (leixing === '混流排口') {
          }
        }
      },
      showSewageOutfalls() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  排口覆盖物
        for (let i = 0; i < overlay.Circle.length; i++) {
          const outfallColor = overlay.Circle[i].getFillColor()
          const leixing = overlay.Circle[i].leixing
          if (leixing === '雨水排水口') {

          }
          if (leixing === '污水排口') {
            overlay.Circle[i].show()
          }
          if (leixing === '混流排口') {
          }
        }
      },
      // 隐藏管线
      hideAllConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
            overlay.Polyline[i].hide()
          }
          if (type === '雨水管') {
            overlay.Polyline[i].hide()
          }
        }
      },
      showAllConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
            overlay.Polyline[i].show()
          }
          if (type === '雨水管') {
            overlay.Polyline[i].show()
          }
        }
      },
      hideRainConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
          }
          if (type === '雨水管') {
            overlay.Polyline[i].hide()
          }
        }
      },
      showRainConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
          }
          if (type === '雨水管') {
            overlay.Polyline[i].show()
          }
        }
      },
      hideSewageConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
            overlay.Polyline[i].hide()
          }
          if (type === '雨水管') {

          }
        }
      },
      showSewageConduits() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        //  管线覆盖物
        for (let i = 0; i < overlay.Polyline.length; i++) {
          const type = overlay.Polyline[i].type
          if (type === '污水管') {
            overlay.Polyline[i].show()
          }
          if (type === '雨水管') {

          }
        }
      },
      //  隐藏地块
      hideAllSubcatchments() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].hide()
        }
      },
      showAllSubcatchments() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          overlay.Polygon[i].show()
        }
      },
      // 隐藏道路
      hideDaolu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '道路') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showDaolu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '道路') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏市政
      hideShizheng() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '市政') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showShizheng() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '市政') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏绿地
      hideLvdi() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '绿地') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showLvdi() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '绿地') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏居住
      hideJuzhu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '居住') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showJuzhu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '居住') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏政府
      hideZhengfu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '政府') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showZhengfu() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '政府') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏工业
      hideGongye() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '工业') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showGongye() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '工业') {
            overlay.Polygon[i].show()
          }
        }
      },
      // 隐藏商业
      hideShangye() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '商业') {
            overlay.Polygon[i].hide()
          }
        }
      },
      showShangye() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Polygon.length; i++) {
          const sonType = overlay.Polygon[i].sonType
          if (sonType === '商业') {
            overlay.Polygon[i].show()
          }
        }
      },
      //  隐藏企业
      hideAllCompanys() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Marker.length; i++) {
          overlay.Marker[i].hide()
        }
      },
      showAllCompanys() {
        const self = this
        const map = self.map
        const allOverlay = map.getOverlays() // 获得所有覆盖物
        const overlay = {
          Polygon: [],
          Polyline: [],
          Circle: [],
          Marker: []
        }
        for (let i = 0; i < allOverlay.length; i++) {
          const overlayType = allOverlay[i].toString()
          if (overlayType === '[object Polygon]') {
            overlay.Polygon.push(allOverlay[i])
          }
          if (overlayType === '[object Polyline]') {
            overlay.Polyline.push(allOverlay[i])
          }
          if (overlayType === '[object Circle]') {
            overlay.Circle.push(allOverlay[i])
          }
          if (overlayType === '[object Marker]') {
            overlay.Marker.push(allOverlay[i])
          }
        }
        for (let i = 0; i < overlay.Marker.length; i++) {
          overlay.Marker[i].show()
        }
      },
      //  拓扑查询加快方式
      //  根据地块查下游排口 （管道类型）
      getDescendantOutfallsOfSubcatchment(feature, cy, conduitType) {
        if (feature['geometry']['type'] !== 'Polygon') {
          console.warn('输入的feature不合法：feature的类型应该为Polygon')
          return []
        }
        const center = feature.properties.center
        const subcatchmentCenterPoint = [center[1], center[0]]
        const nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)
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
        const center = feature.properties.center
        const subcatchmentCenterPoint = [center[1], center[0]]
        const nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)

        return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().edges(), edge => {
          return edge.data()
        })
      },
      //  测试函数
      UpdateData() {
        const self = this
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
          const data = resp.data
          for (let i = 0; i < data.length; i++) {
            const shapeid = data[i].id
            const feature = JSON.parse(data[i].properties)
            const properties = feature
            if (properties.properties.JSZT === '现状' && properties.properties.JSZT === '已落实海绵') {
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
