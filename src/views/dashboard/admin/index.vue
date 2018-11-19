<template>
  <div class="map-context">
    <div class="map-tab"

    >
      <BaiduMap
        ref="map"
        :is-hide-all-subcatchments="isHideAllSubcatchments"
        :is-hide-daolu = "isHideDaolu"
        :is-hide-shizheng = "isHideShizheng"
        :is-hide-lvdi = "isHideLvdi"
        :is-hide-juzhu = "isHideJuzhu"
        :is-hide-zhengfu = 'isHideZhengfu'
        :is-hide-gongye = "isHideGongye"
        :is-hide-shangye = "isHideShangye"
        :is-hide-all-conduits="isHideAllConduits"
        :is-hide-rain-conduits = "isHideRainConduits"
        :is-hide-sewage-conduits = "isHideSewageConduits"
        :is-hide-all-outfalls="isHideAllOutfalls"
        :is-hide-merge-outfalls = 'isHideMergeOutfalls'
        :is-hide-rain-outfalls = 'isHideRainOutfalls'
        :is-hide-sewage-outfalls="isHideSewageOutfalls"
        :is-hide-companys = 'isHideCompanys'
        @getInfo = "getInfo"
      />
      <!--左-->
      <div :class="isCollapse?'open':'off'" class="left-content">
        <!--搜索框-->
        <el-row class="map-search">
          <div class="map-search">
            <el-input class="map-input" placeholder="请输入内容"/>
            <el-button type="primary" class="search-button">搜索</el-button>
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
                <!--合流排口-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/mergeOutfall-img.png" alt=""></span>
                    <i
                      :class="isHideMergeOutfalls?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                      class="iconfont"
                      @click="handleMergeOutfalls()"
                      @click.stop/>
                    <span style="color:black;font-size: 16px;">混流排口</span>
                    <span style="color:black;font-size: 16px;">{{this.outfalls.meregeOutfalls.length}}</span>
                </template>
                <!--<el-menu-item index="1-1">选项1</el-menu-item>-->
                <!--<el-menu-item index="1-2">选项2</el-menu-item>-->
              </el-menu-item-group>
                <!--雨水排口-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/rainOutfall-img.png" alt=""></span>
                  <i
                    :class="isHideRainOutfalls?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleRainOutfalls()"
                    @click.stop/>
                  <span style="color: black;font-size: 16px;">雨水排口</span>
                  <span style="color: black;font-size: 16px;">{{this.outfalls.rainOutfalls.length}}</span>
                </template>
              </el-menu-item-group>
                <!--污水排口-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/sewageOutfall-img.png" alt=""></span>
                  <i
                    :class="isHideSewageOutfalls?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleSewageOutfalls()"
                    @click.stop/>
                  <span style="color:black ;font-size: 16px;">污水去向</span>
                  <span style="color:black;font-size: 16px;">{{this.outfalls.sewageOutfalls.length}}</span>
                </template>
              </el-menu-item-group>
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
                  <span class="logo"><img src="/static/img/rainConduit-img.png" alt=""></span>
                  <i
                  :class="isHideRainConduits?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideRainConduits()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">雨水管</span>
                  <span style="color: black;font-size: 16px;">{{this.conduits.rainConduits.length}}</span>
                </template>
              </el-menu-item-group>
              <!--污水管-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/sewageConduits-img.png" alt=""></span>
                  <i
                    :class="isHideRainConduits?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleHideSewageConduits()"
                    @click.stop/>
                  <span style="color: black;font-size: 16px;">污水管</span>
                  <span style="color: black;font-size: 16px;">{{this.conduits.sewageConduits.length}}</span>
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
                <span class="number">{{this.subcatchments.juZhuYongDi.length + this.subcatchments.road.length + this.subcatchments.shiZheng.length + this.subcatchments.lvDi.length + this.subcatchments.zhengFu.length + this.subcatchments.gongYe.length +this.subcatchments.shangYe.length }}</span>
              </template>
              <!--道路&道路广场用地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/daolu.png" alt=""></span>
                  <i
                    :class="isHideDaolu?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleHideDaolu()"
                    @click.stop/>
                  <span style="color: black;font-size: 16px;">道路&道路广场用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.road.length}}</span>
                </template>
              </el-menu-item-group>
              <!--市政公用设施用地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/shizheng.png" alt=""></span>
                  <i
                    :class="isHideShizheng?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                    class="iconfont"
                    @click="handleHideShiZheng()"
                    @click.stop/>
                  <span style="color: black;font-size: 16px;">市政公用设施用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.shiZheng.length}}</span>
                </template>
              </el-menu-item-group>
              <!--绿地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/lvdi.png" alt=""></span>
                  <i
                  :class="isHideLvdi?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideLvdi()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">绿地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.lvDi.length}}</span>
                </template>
              </el-menu-item-group>
              <!--居住用地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/juzhu.png" alt=""></span>
                  <i
                  :class="isHideJuzhu?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideJuzhu()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">居住用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.juZhuYongDi.length}}</span>
                </template>
              </el-menu-item-group>
              <!--政府社团用地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/zhengfu.png" alt=""></span>
                  <i
                  :class="isHideZhengfu?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideZhengfu()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">政府社团用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.zhengFu.length}}</span>
                </template>
              </el-menu-item-group>
              <!--工业用地-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/gongye.png" alt=""></span>
                  <i
                  :class="isHideGongye?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideGongye()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">工业用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.gongYe.length}}</span>
                </template>
              </el-menu-item-group>
              <!--商业-->
              <el-menu-item-group>
                <template slot="title">
                  <span class="logo"><img src="/static/img/shangye.png" alt=""></span>
                  <i
                  :class="isHideShangye?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                  class="iconfont"
                  @click="handleHideShangye()"
                  @click.stop/>
                  <span style="color: black;font-size: 16px;">商业服务业设施用地</span>
                  <span style="color: black;font-size: 16px;">{{this.subcatchments.shangYe.length}}</span>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <!--工业企业-->
            <el-submenu index="4">
              <template slot="title">
                <i class="iconfont el-icon-dikuai"/>
                <i class="display-submenu  iconfont el-icon-yanjing_yincang"
                   :class="isHideCompanys?'el-icon-yanjing_yincang':'el-icon-yanjing_xianshi'"
                   @click="handleHideAllCompanys()"
                   @click.stop/>
                <span class="submenu-title">工业企业</span>
                <span class="number">{{companys.length}}</span>
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
              <el-collapse-item  v-model="data" name="1" v-if="data.type=='地块'">
                <template slot="title">
                  <span>{{data.type}}</span>
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainConduits(data.info.id)" @click.stop>查下游雨水管+排口</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainOutfalls(data.info.id)" @click.stop >查下游雨水排口</el-button>-->
                  <!--<el-button type="primary" style="padding: 3px; font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleSubcatchmentsSelectSewageConduits(data.info.id)" @click.stop>查下游污水管</el-button>-->
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);" @click="handleSubcatchmentsSelectSewageConduits(data.info.id)" @click.stop >查下游污水去向</el-button>

                </template>
                <div>
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-content">
                        <li>
                          <div class="info-title">编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.name" placement="top-start">
                              <el-button class="info-button">{{data.info.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">面积</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="String(data.info.area)" placement="top-start">
                              <el-button class="info-button" style="height: 20px">{{data.info.area}}m<sup>2</sup></el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">用地类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.YDLX" placement="top-start">
                              <el-button class="info-button">{{data.info.YDLX}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">建设状态</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.JSZT" placement="top-start">
                              <el-button class="info-button">{{data.info.JSZT}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">项目名称</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.XMMC" placement="top-start">
                              <el-button class="info-button">{{data.info.XMMC}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">排入河道</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.PRHD" placement="top-start">
                              <el-button class="info-button">{{data.info.PRHD}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">所属流域</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.SSLY" placement="top-start">
                              <el-button class="info-button">{{data.info.SSLY}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">所属排水分区</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.SSPSFQ" placement="top-start">
                              <el-button class="info-button">{{data.info.SSPSFQ}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">是否为正本清源项目</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.ZBQY" placement="top-start">
                              <el-button class="info-button">{{data.info.ZBQY}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">是否为海绵项目</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.HMCS" placement="top-start">
                              <el-button class="info-button">{{data.info.HMCS}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">海绵类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.HMLX" placement="top-start">
                              <el-button class="info-button">{{data.info.HMLX}}</el-button>
                            </el-tooltip>
                          </div>
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
                      <ul class="info-content">
                        <li>
                          <div class="info-title">排口编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.name" placement="top-start">
                              <el-button class="info-button">{{data.info.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.leixing" placement="top-start">
                              <el-button class="info-button">{{data.info.leixing}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">排向</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.paixiang" placement="top-start">
                              <el-button class="info-button">{{data.info.paixiang}}</el-button>
                            </el-tooltip>
                          </div>
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
                      <ul class="info-content">
                        <li>
                          <div class="info-title">管道编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.name" placement="top-start">
                              <el-button class="info-button">{{data.info.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">管道类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.leixing" placement="top-start">
                              <el-button class="info-button">{{data.info.leixing}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">管径</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="data.info.guanjing" placement="top-start">
                              <el-button class="info-button">{{data.info.guanjing}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--企业-->
              <el-collapse-item v-model="data" :title="data.type+'信息'" name="1" v-if="data.type=='企业'">
                <template slot="title">
                  <span>{{data.type}}</span>
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleCompanySelectSewageConduits(data.geos)" @click.stop>查下游污水管+污水去向</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleCompanySelectSewageOutfall(data.geos)" @click.stop>查下游污水去向</el-button>-->
                </template>
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title="基本信息" name="1">
                    <ul class="info-content">
                      <li>
                        <div class="info-title">企业名称</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.QYMC)" placement="top-start">
                            <el-button class="info-button">{{data.info.QYMC}}</el-button>
                          </el-tooltip>
                        </div>

                      </li>
                      <li>
                        <div class="info-title">X_坐标</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.X_cor)" placement="top-start">
                            <el-button class="info-button">{{data.info.X_cor}}</el-button>
                          </el-tooltip>
                        </div>

                      </li>
                      <li>
                        <div class="info-title">Y_坐标</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.Y_cor)" placement="top-start">
                            <el-button class="info-button">{{data.info.Y_cor}}</el-button>
                          </el-tooltip>
                        </div>

                      </li>
                      <li>
                        <div class="info-title">街道</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.JDMC)" placement="top-start">
                            <el-button class="info-button">{{data.info.JDMC}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">社区</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.SQMC)" placement="top-start">
                            <el-button class="info-button">{{data.info.SQMC}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">地址</div>
                          <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.SCJYDZ)" placement="top-start">
                            <el-button class="info-button">{{data.info.SCJYDZ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">法人代表</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.FDDBR)" placement="top-start">
                            <el-button class="info-button">{{data.info.FDDBR}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">联系方式</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.LXFS)" placement="top-start">
                            <el-button class="info-button">{{data.info.LXFS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">企业人数</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.QYRS)" placement="top-start">
                            <el-button class="info-button">{{data.info.QYRS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">行业类别</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.HYLB)" placement="top-start">
                            <el-button class="info-button">{{data.info.HYLB}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">生产用水量</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.SCYSL)" placement="top-start">
                            <el-button class="info-button">{{data.info.SCYSL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">排水量</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.PSL)" placement="top-start">
                            <el-button class="info-button">{{data.info.PSL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">主要生产工艺</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.ZYSCGY)" placement="top-start">
                            <el-button class="info-button">{{data.info.ZYSCGY}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">产品</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.GPZL)" placement="top-start">
                            <el-button class="info-button">{{data.info.GPZL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">环评</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.HPPFWJ)" placement="top-start">
                            <el-button class="info-button">{{data.info.HPPFWJ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">环评有效性</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.HPPFWJYXX)" placement="top-start">
                            <el-button class="info-button">{{data.info.HPPFWJYXX}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">排污许可证</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.PWXKZ)" placement="top-start">
                            <el-button class="info-button">{{data.info.PWXKZ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">废水处理方式</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(data.info.FSCLFS)" placement="top-start">
                            <el-button class="info-button">{{data.info.FSCLFS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </el-collapse-item>
              <!--企业结束-->
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
        isLoading: true,
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
        subcatchments:{
          road : [],
          shiZheng:[],
          lvDi:[],
          juZhuYongDi:[],
          zhengFu:[],
          gongYe:[],
          shangYe:[]
        },
        companys:[],
        selectLoading: false,
        //显示隐藏地块
        isHideAllSubcatchments: true,
        isHideDaolu:true,
        isHideShizheng:true,
        isHideLvdi:true,
        isHideJuzhu:true,
        isHideZhengfu:true,
        isHideGongye:true,
        isHideShangye:true,
        //显示隐藏管线
        isHideAllConduits: true,
        isHideRainConduits: true,
        isHideSewageConduits: true,
        //显示隐藏排口
        isHideAllOutfalls: true,
        isHideMergeOutfalls:true,
        isHideRainOutfalls:true,
        isHideSewageOutfalls:true,
        //显示隐藏企业
        isHideCompanys:true,
        //消息提示
        infoManager: false,
        isCollapse: true,
        tabPosition: 'right',
        activeName: '1',
        data:{
          geos:{},
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
          //地块
          self.subcatchments.road = mapData.subcatchments.road;
          self.subcatchments.shiZheng = mapData.subcatchments.shiZheng;
          self.subcatchments.gongYe =mapData.subcatchments.gongYe;
          self.subcatchments.juZhuYongDi = mapData.subcatchments.juZhuYongDi;
          self.subcatchments.lvDi = mapData.subcatchments.lvDi;
          self.subcatchments.zhengFu =mapData.subcatchments.zhengFu;
          self.subcatchments.shangYe = mapData.subcatchments.shangYe;
          //企业
          self.companys = mapData.companys;
        })
      },
      //获取信息
      getInfo(data) {
        const self  = this;
        self.infoManager = true;
        self.data.type = data.type;
        self.data.info = data.info
        self.data.geos = data.geos;
      },
      /**
       * 显示/隐藏全部地块
       */
      handleHideAllSubcatchments() {
        this.isHideAllSubcatchments = !this.isHideAllSubcatchments;
      },
        //隐藏道路
      handleHideDaolu(){
        this.isHideDaolu = !this.isHideDaolu;
      },
       // 隐藏市政
      handleHideShiZheng(){
        this.isHideShizheng = !this.isHideShizheng;
      },
      // 隐藏绿地
      handleHideLvdi(){
        this.isHideLvdi = !this.isHideLvdi;
      },
      // 隐藏居住用地
      handleHideJuzhu(){
        this.isHideJuzhu = !this.isHideJuzhu;
      },
      // 隐藏政府
      handleHideZhengfu(){
        this.isHideZhengfu = !this.isHideZhengfu;
      },
      // 隐藏工业用地
      handleHideGongye(){
        this.isHideGongye = !this.isHideGongye;
      },
      // 隐藏商业
      handleHideShangye(){
        this.isHideShangye = !this.isHideShangye;
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
        // 显示/隐藏合流排口
      handleMergeOutfalls(){
        this.isHideMergeOutfalls = !this.isHideMergeOutfalls
      },
        // 显示/隐藏雨水排口
      handleRainOutfalls(){
        this.isHideRainOutfalls = !this.isHideRainOutfalls
      },
        // 显示/隐藏污水排口
      handleSewageOutfalls(){
        this.isHideSewageOutfalls = !this.isHideSewageOutfalls
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
       * 显示/隐藏全部企业
       *
       */
      handleHideAllCompanys(){
       this.isHideCompanys = !this.isHideCompanys;
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
       *根据地块查询下游雨水管道
       */
      handleSubcatchmentsSelectRainConduits(data){
        this.$refs.map.handleSubcatchmentsSelectRainConduits(data);
      },
        // 根据地块查询污水管道
      handleSubcatchmentsSelectSewageConduits(data){
        this.$refs.map.handleSubcatchmentsSelectSewageConduits(data);
      },
      /**
       * 根据企业查询下游污水排口
       * */
      handleCompanySelectSewageOutfall(data){
        this.$refs.map.handleCompanySelectSewageOutfall(data);
      },
      //根据企业查询污水管道
      handleCompanySelectSewageConduits(data){
        this.$refs.map.handleCompanySelectSewageConduits(data)
      },
      /**
       * 根据地块查询下游雨水排口
       */
      handleSubcatchmentsSelectRainOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectRainOutfalls(data);
      },
      handleSubcatchmentsSelectSewageOutfalls(data){
        this.$refs.map.handleSubcatchmentsSelectSewageOutfalls(data)
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
  *{margin: 0px;padding: 0px}
</style>
<style rel="stylesheet/scss" lang="scss">
  *{margin: 0px;padding: 0px;}
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
        .el-collapse-item__content{padding-bottom: 0px;}
        .info-content{max-height: 500px;overflow: auto;padding-bottom:20px;
          .info-title{display:inline-block;margin-left: 20px;}
          .info-span{display: inline-block;width:200px;float:right;margin-right:100px;text-align:center;
            .info-button{width: 100%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;border: 0px;}
          }
        }
      }
    }

  }
  .search-button{width: 60px;line-height: 30px;}
  .iconfont{margin-right: 10px;}
  .menu{overflow: auto;}
  .BMap_cpyCtrl {display: none;}
  .anchorBL {display: none;}
  .open{width: 320px;}
  .off{width: 0px;}
  .el-icon-yanjing_yincang{cursor: pointer}
  .el-icon-yanjing_xianshi{cursor: pointer}
  .el-menu-item-group__title{background: none;}
  .logo{display:inline-block;width: 20px;height: 10px;
    img{width: 100%;height: 100%;}
  }
  .el-button + .el-button{margin: 0px;}
</style>

