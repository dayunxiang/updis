<template>
  <div class="map-context"
       v-loading="isLoading"
       element-loading-text="正在查询中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="map-tab">
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
      />
      <!--左-->
      <div :class="isCollapse?'open':'off'" class="left-content">
        <!--搜索框-->
        <!--<el-row class="map-search">-->
        <!--<div class="map-search">-->
        <!--<el-input class="map-input" placeholder="请输入内容"/>-->
        <!--<el-button type="primary" class="search-button">搜索</el-button>-->
        <!--</div>-->
        <!--</el-row>-->
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
                <span class="number">{{this.outfalls.rainOutfalls.length+this.outfalls.meregeOutfalls.length+this.outfalls.sewageOutfalls.length}}</span>
              </template>
              <!--分组设置-->
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
        <div class="label info-label" @click="handleInfoShow">
          信息管理
        </div>
        <div v-show="infoManager" class="context">
          <div>
            <el-collapse v-model="activeName" accordion>
              <!--地块-->
              <el-collapse-item  v-model="dataInfo" name="1" v-if="dataInfo.type=='地块'">
                <template slot="title">
                  <span>{{dataInfo.type}}</span>
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainConduits(dataInfo.id)" @click.stop>查下游雨水管+排口</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainOutfalls(data.info.id)" @click.stop >查下游雨水排口</el-button>-->
                  <!--<el-button type="primary" style="padding: 3px; font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleSubcatchmentsSelectSewageConduits(data.info.id)" @click.stop>查下游污水管</el-button>-->
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);" @click="handleSubcatchmentsSelectSewageConduits(dataInfo.id)" @click.stop >查下游污水去向</el-button>

                </template>
                <div>
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-content">
                        <li>
                          <div class="info-title">编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.name" placement="top-start">
                              <el-button class="info-button">{{dataInfo.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">面积</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="String(dataInfo.area.toFixed(2))" placement="top-start">
                              <el-button class="info-button" style="height: 20px">{{dataInfo.area.toFixed(2)}}m<sup>2</sup></el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">用地类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.YDLX" placement="top-start">
                              <el-button class="info-button">{{dataInfo.YDLX}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">建设状态</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.JSZT" placement="top-start">
                              <el-button class="info-button">{{dataInfo.JSZT}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">项目名称</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.XMMC" placement="top-start">
                              <el-button class="info-button">{{dataInfo.XMMC}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">排入河道</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.PRHD" placement="top-start">
                              <el-button class="info-button">{{dataInfo.PRHD}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">所属流域</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.SSLY" placement="top-start">
                              <el-button class="info-button">{{dataInfo.SSLY}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">所属排水分区</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.SSPSFQ" placement="top-start">
                              <el-button class="info-button">{{dataInfo.SSPSFQ}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">是否为正本清源项目</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.ZBQY" placement="top-start">
                              <el-button class="info-button">{{dataInfo.ZBQY}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">是否为海绵项目</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.HMCS" placement="top-start">
                              <el-button class="info-button">{{dataInfo.HMCS}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">海绵类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.HMLX" placement="top-start">
                              <el-button class="info-button">{{dataInfo.HMLX}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">现状控制率</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.现状控制率" placement="top-start">
                              <el-button class="info-button">{{dataInfo.现状控制率}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">规划控制率</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.规划控制率" placement="top-start">
                              <el-button class="info-button">{{dataInfo.规划控制率}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--排口-->
              <el-collapse-item v-model="dataInfo" :title="dataInfo.leixing+'信息'" name="1" v-if="dataInfo.type=='排口'">
                <template slot="title">
                  <span>{{dataInfo.leixing}}信息</span>
                  <el-button @click.stop type="primary" round @click="handleSelectConduits(dataInfo.name)">查询上游管道</el-button>
                  <el-button type="primary" round  @click="handleSelectSubcatchments(dataInfo.name)" @click.stop>查询上游地块</el-button>
                </template>
                <div>
                  <el-collapse v-model="activeNames" >
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-content">
                        <li>
                          <div class="info-title">排口编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.name" placement="top-start">
                              <el-button class="info-button">{{dataInfo.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.leixing" placement="top-start">
                              <el-button class="info-button">{{dataInfo.leixing}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">排向</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.paixiang" placement="top-start">
                              <el-button class="info-button">{{dataInfo.paixiang}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--管线-->
              <el-collapse-item v-model="data" :title="dataInfo.leixing +'信息'"  name="1" v-if="dataInfo.type == '管线'">
                <div>
                  <el-collapse v-model="activeNames" >
                    <el-collapse-item title="基本信息" name="1">
                      <ul class="info-content">
                        <li>
                          <div class="info-title">管道编号</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.name" placement="top-start">
                              <el-button class="info-button">{{dataInfo.name}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">管道类型</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content="dataInfo.leixing" placement="top-start">
                              <el-button class="info-button">{{dataInfo.leixing}}</el-button>
                            </el-tooltip>
                          </div>
                        </li>
                        <li>
                          <div class="info-title">管径</div>
                          <div class="info-span">
                            <el-tooltip class="item" effect="dark" :content= "dataInfo.guanjing"placement="top-start">
                              <el-button class="info-button">{{dataInfo.guanjing*1000}} <span style="color:#42b983">mm</span></el-button>
                            </el-tooltip>
                          </div>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
              <!--企业-->
              <el-collapse-item v-model="dataInfo" :title="dataInfo.type+'信息'" name="1" v-if="dataInfo.type=='企业'">
                <template slot="title">
                  <span>{{dataInfo.type}}</span>
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleCompanySelectSewageConduits(dataInfo.geos)" @click.stop>查下游污水管+污水去向</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleCompanySelectSewageOutfall(data.geos)" @click.stop>查下游污水去向</el-button>-->
                </template>
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title="基本信息" name="1">
                    <ul class="info-content">
                      <li>
                        <div class="info-title">企业名称</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.QYMC)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.QYMC}}</el-button>
                          </el-tooltip>
                        </div>

                      </li>
                      <li>
                        <div class="info-title">街道</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.JDMC)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.JDMC}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">社区</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.SQMC)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.SQMC}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">地址</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.SCJYDZ)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.SCJYDZ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">法人代表</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.FDDBR)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.FDDBR}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">联系方式</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.LXFS)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.LXFS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">企业人数</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.QYRS)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.QYRS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">行业类别</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.HYLB)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.HYLB}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">生产用水量</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.SCYSL)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.SCYSL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">排水量</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.PSL)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.PSL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">主要生产工艺</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.ZYSCGY)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.ZYSCGY}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">产品</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.GPZL)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.GPZL}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">环评</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.HPPFWJ)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.HPPFWJ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">环评有效性</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.HPPFWJYXX)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.HPPFWJYXX}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">排污许可证</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.PWXKZ)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.PWXKZ}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">废水处理方式</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.FSCLFS)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.FSCLFS}}</el-button>
                          </el-tooltip>
                        </div>
                      </li>
                      <li>
                        <div class="info-title">特征污染物</div>
                        <div class="info-span">
                          <el-tooltip class="item" effect="dark" :content="String(dataInfo.TZWRW)" placement="top-start">
                            <el-button class="info-button">{{dataInfo.TZWRW}}</el-button>
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
        <div class="label" @click="handleSelectShow">
          反向查询
        </div>
        <div  class="selectContext" v-show="isSelect">
          <div>
            <el-tabs type="border-card" style="width: 100%">
              <el-tab-pane label="精确查询">
                <div style="float: left;width: 80%;">
                  <ul v-for="list in ulList" :key="list.id" style="display:inline-block;margin-bottom:10px; ">
                    <li style="float: left;">
                      <span> 类型 </span>
                      <el-select v-model="value1" @change="demoListDataModel" clearable placeholder="请选择" style="width: 120px">
                        <el-option
                          v-for="item in exactQuery"
                          :key="item.value"
                          :label="item.label"
                          :value="item">
                        </el-option>
                      </el-select>
                    </li>
                    <li style="float: left" >
                      <span> 属性 </span>
                      <el-select v-model="value2" clearable placeholder="请选择" style="width: 150px">
                        <el-option
                          v-for="item in attributeData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                    <li style="float: left">
                      <span> 属性值 </span>
                      <el-select v-model="value3" clearable placeholder="请选择" style="width: 200px">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                  </ul>
                </div>
                <ul style="float:left;background:rgba(0,0,0,.1);width: 20%;" >
                  <li style="text-align: center;margin: 10px 0;" >
                    <el-button type="primary" @click="handelAddTerm" style="padding:5px 15px !important;"> 增加查询条件</el-button>
                  </li>
                  <li style="text-align: center;margin: 10px 0;" >
                    <el-button type="primary" @click="handelDeleteTerm" style="padding:5px 15px !important;">清除查询条件</el-button>
                  </li>
                  <li style="text-align: center;margin: 10px 0;">
                    <el-button type="success" @click="handelQueryTerm" style="padding:5px 15px !important;">查询</el-button>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="模糊查询">
                <div>
                  <el-autocomplete
                    class="el-input"
                    style="width: 450px"
                    v-model="state1"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入查询条件,多条件之间用;(分号隔开)"
                    :trigger-on-focus="false">
                  </el-autocomplete>
                  <el-button type="success"  @click="handleSelect" style="display:inline-block;width: 100px;line-height: 34px;">查询</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div></div>
          <div>
            <el-tabs v-model="activeName2" type="card">
              <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
              <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
              <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!--<div  class="selectContext" v-show="isSelect" >
          <div class="select-search">
            <el-autocomplete
              class="el-input"
              style="width: 450px"
              v-model="state1"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入查询条件,多条件之间用;(分号隔开)"
              :trigger-on-focus="false">
            </el-autocomplete>
            <el-button type="success" icon="el-icon-search" circle @click="handleSelect"></el-button>
          </div>
          <div class="result-ul" v-show = 'isSelect'>
            <el-tabs type="border-card" v-model="select" >
              <el-tab-pane style="max-height: 500px;overflow: auto" v-if = " selectOutfalls.length"      :label= "'排口'+'（'+ selectOutfalls.length+')'">
                <el-table :data=" selectOutfalls" border max-height="500" style="width: 100%;" key="outfallTable">

                  <el-table-column
                    prop="name"
                    label="排口编号"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="leixing"
                    label="类型"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="paixiang"
                    label="排向"
                    width="120">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane v-if = "selectSubcatchmentData.length" :label= "'地块'+'（'+selectSubcatchmentData.length+')'" style="max-height: 500px;overflow: auto">
                <el-table :data="selectSubcatchmentData" border max-height="500" style="width: 100%;" key="conduitData">
                  <el-table-column
                    prop="name"
                    label="编号"
                    sortable
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="YDLX"
                    label="用地类型"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="area"
                    label="面积(平方米)"
                    sortable
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="JSZT"
                    label="建设状态"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="XMMC"
                    label="项目名称"
                    sortable
                    width="250">
                  </el-table-column>
                  <el-table-column
                    prop="PRHD"
                    label="排入河道"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="SSLY"
                    label="所属流域"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="SSPSFQ"
                    label="所属排水分区"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="ZBQY"
                    label="是否为正本清源项目"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="HMCS"
                    label="是否为海绵项目"
                    sortable
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="HMLX"
                    label="海绵类型"
                    sortable
                    width="200">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane style="max-height: 500px;overflow: auto" v-if = "selectCompanys.length"      :label= "'企业'+'（'+selectCompanys.length+')'">
                <el-table :data="selectCompanys" border max-height="500" style="width: 100%;" key="companyTable">
                  <el-table-column
                    prop="QYMC"
                    label="企业名称"
                    width="300">
                  </el-table-column>
                  <el-table-column
                    prop="JDMC"
                    label="街道名称"
                    width="300">
                  </el-table-column>
                  <el-table-column
                    prop="SQMC"
                    label="社区名称"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="SCJYDZ"
                    label="地址"
                    width="400">
                  </el-table-column>
                  <el-table-column
                    prop="FDDBR"
                    label="法人代表"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="LXFS"
                    label="联系方式"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="QYRS"
                    label="企业人数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="HYLB"
                    label="行业类别"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="SCYSL"
                    label="生产用水量"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="PSL"
                    label="排水量"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="ZYSCGY"
                    label="主要生产工艺"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="GPZL"
                    label="产品"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="HPPFWJ"
                    label="环评"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="HPPFWJYXX"
                    label="环评有效性"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="PWXKZ"
                    label="排污许可证"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="FSCLFS"
                    label="废水处理方式"
                    width="120">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        重新绘制-->
        <div class="label" style="background: red" @click="handleReset">
          重新绘制
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _each from '@/utils/_each'
  import BaiduMap from './components/map/baidu'
  import request from '@/utils/request'
  import BMap from 'BMap'
  import {geojson2cytoscape,
    getAncestorConduitsOfOutfall,
    calcAllSubcatchmentNearestNode,
    getAncestorSubcatchmentsOfOutfall,
    getDescendantConduitsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getNearestNodeOfPoint
  } from '@/utils/mapUtil'
  import '@/utils/GeoUtils.js'
  import _ from 'lodash'
  export default {
    name: 'Home',
    computed: {
      info() {
        return this.$store.state.mapData.info;
      },
      resultData() {
        return this.$store.state.mapData.resultData;
      }
    },
    watch: {
      info: function(info) {
        this.infoManager = true;
        this.dataInfo = info;
      },
      resultData: function(resultData) {
        var self = this;
        for (var i = 0; i < resultData.length; i++) {
          var category = resultData[i].businessType;
          switch (category) {
            case 'SUBCATCHMENTS':
              var subcatchment = {
                area : Math.abs(resultData[i].properties.area.toFixed(2)),
                HMCS:resultData[i].properties.HMCS,
                HMLX:resultData[i].properties.HMLX,
                JSZT:resultData[i].properties.JSZT,
                PRHD:resultData[i].properties.PRHD,
                SSLY:resultData[i].properties.SSLY,
                SSPSFQ:resultData[i].properties.SSPSFQ,
                XMMC:resultData[i].properties.XMMC,
                YDLX:resultData[i].properties.YDLX,
                ZBQY:resultData[i].properties.ZBQY,
                name:resultData[i].properties.name,
                现状控制率:resultData[i].properties.现状控制率,
                规划控制率:resultData[i].properties.规划控制率
              }
              self.selectSubcatchmentData.push(subcatchment);
              break;

            case 'OUTFALLS':
              self. selectOutfalls.push(resultData[i].properties.properties)
              break;
            case 'COMPANY':
              self.selectCompanys.push(resultData[i].properties)
              break;
          }
        }
      },
      // init(){
      //
      // }
    },
    components: {
      BaiduMap
    },
    data() {
      return {
        dataList: [
          { id: 1, name: '类型',
            label:[
              {value:1, label: '地块',
                listName:[
                  {value: 1, label: '编号'},
                  {value: 1, label: '面积'},
                  {value: 1, label: '用地类型'},
                ]
              },
              {value:2, label: '工业企业'},
              {value:3, label: '排口'},
              {value:4, label: '管线'},
            ]
          },
          { id: 2, name: '属性',
            labelName:[
              {value:1, label: '地块'},
            ]
          },
          { id: 3, name: '属性值'},
        ],


        activeName2: 'first',
        ulList:[0],
        exactQuery: [
          { value:'1', label:'' },
          { value:'2', label:'' },
          { value:'3', label:'' },
          { value:'4', label:'' }
        ],
        value1: '',
        attributeData: [],
        value2:'',
        attributeValueData: [
          { value:'1', label:'02-06-8' },
          { value:'2', label:'62003.52平方米' },
          { value:'3', label:'G1' },
          { value:'4', label:'现状' },
          { value:'5', label:'' },
          { value:'6', label:'东坑水' },
          { value:'7', label:'东坑水' },
          { value:'8', label:'19#排水分区' },
          { value:'9', label:'' },
          { value:'10', label:'已落实海绵' },
          { value:'11', label:'海绵型公园绿地' },
          { value:'12', label:'85%' },
          { value:'13', label:'85%' }
        ],
        value3:'',
        junctionsLayData: [],    // 交汇点数据
        conduitsLayData: [],     // 管道数据
        companysLayData: [],     // 公司数据
        subLayData: [], // 地块数据
        nameTypeDataAll: [],
/**********************************************************************************************************************************/
        options: [{
          value: '选项1',
          label: '地块'
        }, {
          value: '选项2',
          label: '工业企业'
        }, {
          value: '选项3',
          label: '排口'
        }, {
          value: '选项4',
          label: '管线'
        }],
        value4: '',
        //
        isLoading: false,
        //搜索出来的结果
        selectSubcatchmentData:[],
        selectOutfalls:[],
        selectCompanys:[],
        //end
        subcatchmentData: [],
        conduitsData: [],
        outfallsData: [],
        companysData: [],
        isResult: false,

        projectId: '',
        outfalls: {
          rainOutfalls: [],
          sewageOutfalls: [],
          meregeOutfalls: []
        },
        conduits: {
          rainConduits: [],
          sewageConduits: []
        },
        subcatchments: {
          road: [],
          shiZheng: [],
          lvDi: [],
          juZhuYongDi: [],
          zhengFu: [],
          gongYe: [],
          shangYe: []
        },
        companys: [],
        selectLoading: false,
        //显示隐藏地块
        isHideAllSubcatchments: true,
        isHideDaolu: true,
        isHideShizheng: true,
        isHideLvdi: true,
        isHideJuzhu: true,
        isHideZhengfu: true,
        isHideGongye: true,
        isHideShangye: true,
        //显示隐藏管线
        isHideAllConduits: true,
        isHideRainConduits: true,
        isHideSewageConduits: true,
        //显示隐藏排口
        isHideAllOutfalls: true,
        isHideMergeOutfalls: true,
        isHideRainOutfalls: true,
        isHideSewageOutfalls: true,
        //显示隐藏企业
        isHideCompanys: true,
        //消息提示
        infoManager: false,
        isSelect: false,
        isCollapse: true,
        tabPosition: 'right',
        activeName: '1',
        data: {},
        mapData: {},
        activeNames: ['1'],
        dataInfo: {},
        //  输入项
        restaurants: [],
        state1: '',
        //  查询结果
        selectResult: {
          subcatchments: [],
          conduits: [],
          junctions: [],
          outfalls: [],
          companys: []
        },
        select: {
          subcatchments: [],
          conduits: [],
          junctions: [],
          outfalls: [],
          companys: []
        },
      }
    },
    create() {

    },
    mounted() {
      this.init();
      this.getProjectId();
      this.getMapData();
      this.restaurants = this.loadAll();
    },
    methods: {
      init(){
        const _this = this;
        this.nameTypeDataAll = [];
        var nameTypeDataList = [];
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: '3'
                }
              }
            }
          }
        }).then((res) => {
        _.each(res.data, function (lat) {
          var nameTypeData = JSON.parse(lat.properties)
          nameTypeDataList.push(nameTypeData)

        })
        this.nameTypeDataAll = nameTypeDataList;
        console.log("res数据:", this.nameTypeDataAll);
      })
      },
      // 取得项目编号
      getProjectId() {
        this.projectId = this.$route.query.projectId
      },
      // 取得mapData
      getMapData() {
        var self = this;
        var projectId = this.projectId;

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
          var data = resp.data;
          var selectOpaction = []
          //正则 匹配道路 的正则
          var daoluReg = /^[S][^A-Za-z]$/;
          // 市政公用设施用地
          var shiZhengReg = /^[U][^A-Za-z]$/;
          // 绿地
          var lvDiReg = /^[G,E][^A-Za-z]/;
          // 居住用地
          var juZhuYongDiReg = /^[R][^A-Za-z]/;
          // 政府
          var zhengFuReg = /^[G][I][C]/;
          // 工业
          var gongYeReg = /^[M]/;
          // 商业服务业设施用地
          var shangyeReg = /^[C][^A-Za-z]/;
          for (var i = 0; i < data.length; i++) {
            var category = data[i].category;
            var properties = JSON.parse(data[i].properties).properties;
            var arr = []
            for (let i in properties) {
              if (i == 'WP' || i == 'YP' || i == 'center' || i == 'area' || i == 'X_cor' || i == 'Y_cor' || i == null) {
              } else {
                //如果字符串中含有多个的处理
                if (String(properties[i]).indexOf('、') != -1) {
                  for (var s = 0; s < properties[i].split('、').length; s++) {
                    var value = {
                      value: properties[i].split('、')[s]
                    }
                    selectOpaction.push(value);
                  }
                }
                var value = {
                  value: properties[i]
                }
                selectOpaction.push(value);
              }

            }
            if (category == 'COMPANY') {
              self.companys.push(data[i])
            }
            if (category == 'OUTFALLS') {
              if (properties.leixing == '污水排口') {
                self.outfalls.sewageOutfalls.push(data[i])
              }
              if (properties.leixing == '混流排口') {
                self.outfalls.meregeOutfalls.push(data[i])
              }
              if (properties.leixing == '雨水排水口') {
                self.outfalls.rainOutfalls.push(data[i])
              }
            }
            if (category == 'CONDUITS') {
              if (properties.leixing == '污水管') {
                self.conduits.sewageConduits.push(data[i])
              }
              if (properties.leixing == '雨水管') {
                self.conduits.rainConduits.push(data[i])
              }
            }
            if (category == 'SUBCATCHMENTS') {
              var YDLX = properties.YDLX;
              if ((YDLX == '道路' || daoluReg.test(YDLX))) {
                self.subcatchments.road.push(data[i])
              }
              if (shiZhengReg.test(YDLX)) {
                self.subcatchments.shiZheng.push(data[i])
              }
              if (lvDiReg.test(YDLX)) {
                self.subcatchments.lvDi.push(data[i])
              }
              if (juZhuYongDiReg.test(YDLX)) {
                self.subcatchments.juZhuYongDi.push(data[i])
              }
              if (zhengFuReg.test(YDLX)) {
                self.subcatchments.zhengFu.push(data[i])
              }
              if (gongYeReg.test(YDLX)) {
                self.subcatchments.gongYe.push(data[i])
              }
              if (shangyeReg.test(YDLX)) {
                self.subcatchments.shangYe.push(data[i])
              }
            }
          }
          //数组去重
          var TempArr = []
          var newArr = []
          var selection = []
          for (var i = 0; i < selectOpaction.length; i++) {
            if(selectOpaction[i].value == '光明医院' || selectOpaction[i].value == 'GIC4'){
              selection.push(selectOpaction[i])
            }
            if (selectOpaction[i].value == null) {
            }
            else {
              TempArr.push(selectOpaction[i])
            }
          }
          for (var i = 0; i < TempArr.length; i++) {
            var flag = true
            for (var j = 0; j < newArr.length; j++) {
              if (String(TempArr[i].value) == String(newArr[j].value)) {
                flag = false
              }
            }
            if (flag) {
              var obj = {
                value: String(selectOpaction[i].value)
              }
              newArr.push(obj)

            }
          }
          for (var i = 0; i < newArr.length; i++) {
            flag = true
            for (var j = 0; j < selection.length; j++) {
              if (newArr[i].value == selection[j].value) {
                flag = false
              }
            }
            if (flag) {
              selection.push(newArr[i])
            }
          }
          self.restaurants = selection;
          // for(var i = 0;i<self.restaurants.length;i++){
          //   console.log(self.restaurants[i].value == '光明医院')
          // }

        })
      },
      // 折叠展开
      hanleFold() {
        this.isCollapse = !this.isCollapse
      },
      /**
       * 显示/隐藏全部地块
       */
      handleHideAllSubcatchments() {
        this.isHideAllSubcatchments = !this.isHideAllSubcatchments;
      },
      //隐藏道路
      handleHideDaolu() {
        this.isHideDaolu = !this.isHideDaolu;
      },
      // 隐藏市政
      handleHideShiZheng() {
        this.isHideShizheng = !this.isHideShizheng;
      },
      // 隐藏绿地
      handleHideLvdi() {
        this.isHideLvdi = !this.isHideLvdi;
      },
      // 隐藏居住用地
      handleHideJuzhu() {
        this.isHideJuzhu = !this.isHideJuzhu;
      },
      // 隐藏政府
      handleHideZhengfu() {
        this.isHideZhengfu = !this.isHideZhengfu;
      },
      // 隐藏工业用地
      handleHideGongye() {
        this.isHideGongye = !this.isHideGongye;
      },
      // 隐藏商业
      handleHideShangye() {
        this.isHideShangye = !this.isHideShangye;
      },
      /**
       * 显示/隐藏所有管线
       */
      handleHideAllConduits() {
        this.isHideAllConduits = !this.isHideAllConduits;
      },
      // 显示/隐藏雨水管线
      handleHideRainConduits() {
        this.isHideRainConduits = !this.isHideRainConduits;
      },
      // 显示/隐藏污水管线
      handleHideSewageConduits() {
        this.isHideSewageConduits = !this.isHideSewageConduits;
      },

      /**
       * 显示/隐藏所有排口
       */
      handleHideAllOutfalls() {
        this.isHideAllOutfalls = !this.isHideAllOutfalls
      },
      // 显示/隐藏合流排口
      handleMergeOutfalls() {
        this.isHideMergeOutfalls = !this.isHideMergeOutfalls
      },
      // 显示/隐藏雨水排口
      handleRainOutfalls() {
        this.isHideRainOutfalls = !this.isHideRainOutfalls
      },
      // 显示/隐藏污水排口
      handleSewageOutfalls() {
        this.isHideSewageOutfalls = !this.isHideSewageOutfalls
      },
      // 信息管理是否显示
      handleInfoShow() {
        this.infoManager = !this.infoManager
        if (this.isSelect) {
          this.isSelect = !this.isSelect;
        }
      },

      /**
       * 显示/隐藏全部企业
       *
       */
      handleHideAllCompanys() {
        this.isHideCompanys = !this.isHideCompanys;
      },
      /**
       * 根据排口查询上游管线
       */
      handleSelectConduits(outFallName) {
        this.$refs.map.handleSelectConduits(outFallName);
      },
      /**
       *根据排口查上游地块
       */
      handleSelectSubcatchments(outFallName) {
        this.$refs.map.handleSelectSubcatchments(outFallName);
      },
      /**
       *根据地块查询下游雨水管道
       */
      handleSubcatchmentsSelectRainConduits(data) {
        this.$refs.map.handleSubcatchmentsSelectRainConduits(data);
      },
      // 根据地块查询污水管道
      handleSubcatchmentsSelectSewageConduits(data) {
        this.$refs.map.handleSubcatchmentsSelectSewageConduits(data);
      },
      /**
       * 根据企业查询下游污水排口
       * */
      handleCompanySelectSewageOutfall(data) {
        this.$refs.map.handleCompanySelectSewageOutfall(data);
      },
      //根据企业查询污水管道
      handleCompanySelectSewageConduits(data) {
        this.$refs.map.handleCompanySelectSewageConduits(data)
      },
      /**
       * 根据地块查询下游雨水排口
       */
      handleSubcatchmentsSelectRainOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectRainOutfalls(data);
      },
      handleSubcatchmentsSelectSewageOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectSewageOutfalls(data)
      },
      /**
       * 重新绘制事件
       * */
      handleReset() {
        var self = this;
        self.selectSubcatchmentData = [];
        self.selectOutfalls = [];
        self.selectCompanys = [];
        self.$refs.map.handleReset();
      },
      /**
       * 反向查询
       * */
      //精确查询  ---  增加查询条件
      handelAddTerm(){
        var lengthId = this.ulList.length;
        var id = 1;
        var deId = id++
        if(lengthId < 3) {
          this.ulList.push(deId);
        }
      },
      handelDeleteTerm(){
        var index = this.ulList.length - 1;
        this.ulList.splice(1,index);
        console.log(this.ulList);
      },
      handelQueryTerm(){
        console.log("查询")
      },
      demoListDataModel(value){
        this.attributeData = [];
        if(value.label === '工业企业') {
          this.attributeData = [
            { value:'1', label:'企业信息' },
            { value:'2', label:'街道' },
            { value:'3', label:'社区' },
            { value:'4', label:'地址' },
            { value:'5', label:'法人代表' },
            { value:'6', label:'联系方式' },
            { value:'7', label:'企业人数' },
            { value:'8', label:'行业类别' },
            { value:'9', label:'生产用水量' },
            { value:'10', label:'排水量' },
            { value:'11', label:'主要生产工艺' },
            { value:'12', label:'产品' },
            { value:'13', label:'环评' },
            { value:'14', label:'环评有效性' },
            { value:'15', label:'排污许可证' },
            { value:'16', label:'废水处理方式' },
            { value:'17', label:'特征污染物' },
          ]
        }
        if(value.label === '地块') {
          this.attributeData = [
            { value:'1', label:'编号' },
            { value:'2', label:'面积' },
            { value:'3', label:'用地类型' },
            { value:'4', label:'建设状态' },
            { value:'5', label:'项目名称' },
            { value:'6', label:'排入河道' },
            { value:'7', label:'所属流域' },
            { value:'8', label:'所属排水分区' },
            { value:'9', label:'是否为正本清源项目' },
            { value:'10', label:'是否为海绵项目' },
            { value:'11', label:'海绵类型' },
            { value:'12', label:'现状控制率' },
            { value:'13', label:'规划控制率' }
          ]
        }
        if(value.label === '管线') {
          this.attributeData = [
            { value:'1', label:'管道编号' },
            { value:'2', label:'管道类型' },
            { value:'3', label:'管径' },
          ]
        }
        if(value.label === '排口') {
          this.attributeData = [
            { value:'1', label:'编号' },
            { value:'2', label:'面积' },
            { value:'3', label:'用地类型' },
            { value:'4', label:'建设状态' },
            { value:'5', label:'项目名称' },
            { value:'6', label:'排入河道' },
            { value:'7', label:'所属流域' },
            { value:'8', label:'所属排水分区' },
            { value:'9', label:'是否为正本清源项目' },
            { value:'10', label:'是否为海绵项目' },
            { value:'11', label:'海绵类型' },
            { value:'12', label:'现状控制率' },
            { value:'13', label:'规划控制率' }
          ]
        }
        console.log("value1:",value.label);
      },
      handleSelectShow() {
        this.isSelect = !this.isSelect;
        if (this.infoManager) {
          this.infoManager = !this.infoManager;
        }
        var labelData = this.nameTypeDataAll;
        var typeName1 = '';  // 工业企业
        var typeName2 = '';  // 地块
        var typeName3 = '';  // 管线
        var typeName4 = '';  // 排口
        var COMtypeData = [];  // 公司数据
        var SUBtypeData = [];  // 地块数据
        var CONtypeData = [];  // 管道数据
        var JUNtypeData = [];  // 交汇点数据
        _.each(labelData, function (vn) {
          if(vn.businessType === 'COMPANY') {
            typeName1 = '工业企业'
            // COMtypeData.push(nameTypeData.properties);
            console.log("转换", vn.properties);
          }
          if(vn.businessType === 'SUBCATCHMENTS') {
            typeName2 = '地块'
            // SUBtypeData.push(nameTypeData.properties)
          }
          if(vn.businessType === 'CONDUITS') {
            typeName3 = '管线'
            // CONtypeData.push(nameTypeData.properties)
          }
          if(vn.businessType === 'JUNCTIONS') {
            typeName4 = '排口'
            // JUNtypeData.push(nameTypeData.properties)
          }
        })

        this.exactQuery[0].label = typeName2; // 地块
        this.exactQuery[1].label = typeName1; // 工业企业
        this.exactQuery[2].label = typeName4; // 排口
        this.exactQuery[3].label = typeName3; // 管线
        this.junctionsLayData = JUNtypeData;  // 交汇点数据
        this.conduitsLayData =  CONtypeData;  // 管道数据
        this.companysLayData = COMtypeData ;  // 公司数据
        this.subLayData = SUBtypeData;        // 地块数据
      },
      //反向查询组件
      querySearchAsync(queryString, cb) {
        if (this.state1.substr(this.state1.length - 1, 1) == ';') {
          queryString == ''
        }
        var restaurants = this.restaurants;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createStateFilter(queryString) {
        return (restaurants) => {
          return (restaurants.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },

      //查询开始
      handleSelect() {
        var self = this;
        self.isLoading = true;
        self.selectSubcatchmentData = [];
        self.selectOutfalls = [];
        self.selectCompanys = [];
        var selectArr = self.String2Array(self.state1);
        self.selectResult.subcatchments = [];
        self.selectResult.conduits = [];
        self.selectResult.outfalls = [];
        self.selectResult.companys = [];
        self.selectResult.junctions = [];
        //请求全部数据
        var projectId = this.projectId;
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
          var data = resp.data;
          var companys = [];
          var outfalls = [];
          var conduits = [];
          var subcatchments = [];
          var result = [];
          for (var i = 0; i < data.length; i++) {
            var category = data[i].category;
            if (category == 'COMPANY') {
              companys.push(data[i])
            }
            if (category == 'OUTFALLS') {
              outfalls.push(data[i])
            }
            if (category == 'CONDUITS') {
              conduits.push(data[i]);
            }
            if (category == 'SUBCATCHMENTS') {
              subcatchments.push(data[i])
            }

          }
          if (selectArr.length > 0) {
            for (var j = 0; j < selectArr.length; j++) {
              //循环企业
              for (var a = 0; a < companys.length; a++) {
                var properties = JSON.parse(companys[a].properties).properties;
                for (let i in properties) {
                  if (String(properties[i]).indexOf('、') != -1) {
                    for (var s = 0; s < properties[i].split('、').length; s++) {
                      if (properties[i].split('、')[s] == selectArr[j]) {
                        result.push(companys[a])
                      }
                    }
                  }
                }
              }
              //循环管线
              for (var d = 0; d < conduits.length; d++) {
                var properties = JSON.parse(conduits[d].properties).properties;
                for (let item in properties) {
                  if (String(properties[item]) == selectArr[j]) {
                  }
                }
              }
              //循环地块
              for (var b = 0; b < subcatchments.length; b++) {
                var properties = JSON.parse(subcatchments[b].properties).properties;
                for (let i in properties) {
                  if (String(properties[i]) == selectArr[j]) {
                    result.push(subcatchments[b])
                  }
                }
              }
              //循环排口
              for (var e = 0; e < outfalls.length; e++) {
                var properties = JSON.parse(outfalls[e].properties).properties;
                for (let i in properties) {
                  if (String(properties[i]) == selectArr[j]) {
                    console.log(selectArr[j])
                    console.log(properties[i])
                  }
                }
              }

            }
          }
          else {
            console.log('请输入查询条件');
          }
          // for(var i = 0;i<data.length;i++) {
          //   var category = data[i].category;
          //   var properties = JSON.parse(data[i].properties).properties;
          //   for (let item in properties) {
          //     if (properties[item] == value) {
          //       result.push(data[i])
          //       // }
          //     }
          //   }
          // }
          //  拿到结果 进行处理
          if(selectArr.length >1){
            var thisCompanys = [];
            var thisSubcatchments = []
            var selectSubcatchmets = []
            var comapnysToSubcatchments = []
            console.log('我开始这行了');
            for(var p = 0;p<result.length;p++){
              var category = result[p].category;
              switch (category) {
                case 'SUBCATCHMENTS':
                  // thisSubcatchments.push(JSON.parse(result[p].properties));
                  thisSubcatchments.push(result[p]);
                  break;
                case 'COMPANY':
                  // thisCompanys.push(JSON.parse(result[p].properties))
                  thisCompanys.push(result[p])
                  break;
              }
            }
            // 地块
            for(var z = 0;z<thisSubcatchments.length;z++){
              var properties = JSON.parse(thisSubcatchments[z].properties)
              var geos = properties.geometry.coordinates[0];
              var selectSubcatchmet = {
                properties:thisSubcatchments[z],
                overlays:[]
              }
              for(var i = 0;i<geos.length;i++){
                var points = new BMap.Point(geos[i][1],geos[i][0]);
                selectSubcatchmet.overlays.push(points)
              }
              selectSubcatchmets.push(selectSubcatchmet);
            }
            //企业 地块
            for(var q = 0;q<thisCompanys.length;q++){
              var properties = JSON.parse(thisCompanys[q].properties);
              var companyLng_lat = properties.geometry.coordinates;
              var point = new BMap.Point(companyLng_lat [1], companyLng_lat [0]);
              for(var j = 0;j<selectSubcatchmets.length;j++){
                var overlays = selectSubcatchmets[j].overlays
                var ply = new BMap.Polygon(overlays);
                var result = BMapLib.GeoUtils.isPointInPolygon(point, ply);
                if(result){
                  self.selectResult.subcatchments.push(selectSubcatchmets[j].properties)
                  self.selectResult.companys.push(thisCompanys[q])
                }
              }
            }
            // console.log(comapnysToSubcatchments.propert);
          }
          if(selectArr.length == 1){
            var newArr = []
            for (var i = 0; i < result.length; i++) {
              var flag = true;
              for (var j = 0; j < newArr.length; j++) {
                if (result[i].id == newArr[j].id) {
                  flag = false
                }
              }
              if (flag) {
                newArr.push(result[i])
              }
            }
            for (var i = 0; i < newArr.length; i++) {
              var category = newArr[i].category;
              console.log(category );
              switch (category) {
                case 'SUBCATCHMENTS':
                  var properties = JSON.parse(newArr[i].properties);
                  var subcatchments = {
                    properties: properties.properties
                  }
                  self.subcatchmentData.push(subcatchments.properties)
                  self.selectResult.subcatchments.push(newArr[i])
                  break;
                case 'CONDUITS':
                  var properties = JSON.parse(newArr[i].properties);
                  var conduits = {
                    properties: properties.properties
                  }
                  self.select.conduitsData.push(conduits.properties)
                  self.selectResult.conduits.push(newArr[i])
                  break;
                case 'OUTFALLS':
                  var properties = JSON.parse(newArr[i].properties);
                  var outfalls = {
                    properties: properties.properties
                  }
                  self.outfallsData.push(outfalls.properties)
                  self.selectResult.outfalls.push(newArr[i])
                  break;
                case 'COMPANY':
                  var properties = JSON.parse(newArr[i].properties);
                  var companys = {
                    properties: properties.properties
                  }
                  self.companysData.push(companys.properties)
                  self.selectResult.companys.push(newArr[i])
                  break;
              }
            }
          }

          //  拿到结果进行处理  用于页面展示  用于 地图绘制

          self.isResult = !self.isResult
          this.$refs.map.showResult(self.selectResult);
          self.isLoading = false;
        })
      },
      //字符串转数组
      String2Array(data) {
        var selectArr = data.split(';')
        return selectArr;
      },
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
      .selectContext{position:absolute;top:58px;left:-800px; width:800px;max-height:700px;background:rgba(255,255,255,0.5);
        .result-ul li{float:left; width: 80px;}
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
  .logo{display:inline-block;width: 20px;height: 20px;position: relative; top:5px;
    img{width: 100%;height: 100%;}
  }
  .el-button + .el-button{margin: 0px;}
</style>

