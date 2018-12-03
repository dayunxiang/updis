<template>
  <div style="padding:20px 0px 0px 20px;">
    <!--标签页-->
    <div class="label">
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               @tab-click="handleClick">
        <!--表格-->
        <el-tab-pane label="建筑小区" name="0" algin="center">
          <!--:default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change1'-->
          <el-table :data="plotData1.slice(( currentPageNum1 - 1 ) * pageSizeNum1 , currentPageNum1 * pageSizeNum1)"
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum1 * ( currentPageNum1 - 1 ) }}
              </template>
            </el-table-column>
            <el-table-column v-for="item in tableHeaderData" :key="item.index" :label="item.name" :prop="item.great" align="center" width="130" :sortable="true" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" >查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" >编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div style="width:100%; text-align: center; margin:10px 0px;">
            <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="pageSizeData"
              :total="totalNumber1">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公园绿地" name="1" algin="center">
          <el-table :data="plotData2.slice(( currentPageNum2 - 1 ) * pageSizeNum2 , currentPageNum2 * pageSizeNum2)"
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum2 * ( currentPageNum2 - 1 ) }}
              </template>
            </el-table-column>
            <el-table-column v-for="item in tableHeaderData" :key="item.index" :label="item.name" :prop="item.great" align="center" width="130" :sortable="true" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" >查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" >编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div style="width:100%; text-align: center; margin:10px 0px;">
            <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="pageSizeData"
              :total="totalNumber2">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="道路广场" name="2" algin="center">
          <el-table :data="plotData3.slice(( currentPageNum3 - 1 ) * pageSizeNum3 , currentPageNum3 * pageSizeNum3)"
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum3 * ( currentPageNum3 - 1 ) }}
              </template>
            </el-table-column>
            <el-table-column v-for="item in tableHeaderData" :key="item.index" :label="item.name" :prop="item.great" align="center" width="130" :sortable="true" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" >查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" >编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div style="width:100%; text-align: center; margin:10px 0px;">
            <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="pageSizeData"
              :total="totalNumber3">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--获取信息-->
      <el-dialog :title="this.hodelView === ''?'查看信息':'编辑信息'" :visible.sync="dialogVisible" data="optionData" @click="dialogVisible = false">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="optionData"
          ref="optionData">
          <!--<h2 style="padding:0px 0px 10px 35px;"><span>类型名称：</span>  123</h2>-->
          <el-form-item label="地块编号" prop="name">
            <el-input v-model="optionData.name" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="用地类型" prop="YDLX">
            <el-input v-model="optionData.YDLX" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="建设状态" prop="JSZT">
            <el-input v-model="optionData.JSZT" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="XMMC">
            <el-input v-model="optionData.XMMC" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="排入河道" prop="PRHD">
            <el-input v-model="optionData.PRHD" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="所属流域" prop="SSLY">
            <el-input v-model="optionData.SSLY" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="所属排水分区" prop="SSPSFQ">
            <el-input v-model="optionData.SSPSFQ" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="是否为正本清源项目" prop="ZBQY">
            <el-input v-model="optionData.ZBQY" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="海绵建设情况" prop="HMJSQK">
            <el-input v-model="optionData.HMJSQK" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="现状年径流总量控制率" prop="XZKZL">
            <el-input v-model="optionData.XZKZL" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="规划年径流总量控制率" prop="GHKZL">
            <el-input v-model="optionData.GHKZL" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
          <el-form-item label="面积(平方米)" prop="area">
            <el-input v-model="optionData.area" :disabled="hodelView == 'view' ? false : true" style="width:300px;" class="elementMadel"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel('optionData')">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? false : true" @click="dialogVisible = false" type="primary" >确 定</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" @click="dialogVisible = true" type="primary" >确 定</el-button>
        </span>
      </el-dialog>
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
        /**  表格的表头数据  **/
        tableHeaderData: [
          { index: 1, name: '地块编号', great: 'name'},
          { index: 2, name: '用地类型', great: 'YDLX'},
          { index: 3, name: '建设状态', great: 'JSZT'},
          { index: 4, name: '项目名称', great: 'XMMC'},
          { index: 5, name: '排入河道', great: 'PRHD'},
          { index: 6, name: '所属流域', great: 'SSLY'},
          { index: 7, name: '所属排水分区', great: 'SSPSFQ'},
          { index: 8, name: '是否为正本清源项目', great: 'ZBQY'},
          { index: 9, name: '海绵建设情况', great: 'HMJSQK'},
          { index: 10, name: '现状年径流总量控制率', great: 'XZKZL'},
          { index: 11, name: '规划年径流总量控制率', great: 'GHKZL'},
          { index: 12, name: '面积(平方米)', great: 'area'}
        ],
        createBeforeData: [],    // 创建前加载的数据
        activeNameTest: '0',     // 表格标签页
        plotData1:[],       // 建筑小区
        plotData2:[],       // 公园绿地
        plotData3:[],       // 道路广场
        pageSizeNum1: 10,   // 每页显示的条数
        pageSizeNum2: 10,   // 每页显示的条数
        pageSizeNum3: 10,   // 每页显示的条数
        currentPageNum1: 1, // 默认显示第几页
        currentPageNum2: 1, // 默认显示第几页
        currentPageNum3: 1, // 默认显示第几页
        pageSizeData: [10,20,50],  // 选定显示的条数
        totalNumber1: 0,  // 总条目数
        totalNumber2: 0,  // 总条目数
        totalNumber3: 0,  // 总条目数
        /**  操作部分  **/
        optionData: {},           // 查看编辑获取表格中的数据
        hodelView: '',            // 查看input禁用编辑input显示
        dialogVisible: false,     // 查看获取的用户的信息
        labelPosition: 'right',   // label文字向右对齐
        newTabName: '',

        demoList: [],
      }
    },
    created() {
    },
    mounted() {
      this.init();
      this.list();
    },
    methods: {
      init(){
        const _this = this;
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 100000,
            filters: {
              'shape': {
                'category': {
                  equalTo: "SUBCATCHMENTS"
                },
                'projectId': {
                  equalTo: '3'
                }
              }
            }
          }
        }).then(res => {
          _.each(res.data, function (ls) {
            var TestData = JSON.parse(ls.properties);  // 将字符串解析为对象
            _this.createBeforeData.push(TestData);     // 保存初始数据
          })
          _this.ProductInit();
        })
      },
      ProductInit (){
        const _this = this;
        var data = _this.createBeforeData;
        _.each(data, function (ls) {
          var na = ls.properties;
          var letter = na.YDLX.substr(0, 1);     // 截取字符
          var threeTest = na.YDLX.substr(0, 3);  // 截取字符
          /** 建筑小区  **/
          if( letter === "R" || letter === "M" || letter === "C" || threeTest === "GIC" ) {
            var build = {};
            build.name = na.name;
            build.YDLX = na.YDLX;
            build.JSZT = na.JSZT;
            build.XMMC = na.XMMC;
            build.PRHD = na.PRHD;
            build.SSLY = na.SSLY;
            build.SSPSFQ = na.SSPSFQ;
            build.ZBQY = na.ZBQY;
            build.XZKZL = na.现状控制率;
            build.GHKZL = na.规划控制率;
            build.area = Math.abs(na.area).toFixed(2);
            if( na.JSZT === "现状" && na.HMCS === "已落实海绵" ) {
              build.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "现状" && na.HMCS === "未落实海绵" ) {
              build.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "现状" && na.HMCS === null ) {
              build.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "已落实海绵" ) {
              build.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "未落实海绵" ) {
              build.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "在建" && na.HMCS === null ) {
              build.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "规划" && na.HMCS === null ) {
              build.HMJSQK = '规划管控';
            }
            _this.plotData1.push(build);
          } else
          /** 公园绿地  **/
          if( letter === "G" ) {
            var park = {};
            park.name = na.name;
            park.YDLX = na.YDLX;
            park.JSZT = na.JSZT;
            park.XMMC = na.XMMC;
            park.PRHD = na.PRHD;
            park.SSLY = na.SSLY;
            park.SSPSFQ = na.SSPSFQ;
            park.ZBQY = na.ZBQY;
            park.XZKZL = na.现状控制率;
            park.GHKZL = na.规划控制率;
            park.area = Math.abs(na.area).toFixed(2);
            if( na.JSZT === "现状" && na.HMCS === "已落实海绵" ) {
              park.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "现状" && na.HMCS === "未落实海绵" ) {
              park.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "现状" && na.HMCS === null ) {
              park.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "已落实海绵" ) {
              park.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "未落实海绵" ) {
              park.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "在建" && na.HMCS === null ) {
              park.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "规划" && na.HMCS === null ) {
              park.HMJSQK = '规划管控';
            }
            _this.plotData2.push(park)
          } else
          /** 道路广场  **/
          if( na.YDLX === "道路" || letter === "S" ) {
            var road = {};
            road.name = na.name;
            road.YDLX = na.YDLX;
            road.JSZT = na.JSZT;
            road.XMMC = na.XMMC;
            road.PRHD = na.PRHD;
            road.SSLY = na.SSLY;
            road.SSPSFQ = na.SSPSFQ;
            road.ZBQY = na.ZBQY;
            road.XZKZL = na.现状控制率;
            road.GHKZL = na.规划控制率;
            road.area = Math.abs(na.area).toFixed(2);
            if( na.JSZT === "现状" && na.HMCS === "已落实海绵" ) {
              road.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "现状" && na.HMCS === "未落实海绵" ) {
              road.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "现状" && na.HMCS === null ) {
              road.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "已落实海绵" ) {
              road.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "在建" && na.HMCS === "未落实海绵" ) {
              road.HMJSQK = na.JSZT + '无海绵';
            }
            if( na.JSZT === "在建" && na.HMCS === null ) {
              road.HMJSQK = na.JSZT + na.HMCS;
            }
            if( na.JSZT === "规划" && na.HMCS === null ) {
              road.HMJSQK = '规划管控';
            }
            _this.plotData3.push(road)
          }
        })
        this.totalNumber1 = _this.plotData1.length;
        this.totalNumber2 = _this.plotData2.length;
        this.totalNumber3 = _this.plotData3.length;
      },
      /**
       * 标签页
       */
      handleClick(tab, event) {
        console.log(tab.index)
      },
      sizeChange(pageSizeNum1){
        this.pageSizeNum1 = pageSizeNum1;
      },
      sizeChange(pageSizeNum2){
        this.pageSizeNum2 = pageSizeNum2;
      },
      sizeChange(pageSizeNum3){
        this.pageSizeNum3 = pageSizeNum3;
      },
      currentChange(currentPageNum1){
        this.currentPageNum1 = currentPageNum1;
      },
      currentChange(currentPageNum2){
        this.currentPageNum2 = currentPageNum2;
      },
      currentChange(currentPageNum3){
        this.currentPageNum3 = currentPageNum3;
      },
      /**  查看/编辑:信息  **/
      handleCheck (row, formRule) {
        const _this = this;
        _this.hodelView = "";
        _this.dialogVisible = true;
        _this.optionData = row;
        console.log("获取一行: ", _this.$refs)
      },
      handleEditor(row, formRule) {
        const _this = this;
        _this.hodelView = "view";
        _this.dialogVisible = true;
        _this.optionData = row;
        _this.$refs[formRule].resetFields();
      },
      handleCancel(formRule){
        const _this = this;
        _this.dialogVisible = false;
        _this.$refs[formRule].resetFields();
      },
      list(){
        const _this = this;
        var arr = _this.demoList;
        console.log(this.binaryInsertionSort(arr));//[2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50];
      },
      binaryInsertionSort(array) {
        console.time('二分插入排序耗时：');
        for (var i = 1; i < array.length; i++) {
          var key = array[i], left = 0, right = i - 1;
          while (left <= right) {
            var middle = parseInt((left + right) / 2);
            if (key < array[middle]) {
              right = middle - 1;
            } else {
              left = middle + 1;
            }
          }
          for (var j = i - 1; j >= left; j--) {
            array[j + 1] = array[j];
          }
          array[left] = key;
        }
        console.timeEnd('二分插入排序耗时：');
        return array;
      },
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
