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
                    <li style="float: left">
                      <span> 属性 </span>
                      <el-select v-model="value2" @change="demoListDataModelType" clearable placeholder="请选择" style="width: 150px">
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
                      <el-select v-model="value3" @change="demoListDataListDemo" clearable placeholder="请选择" style="width: 200px">
                        <el-option
                          v-for="item in attributeValueData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                  </ul>
                </div>
                <ul style="float:left;background:rgba(0,0,0,.1);width: 20%;">
                  <li style="text-align: center;margin: 10px 0;">
                    <el-button type="primary" @click="handelAddTerm" style="padding:5px 15px !important;"> 增加查询条件</el-button>
                  </li>
                  <li style="text-align: center;margin: 10px 0;">
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
                    v-model="queryStr"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入查询条件,多条件之间用;(分号隔开)"
                    :trigger-on-focus="false">
                  </el-autocomplete>
                  <el-button type="success" @click="handleSelect" style="display:inline-block;width: 100px;line-height: 34px;">查询</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-show="tabPaneLabel" class="tabPaneLabel">
            <el-tabs class="tabPaneSpan">
              <el-tab-pane :label=" '地块（'+showResult.subcatchments.length+'）'" name="0">
                <el-table :data="showResult.subcatchments" style="width: 100%" height="280">
                  <el-table-column fixed width="50" label="序号" align="center" type="index"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="100" :show-overflow-tooltip="true" label="编号" prop="name"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="用地类型" prop="YDLX"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="建设状态" prop="JSZT"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="项目名称" prop="XMMC"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="排入河道" prop="PRHD"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="110" :show-overflow-tooltip="true" label="所属流域" prop="SSLY"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="150" :show-overflow-tooltip="true" label="所属排水分区" prop="SSPSFQ"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="是否为正本清源项目" prop="ZBQY"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="150" :show-overflow-tooltip="true" label="海绵建设情况" prop="HMCS"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="现状控制率" prop="现状控制率"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="规划控制率" prop="规划控制率"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="130" :show-overflow-tooltip="true" label="面积(公顷)" prop="area"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange1"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[3,5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="count">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '企业('+showResult.companies.length+')'" name="1">
                <el-table :data="showResult.companies" style="width: 100%" height="280">
                  <el-table-column fixed width="50" label="序号" align="center" type="index"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="100" :show-overflow-tooltip="true" label="企业名称" prop="QYMC"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="街道" prop="JDMC"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="社区" prop="SQMC"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="地址" prop="SCJYDZ"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="法人代表" prop="FDDBR"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="联系方式" prop="LXFS"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="企业人数" prop="QYRS"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="行业类别" prop="QYLXR"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="生产用水量" prop="SCYSL"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="排水量" prop="PSL"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="主要生产工艺" prop="ZYSCGY"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="产品" prop="CPZL"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="环评" prop="HPPFWJ"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="环评有效性" prop="EnterEffective"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="排污许可证" prop="PWXKZ"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="废水处理方式" prop="FSCLFS"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="170" :show-overflow-tooltip="true" label="特征污染物" prop="TZWRW"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange1"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="0">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '管线('+showResult.conduits.length+')'" name="2">
                <el-table :data="showResult.conduits" style="width: 100%" height="280">
                  <el-table-column fixed type="index" width="50" label="序号" align="center"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管道编号" prop="name"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管道类型" prop="leixing"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="管径" prop="leixing"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange1"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="0">
                </el-pagination>
              </el-tab-pane>
              <el-tab-pane :label=" '排口('+showResult.outfalls.length+')'" name="3">
                <el-table :data="showResult.outfalls" style="width: 100%" height="280">
                  <el-table-column fixed type="index" width="50" label="序号" align="center"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="排口编号" prop="name"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="排口类型" prop="leixing"></el-table-column>
                  <el-table-column align="center" :sortable="true" width="240" :show-overflow-tooltip="true" label="排向" prop="paixiang"></el-table-column>
                </el-table>
                <el-pagination style="text-align:center;"
                               @size-change="handleSizeChange1"
                               @current-change="handleCurrentChangeHandel1"
                               :page-sizes="[5]"
                               :page-size="5"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="0">
                </el-pagination>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div></div>
        </div>
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
  import {
    geojson2cytoscape,
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
    watch: {
      info: function (info) {
        this.infoManager = true;
        this.dataInfo = info;
      }
    },
    components: {
      BaiduMap
    },
    data() {
      return {
        count: 0,
        displayData1: [],
        displayData2: [],
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
        /***********************/
        count1: 0,
        count2: 0,
        count3: 0,
        currentPageNum1: 1,  //默认开始页面
        currentPageNum2: 1,  //默认开始页面
        currentPageNum3: 1,  //默认开始页面
        pageSizeValue1: 3,
        pageSizeValue2: 3,
        pageSizeValue3: 3,
        pageSizeNum: [3, 5, 7],   //每页的数据条数
        currentPage4: 4,
        totalNumber1: 5,
        totalNumber2: 5,
        totalNumber3: 5,
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
          },
        ],
        activeName2: 'first',
        ulList: [0],
        exactQuery: [
          {value: '1', label: ''},
          {value: '2', label: ''},
          {value: '3', label: ''},
          {value: '4', label: ''}
        ],
        value1: '',
        attributeData: [],
        value2: '',
        attributeValueData: [],
        value3: '',
        junctionsLayData: [],    // 交汇点数据
        conduitsLayData: [],     // 管道数据
        companysLayData: [],     // 公司数据
        subLayData: [], // 地块数据
        shapes: [],
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
        selectSubcatchmentData: [],
        selectOutfalls: [],
        selectCompanys: [],
        //end
        subcatchmentData: [],
        conduitsData: [],
        outfallsData: [],
        companysData: [],
        isResult: false,

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
        activeNames: ['1'],
        dataInfo: {},
        //  输入项
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
        },
      }
    },
    computed: {
      info() {
        return this.$store.state.mapData.info;
      },
      resultData() {
        return this.$store.state.mapData.resultData;
      },
      shapeIdStrMap() {
        let self = this
        let ret = {}
        _.each(self.shapes, shape => {
          self.$set(ret, shape.id, JSON.stringify(shape))
        })
        return ret
      },
      shapeIdMap() {
        let self = this
        return _.keyBy(self.shapes, 'id')
      },
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
      },
      showResult() {
        let self = this
        return {
          subcatchments: _.map(self.selectResult.subcatchments, item => item.properties.properties),
          outfalls: _.map(self.selectResult.outfalls, item => item.properties.properties),
          junctions: _.map(self.selectResult.junctions, item => item.properties.properties),
          conduits: _.map(self.selectResult.conduits, item => item.properties.properties),
          companies: _.map(self.selectResult.companies, item => item.properties.properties)
        }
      }
    },
    create() {

    },
    mounted() {
      this.init();
    },
    methods: {
      /**
       * 根据属性值得到查询时的下拉选项
       * */
      getQueryOptions() {
        let self = this;
        _.each(self.shapes, shape => {
          let properties = shape.properties.properties;

          if(!properties) {
            return 0;
          }

          _.each(_.keys(properties), key => {
            if (!key || !properties[key] || ['WP', 'YP', 'center', 'area', 'X_cor', 'Y_cor'].indexOf(key) >= 0) {
              return 0;
            }

            _.each(String(properties[key]).split('、'), option => {
              if (['光明医院', 'GIC4'].indexOf(option) >= 0) {
                return 0;
              }
              self.queryOptions.push({value: option})
            })
          })
        })
        self.queryOptions = _.uniqBy(self.queryOptions, 'value')
      },
      init() {
        const self = this;
        self.shapes = [];
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
          self.shapes = JSON.parse(JSON.stringify(res.data));
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
        let self = this;
        self.selectSubcatchmentData = [];
        self.selectOutfalls = [];
        self.selectCompanys = [];
        self.$refs.map.handleReset();
      },
      /**
       * 反向查询
       * */
      //精确查询  ---  增加查询条件
      handelAddTerm() {
        const _this = this;
        _this.value1 = '';
        _this.value2 = '';
        _this.value3 = '';
        let lengthId = _this.ulList.length;
        let id = 1;
        let deId = id++
        if (lengthId < 3) {
          this.ulList.push(deId);
        }
      },
      /************* 清空查询 ***************/
      handelDeleteTerm() {
        let index = this.ulList.length - 1;
        this.ulList.splice(1, index);
        // console.log(this.ulList);
      },
      /************* 查询按钮 ***************/
      handelQueryTerm() {
        const _this = this;
        if (_this.value1 !== '' && _this.value2 !== '') {
          _this.tabPaneLabel = true
        }
        let desData = _this.shapes
        _.each(desData, function (vb, index) {
          let ns = vb.properties;
          if (vb.businessType === 'CONDUITS') {
            _this.tableDataList[2].fromData.push({
              RowMouthNum: ns.fromnode,
              RowMouthType: ns.leixing,
              RowMouthDirection: ns.guanjing
            })
          }
          if (vb.businessType === 'SUBCATCHMENTS') {
            _this.tableDataList[0].fromData.push({
              massifNumber: ns.name,
              massifArea: (ns.area).toFixed(2),
              massifType: ns.YDLX,
              massifState: ns.JSZT,
              massifRowNamer: ns.XMMC,
              massifRowRiver: ns.PRHD,
              massifRowBasin: ns.SSLY,
              massifPartition: ns.SSPSFQ,
              massifNum: ns.ZBQY,
              massifReform: ns.HMCS,
              spongeType: ns.HMLX,
              massifPresent: ns.现状控制率,
              massifPlan: ns.规划控制率
            })
          }
          if (vb.businessType === 'COMPANY') {
            _this.tableDataList[1].fromData.push({
              EnterName: ns.name,
              EnterStreet: ns.JDMC,
              EnterCommunity: ns.SQMC,
              EnterAddress: ns.SCJYDZ,
              EnterPerson: ns.FDDBR,
              EnterPhone: ns.LXFS,
              EnterNum: ns.QYRS,
              EnterCategory: ns.HYLB,
              EnterWater: ns.SCYSL,
              EnterDrainage: ns.PSL,
              EnterTechnology: ns.ZYSCGY,
              EnterProduct: ns.CPZL,
              EnterEvaluate: ns.OBJECTID,
              EnterEffective: ns.HPPFWJYXX,
              EnterPermit: ns.HPPFWJ,
              EnterHandle: ns.FSCLFS,
              EnterFilth: ns.TZWRW
            })
          }
          // if( vb.businessType === 'JUNCTIONS' ){
          //   _this.tableDataList[2].fromData.push({
          //     RowMouthNum: ns.name,
          //     RowMouthType: ns.leixing,
          //     RowMouthDirection: ''
          //   })
          // }
        })
        _this.totalNumber1 = _this.tableDataList[0].fromData.length;
        _this.totalNumber2 = _this.tableDataList[1].fromData.length;
        _this.totalNumber3 = _this.tableDataList[2].fromData.length;
        console.log("数据", _this.tableDataList[1])
      },
      /************* 选择框 ***************/
      demoListDataListDemo(value) {
        console.log("??????????", value);

        if (value == '1') {
          this.displayData = this.listDemoData;
          this.count = this.displayData.length
        }
        if (value == '2') {
          this.displayData = [];
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
            },
          ]
          this.count = this.displayData.length
        }
        if (value === '3') {
          this.displayData = [];
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
            },
          ]
          this.count = this.displayData.length
        }
      },
      demoListDataModelType(value) {
        if (value === '3') {
          this.attributeValueData = [
            {value: '1', label: 'G1'},
            {value: '2', label: 'M1'},
            {value: '3', label: '道路'},
          ]
        }
      },
      demoListDataModel(value) {
        this.attributeData = [];
        if (value.label === '工业企业') {
          this.attributeData = [
            {value: '1', label: '企业信息'},
            {value: '2', label: '街道'},
            {value: '3', label: '社区'},
            {value: '4', label: '地址'},
            {value: '5', label: '法人代表'},
            {value: '6', label: '联系方式'},
            {value: '7', label: '企业人数'},
            {value: '8', label: '行业类别'},
            {value: '9', label: '生产用水量'},
            {value: '10', label: '排水量'},
            {value: '11', label: '主要生产工艺'},
            {value: '12', label: '产品'},
            {value: '13', label: '环评'},
            {value: '14', label: '环评有效性'},
            {value: '15', label: '排污许可证'},
            {value: '16', label: '废水处理方式'},
            {value: '17', label: '特征污染物'},
          ]
        }
        if (value.label === '地块') {
          this.attributeData = [
            {value: '1', label: '编号'},
            {value: '2', label: '面积'},
            {value: '3', label: '用地类型'},
            {value: '4', label: '建设状态'},
            {value: '5', label: '项目名称'},
            {value: '6', label: '排入河道'},
            {value: '7', label: '所属流域'},
            {value: '8', label: '所属排水分区'},
            {value: '9', label: '是否为正本清源项目'},
            {value: '10', label: '是否为海绵项目'},
            {value: '11', label: '海绵类型'},
            {value: '12', label: '现状控制率'},
            {value: '13', label: '规划控制率'}
          ]
        }
        if (value.label === '管线') {
          this.attributeData = [
            {value: '1', label: '管道编号'},
            {value: '2', label: '管道类型'},
            {value: '3', label: '管径'},
          ]
        }
        if (value.label === '排口') {
          this.attributeData = [
            {value: '1', label: '编号'},
            {value: '2', label: '面积'},
            {value: '3', label: '用地类型'},
            {value: '4', label: '建设状态'},
            {value: '5', label: '项目名称'},
            {value: '6', label: '排入河道'},
            {value: '7', label: '所属流域'},
            {value: '8', label: '所属排水分区'},
            {value: '9', label: '是否为正本清源项目'},
            {value: '10', label: '是否为海绵项目'},
            {value: '11', label: '海绵类型'},
            {value: '12', label: '现状控制率'},
            {value: '13', label: '规划控制率'}
          ]
        }
        // console.log("value1:",value.label);
      },
      handleSelectShow() {
        this.isSelect = !this.isSelect;
        if (this.infoManager) {
          this.infoManager = !this.infoManager;
        }
        if (this.tabPaneLabel === true) {
          this.tabPaneLabel = false
        }
        let labelData = this.shapes;
        let typeName1 = '';  // 工业企业
        let typeName2 = '';  // 地块
        let typeName3 = '';  // 管线
        let typeName4 = '';  // 排口
        let COMtypeData = [];  // 公司数据
        let SUBtypeData = [];  // 地块数据
        let CONtypeData = [];  // 管道数据
        let JUNtypeData = [];  // 交汇点数据
        _.each(labelData, function (vn) {
          if (vn.businessType === 'COMPANY') {
            typeName1 = '工业企业'
          }
          if (vn.businessType === 'SUBCATCHMENTS') {
            typeName2 = '地块'
          }
          if (vn.businessType === 'CONDUITS') {
            typeName3 = '管线'
          }
          if (vn.businessType === 'JUNCTIONS') {
            typeName4 = '排口'
          }
        })

        this.exactQuery[0].label = typeName2; // 地块
        this.exactQuery[1].label = typeName1; // 工业企业
        this.exactQuery[2].label = typeName4; // 排口
        this.exactQuery[3].label = typeName3; // 管线
        this.junctionsLayData = JUNtypeData;  // 交汇点数据
        this.conduitsLayData = CONtypeData;  // 管道数据
        this.companysLayData = COMtypeData;  // 公司数据
        this.subLayData = SUBtypeData;        // 地块数据
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
      handleCurrentChangeHandel1(currentPageNum1) {
        this.currentPageNum1 = currentPageNum1;
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeHandel2(currentPageNum2) {
        this.currentPageNum2 = currentPageNum2;
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChangeHandel3(currentPageNum3) {
        this.currentPageNum3 = currentPageNum3;
        // console.log(`每页 ${val} 条`);
      },
      /************* 切换标签页 **************/
      handleClicktabClick(tab, event) {
        if (this.tabPaneLabel === true) {
          this.tabPaneLabel = false
        }
      },
      //反向查询组件
      querySearchAsync(queryString, cb) {
        let self = this;
        if (this.queryStr.substr(this.queryStr.length - 1, 1) == ';') {
          queryString == ''
        }
        let results = queryString ? this.queryOptions.filter(this.createStateFilter(queryString)) : this.queryOptions;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createStateFilter(queryString) {
        return (queryOptions) => {
          return (queryOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },

      //查询开始
      handleSelect() {
        let self = this;
        self.isLoading = true;
        console.log('isLoading: ', self.isLoading)
        self.selectSubcatchmentData = [];
        self.selectOutfalls = [];
        self.selectCompanys = [];
        let queryArry = self.queryStr.split(';');
        self.selectResult.subcatchments = [];
        self.selectResult.conduits = [];
        self.selectResult.outfalls = [];
        self.selectResult.companies = [];
        self.selectResult.junctions = [];

        let matchedShapes = _.chain(self.shapes).reject(shape => {
          let flag = false
          for (let i = 0; i < queryArry.length; i++) {
            if (self.shapeIdStrMap[shape.id].indexOf(queryArry[i]) < 0) { // 有一个查询条件不符合就过滤掉
              flag = true;
              break;
            }
          }
          return flag
        }).value()

        //  拿到结果进行处理  用于页面展示  用于 地图绘制
        self.selectResult = {
          subcatchments: _.reject(matchedShapes, function(item) {
            return item.category !== 'SUBCATCHMENTS';
          }),
          conduits: _.reject(matchedShapes, function(item) {
            return item.category !== 'CONDUITS';
          }),
          junctions: _.reject(matchedShapes, function(item) {
            return item.category !== 'JUNCTIONS';
          }),
          outfalls: _.reject(matchedShapes, function(item) {
            return item.category !== 'OUTFALLS';
          }),
          companies: _.reject(matchedShapes, function(item) {
            return item.category !== 'COMPANY';
          }),
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

        self.isResult = !self.isResult
        setTimeout(function() {
          self.$refs.map.showResult(self.selectResult, self.shapes);
          self.isLoading = false;
          self.tabPaneLabel = true
        }, 50)
      },
    }
  }
</script>
<style rel="stylesheet/scss" scoped>
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
        top: 58px;
        left: -800px;
        width: 800px;
        max-height: 700px;
        background: rgba(255, 255, 255, 0.5);
        .result-ul li {
          float: left;
          width: 80px;
        }
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
