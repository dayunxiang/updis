

<template>
  <div class="map-context">
    <div class="map-tab">
      <BaiduMap
        ref="map"
        :is-hide-all-subcatchments="isHideAllSubcatchments"
        :is-hide-all-conduits="isHideAllConduits"
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
                <span class="number"></span>
              </template>
              <!--分组设置-->
              <el-menu-item-group>
                <template slot="title">合流排口</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">雨水排口</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">截流式</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">截污管</template>
                <el-menu-item index="4-1">选项1</el-menu-item>
                <el-menu-item index="4-2">选项2</el-menu-item>
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
                <span class="number"></span>
              </template>
              <!--分组设置-->
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
                <span class="number"></span>
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
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='地块'">
                <div>
                  <ul>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
              <!--排口-->
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='排口'">
                <div>
                  <ul>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
              <!--管线-->
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='管线'">
                <div>
                  <ul>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                    <li>
                      <span>名称</span><span class="test3">{{data.info.name}}</span>
                    </li>
                  </ul>
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
  import BaiduMap from './components/map/baidu/baidu'

  export default {
    name: 'Home',
    components: {
      BaiduMap
    },
    data() {
      return {
        isHideAllSubcatchments: true,
        isHideAllConduits: true,
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
      }
    },
    methods: {
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
        this.isHideAllConduits = !this.isHideAllConduits
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
       * 获得vuex里的mapData数据
       */
    },
    mounted(){

    },
    created() {

    }
  }
</script>
<style rel="stylesheet/scss" scoped>
  .el-menu-item menu-item{background: black;}
  #app .nest-menu .el-submenu > .el-submenu__title, #app .el-submenu .el-menu-item{background-color: rgba(255, 255, 255, 0.5) !important;}
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
        .test3{width: 100px;text-align: center;display: inline-block;float: right;margin-right: 200px;}
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

