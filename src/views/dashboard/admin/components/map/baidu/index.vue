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
      'isHideCompanys', 'isShowHandle'],
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
          range: [],
          isShow:true,
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
          if (!self.$route.query.AttributeValue && !self.$route.query.seletctType) {
            this.getDataInfoSuccess(self.shapes)
          }
        })
      },
      // 处理请求过来的所有数据
      getDataInfoSuccess(data) {
        const self = this
        _.each(data, item => {
          const mapData = {
            id: item.id,
            category: item.category,
            properties: item.properties
          }
          switch (item.category) {
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
        })
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
      renderingSubcatchments(data) {
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
        _.each(_.cloneDeep(data), subcatchment => {
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
          polygon.addEventListener('click', function(event) {
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
            //右键单击map出现右键菜单事件
            var menu = new BMap.ContextMenu()
            menu.addItem(new BMap.MenuItem(`<p>编辑</p>`, function(){
              self.$emit("isShowHandle",  subcatchment.properties)
            }))
            polygon.addContextMenu(menu)

          })
        })
      },
      // 查询分区
      renderingRange(data) {
        const self = this
        _.each(data, function(subcatchment) {
          const pointArr = []
          _.each(subcatchment.properties.geometry.coordinates[0], item => {
            pointArr.push(new BMap.Point(item[0] + 0.005363, item[1] - 0.00402))
          })
          self.map.addOverlay(new BMap.Polygon(pointArr, {
            strokeColor: '#7f7f7f',
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
        const map = this.map
        _.each(_.cloneDeep(data), conduit => {
          conduit.properties.properties.type = '管线'
          const pointArr = []
          _.each(conduit.properties.geometry.coordinates, (item) => {
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
            //右键单击map出现右键菜单事件
            var menu = new BMap.ContextMenu()
            menu.addItem(new BMap.MenuItem(`<p>编辑</p>`, function(){
              self.$emit("isShowHandle",  conduit.properties)
            }))
            polyline.addContextMenu(menu)
          })
        })
      },
      // 渲染检查井
      renderingJunctions(data) {
        const map = this.map
        //  渲染检查井
        _.each(data, item => {
          const point = new BMap.Point(item.properties.geometry.coordinates[1] + 0.005363, item.properties.geometry.coordinates[0] - 0.00402)
          //  渲染管线
          let circle = null
          if (item.properties.properties.leixing === '雨水检查井') {
            circle = new BMap.Circle(point, 3, { fillColor: 'blue', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
          }
          if (item.properties.properties.leixing === '污水检查井') {
            circle = new BMap.Circle(point, 3, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
          }
          map.addOverlay(circle)
        })
      },
      // 渲染排口
      renderingOutfalls(data) {
        const self = this
        const map = this.map
        _.each(_.cloneDeep(data), outfall => {
          outfall.properties.properties.type = '排口'
          const leixing = outfall.properties.properties.leixing
          const point = new BMap.Point(outfall.properties.geometry.coordinates[1] + 0.005363, outfall.properties.geometry.coordinates[0] - 0.00402)
          //  渲染排口
          let circle = null
          if (outfall.properties.properties.leixing === '雨水排水口') {
            circle = new BMap.Circle(point, 10, { fillColor: 'rgb(111,252,243)', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
            circle.leixing = '雨水排水口'
          }
          if (outfall.properties.properties.leixing === '污水排口') {
            circle = new BMap.Circle(point, 20, { fillColor: '#e868f2', strokeWeight: 1, fillOpacity: 0.5, strokeOpacity: 0.3 })
            circle.leixing = '污水排口'
          }
          if (outfall.properties.properties.leixing === '混流排口') {
            circle = new BMap.Circle(point, 5, { fillColor: 'rgba(117,86,86,1)', strokeWeight: 1, fillOpacity: 1, strokeOpacity: 0.3 })
            circle.leixing = '混流排口'
          }
          map.addOverlay(circle)
          // 排口点击事件
          circle.addEventListener('click', function() {
            self.test()
            self.clearSelectConduits()
            self.$store.dispatch('getInfo', outfall.properties.properties)
            this.setFillColor('red')
            this.type = '选中的排口'
          })
        })
      },
      // 渲染工业企业
      renderingCompanys(data) {
        const self = this
        const map = this.map
        _.each(_.cloneDeep(data), company => {
          const lng_lat = company.properties.geometry.coordinates
          company.properties.properties.type = '企业'
          const point = new BMap.Point(lng_lat[1] + 0.005363, lng_lat[0] - 0.00402)
          company.properties.properties.geos = [lng_lat[1] + 0.005363, lng_lat[0] - 0.00402]
          const myIcon = new BMap.Icon('/static/icon/companys_32.ico', new BMap.Size(32, 32))
          const marker = new BMap.Marker(point, { icon: myIcon })
          marker.type = company.properties.properties.type
          // //  渲染工业企业
          map.addOverlay(marker)
          // 工业企业点击事件
          marker.addEventListener('click', function() {
            self.$store.dispatch('getInfo', company.properties.properties)
            self.test();
            //右键单击map出现右键菜单事件
            var menu = new BMap.ContextMenu()
            menu.addItem(new BMap.MenuItem(`<p>编辑</p>`, function(){
              self.$emit("isShowHandle",  company.properties)
            }))
            marker.addContextMenu(menu)
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
        if (map.getOverlays().length === 0) {
          self.getDataInfo()
        }
      },
      //  渲染查询结果
      showResult(data, shapes) {
        const self = this
        self.shapes = shapes

        const allOverlay = self.map.getOverlays()
        for (let i = 0; i < allOverlay.length; i++) {
          self.map.removeOverlay(allOverlay[i])
        }
        self.$store.dispatch('getMapData', data)
        self.renderingRange(data.range)
        self.renderingSubcatchments(data.subcatchments) // 地块
        self.renderingConduits(data.conduits) // 管线
        self.renderingJunctions(data.junctions) // 井
        self.renderingOutfalls(data.outfalls) // 排口
        self.renderingCompanys(data.companies) // 公司
        return false
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
