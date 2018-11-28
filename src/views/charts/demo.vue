<template>
  <div style="padding:20px 0px 0px 20px;">
    <!--标签页-->
    <div class="label">
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               @tab-click="handleClick">
        <el-tab-pane v-for="lay in labelPageData" :key="index" :label="lay.name" :name="lay.index" algin="center">
          <!--表格-->
          <!--:data="buildSquare.slice(( currentPageNum1 - 1 ) * pageSizeNum1 , currentPageNum1 * pageSizeNum1)"-->
          <el-table :default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change1'
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum1 * ( currentPageNum1 - 1 ) }}
              </template>
            </el-table-column>

            <el-table-column align="center" width="130" :sortable="true" :show-overflow-tooltip="true"
                             v-for="item in tableHeaderData" :key="item.index" :label="item.name"
                             prop="name" >
            </el-table-column>

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
        labelPageData:[
          { index: 0, name: '建筑小区' },
          { index: 1, name: '公园绿地' },
          { index: 2, name: '道路广场' },
          { index: 3, name: '河道治理' },
          { index: 4, name: '涉水基础设施' },
          { index: 5, name: 'PPP项目' }
        ],
        /**
         * 表格的表头数据
         */
        tableHeaderData: [
          { index: 1, name: '用地类型'},
          { index: 2, name: '地块编号'},
          { index: 3, name: '建设状态'},
          { index: 4, name: '项目名称'},
          { index: 5, name: '排入河道'},
          { index: 6, name: '所属流域'},
          { index: 7, name: '所属排水分区'},
          { index: 8, name: '是否为正本清源项目'},
          { index: 9, name: '海绵建设情况'},
          { index: 10, name: '现状年径流总量控制率'},
          { index: 11, name: '规划年径流总量控制率'},
          { index: 12, name: '面积(公顷)'}
        ],
        createBeforeData: [],    // 创建前加载的数据
      }
    },
    created() {
    },
    mounted() {
      this.init();
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
          
        })
        debugger
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
