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
        :is-hide-daolu="isHideDaolu"
        :is-hide-shizheng="isHideShizheng"
        :is-hide-lvdi="isHideLvdi"
        :is-hide-juzhu="isHideJuzhu"
        :is-hide-zhengfu='isHideZhengfu'
        :is-hide-gongye="isHideGongye"
        :is-hide-shangye="isHideShangye"
        :is-hide-all-conduits="isHideAllConduits"
        :is-hide-rain-conduits="isHideRainConduits"
        :is-hide-sewage-conduits="isHideSewageConduits"
        :is-hide-all-outfalls="isHideAllOutfalls"
        :is-hide-merge-outfalls='isHideMergeOutfalls'
        :is-hide-rain-outfalls='isHideRainOutfalls'
        :is-hide-sewage-outfalls="isHideSewageOutfalls"
        :is-hide-companies='isHideCompanys'
        v-on:isShowHandle="isShowHandles"

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
                  <span style="color: black;font-size: 16px;">{{subcatchments.road.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.shiZheng.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.lvDi.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.juZhuYongDi.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.zhengFu.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.gongYe.length}}</span>
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
                  <span style="color: black;font-size: 16px;">{{subcatchments.shangYe.length}}</span>
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
                <span class="number">{{companies.length}}</span>
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
              <el-collapse-item v-model="dataInfo" name="1" v-if="dataInfo.type=='地块'">
                <template slot="title">
                  <span>{{dataInfo.type}}</span>
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainConduits(dataInfo.id)" @click.stop>查下游雨水管+排口</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(18,54,239,0.5);" @click="handleSubcatchmentsSelectRainOutfalls(data.info.id)" @click.stop >查下游雨水排口</el-button>-->
                  <!--<el-button type="primary" style="padding: 3px; font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleSubcatchmentsSelectSewageConduits(data.info.id)" @click.stop>查下游污水管</el-button>-->
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);" @click="handleSubcatchmentsSelectSewageConduits(dataInfo.id)" @click.stop>查下游污水去向</el-button>

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
                  <el-button type="primary" round @click="handleSelectSubcatchments(dataInfo.name)" @click.stop>查询上游地块</el-button>
                </template>
                <div>
                  <el-collapse v-model="activeNames">
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
              <el-collapse-item v-model="data" :title="dataInfo.leixing +'信息'" name="1" v-if="dataInfo.type == '管线'">
                <div>
                  <el-collapse v-model="activeNames">
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
                            <el-tooltip class="item" effect="dark" :content="dataInfo.guanjing" placement="top-start">
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
                  <el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);" @click="handleCompanySelectSewageConduits(dataInfo.geos)" @click.stop>查下游污水管+污水去向</el-button>
                  <!--<el-button type="primary" style="padding: 3px;font-size: 13px;background:rgba(255,0,255,0.5);"  @click="handleCompanySelectSewageOutfall(data.geos)" @click.stop>查下游污水去向</el-button>-->
                </template>
                <el-collapse v-model="activeNames">
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
        <div class="selectContext" v-show="isSelect">
          <div>
            <el-tabs type="border-card" style="width: 100%" @tab-click="handleClicktabClick">
              <el-tab-pane label="精确查询">
                <div style="height:50px;">
                  <div style="padding:5px 0px;float:left;width:100%">
                    <span style="float:left;display:inline-block;line-height: 40px;">选择空间:</span>
                    <div style="float:left;max-width:570px;">
                      <span style="margin:3px 5px;display:inline-block" v-for="lay in spaceList" :key="lay.id">
                        <el-select v-model="lay.spaceValue" clearable placeholder="请选择" style="width:180px">
                        <el-option
                          v-for="item in rangeData"
                          :key="item.value"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                      </span>
                    </div>
                    <span style="float:left;display:inline-block;margin:5px 12px;">
                      <el-button style="padding:8px 10px;" type="primary" icon="el-icon-plus" @click="handelAddTea"></el-button>
                    </span>
                  </div>
                </div>
                <div style="position: relative;">
                  <div class="anshuxing">按属性:</div>
                  <div style="float:left;">
                    <div style="padding-bottom:3px" v-for="(list, index) in TypeList" :key="list.id">
                      <span> 类型: </span>
                      <el-select v-model="list.seletctType" @change="demoListDataModel(list, index)" clearable placeholder="请选择" style="width:120px">
                        <el-option
                          v-for="item in exactQuery"
                          :key="item.value"
                          :label="item.label"
                          :value="item">
                        </el-option>
                      </el-select>
                      <span> 属性: </span>
                      <el-select v-model="list.selectAttribute" @change="demoListDataModelType(list, index)" clearable placeholder="请选择" style="width:160px">
                        <el-option
                          v-for="item in attributeData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span> 属性值: </span>
                      <el-autocomplete
                        class="el-input"
                        style="width:130px"
                        v-model="list.AttributeValue"
                        :fetch-suggestions="AttributeValueFunc"
                        placeholder="请输入属性值"
                        :trigger-on-focus="true"
                        @focus="AttributeValueFocus(list.attribute)">
                      </el-autocomplete>
                    </div>
                  </div>
                  <div class="divSpanButton">
                    <el-button type="primary" icon="el-icon-plus" @click="handelAddTerm"></el-button>
                  </div>
                  <div style="float:right; display:inline-block;padding-right:80px;padding-top:5px;">
                    <el-button type="success" style="padding:12px 35px;" @click="handelQueryTerm">查询</el-button>
                    <el-button type="primary" style="padding:12px 35px;" @click="handelDeleteTerm">清除</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="模糊查询">
                <div style="padding:5px 0px;">
                  <span style="display:inline-block;min-width:85px;text-align:right;">按空间范围:</span>
                  <el-autocomplete
                    class="el-input"
                    style="width:450px"
                    v-model="spaceRange"
                    :fetch-suggestions="spaceRangeAsync"
                    placeholder="请输入查询条件,多条件之间用;(分号隔开)"
                    :trigger-on-focus="false">
                  </el-autocomplete>
                </div>
                <div style="width:540px;">
                  <span style="display:inline-block;min-width:85px;text-align:right;">按属性值:</span>
                  <el-autocomplete
                    class="el-input"
                    style="width:450px"
                    v-model="queryStr"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入查询条件,多条件之间用;(分号隔开)"
                    :trigger-on-focus="false">
                  </el-autocomplete>
                  <div class="buttonDouble">
                    <el-button type="success" @click="handleSelect">查询</el-button>
                    <el-button type="primary" @click="handelDeleteTerm">清除</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="tabPaneLabel" v-show="selectTable === selectLabel" style="background-color: #fff;padding-left: 10px;position:relative;">
            <span class="buttonList">
              <el-button @click="underPipeClick" v-if="underPipelineMouth" :style="'background:'+underBackCor+';color:'+textCor"
                         type="primary" plain size="mini">下游管线 + 排口</el-button>
              <el-button @click="underSewageClick" v-if="underSewageWhere" :style="'background:'+onBackCor+';color:'+textCor"
                         type="primary" plain size="mini">下游污水 + 去向</el-button>
              <el-button @click="entUnderClick" v-if="entUnderSewageWhere" :style="'background:'+onBackCor+';color:'+textCor"
                         type="primary" plain size="mini">下游污水 + 去向</el-button>
              <el-button @click="paikouOnPipeClick" v-if="paikouOnPipe" :style="'background:'+BackCor+';color:'+textCor"
                         type="primary" plain size="mini">上游管道</el-button>
              <el-button @click="paikouOnPlotClick" v-if="paikouOnPlot" :style="'background:'+BackCor+';color:'+textCor"
                         type="primary" plain size="mini">上游地块</el-button>
            </span>
            <el-tabs class="tabPaneSpan"  @tab-click="tableListComlde">
              <el-tab-pane :label=" '地块（'+showResult.subcatchments.length+'）'" name="0">
                 <el-table :data="(showResult.subcatchments).slice((currentPageNum1-1)*totalNumber1, currentPageNum1*totalNumber1)"
                          @selection-change="queryChangeHandle"
                          style="width: 100%" height="280" border >
                  <el-table-column align="center" default-sort type="selection"></el-table-column>
                  <el-table-column fixed width="50" label="序号" align="center" type="index">
                    <template slot-scope="scope">
                      {{ scope.$index + 1 + totalNumber1 * ( currentPageNum1 - 1 ) }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" :sortable="true" width="100" :show-overflow-tooltip="true" label="编号" prop="name"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="120" :show-overflow-tooltip="true" label="用地类型" prop="YDLX"
                                   column-key="YDLX" :filters="tableFilter(showResult.subcatchments, 'YDLX')"
                                   :filter-method="YDLXHandler"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="120" :show-overflow-tooltip="true" label="建设状态" prop="JSZT"
                                   column-key="JSZT" :filters="tableFilter(showResult.subcatchments, 'JSZT')"
                                   :filter-method="JSZTHandler"
                  ></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="项目名称" prop="XMMC"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="排入河道" prop="PRHD"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="所属流域" prop="SSLY"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="150" :show-overflow-tooltip="true" label="所属排水分区" prop="SSPSFQ"
                                   column-key="SSPSFQ" :filters="tableFilter(showResult.subcatchments, 'SSPSFQ')"
                                   :filter-method="SSPSFQHandler"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="180" :show-overflow-tooltip="true" label="是否为正本清源项目" prop="ZBQY"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="150" :show-overflow-tooltip="true" label="海绵建设情况" prop="HMCS"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="现状控制率" prop="现状控制率"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="规划控制率" prop="规划控制率"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="面积(公顷)" prop="area"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange1"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="showResult.subcatchments.length">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '企业('+showResult.companies.length+')'" name="1">
                <el-table :data="(showResult.companies).slice(( currentPageNum2 - 1 ) * totalNumber2 , currentPageNum2 * totalNumber2)"
                          style="width: 100%" height="280" border>
                  <el-table-column align="center" default-sort type="selection"></el-table-column>
                  <el-table-column fixed label="序号" align="center" type="index" width="50"></el-table-column>
                  <el-table-column align="center" sortable width="110" :show-overflow-tooltip="true" label="企业名称" prop="QYMC"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="街道" prop="JDMC"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="社区" prop="SQMC"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="地址" prop="SCJYDZ"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="法人代表" prop="FDDBR"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="联系方式" prop="LXFS"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="企业人数" prop="QYRS"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="行业类别" prop="QYLXR"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="生产用水量" prop="SCYSL"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="排水量" prop="PSL"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="主要生产工艺" prop="ZYSCGY"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="产品" prop="CPZL"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="环评" prop="HPPFWJ"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="环评有效性" prop="EnterEffective"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="排污许可证" prop="PWXKZ"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="废水处理方式" prop="FSCLFS"></el-table-column>
                  <el-table-column align="center" sortable width="170" :show-overflow-tooltip="true" label="特征污染物" prop="TZWRW"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange2"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="showResult.companies.length">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '管线('+showResult.conduits.length+')'" name="2">
                <el-table :data="(showResult.conduits).slice(( currentPageNum3 - 1 ) * totalNumber3 , currentPageNum3 * totalNumber3)"
                          style="width: 100%" height="280" borde>
                  <el-table-column align="center" default-sort type="selection"></el-table-column>
                  <el-table-column fixed type="index" width="50" label="序号" align="center">
                    <template slot-scope="scope">
                      {{ scope.$index + 1 + totalNumber3 * ( currentPageNum3 - 1 ) }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管道编号" prop="name"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管道类型" prop="leixing"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管径" prop="guanjing"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange3"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="0">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '排口('+showResult.outfalls.length+')'" name="3">
                <el-table :data="(showResult.outfalls).slice((currentPageNum4-1)*totalNumber4, currentPageNum4*totalNumber4)"
                          style="width: 100%" height="280" @selection-change="queryChangeRowMouth" ref="multipleTable" border="">
                  <el-table-column align="center" default-sort type="selection"></el-table-column>
                  <el-table-column fixed type="index" width="50" label="序号" align="center">
                    <template slot-scope="scope">
                      {{ scope.$index + 1 + totalNumber4 * ( currentPageNum4 - 1 ) }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable width="210" :show-overflow-tooltip="true" label="排口编号" prop="name"></el-table-column>
                  <el-table-column align="center" sortable width="210" :show-overflow-tooltip="true" label="排口类型" prop="leixing"></el-table-column>
                  <el-table-column align="center" sortable width="210" :show-overflow-tooltip="true" label="排向" prop="paixiang"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange4"
                               @current-change="handleCurrentChangeHandel4"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="showResult.outfalls.length">
                </el-pagination>
              </el-tab-pane>
            </el-tabs>
            <!-- 点击按钮弹出框 -->
            <el-dialog title="下游管线 + 排口" :visible.sync="dialogVisible" width="80%">
              <el-tabs type="card">
                <!-- 标签页 -->
                <!--<el-tab-pane v-for="lay in tabPaneName" :label="lay.labelName" :name="lay.id" :key="lay.id">-->
                  <!-- 表格 -->
                  <!--<el-table :data="dialogTableData" @selection-change="queryChangeHandle" style="width: 100%" highlight-current-row border height="280">-->
                    <!--<template>-->
                      <!--<el-table-column fixed width="50" label="序号" align="center" type="index"></el-table-column>-->
                      <!--<template v-for="col in dialogTheader">-->
                        <!--<el-table-column v-if="col.type == 'sort'" :prop="col.prop" :label="col.label" :width="col.width"-->
                                         <!--:show-overflow-tooltip="true" align="center">-->
                        <!--</el-table-column>-->
                      <!--</template>-->
                    <!--</template>-->
                  <!--</el-table>-->

                <!--</el-tab-pane>-->
              </el-tabs>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleSubmit">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <!-- 查询下游 -->
          <div v-if="queryDown" class="tabPaneLabel">
            <el-tabs  @tab-click="queryUpDownHandleClick">
              <el-tab-pane label="下游管线" name="0">下游管线信息</el-tab-pane>
              <el-tab-pane label="下游排口" name="1">下游排口信息</el-tab-pane>
            </el-tabs>
          </div>
          <!-- 查询上游 -->
          <div v-if="queryUp" class="tabPaneLabel">
            <el-tabs v-model="firstModel" @tab-click="queryUpDownHandleClick">
              <el-tab-pane label="上游地块" name="first">上游地块信息</el-tab-pane>
              <el-tab-pane label="上游企业" name="second">上游企业信息</el-tab-pane>
              <el-tab-pane label="上游管线" name="third">上游管线信息</el-tab-pane>
            </el-tabs>
          </div>
          <div></div>
        </div>
        <div class="label" style="background: red" @click="handleReset">
          重新绘制
        </div>
      </div>

      <!--编辑弹框-->
      <div class="isShowDialog" v-if="isShowDialog">
        <span style="display:inline-block;width:150px;padding:10px 0px 10px 20px;font-size: 20px;"> 编辑 </span>
        <div v-for="(item, index) in placeModelData" :key="index" class="isShowBianji">
          <span class="isShowDialogSpan"> {{item.name}} </span>
          <el-input placeholder="请输入内容" v-model="item.placeholderModel" clearable :disabled="item.disabledShow"></el-input>
        </div>
        <div style="padding:10px 0px;padding-left:125px;">
          <el-button style="padding:10px 20px;" @click="isShowDialog = false"> 取消 </el-button>
          <el-button style="padding:10px 20px;" type="primary" @click="isShowDialog = false"> 确认 </el-button>
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
  import {
    geojson2cytoscape,
    getAncestorConduitsOfOutfall,
    calcAllSubcatchmentNearestNode,
    getAncestorSubcatchmentsOfOutfall,
    getDescendantConduitsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getNearestNodeOfPoint,
    isJunctionInRange,
    isOutfallInRange,
    isSubcatchmentInRange,
    isCompanyInRange,
    isConduitInRange
  } from '@/utils/mapUtil'
  import '@/utils/GeoUtils.js'
  import _ from 'lodash'

  export default {
    name: 'Home',
    watch: {
      info: function(info) {
        this.infoManager = true
        this.dataInfo = info
      }
    },
    components: {
      BaiduMap
    },
    data() {
      return {
       // isShowHandle: 'list',
        isShowDialog: false,
        placeModelData: [
          { id:'0', name: '编号:',  placeholderModel: 'DK-02' },
          { id:'1', name: '用地类型:',  placeholderModel: '地块' },
          { id:'2', name: '建设状态:',  placeholderModel: '在建' },
          { id:'3', name: '项目名称:',  placeholderModel: '深圳' },
          { id:'4', name: '所属流域:',  placeholderModel: '1#排水分区' }
        ],
        dialogTheader: [], // 初始化表头
        dialogTableData: [], // 弹框表格数据
        tabPaneName: [], // 弹框标签页数据
        dialogVisible: false, // 弹框
        underPipelineMouth: false, // 下游管线 +  排口按钮
        underSewageWhere: false, // 下游污水 + 去向
        entUnderSewageWhere: false, // 下游污水 + 去向
        paikouOnPipe: false, // 上游管道
        paikouOnPlot: false, // 上游地块
        BackCor: '#00BF8B',
        underBackCor: 'rgba(18, 54, 239, 0.5)',
        onBackCor: 'rgba(255, 0, 255, 0.5)',
        textCor: '#fff',
        elOptionValue: '',
        elOptionData: [],
        comend: null,
        tableData: [],
        /** ***********/
        firstModel: 'first',
        queryUp: false, // 查询上游
        queryDown: false, // 查询下游
        isShowButton: false, // 多选按钮
        isDisabled: true, // 禁用按钮
        /** *************************/
        count: 0,
        displayData: [],
        listDemoData: [
          {
            id: 1,
            massifNumber: '06-01',
            massifType: 'G1',
            massifState: '现状',
            massifRowNamer: '',
            massifRowRiver: '东坑水',
            massifRowBasin: '东坑水',
            massifPartition: '6#排水分区',
            massifNum: '',
            massifReform: '现状无海绵',
            massifPresent: '73%',
            massifPlan: '73%',
            massifArea: '0.24'
          },
          {
            id: 2,
            massifNumber: '05-03',
            massifType: 'G1',
            massifState: '在建',
            massifRowNamer: '',
            massifRowRiver: '东坑水',
            massifRowBasin: '东坑水',
            massifPartition: '2#排水分区',
            massifNum: '',
            massifReform: '在建已落实海绵',
            massifPresent: '80%',
            massifPlan: '80%',
            massifArea: '0.26'
          },
          {
            id: 3,
            massifNumber: '01-10-2',
            massifType: 'G1',
            massifState: '规划',
            massifRowNamer: '',
            massifRowRiver: '东坑水',
            massifRowBasin: '东坑水',
            massifPartition: '7#排水分区',
            massifNum: '',
            massifReform: '规划管控',
            massifPresent: '73%',
            massifPlan: '73%',
            massifArea: '0.32'
          },
          {
            id: 4,
            massifNumber: '03-14',
            massifType: 'G1',
            massifState: '规划',
            massifRowNamer: '',
            massifRowRiver: '东坑水',
            massifRowBasin: '东坑水',
            massifPartition: '3#排水分区',
            massifNum: '',
            massifReform: '规划管控',
            massifPresent: '80%',
            massifPlan: '80%',
            massifArea: '1.83'
          },
          {
            id: 5,
            massifNumber: '05-17',
            massifType: 'G1',
            massifState: '在建',
            massifRowNamer: '',
            massifRowRiver: '东坑水',
            massifRowBasin: '东坑水',
            massifPartition: '3#排水分区',
            massifNum: '',
            massifReform: '在建已落实海绵',
            massifPresent: '73%',
            massifPlan: '73%',
            massifArea: '1.22'
          }
        ],
        /** *********************/
        currentPageNum1: 1, // 默认开始页面
        currentPageNum2: 1, // 默认开始页面
        currentPageNum3: 1, // 默认开始页面
        currentPageNum4: 1, // 默认开始页面
        pageSizeValue1: 3,
        pageSizeValue2: 3,
        pageSizeValue3: 3,
        pageSizeNum: [5], // 每页的数据条数
        currentPage4: 4,
        totalNumber: 5,
        totalNumber1: 5,
        totalNumber2: 5,
        totalNumber3: 5,
        totalNumber4: 5,
        tabPaneLabel: false,
        activeNameFiast: 0,
        tableDataList: [
          {
            firstId: 0, name: '地块',
            fromData: []
          },
          {
            firstId: 1, name: '企业',
            fromData: []
          },
          {
            firstId: 2, name: '排口',
            fromData: []
          }
        ],
        activeName2: 'first',
        TypeList: [{
          seletctType: '',
          selectAttribute: '',
          AttributeValue: ''
        }],
        spaceList: [{
          spaceValue: ''
        }],
        // 精确查找类型
        exactQuery: [
          { value: 'outfalls', label: '排口' },
          { value: 'conduits', label: '管线' },
          { value: 'subcatchments', label: '地块' },
          { value: 'companies', label: '工业企业' }
        ],
        AttributeValue: [], // 精确查找属性值推荐
        selectLabel: '', // 反向查询当前lable
        selectTable: '精确查询', // 反向查询当前查询的tab
        attributeData: [],
        junctionsLayData: [], // 交汇点数据
        conduitsLayData: [], // 管道数据
        companysLayData: [], // 公司数据
        subLayData: [], // 地块数据
        shapes: [],
        /** *************************************************/
        options: [
          {
            value: '选项1',
            label: '地块'
          },
          {
            value: '选项2',
            label: '工业企业'
          },
          {
            value: '选项3',
            label: '排口'
          },
          {
            value: '选项4',
            label: '管线'
          }
        ],
        value4: '',
        //
        isLoading: false,
        // 搜索出来的结果
        selectSubcatchmentData: [],
        selectOutfalls: [],
        selectCompanys: [],
        // end
        subcatchmentData: [],
        conduitsData: [],
        outfallsData: [],
        companysData: [],
        isResult: false,

        selectLoading: false,
        // 显示隐藏地块
        isHideAllSubcatchments: true,
        isHideDaolu: true,
        isHideShizheng: true,
        isHideLvdi: true,
        isHideJuzhu: true,
        isHideZhengfu: true,
        isHideGongye: true,
        isHideShangye: true,
        // 显示隐藏管线
        isHideAllConduits: true,
        isHideRainConduits: true,
        isHideSewageConduits: true,
        // 显示隐藏排口
        isHideAllOutfalls: true,
        isHideMergeOutfalls: true,
        isHideRainOutfalls: true,
        isHideSewageOutfalls: true,
        // 显示隐藏企业
        isHideCompanys: true,
        // 消息提示
        infoManager: false,
        isSelect: false,
        isCollapse: true,
        tabPosition: 'right',
        activeName: '1',
        data: {},
        activeNames: ['1'],
        dataInfo: {},
        //  空间输入项
        spaceRange: '',
        //  属性输入项
        queryStr: '',
        queryOptions: [],
        //  查询结果
        selectResult: {
          subcatchments: [],
          conduits: [],
          junctions: [],
          outfalls: [],
          companies: []
        },
        select: {
          subcatchments: [],
          conduits: [],
          junctions: [],
          outfalls: [],
          companies: []
        }
      }
    },
    computed: {

      info() {
        return this.$store.state.mapData.info
      },
      resultData() {
        return this.$store.state.mapData.resultData
      },
      shapeIdStrMap() {
        const self = this
        const ret = {}
        _.each(self.shapes, shape => {
          self.$set(ret, shape.id, JSON.stringify(shape))
        })
        return ret
      },
      shapeIdMap() {
        const self = this
        return _.keyBy(self.shapes, 'id')
      },
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
      },
      showResult() {
        const self = this
        return {
          subcatchments: _.map(self.selectResult.subcatchments, item => item.properties.properties),
          outfalls: _.map(self.selectResult.outfalls, item => item.properties.properties),
          junctions: _.map(self.selectResult.junctions, item => item.properties.properties),
          conduits: _.map(self.selectResult.conduits, item => item.properties.properties),
          companies: _.map(self.selectResult.companies, item => item.properties.properties)
        }
      },
      rangeData() {
        return _.filter(this.shapes, function(item) {
          return item.category === 'RANGE'
        })
      }
    },
    create() {},
    mounted() {
      this.init()
    },
    methods: {
      isShowHandles:function(data) {
        let methObj = data.properties;
        this.placeModelData = [];
        this.isShowDialog = true;
        /**** 地块 *****/
        if(data.businessType === 'SUBCATCHMENTS'){
          this.placeModelData = [
            { id:'0', name: '编号:', placeholderModel: methObj.name, disabledShow: true },
            { id:'1', name: '面积:', placeholderModel: methObj.area, disabledShow: true },
            { id:'2', name: '用地类型:', placeholderModel: methObj.YDLX, disabledShow: true },
            { id:'3', name: '建设状态:', placeholderModel: methObj.JSZT, disabledShow: false },
            { id:'4', name: '项目名称:', placeholderModel: methObj.XMMC, disabledShow: false },
            { id:'5', name: '排入河道:', placeholderModel: methObj.PRHD, disabledShow: true },
            { id:'6', name: '所属流域:', placeholderModel: methObj.SSLY, disabledShow: true },
            { id:'7', name: '所属排水分区:', placeholderModel: methObj.SSPSFQ, disabledShow: false },
            { id:'8', name: '是否为正本清源项目:', placeholderModel: methObj.ZBQY, disabledShow: false },
            { id:'9', name: '是否为海绵项目:', placeholderModel: methObj.HMLX, disabledShow: true },
            { id:'10', name: '海绵类型:', placeholderModel: methObj.HMLX, disabledShow: true },
            { id:'11', name: '现状控制率:', placeholderModel: methObj.现状控制率, disabledShow: false },
            { id:'12', name: '规划控制率:', placeholderModel: methObj.规划控制率, disabledShow: true },
          ]
        }
        /**** 企业 *****/
        if(data.businessType === 'COMPANY'){
          this.placeModelData = [
            { id:'0', name: '企业名称:', placeholderModel: methObj.name, disabledShow: true },
            { id:'1', name: '街道:', placeholderModel: methObj.JDMC, disabledShow: true },
            { id:'2', name: '社区:', placeholderModel: methObj.SQMC, disabledShow: true },
            { id:'3', name: '地址:', placeholderModel: methObj.SCJYDZ, disabledShow: true },
            { id:'4', name: '法人代表:', placeholderModel: methObj.FDDBR, disabledShow: true },
            { id:'5', name: '联系方式:', placeholderModel: methObj.LXFS, disabledShow: true },
            { id:'6', name: '企业人数:', placeholderModel: methObj.QYRS, disabledShow: true },
            { id:'7', name: '行业类别:', placeholderModel: methObj.HYLB, disabledShow: true },
            { id:'8', name: '生产用水量:', placeholderModel: methObj.SCYSL, disabledShow: false },
            { id:'9', name: '排水量:', placeholderModel: methObj.PSL, disabledShow: false },
            { id:'10', name: '主要生产工艺:', placeholderModel: methObj.ZYSCGY, disabledShow: false },
            { id:'11', name: '产品:', placeholderModel: methObj.CPZL, disabledShow: false },
            { id:'12', name: '环评:', placeholderModel: methObj.HPPFWJ, disabledShow: false },
            { id:'13', name: '环评有效性:', placeholderModel: methObj.HPPFWJYXX, disabledShow: false },
            { id:'14', name: '排污许可证:', placeholderModel: methObj.PWXKZ, disabledShow: false },
            { id:'15', name: '废水处理方式:', placeholderModel: methObj.FSCLFS, disabledShow: false },
            { id:'16', name: '特征污染物:', placeholderModel: methObj.TZWRW, disabledShow: false },
          ]
        }
        /**** 管线 *****/
        if(data.businessType === 'CONDUITS'){
          this.placeModelData = [
            { id:'0', name: '管道编号:', placeholderModel: methObj.name, disabledShow: true },
            { id:'1', name: '管道类型:', placeholderModel: methObj.leixing, disabledShow: true },
            { id:'2', name: '管径:', placeholderModel: methObj.guanjing, disabledShow: false },
          ]
        }
      },
      /** ** 表头筛选 *****/
      YDLXHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      JSZTHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      SSPSFQHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      /** ** table页的切换 *******/
      tableListComlde(tab, event) {
        if (tab.index === '0') {
          this.underPipelineMouth = true
          this.underSewageWhere = true
          this.entUnderSewageWhere = false
          this.paikouOnPipe = false
          this.paikouOnPlot = false
        }
        if (tab.index === '1') {
          this.underPipelineMouth = false
          this.underSewageWhere = false
          this.entUnderSewageWhere = true
          this.paikouOnPipe = false
          this.paikouOnPlot = false
        }
        if (tab.index === '2') {
          this.underPipelineMouth = false
          this.underSewageWhere = false
          this.entUnderSewageWhere = false
          this.paikouOnPipe = false
          this.paikouOnPlot = false
        }
        if (tab.index === '3') {
          this.underPipelineMouth = false
          this.underSewageWhere = false
          this.entUnderSewageWhere = false
          this.paikouOnPipe = true
          this.paikouOnPlot = true
        }
      },
      /** ** 弹框提交按钮 ********/
      dialogVisibleSubmit() {
        console.log('弹框提交按钮')
      },
      /** ** 查询下游水管及排口 *****/
      underPipeClick(value) {
        const _this = this
        _this.dialogVisible = true
        _this.tabPaneName = [
          { labelName: '管线', labelId: 0, id: 0 },
          { labelName: '排口', labelId: 1, id: 1 }
        ]
        _.each(_this.shapes, function(vb) {
          _this.dialogTheader = [] // 初始化表头
          _this.dialogTableData = [] // 初始化表格数据
          var des = vb.properties.properties
          var busType = vb.properties.businessType
          // debugger
          if (_this.seletctType.labelId === busType) {
            _this.dialogTheader = [
              { width: '100', prop: 'name', label: '编号', type: 'sort' },
              { width: '120', prop: 'YDLX', label: '用地类型', type: 'sort' },
              { width: '120', prop: 'JSZT', label: '建设状态', type: 'sort' },
              { width: '110', prop: 'XMMC', label: '项目名称', type: 'sort' },
              { width: '110', prop: 'PRHD', label: '排入河道', type: 'sort' },
              { width: '110', prop: 'SSLY', label: '所属流域', type: 'sort' },
              { width: '160', prop: 'SSPSFQ', label: '所属排水分区', type: 'sort' },
              { width: '180', prop: 'ZBQY', label: '是否为正本清源项目', type: 'sort' },
              { width: '150', prop: 'HMCS', label: '海绵建设情况', type: 'sort' },
              { width: '130', prop: '现状控制率', label: '现状控制率', type: 'sort' },
              { width: '130', prop: '规划控制率', label: '规划控制率', type: 'sort' },
              { width: '130', prop: 'area', label: '面积(公顷)', type: 'sort' }
            ]
            _this.dialogTableData.push({
              name: des.name,
              YDLX: des.YDLX,
              JSZT: des.JSZT,
              XMMC: des.XMMC,
              PRHD: des.PRHD,
              SSLY: des.SSLY,
              SSPSFQ: des.SSPSFQ,
              ZBQY: des.ZBQY,
              HMCS: des.HMCS,
              现状控制率: des.现状控制率,
              规划控制率: des.规划控制率,
              area: (des.area).toFixed(2)
            })
          }
        })
      },
      /** ** 查询下游污水去向 *****/
      underSewageClick() {
        console.log('地块下游污水 + 去向')
      },
      /** ** 查询企业下游污水 ******/
      entUnderClick() {
        console.log('查询企业下游污水')
      },
      /** ** 查询上游管道 *****/
      paikouOnPipeClick() {
        console.log('查询上游管道')
      },
      /** ** 查询上游地块 *****/
      paikouOnPlotClick() {
        console.log('查询上游地块')
      },
      /** **** 查询上游 ********/
      queryUpperSwim(row) {
        const _this = this
        _this.tabPaneLabel = false
        _this.queryUp = true
        _this.queryDown = false
      },
      /** **** 查询下游 ********/
      queryLowerSwim(row) {
        const _this = this
        console.log('========', _this, row)
        _this.tabPaneLabel = false
        _this.queryDown = true
      },
      queryUpDownHandleClick() {},
      queryChangeRowMouth(val) {
        const _this = this
        var mouthData = _this.showResult.outfalls
        if (val.length > 0) {
          _this.isShowButton = true
        } else {
          _this.isShowButton = false
        }
      },
      queryChangeHandle(val) {
        const _this = this
        if (val.length > 0) {
          _this.isShowButton = true
        } else {
          _this.isShowButton = false
        }
      },

      /**
       * 根据属性值得到查询时的下拉选项
       * */
      getQueryOptions() {
        const self = this
        _.each(self.shapes, shape => {
          const properties = shape.properties.properties

          if (!properties) {
            return 0
          }

          _.each(_.keys(properties), key => {
            if (!key || !properties[key] || ['WP', 'YP', 'center', 'area', 'X_cor', 'Y_cor'].indexOf(key) >= 0) {
              return 0
            }

            _.each(String(properties[key]).split('、'), option => {
              if (['光明医院', 'GIC4'].indexOf(option) >= 0) {
                return 0
              }
              self.queryOptions.push({ value: option })
            })
          })
        })
        self.queryOptions = _.uniqBy(self.queryOptions, 'value')
      },
      init() {
        const self = this
        self.shapes = []
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000000,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: self.$route.query.projectId
                }
              }
            }
          }
        }).then((res) => {
          self.shapes = JSON.parse(JSON.stringify(res.data))
          _.each(self.shapes, function(item) { item.properties = JSON.parse(item.properties) })
          self.getQueryOptions()
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
        this.isHideAllSubcatchments = !this.isHideAllSubcatchments
      },
      // 隐藏道路
      handleHideDaolu() {
        this.isHideDaolu = !this.isHideDaolu
      },
      // 隐藏市政
      handleHideShiZheng() {
        this.isHideShizheng = !this.isHideShizheng
      },
      // 隐藏绿地
      handleHideLvdi() {
        this.isHideLvdi = !this.isHideLvdi
      },
      // 隐藏居住用地
      handleHideJuzhu() {
        this.isHideJuzhu = !this.isHideJuzhu
      },
      // 隐藏政府
      handleHideZhengfu() {
        this.isHideZhengfu = !this.isHideZhengfu
      },
      // 隐藏工业用地
      handleHideGongye() {
        this.isHideGongye = !this.isHideGongye
      },
      // 隐藏商业
      handleHideShangye() {
        this.isHideShangye = !this.isHideShangye
      },
      /**
       * 显示/隐藏所有管线
       */
      handleHideAllConduits() {
        this.isHideAllConduits = !this.isHideAllConduits
      },
      // 显示/隐藏雨水管线
      handleHideRainConduits() {
        this.isHideRainConduits = !this.isHideRainConduits
      },
      // 显示/隐藏污水管线
      handleHideSewageConduits() {
        this.isHideSewageConduits = !this.isHideSewageConduits
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
        this.isShowDialog = false
        if (this.isSelect) {
          this.isSelect = !this.isSelect
        }
      },

      /**
       * 显示/隐藏全部企业
       *
       */
      handleHideAllCompanys() {
        this.isHideCompanys = !this.isHideCompanys
      },
      /**
       * 根据排口查询上游管线
       */
      handleSelectConduits(outFallName) {
        this.$refs.map.handleSelectConduits(outFallName)
      },
      /**
       *根据排口查上游地块
       */
      handleSelectSubcatchments(outFallName) {
        this.$refs.map.handleSelectSubcatchments(outFallName)
      },
      /**
       *根据地块查询下游雨水管道
       */
      handleSubcatchmentsSelectRainConduits(data) {
        this.$refs.map.handleSubcatchmentsSelectRainConduits(data)
      },
      // 根据地块查询污水管道
      handleSubcatchmentsSelectSewageConduits(data) {
        this.$refs.map.handleSubcatchmentsSelectSewageConduits(data)
      },
      /**
       * 根据企业查询下游污水排口
       * */
      handleCompanySelectSewageOutfall(data) {
        this.$refs.map.handleCompanySelectSewageOutfall(data)
      },
      // 根据企业查询污水管道
      handleCompanySelectSewageConduits(data) {
        this.$refs.map.handleCompanySelectSewageConduits(data)
      },
      /**
       * 根据地块查询下游雨水排口
       */
      handleSubcatchmentsSelectRainOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectRainOutfalls(data)
      },
      handleSubcatchmentsSelectSewageOutfalls(data) {
        this.$refs.map.handleSubcatchmentsSelectSewageOutfalls(data)
      },
      /**
       * 重新绘制事件
       * */
      handleReset() {
        const self = this
        self.isShowDialog = false
        self.selectSubcatchmentData = []
        self.selectOutfalls = []
        self.selectCompanys = []
        self.$refs.map.handleReset()
      },
      /**
       * 反向查询
       * */
      // 精确查询  ---  增加查询条件
      handelAddTerm() {
        if (this.TypeList.length < 3) {
          this.TypeList.push({
            seletctType: '',
            selectAttribute: '',
            AttributeValue: ''
          })
        }
      },
      handelAddTea() {
        if (this.spaceList.length < 7) {
          this.spaceList.push({
            spaceValue: ''
          })
        }
      },
      /** *********** 清空查询 ***************/
      handelDeleteTerm() {
        this.TypeList = [{
          seletctType: '',
          selectAttribute: '',
          AttributeValue: ''
        }]
        this.spaceList = [{
          spaceValue: ''
        }]
        this.tabPaneLabel = false;
        this.handleReset();
      },
      /* handelDeleteCloa(){
        let indexId = this.spaceList.length - 1;
        this.spaceList.splice(1, indexId);
      },*/
      // 判断是否在范围内
      isRange(item, data) {
        return (item.category === 'RANGE' && item.name === data.name) || (item.category === 'JUNCTIONS' && isJunctionInRange(item, data)) || (item.category === 'OUTFALLS' && isOutfallInRange(item, data)) || (item.category === 'SUBCATCHMENTS' && isSubcatchmentInRange(item, data)) || (item.category === 'COMPANY' && isCompanyInRange(item, data)) || (item.category === 'CONDUITS' && isConduitInRange(item, data))
      },
      /** *********** 查询按钮 ***************/
      handelQueryTerm() {
        const _this = this
        _this.isLoading = true
        let isTypeList = false
        _this.selectResult = {
          subcatchments: [],
          conduits: [],
          outfalls: [],
          companies: [],
          junctions: [],
          range: []
        }
        let shapesData = _.cloneDeep(_this.shapes)
        let range = [] // 当前选中的空间
        _.each(_this.spaceList, item => {
          if (item.spaceValue) {
            range.push(_.filter(_this.rangeData, data => { return data.name === item.spaceValue })[0])
          }
        })
        let shapesDatas = []
        console.log('range🙃', range)
        _.each(range, data => {
          shapesDatas.length ? shapesDatas = _.concat((_.filter(shapesData, item => {
            return _this.isRange(item, data)
          })), shapesDatas) : shapesDatas = _.filter(shapesData, item => {
            return _this.isRange(item, data)
          })
        })
        if (shapesDatas.length) {
          shapesData = shapesDatas
        }
        console.log('_this.TypeList:', _this.TypeList)
        _.each(_this.TypeList, function(list) {
          if (list.seletctType && list.seletctType.value && list.selectAttribute && list.AttributeValue) {
            isTypeList = true
            const matchedShapes = _.filter(shapesData, shape => {
              return shape.category === (list.seletctType.value === 'companies' ? 'COMPANY' : list.seletctType.value.toUpperCase()) &&
                shape.properties.properties[list.selectAttribute] === list.AttributeValue
            })
            _this.selectResult[list.seletctType.value].length ? _this.selectResult[list.seletctType.value] = _.concat(_this.selectResult[list.seletctType.value], matchedShapes) : _this.selectResult[list.seletctType.value] = matchedShapes
          }
        })
        if (!isTypeList) {
          _this.selectResult = {
            subcatchments: _.reject(shapesData, function(item) {
              return item.category !== 'SUBCATCHMENTS'
            }),
            conduits: _.reject(shapesData, function(item) {
              return item.category !== 'CONDUITS'
            }),
            junctions: _.reject(shapesData, function(item) {
              return item.category !== 'JUNCTIONS'
            }),
            outfalls: _.reject(shapesData, function(item) {
              return item.category !== 'OUTFALLS'
            }),
            companies: _.reject(shapesData, function(item) {
              return item.category !== 'COMPANY'
            }),
            range: _.reject(shapesData, function(item) {
              return item.category !== 'RANGE'
            })
          }
        }
        _this.tableDispose(_this.selectResult)
        _this.selectLabel = '精确查询'
        console.log('😆', _this.selectResult, shapesData)
        setTimeout(function() {
          _this.$refs.map.showResult(_this.selectResult, shapesData)
          _this.isLoading = false
          _this.tabPaneLabel = true
          _this.underPipelineMouth = true // 地块
          _this.underSewageWhere = true // 地块
        }, 200)
      },
      // 处理反向查询的数据
      tableDispose(selectResult) {
        // 处理管线直径
        if (selectResult.conduits.length) {
          _.map(selectResult.conduits, item => {
            item.properties.properties.guanjing = item.properties.properties.guanjing * 1000
          })
        }
        // 处理地块面积
        if (selectResult.subcatchments.length) {
          _.map(selectResult.subcatchments, item => {
            item.properties.properties.area = (item.properties.properties.area / 10000).toFixed(2)
          })
        }
      },
      // tableFilter
      tableFilter(data, value) {
        const filter = []
        _.each(data, item => {
          filter.push({ value: item[value], text: item[value] })
        })
        return _.uniqBy(filter, 'value')
      },
      /** *********** 选择框 ***************/
      demoListDataListDemo(value) {
        console.log('??????????', value)

        if (value === '1') {
          this.displayData = this.listDemoData
          this.count = this.displayData.length
        }
        if (value === '2') {
          this.displayData = []
          this.displayData = [
            {
              id: 1,
              massifNumber: '06-18',
              massifType: 'M1',
              massifState: '现状',
              massifRowNamer: '招商光明科技园企业加速器',
              massifRowRiver: '东坑水',
              massifRowBasin: '东坑水',
              massifPartition: '6#排水分区',
              massifNum: '工业区正本清源',
              massifReform: '现状已落实海绵',
              massifPresent: '70%',
              massifPlan: '70%',
              massifArea: '8.14'
            },
            {
              id: 2,
              massifNumber: '06-08',
              massifType: 'M1',
              massifState: '在建',
              massifRowNamer: '汇业科技园',
              massifRowRiver: '东坑水',
              massifRowBasin: '东坑水',
              massifPartition: '6#排水分区',
              massifNum: '工业区正本清源',
              massifReform: '在建已落实海绵',
              massifPresent: '70%',
              massifPlan: '70%',
              massifArea: '7.6'
            }
          ]
          this.count = this.displayData.length
        }
        if (value === '3') {
          this.displayData = []
          this.displayData = [
            {
              id: 1,
              massifNumber: 'DL-1',
              massifType: '道路',
              massifState: '规划',
              massifRowNamer: '',
              massifRowRiver: '东坑水',
              massifRowBasin: '东坑水',
              massifPartition: '19#排水分区',
              massifNum: '',
              massifReform: '规划管控',
              massifPresent: '55%',
              massifPlan: '55%',
              massifArea: '0.04'
            },
            {
              id: 2,
              massifNumber: 'DL-10',
              massifType: '道路',
              massifState: '规划',
              massifRowNamer: '光源二路',
              massifRowRiver: '东坑水',
              massifRowBasin: '东坑水',
              massifPartition: '6#排水分区',
              massifNum: '',
              massifReform: '规划管控',
              massifPresent: '55%',
              massifPlan: '55%',
              massifArea: '0.23'
            },
            {
              id: 3,
              massifNumber: 'DL-2',
              massifType: '道路',
              massifState: '规划',
              massifRowNamer: '泉鸣路',
              massifRowRiver: '东坑水',
              massifRowBasin: '东坑水',
              massifPartition: '2#排水分区',
              massifNum: '',
              massifReform: '规划管控',
              massifPresent: '55%',
              massifPlan: '55%',
              massifArea: '0.13'
            }
          ]
          this.count = this.displayData.length
        }
      },
      demoListDataModelType(value, index) {
        console.log(value, index)
        value.attribute = []
        _.each(this.shapes, item => {
          if (item.properties.businessType === (value.seletctType.value === 'companies' ? 'COMPANY' : value.seletctType.value.toUpperCase())) {
            value.attribute.push(item.properties.properties[value.selectAttribute])
          }
        })
        console.log('demoListDataModelType🙃：', value)
        value.attribute = _.uniq(value.attribute)
        value.AttributeValue = ''
      },
      AttributeValueFocus(attribute) {
        this.AttributeValue = attribute
      },
      demoListDataModel(value, index) {
        this.attributeData = []
        if (value.seletctType.label === '排口') {
          this.attributeData = [
            { value: 'name', label: '排口编号' },
            { value: 'leixing', label: '排口类型' },
            { value: 'paixiang', label: '排向' }
          ]
        }

        if (value.seletctType.label === '管线') {
          this.attributeData = [
            { value: 'name', label: '管道编号' },
            { value: 'leixing', label: '管道类型' },
            { value: 'guanjing', label: '管径' }
          ]
        }
        if (value.seletctType.label === '地块') {
          this.attributeData = [
            { value: 'name', label: '编号' },
            { value: 'YDLX', label: '用地类型' },
            { value: 'JSZT', label: '建设状态' },
            { value: 'XMMC', label: '项目名称' },
            { value: 'PRHD', label: '排入河道' },
            { value: 'SSLY', label: '所属流域' },
            { value: 'SSPSFQ', label: '所属排水分区' },
            { value: 'ZBQY', label: '是否为正本清源项目' },
            { value: 'HMCS', label: '海绵建设情况' },
            { value: '现状控制率', label: '现状控制率' },
            { value: '规划控制率', label: '规划控制率' },
            { value: 'area', label: '面积(公顷)' }
          ]
        }
        if (value.seletctType.label === '工业企业') {
          this.attributeData = [
            { value: 'QYMC', label: '企业名称' },
            { value: 'JDMC', label: '街道' },
            { value: 'SQMC', label: '社区' },
            { value: 'SCJYDZ', label: '地址' },
            { value: 'FDDBR', label: '法人代表' },
            { value: 'LXFS', label: '联系方式' },
            { value: 'QYRS', label: '企业人数' },
            { value: 'QYLXR', label: '行业类别' },
            { value: 'SCYSL', label: '生产用水量' },
            { value: 'PSL', label: '排水量' },
            { value: 'ZYSCGY', label: '主要生产工艺' },
            { value: 'CPZL', label: '产品' },
            { value: 'HPPFWJ', label: '环评' },
            { value: 'EnterEffective', label: '环评有效性' },
            { value: 'PWXKZ', label: '排污许可证' },
            { value: 'FSCLFS', label: '废水处理方式' },
            { value: 'TZWRW', label: '特征污染物' }
          ]
        }
        value.AttributeValue = ''
        value.selectAttribute = ''
        // console.log("seletctType:",value.label);
      },
      handleSelectShow() {
        const _this = this
        _this.isSelect = !_this.isSelect
        _this.isShowDialog = false
        if (this.infoManager) {
          _this.infoManager = !_this.infoManager
        }
      },
      handleSizeChange1(pageSizeValue1) {
        this.pageSizeValue1 = pageSizeValue1
      },
      handleSizeChange2(pageSizeValue2) {
        this.pageSizeValue2 = pageSizeValue2
      },
      handleSizeChange3(pageSizeValue3) {
        this.pageSizeValue3 = pageSizeValue3
      },
      handleSizeChange4(pageSizeValue4) {
        this.pageSizeValue4 = pageSizeValue4
      },
      handleCurrentChangeHandel1(currentPageNum1) {
        this.currentPageNum1 = currentPageNum1
      // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeHandel2(currentPageNum2) {
        this.currentPageNum2 = currentPageNum2
      // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeHandel3(currentPageNum3) {
        this.currentPageNum3 = currentPageNum3
      // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeHandel4(currentPageNum4) {
        this.currentPageNum4 = currentPageNum4
      // console.log(`每页 ${val} 条`);
      },
      /** *********** 切换标签页 **************/
      handleClicktabClick(tab, event) {
        console.log('selectTable === selectLabel', this.selectTable === this.selectLabel)
        this.selectTable = tab.label
        if (this.queryDown === true) {
          this.queryDown = false
        }
        if (this.queryUp === true) {
          this.queryUp = false
        }
      },
      /** **** 属性值查询 *******/
      AttributeValueFunc(queryString, cb) {
        let result = []
        const results = _.filter(this.AttributeValue, item => {
          return item.indexOf(queryString) !== -1
        })
        _.each(results || this.AttributeValue, function(item) {
          if (result.length < 10) {
            result.push({ value: item })
          }
        })
        this.timeout = setTimeout(() => {
          cb(result)
        }, 1000 * Math.random())
      },
      /** **** 反向空间查询 *******/
      spaceRangeAsync(queryString, cb) {
        const self = this
        if (this.spaceRange.substr(this.spaceRange.length - 1, 1) == ';') {
          queryString === ''
        }
        console.log(queryString)
        const results = _.filter(self.rangeData, item => {
          return item.name.indexOf(queryString) !== -1
        })
        let result = []
        _.each(results, function(item) {
          result.push({ value: item.name })
        })
        console.log(results)
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(result)
        }, 1000 * Math.random())
      },
      spaceRangeFilter(queryString) {
        return (queryOptions) => {
          return (queryOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      // 反向查询组件
      querySearchAsync(queryString, cb) {
        const self = this
        if (this.queryStr.substr(this.queryStr.length - 1, 1) == ';') {
          queryString === ''
        }
        const results = queryString ? this.queryOptions.filter(this.createStateFilter(queryString)) : this.queryOptions
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 1000 * Math.random())
      },
      createStateFilter(queryString) {
        return (queryOptions) => {
          return (queryOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },

      // 查询开始
      handleSelect() {
        const self = this
        self.isLoading = true
        self.queryDown = false
        self.queryUp = false
        console.log('isLoading: ', self.isLoading)
        self.selectSubcatchmentData = []
        self.selectOutfalls = []
        self.selectCompanys = []
        const queryArry = self.queryStr.split(';')
        self.selectResult.subcatchments = []
        self.selectResult.conduits = []
        self.selectResult.outfalls = []
        self.selectResult.companies = []
        self.selectResult.junctions = []
        self.selectResult.range = []
        const spaceList = self.spaceRange.split(';')
        let shapesData = _.cloneDeep(self.shapes)
        let range = [] // 当前选中的空间
        _.each(spaceList, item => {
          if (item) {
            range.push(_.filter(self.rangeData, data => { return data.name === item })[0])
          }
        })
        let shapesDatas = []
        _.each(range, data => {
          shapesDatas.length ? shapesDatas = _.concat((_.filter(shapesData, item => {
            return self.isRange(item, data)
          })), shapesDatas) : shapesDatas = _.filter(shapesData, item => {
            return self.isRange(item, data)
          })
        })
        if (shapesDatas.length) {
          shapesData = shapesDatas
        }
        const matchedShapes = _.chain(shapesData).reject(shape => {
          let flag = false
          for (let i = 0; i < queryArry.length; i++) {
            if (self.shapeIdStrMap[shape.id].indexOf(queryArry[i]) < 0) { // 有一个查询条件不符合就过滤掉
              flag = true
              break
            }
          }
          return flag
        }).value()

        //  拿到结果进行处理  用于页面展示  用于 地图绘制
        self.selectResult = {
          subcatchments: _.reject(matchedShapes, function(item) {
            return item.category !== 'SUBCATCHMENTS'
          }),
          conduits: _.reject(matchedShapes, function(item) {
            return item.category !== 'CONDUITS'
          }),
          junctions: _.reject(matchedShapes, function(item) {
            return item.category !== 'JUNCTIONS'
          }),
          outfalls: _.reject(matchedShapes, function(item) {
            return item.category !== 'OUTFALLS'
          }),
          companies: _.reject(matchedShapes, function(item) {
            return item.category !== 'COMPANY'
          }),
          range: _.reject(shapesData, function(item) {
            return item.category !== 'RANGE'
          })
        }

        // 在匹配地块内的公司，也得放到结果selectResult.companies中。 @TODO: 这一部分代码不能删除。应该提前计算完。因为isPointInPolygon速度非常慢。
        // _.each(self.companies, company =>  {
        //   _.each(self.selectResult.subcatchments, subcatchment => {
        //     let overlays = _.map(subcatchment.properties.geometry.coordinates[0], point => {
        //       return new BMap.Point(point[1], point[0])
        //     })
        //     let polygon = new BMap.Polygon(overlays);
        //     let companyCoordinate = company.properties.geometry.coordinates;
        //     let point = new BMap.Point(companyCoordinate[1], companyCoordinate[0]);
        //     if(BMapLib.GeoUtils.isPointInPolygon(point, polygon)){
        //       self.selectResult.companies.push(company)
        //     }
        //   })
        // })
        self.tableDispose(self.selectResult)
        self.isResult = !self.isResult
        self.selectLabel = '模糊查询'
        setTimeout(function() {
          self.$refs.map.showResult(self.selectResult, shapesData)
          self.isLoading = false
          self.tabPaneLabel = true
          self.underPipelineMouth = true // 地块
          self.underSewageWhere = true // 地块
        }, 200)
      }
    }
  }
</script>
<style rel="stylesheet/scss" scoped>

  button, html [type="button"], [type="reset"], [type="submit"] {
    padding: 2px 5px;
  }

  .el-menu-item menu-item {
    background: black;
  }

  #app .nest-menu .el-submenu > .el-submenu__title, #app .el-submenu .el-menu-item {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }

  ul li {
    list-style-type: none;
  }

  * {
    margin: 0px;
    padding: 0px
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .el-table .sort-caret.ascending{
    border-bottom-color: #c0c4cc ;
  }
  .el-table .sort-caret.descending{
    border-top-color: #c0c4cc;
    bottom: 7px;
  }
  .tabPaneLabel {
    background-color: #fff;
    padding-left: 10px;
    /*.el-table th.is-sortable {*/
    /*padding:0 !important;*/
    /*}*/
    /*.el-tabs__header{*/
    /*margin: 0;*/
    /*}*/
  }

  * {
    margin: 0px;
    padding: 0px;
  }

  .submenu-title {
    color: black;
  }

  .el-menu-item-group__title {
    background: rgb(204, 204, 204);
  }

  .menuitem {
    color: black
  }

  .map-context {
    width: 100%;
    height: 100%;
    .map-tab {
      width: 100%;
      height: 100%;
      .isShowDialog{
        position: absolute;
        top: 0;
        left: 700px;
        background-color: #fff;
        width: 400px;
        margin-top: 5px;
        padding:8px;
        max-height:710px;
        overflow: scroll;
        .isShowBianji{
          padding-bottom: 5px;
          .isShowDialogSpan{
            display:inline-block;
            width:160px;
            padding-right:8px;
            text-align: right;
          }
          .el-input{
            width:200px;
            input{
              color:#999
            }
          }
        }
      }
    }
    .left-content {
      position: absolute;
      top: 0px;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
      .map-search {
        width: 100%;
        height: 40px;
        overflow: hidden;
        .map-input {
          width: 75%;
        }
      }
      .menu-box {
        padding-bottom: 20px;
        width: 100%;
        height: 100%;
        overflow: auto;
        color: black;
        .number {
          color: #42b983;
        }
        .display {
          display: inline-block;
          position: relative;
        }
      }
      .fold-button {
        position: absolute;
        top: 40%;
        right: -30px;
        padding: 0px;
        margin: 0px;
        width: 30px;
        height: 100px;
        list-style: none;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        i {
          text-align: center;
          line-height: 100px;
          font-weight: bold;
          color: #666666;
          font-size: 30px;
        }
      }
    }
    .right-box {
      position: absolute;
      top: 60px;
      right: 0px;
      .label {
        position: relative;
        padding: 10px 20px;
        margin-bottom: 20px;
        background: #66b1ff;
        color: white;
        cursor: pointer;
      }
      .context {
        position: absolute;
        left: -500px;
        top: 0px;
        background: red;
        width: 500px;
        background: rgba(255, 255, 255, 0.5);
        color: black;
        .el-collapse-item__header {
          padding: 0px 10px;
          font-size: 20px;
          background: rgba(255, 255, 255, 0.5);
        }
        .el-collapse-item__content {
          padding-bottom: 0px;
        }
        .info-content {
          max-height: 500px;
          overflow: auto;
          padding-bottom: 20px;
          .info-title {
            display: inline-block;
            margin-left: 20px;
          }
          .info-span {
            display: inline-block;
            width: 200px;
            float: right;
            margin-right: 100px;
            text-align: center;
            .info-button {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              border: 0px;
            }
          }
        }
      }
      .selectContext {
        position: absolute;
        /*top: 58px;*/
        top:-60px;
        left: -800px;
        width: 800px;
        max-height: 700px;
        background: rgba(255, 255, 255, 0.5);
        .buttonDouble{
          float: right;
          width:210px;
          button{
            display:inline-block;
            width:100px;
            line-height:34px;
            margin:10px 0px;
          }
        }
        .divSpanButton {
          padding: 3px 7px;
          display: inline-block;
          .el-button{
            padding:8px 10px;
          }
        }
        .buttonList {
          position: absolute;
          left: 370px;
          top: 4px;
          z-index: 1;
          button {
            padding:8px 10px;
          }
        }
        .anshuxing {
          float: left;
          width: 85px;
          text-align: center;
          line-height: 33px;
        }
        /*.result-ul li {*/
          /*float: left;*/
          /*width: 80px;*/
        /*}*/
      }
    }

  }

  .search-button {
    width: 60px;
    line-height: 30px;
  }

  .iconfont {
    margin-right: 10px;
  }

  .menu {
    overflow: auto;
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }

  .open {
    width: 320px;
  }

  .off {
    width: 0px;
  }

  .el-icon-yanjing_yincang {
    cursor: pointer
  }

  .el-icon-yanjing_xianshi {
    cursor: pointer
  }

  .el-menu-item-group__title {
    background: none;
  }

  .logo {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: relative;
    top: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-button + .el-button {
    margin: 0px;
  }
</style>
