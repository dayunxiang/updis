

<template>
  <div class="map-context">
    <div class="map-tab">
      <BaiduMap
        ref="map"
        :is-hide-all-subcatchments="isHideAllSubcatchments"
        :is-hide-all-conduits="isHideAllConduits"
        :is-hide-rain-conduits = "isHideRainConduits"
        :is-hide-sewage-conduits = "isHideSewageConduits"
        :is-hide-all-outfalls="isHideAllOutfalls"
        @getSubcatchmentInfo = "getSubcatchmentInfo"
      />
      <!--左-->
      <div :class="isCollapse?'open':'off'" class="left-content">
        <!--搜索框-->
        <el-row class="map-search">
          <div class="map-search">
            <el-input class="map-input" placeholder="请输入内容"/>
            <el-button type="primary">搜索</el-button>
          </div>
        </el-row>
        <!--菜单-->
        <el-row class="menu-box">
          <el-menu
            v-model="mapData"
            class="el-menu-vertical-demo"
            background-color="rgba(255,255,255,0.5)"
          >
            <!--排口-->
            <el-submenu index="1">
              <template slot="title">
                <i class="iconfont el-icon-ruhepaishuikou"/>
                <i
                  :class="isHideAllOutfalls?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="display-submenu iconfont"
                  @click="handleHideAllOutfalls()"
                  @click.stop/>
                <span class="submenu-title">排口</span>
                <span class="number">{{this.outfalls.meregeOutfalls.length+this.outfalls.rainOutfalls.length+this.outfalls.sewageOutfalls.length}}</span>
              </template>
              <!--分组设置-->
              <el-menu-item-group>
                <template slot="title">
                  <span>合流排口</span>
                  <span>{{this.outfalls.meregeOutfalls.length}}</span>
                </template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">
                  <span>雨水排口</span>
                  <span>{{this.outfalls.rainOutfalls.length}}</span>
                </template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">
                  <span>污水排口</span>
                  <span>{{this.outfalls.sewageOutfalls.length}}</span>
                </template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <!--分组设置结束-->
            </el-submenu>
            <!--管线-->
            <el-submenu index="2">
              <template slot="title">
                <i class="iconfont el-icon-guanxian"/>
                <i
                  :class="isHideAllConduits?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideAllConduits()"
                  @click.stop/>
                <span class="submenu-title">管线</span>
                <span class="number">{{this.conduits.rainConduits.length+this.conduits.sewageConduits.length}}</span>
              </template>
              <!--分组设置-->
              <!--雨水管-->
              <el-menu-item-group>
                <template slot="title">
                  <i
                  :class="isHideRainConduits?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideRainConduits()"
                  @click.stop/>
                  <span>雨水管</span>
                  <span>{{this.conduits.rainConduits.length}}</span>
                </template>
              </el-menu-item-group>
              <!--污水管-->
              <el-menu-item-group>
                <template slot="title">
                  <i
                    :class="isHideRainConduits?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleHideSewageConduits()"
                    @click.stop/>
                  <span>污水管</span>
                  <span>{{this.conduits.sewageConduits.length}}</span>
                </template>
              </el-menu-item-group>
              <!--分组设置结束-->
            </el-submenu>
            <!--地块-->
            <el-submenu index="3">
              <template slot="title">
                <i class="iconfont el-icon-dikuai"/>
                <i
                  :class="isHideAllSubcatchments?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="display-submenu iconfont"
                  @click="handleHideAllSubcatchments()"
                  @click.stop/>
                <span class="submenu-title">地块</span>
                <span class="number">{{subcatchments.length}}</span>
              </template>
            </el-submenu>
            <!--排水分区-->
            <el-submenu index="4">
              <template slot="title">
                <i class="iconfont el-icon-dikuai"/>
                <i class="display-submenu  iconfont el-icon-yanjing_yincang"/>
                <span class="submenu-title">排水分区</span>
                <span class="number">[未定]</span>
              </template>
            </el-submenu>
            <!--工业企业-->
            <el-submenu index="5">
              <template slot="title">
                <i class="iconfont el-icon-dikuai"/>
                <i class="display-submenu  iconfont el-icon-yanjing_yincang"/>
                <span class="submenu-title">工业企业</span>
                <span class="number">[未定]</span>
              </template>
            </el-submenu>
          </el-menu>
        </el-row>
        <!--折叠按钮-->
        <div class="fold-button" @click="hanleFold()">
          <i :class="isCollapse?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"/>
        </div>
      </div>
      <!--右-->
      <div class="right-box">
        <div class="label info-label" @click="handleShow">
          信息管理
        </div>
        <div v-show="infoManager" class="context">
          <div>
            <el-collapse v-model="activeName" accordion>
              <!--地块-->
              <el-collapse-item  v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='地块'">
                <template slot="title">
                  <span>{{data.type}}</span>
                  <el-button type="primary" round @click="handleSubcatchmentsSelectConduits(data.info.id)" @click.stop>查询下游管道</el-button>
                  <el-button type="primary" round @click="handleSubcatchmentsSelectOutfalls(data.info.id)" @click.stop >查询下游排口</el-button>
                </template>
                <div>
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-context">
                        <li>
                          <span>编号:</span><span class="info-span">{{data.info.name}}</span>
                        </li>
                        <li>
                          <span>面积:</span><span class="info-span"></span>
                        </li>
                        <li>
                          <span>用地类型:</span><span class="info-span" >{{data.info.YDLX}}</span>
                        </li>
                        <li>
                          <span>建设状态:</span><span class="info-span" >{{data.info.JSZT}}</span>
                        </li>
                        <li>
                          <span>项目名称:</span><span class="info-span" >{{data.info.XMMC}}</span>
                        </li>
                        <li>
                        <span>排入河道:</span><span class="info-span">{{data.info.PRHD}}</span>
                        </li>
                        <li>
                          <span>所属流域:</span><span class="info-span">{{data.info.SSLY}}</span>
                        </li>
                        <li>
                          <span>所属排水区:</span><span class="info-span">{{data.info.SSPSFQ}}</span>
                        </li>
                        <li>
                          <span>是否为正本清源项目:</span><span class="info-span">{{data.info.ZBQY}}</span>
                        </li>
                        <li>
                          <span>是否为海绵项目:</span><span class="info-span">{{data.info.HMCS}}</span>
                        </li>
                        <li>
                          <span>海绵类型:</span><span class="info-span">{{data.info.HMLX}}</span>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--排口-->
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='排口'">
                <template slot="title">
                  <span>{{data.type}}</span>
                  <el-button @click.stop type="primary" round @click="handleSelectConduits(data.info.name)">查询上游管道</el-button>
                  <el-button type="primary" round  @click="handleSelectSubcatchments(data.info.name)" @click.stop>查询上游地块</el-button>
                </template>
                <div>
                  <el-collapse v-model="activeNames" >
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-context">
                        <li>
                          <span>排口编号</span><span class="info-span">{{data.info.name}}</span>
                        </li>
                        <li>
                          <span>类型</span><span class="info-span">{{data.info.leixing}}</span>
                        </li>
                        <li>
                          <span>排向</span><span class="info-span">{{data.info.paixiang}}</span>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--管线-->
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='管线'">
                <div>
                  <el-collapse v-model="activeNames" >
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-context">
                        <li>
                          <span>管道编号</span><span class="info-span">{{data.info.name}}</span>
                        </li>
                        <li>
                          <span>管道类型</span><span class="info-span">{{data.info.leixing}}</span>
                        </li>
                        <li>
                          <span>管径</span><span class="info-span">{{data.info.guanjing}}</span>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

        </div>
        <div class="label">
          反向查询
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _each from '@/utils/_each'
  import BaiduMap from './components/map/baidu'

  export default {
    name: 'Home',
    components: {
      BaiduMap
    },
    data() {
      return {
        projectId:'',
        outfalls:{
          rainOutfalls:[],
          sewageOutfalls:[],
          meregeOutfalls:[]
        },
        conduits:{
          rainConduits:[],
          sewageConduits:[]
        },
        subcatchments:[],
        selectLoading: false,
        isHideAllSubcatchments: true,
        //显示隐藏管线
        isHideAllConduits: true,
        isHideRainConduits: true,
        isHideSewageConduits: true,


        isHideAllOutfalls: true,
        infoManager: false,
        isCollapse: true,
        tabPosition: 'right',
        activeName: '1',
        data:{
          type:'',
          info:{}
        },
        mapData:{},
        activeNames: ['1']
      }
    },
    create(){

    },
    mounted(){
      this.getProjectId();
      this.getMapData();
    },
    methods: {
      // 取得项目编号
      getProjectId(){
        this.projectId = this.$route.query.projectId
      },
      // 取得mapData
      getMapData(){
        var self = this;
        var mapData = this.$store.state.mapData
        _each(mapData,function(index,mapData){
          self.outfalls.rainOutfalls = mapData.outfalls.rainOutfall;
          self.outfalls.sewageOutfalls = mapData.outfalls.sewageOutfall;
          self.outfalls.meregeOutfalls = mapData.outfalls.mergeOutfall;
          self.conduits.rainConduits = mapData.conduits.rainConduits;
          self.conduits.sewageConduits = mapData.conduits.sewageConduits;
          self.subcatchments = mapData.subcatchments;
        })
      },
      //获取每块地块信息
      getSubcatchmentInfo(data) {
        const self  = this;
        self.infoManager = true;
        self.data.type = data.type;
        self.data.info = data.info
      },
      /**
       * 显示/隐藏全部地块
       */
      handleHideAllSubcatchments() {
        this.isHideAllSubcatchments = !this.isHideAllSubcatchments
      },
      /**
       * 显示/隐藏所有管线
       */
      handleHideAllConduits() {
        this.isHideAllConduits = !this.isHideAllConduits;
      },
      // 显示/隐藏雨水管线
      handleHideRainConduits(){
        this.isHideRainConduits = !this.isHideRainConduits;
      },
      // 显示/隐藏污水管线
      handleHideSewageConduits(){
        this.isHideSewageConduits = !this.isHideSewageConduits;
      },


      /**
       * 显示/隐藏所有排口
       */
      handleHideAllOutfalls() {
        this.isHideAllOutfalls = !this.isHideAllOutfalls
      },
      // 是否显示
      handleShow() {
        this.infoManager = !this.infoManager
      },
      // 折叠展开
      hanleFold() {
        this.isCollapse = !this.isCollapse
      },
      /**
       * 根据排口查询上游管线
       */
      handleSelectConduits(outFallName){
        this.$refs.map.handleSelectConduits(outFallName);
      },
      /**
       *根据排口查上游地块
       */
      handleSelectSubcatchments(outFallName){
        this.$refs.map.handleSelectSubcatchments(outFallName);
      },
      /**
       *根据地块查询下游管道
       */
      handleSubcatchmentsSelectConduits(data){
        this.$refs.map.handleSubcatchmentsSelectConduits(data);
      },
      /**
       * 根据地块查询下游排口
       */
      handleSubcatchmentsSelectOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectOutfalls(data);
      }
    },
    created() {

    }
  }
