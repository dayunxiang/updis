<template>
  <div style="padding:20px 0px 0px 20px;">
    <!--表头部分-->
    <el-form :inline="true" class="demo-form-inline" style="padding-left:10px;">
      <el-form-item label="项目名称" prop="creatorId">
        <el-select v-model="project.creatorId" placeholder="请选择" style="padding-left:10px;">
          <el-option v-for="project in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="点类型" prop="type">
        <el-select v-model="project.geometry_type"  placeholder="请选择点类型" style="padding-left:10px;">
          <el-option label="排口" value="Point1"></el-option>
          <el-option label="工业企业" value="Point2" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编号">
        <el-input v-model="formInline.user" placeholder="请输入要查询的编号" style="padding-left:10px;"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="handleSelect">查询</el-button>
      </el-form-item>
      <!--<el-form-item>
        <el-button type="primary" >添加</el-button>
      </el-form-item>-->
      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>
    <!--标签页-->
    <div class="label">
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               @tab-click="handleClick">
        <el-tab-pane v-for="(itemLabel, index) in labelPageData" :key="index" :label="itemLabel" :name="index" algin="center">
          <!--表格-->
          <el-table :data="buildSquare.slice(( currentPageNum1 - 1 ) * pageSizeNum1 , currentPageNum1 * pageSizeNum1)"
                    :default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change1'
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum1 * ( currentPageNum1 - 1 ) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ"  align="center" width="130" :sortable="true" :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"    align="center" width="175" :sortable="true" :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"    align="center" width="130" :sortable="true" :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="XZKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>
            <el-table-column prop="area"    align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div style="width:100%;text-align: center; margin:10px 0px;">
            <el-pagination
              background
              @current-change="currentChange1"
              @size-change="sizeChange1"
              :page-sizes="pageSizeData"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalFrist">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--获取信息-->
      <el-dialog :title="this.hodelView === ''?'查看信息':'编辑信息'" :visible.sync="dialogVisible" data="optionData"
                 @click="dialogVisible = false">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="optionData"
          :rules="rulersTest"
          ref="optionData">
          <!--<h2 style="padding:0px 0px 10px 35px;"><span>类型名称：</span>  123</h2>-->
          <el-form-item label="地块编号：" prop="name">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px;" v-model="optionData.name"></el-input>
          </el-form-item>
          <el-form-item label="用地类型：" prop="YDLX">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.YDLX"></el-input>
          </el-form-item>
          <el-form-item label="建设状态：" prop="JSZT">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.JSZT"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" prop="XMMC">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.XMMC"></el-input>
          </el-form-item>
          <el-form-item label="排入河道：" prop="PRHD">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.PRHD"></el-input>
          </el-form-item>
          <el-form-item label="所属流域：" prop="SSLY">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.SSLY"></el-input>
          </el-form-item>
          <el-form-item label="所属排水分区：" prop="SSPSFQ">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.SSPSFQ"></el-input>
          </el-form-item>
          <el-form-item label="是否为正本清源项目：" prop="ZBQY">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.ZBQY"></el-input>
          </el-form-item>
          <el-form-item label="海绵建设情况：" prop="JSQK">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.JSQK"></el-input>
          </el-form-item>

          <el-form-item label="年径流总量控制率：" prop="XZKZL">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.XZKZL"></el-input>
          </el-form-item>
          <el-form-item label="年径流总量控制率：" prop="GHKZL">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.GHKZL"></el-input>
          </el-form-item>

          <el-form-item label="面积：" prop="area">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      v-model="optionData.area"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="quxiao('optionData')">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? false : true" type="primary"
                     @click="dialogVisible = false">确 定</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary"
                     @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加信息-->
      <!--<el-dialog title="添加信息" :visible.sync="dialogAdd" data="option4" @click="dialogAdd = false">
        <el-form :model="option4" :rules="rules" ref="option4" :label-position="labelPosition" label-width="200px">
          <el-form-item label="类型名称：" prop="name" class="fontSize">
            <el-input class="elementMadel" v-model="option4.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary"
                     @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>-->
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import request from '@/utils/request'
  import commonApi from '@/api/commonApi'
  import _ from 'lodash'

  export default {
    name: 'keyboard',
    data(){
      return {
        /**
         * 标签页数据
         */
        labelPageData:['建筑小区','公园绿地','道路广场','河道治理','涉水基础设施','PPP项目'],
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
  }
</script>


<style lang="scss">
  div.tongName {
    padding: 0px 12px 0px 12px;
  }

  div.label {
    position: relative;
  }

  div.label > button.el-button {
    position: absolute;
    top: 8px;
    right: 40px;
    z-index: 1;
  }

  .el-table__expand-column .cell {
    display: none;
  }

  div.elementMadel > input {
    color: #666 !important;
    width: 300px !important;
  }
  div.elementMadel {
    width:300px
  }
  .app-main {
    overflow: auto !important;
    padding-bottom: 10% !important;
  }

  div.l-form-item > label.el-form-item__label {
    width: 200px;
  }

  div.fontSize > label {
    font-size: 19px;
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: #999999;
    top: 5px;
  }
  .el-table .sort-caret.descending {
    border-top-color: #999999;
    bottom: 7px;
  }

  /*tr.el-table__row > td.is-center >  div.cell{*/
  /*overflow: hidden;*/
  /*white-space:nowrap;*/
  /*text-overflow:ellipsis;*/
  /*}*/
  /*tr.el-table__row > td.is-center{*/
  /*height:53px;*/
  /*line-height:53px;*/
  /*}*/
</style>
