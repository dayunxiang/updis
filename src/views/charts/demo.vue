<template>
  <div>
    <!--<baidu-map class="bm-view" center="北京"></baidu-map>-->
    <baidu-map class="bm-view"
               center="深圳光明区"
               :zoom="15"
               @mousemove="syncPolyline"
               @click="paintPolyline"
               @rightclick="newPolyline">
      <!--多边形-->
      <bm-polygon fillColor="yellow" stroke-color="yellow"
                  v-for="addlist in surfaceData"
                  :key="addlist.id"
                  :fillOpacity="0.5"
                  :path="addlist.feist"
                  :stroke-weight="1"
                  @click="SurfaceClick()"/>
      <!-- 点 -->
      <bm-point-collection v-for="(val, index) in outFallDa"
                           :key="val.id"
                           :points="val.sel"
                           shape="BMAP_POINT_SHAPE_CIRCLE"
                           color="red"
                           size="BMAP_POINT_SIZE_NORMAL">
      </bm-point-collection>
      <bm-point-collection v-for="(val, index) in junctionDa"
                           :key="val.id"
                           :points="val.jun"
                           shape="BMAP_POINT_SHAPE_SQUARE"
                           color="purple"
                           size="BMAP_POINT_SIZE_SMALL">
      </bm-point-collection>
      <!--折线-->
      <bm-polyline class="lineDete" stroke-color="blue"
                   v-for="updateItem in lineData"
                   :key="updateItem.index"
                   :path="updateItem.getdata"
                   :stroke-opacity="0.6"
                   :stroke-weight="3"
                   :editing="false">
      </bm-polyline>
      <!--地图缩放-->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <!--地图类型-->
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
    </baidu-map>
  </div>
</template>

<script>
  import Vue from 'vue'
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import axios from 'axios'
  import request from '@/utils/request'
  import commonApi from '@/api/commonApi'
  import TestData from '@/assets/json/BD09-CONDUITS.json'
  import subCatchmentData from '@/assets/json/BD09-SUBCATCHMENTS.json'
  import outFallData from '@/assets/json/BD09-OUTFALLS.json'
  import junctionData from '@/assets/json/BD09-JUNCTIONS.json'
  import _ from 'lodash'
  export default {
    data() {
      return {
        polyline: {
          editing: false,
          paths: []
        },
        /* 请求数据 */
        lineData: [],
        surfaceData: [],
        outFallDa: [],
        junctionDa: []
      }
    },
    created(){
    },
    mounted(){
      this.init();
      this.addPolyLinePoint();
      this.outFall();
      this.junction();
    },
    methods: {
      /* 折线数据展示 */
      init() {
        const self = this;
        var metede = TestData.features;
        _.each(metede, function (v,index) {
          var demoList = v.geometry.coordinates;
          var comm = {
            index: index,
            getdata:[]
          }
          _.each(demoList, function (n) {
            comm.getdata.push({lng: n[1], lat: n[0]})
          })
          self.lineData.push(comm)
        })
      },
      /* 点数据展示 */
      junction(){
        const self = this;
        var mer = junctionData.features;
        var junct = {
          jun: []
        }
        _.each(mer, function (ls) {
          var vu = ls.geometry.coordinates;
          junct.jun.push( { lng: vu[1], lat: vu[0] } )
        });
        self.junctionDa.push(junct)
        console.log(self.junctionDa);
      },
      /* 点数据展示 */
      outFall(){
        const self = this;
        var out = outFallData.features;
        var fall = {
          sel:[]
        }
        _.each(out, function (v) {
          var vus = v.geometry.coordinates;
          fall.sel.push({ lng:vus[1], lat:vus[0] })
        })
        self.outFallDa.push(fall);
      },
      /* 多边形数据展示 */
      addPolyLinePoint() {
        const self = this;
        var mete = subCatchmentData.features;
        _.each(mete, function (m, index) {
          var met = m.geometry.coordinates[0];
          var codet = {
            index: index,
            properties: m.properties,
            feist: []
          }
          _.each(met, function (ls) {
            codet.feist.push( { lng: ls[1], lat: ls[0] } )
          });
          self.surfaceData.push(codet)
        })
      },
      /* 多边形事件 */
      SurfaceClick(e){
        console.log("事件: ", e);
      },







      syncPolyline (e) {
        if (!this.polyline.editing) {
          return
        }
        const {paths} = this.polyline
        if (!paths.length) {
          return
        }
        const path = paths[paths.length - 1]
        if (!path.length) {
          return
        }
        if (path.length === 1) {
          path.push(e.point)
        }
        this.$set(path, path.length - 1, e.point)
      },
      newPolyline (e) {
        if (!this.polyline.editing) {
          return
        }
        const {paths} = this.polyline
        if(!paths.length) {
          paths.push([])
        }
        const path = paths[paths.length - 1]
        path.pop()
        if (path.length) {
          paths.push([])
        }
      },
      paintPolyline (e) {
        if (!this.polyline.editing) {
          return
        }
        const {paths} = this.polyline
        !paths.length && paths.push([])
        paths[paths.length - 1].push(e.point)
      }
    }
  }
</script>


<style>
  .bm-view {
    width: 700px;
    height: 450px;
    margin:10px 0px 0px 20px ;
  }
  .bm-buttom-list {
    display: inline-block;
    background:blue;
    color:#fff;
    padding:5px 10px;
    margin:5px 0px 0px 5px;
    border-radius: 5px;
  }
  .bm-buttom-list:link{
    text-decoration:none;
  }
  .bm-buttom-list:visited{
    text-decoration:none;
  }
  .bm-buttom-list:hover{
     text-decoration:none;
     color: #fff;
   }
  .bm-buttom-list:active{
    text-decoration:none;
  }
  .bm-buttom-list:focus {
    color:#fff;
  }
  .lineDete {
    z-index:999;
  }
</style>