</script>
<style rel="stylesheet/scss" scoped>
  .el-menu-item menu-item{background: black;}
  #app .nest-menu .el-submenu > .el-submenu__title, #app .el-submenu .el-menu-item{background-color: rgba(255, 255, 255, 0.5) !important;}
  ul li{list-style-type: none;}
</style>
<style rel="stylesheet/scss" lang="scss">
  .submenu-title{color: black;}
  .el-menu-item-group__title{background: rgb(204,204,204);}
  .menuitem{color:black}
  .map-context{width: 100%;height: 100%;
    .map-tab{width: 100%;height: 100%;}
    .left-content{position:absolute;top:0px;height: 100%;background:rgba(255,255,255,0.5);
      .map-search{width: 100%;height: 40px;overflow: hidden;
        .map-input{width: 75%;}
      }
      .menu-box{padding-bottom:20px;width: 100%;height:100%;overflow: auto;color:black;
        .number{color:#42b983;}
        .display{display: inline-block;position: relative;}
      }
      .fold-button{position: absolute; top: 40%;right: -30px;padding: 0px;margin: 0px;width: 30px;height: 100px;list-style: none;background:rgba(255,255,255,0.5);cursor: pointer;
        i{text-align: center;line-height: 100px;font-weight: bold;color:#666666;font-size: 30px;}
      }
    }
    .right-box{position: absolute;top:60px;right:0px;
      .label{position:relative;padding:10px 20px;margin-bottom:20px;background: #66b1ff;color: white;cursor:pointer;}
      .context{position: absolute;left:-500px;top:0px;background: red;width: 500px;background:rgba(255,255,255,0.5);color: black;
        .el-collapse-item__header{padding:0px 10px;font-size:20px;background:rgba(255,255,255,0.5);}
        .info-context{position: relative;
          .info-title{display:inline-block;color:red;}
          .info-span{position:absolute; right:100px;display:inline-block;width:300px;text-align: center;overflow: hidden;text-overflow: ellipsis;}
        }
      }
    }

  }

  .iconfont{margin-right: 10px;}
  .menu{overflow: auto;}
  .BMap_cpyCtrl {display: none;}
  .anchorBL {display: none;}
  .open{width: 320px;}
  .off{width: 0px;}
</style>

