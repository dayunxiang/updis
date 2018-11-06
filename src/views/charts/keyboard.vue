<template>
  <div style="padding-top:20px;">
    <!--表头部分-->
    <el-form :inline="true"  class="demo-form-inline" style="padding-left:10px;">
      <el-form-item label="项目名称" >
        <el-input placeholder="请输入要查询的编号"></el-input>
        <!--<el-select  placeholder="请选择">-->
          <!--<el-option label="name"></el-option>-->
        <!--</el-select>-->
      </el-form-item>
      <el-form-item label="编号">
        <el-input placeholder="请输入要查询的编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>
    <!--标签页-->
    <div class="label">
      <el-button class="AddButton" type="primary" icon="el-icon-plus" circle @click="handleAddTab(activeNameTest)"></el-button>
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               type="card"
               @tab-click="handleClick">
        <el-tab-pane label="建筑和小区" name="0" algin="center">
          <!--表格-->
          <el-table :data="buildSquare" style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX"   label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"   label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC"   label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"   label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ" label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"   label="是否为正本清源项目"></el-table-column>
            <el-table-column align="center" prop="HMCS"   label="是否为海绵城市项目"></el-table-column>
            <el-table-column align="center" prop="HMLX"   label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div style="width:100%;text-align: center; margin:10px 0px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100">
            </el-pagination>
          </div>

        </el-tab-pane>

        <el-tab-pane label="公园绿地" name="1" algin="center">
          <!--表格-->
          <el-table :data="parkSquare" style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="道路广场" name="2" algin="center">
          <!--表格-->
          <el-table :data="roadSquare" style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="规划管控" name="3" algin="center">
          <!--表格-->
          <el-table :data="plannSquare" style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="河道治理" name="4" algin="center">
          <!--表格-->
          <el-table  style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="涉水基础设施" name="5" algin="center">
          <!--表格-->
          <el-table  style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="PPP项目" name="6" algin="center">
          <!--表格-->
          <el-table  style="width: 100%" border>
            <el-table-column align="center" prop="name"   label="编号" width="75"></el-table-column>
            <el-table-column align="center" prop="YDLX" label="用地类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="JSZT"  label="建设状态" width="90"></el-table-column>
            <el-table-column align="center" prop="XMMC" label="项目名称" width="100"></el-table-column>
            <el-table-column align="center" prop="PRHD"  label="排入河道" width="100"></el-table-column>
            <el-table-column align="center" prop="SSLY"   label="所属流域" width="100"></el-table-column>
            <el-table-column align="center" prop="SSPSFQ"  label="所属排水分区" width="110"></el-table-column>
            <el-table-column align="center" prop="ZBQY"  label="是否为正本清源项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMCS"  label="是否为海绵城市项目" width=""></el-table-column>
            <el-table-column align="center" prop="HMLX"  label="海绵类型" width="100"></el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>


      <!--获取信息-->
      <el-dialog :title="this.hodelView === ''?'查看信息':'编辑信息'" :visible.sync="dialogVisible" data="buildSquare" @click="dialogVisible = false">
        <el-form :label-position="labelPosition" label-width="200px" :model="buildSquare">
          <h2 style="padding:0px 0px 10px 35px;"><span>类型名称：</span>  123  </h2>
          <el-form-item label="编号：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px;" v-model="buildSquare.name"></el-input>
          </el-form-item>
          <el-form-item label="用地类型：" >
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="buildSquare.percentage"></el-input>
          </el-form-item>
          <el-form-item label="建设状态：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.state"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：" >
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.target"></el-input>
          </el-form-item>
          <el-form-item label="排入河道：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.shape"></el-input>
          </el-form-item>
          <el-form-item label="所属流域：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.area"></el-input>
          </el-form-item>
          <el-form-item label="所属排水分区：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.area"></el-input>
          </el-form-item>
          <el-form-item label="是否为正本清源项目：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.area"></el-input>
          </el-form-item>
          <el-form-item label="是否为海绵城市项目：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.area"></el-input>
          </el-form-item>
          <el-form-item label="海绵类型：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="listData.area"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? false : true" type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加信息-->
      <el-dialog title="添加信息" :visible.sync="dialogAdd" data="option4"  @click="dialogAdd = false">
        <el-form :model="option4" :rules="rules" ref="option4" :label-position="labelPosition" label-width="200px" >
          <el-form-item label="类型名称：" prop="name" class="fontSize">
            <el-input class="elementMadel" v-model="option4.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary" @click="handleSubmit">确 定</el-button>
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
  import TestData from '@/assets/json/ceshi.json'

  export default {
    name: 'keyboard',
    data(){
      return {
        projectId: '',
        roadSquare: [],             // 形状分类
        parkSquare: [],             // 形状分类
        buildSquare: [],             // 形状分类
        plannSquare: [],
        ListTest: [],
        dialogVisible: false,     // 查看获取的用户的信息
        dialogAdd: false,         // 添加
        labelPosition: 'right',   // label文字向右对齐
        activeNameTest: '0',      // 表格标签页
        hodelView: '',            // 查看input禁用编辑input显示
        listTitle: '',            // 类型名称
        listData: '',             // 查看编辑获取表格中的数据
        tongName: [],             // 表格中的全部数据
        option4: {                // 添加类型中的表数据
          name: "",
          mingcheng: []
        },
        rules: {                  // 表单验证
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
        },
        targetName: ''
      }
    },
    created() {
      /*this.Test();
      this.init();*/
    },
    mounted() {
      this.ProductInit();
      this.Test();
    },
    methods: {
      /**
       * 加载项目数据
       */
      init() {
        const self = this;
        self.tongName = TestData.tongName;
      },
      Test() {
        this.projectId = this.$route.query.projectId;
      },
      ProductInit (){
        const self = this;
        request ('shapes' , {
          params: {
            pageNo: 1,
            pageSize: 50,
            filters: {
              'shape': {
                'category': {
                  equalTo: "SUBCATCHMENTS"
                },
                'projectId': {
                  equalTo: '4'
                }
              }
            }
          }
        }).then(resp => {
            this.roadData(resp);
        })
      },
      roadData(res){
        const self = this;
        var data = res.data;
        var demo = [];
        _.each(data, function (L) {
          var TestData = JSON.parse(L.properties);
          if( TestData.properties.HMLX === "已建海绵道路" ) {
            self.roadSquare.push(TestData.properties);
          }
          if( TestData.properties.HMLX === "海绵型建筑小区" ) {
            self.parkSquare.push(TestData.properties);
          }
          if( TestData.properties.HMLX === "规划管控" ) {
            self.plannSquare.push(TestData.properties);
          }
          if( TestData.properties.HMLX === "已建绿色建筑" ) {
            self.buildSquare.push(TestData.properties);
          }
//          self.buildSquare.push(TestData.properties);
          var mm = JSON.parse(L.properties);
          demo.push(mm)
        });
        console.log("demo: ", demo);
        console.log("res.data: ", res);
        console.log("结果: ", self.roadSquare)
      },
      handleClick(tab, event ,res ) {
        /*console.log(tab, event);*/
        const self = this;
        console.log("这是数据: ", res);
      },




























      /**
      * 查看信息
      */
      handleCheck (row) {
        const self = this;
        self.hodelView = "";
        var i = self.activeNameTest;
        this.listTitle = self.tongName[i].name;
        self.dialogVisible = true;

        self.buildSquare = row;
        console.log("进入查看信息页面");
      },
      /**
       * 编辑信息
       * */
      handleEditor(row) {
        const self = this;
        self.hodelView = "view";
        var i = self.activeNameTest;
        this.listTitle = self.tongName[i].name;
        self.dialogVisible = true;
        self.buildSquare = row;
        console.log("进入编辑信息页面");
      },
      /**
       * 提交信息
       * */
      handleSubmit() {
        const self = this;
        if( self.option4.name !== '' ) {
          let newTabName = ++self.tabIndex + '';
          self.tongName.push(self.option4);
          self.activeNameTest = newTabName;
          self.dialogAdd = false;
        }
        console.log("前：", self.option4.name);
      },
      /**
       * 删除标签
       */
//      removeTab(  ) {
//        const self = this;
//        let tabs = self.tongName;
//        let activeName = self.activeNameTest;
//        if (activeName === self.targetName) {
//          _.each(tabs, function (vn , index) {
//            console.log("名称：", vn.name);
//            if(vn.name === self.targetName) {
//              let nextTab = tabs[index + 1] || tabs[index - 1];
//              if (nextTab) {
//                activeName = nextTab.name;
//              }
//            }
//          });
//        }
//        self.activeNameTest = activeName;
////        this.tongName = tabs.filter();
//        console.log("名称：", this.targetName);
//      },
      /**
       * 删除信息
       * */
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      /**
       * 点击添加类型
       */
      handleAddTab() {
        const self = this;
        self.hodelView = "view";
        self.dialogAdd = true;
        self.option4.name = '';
        console.log("数据: ", this);
      }
    }
  }
</script>



<style lang="scss">
  div.tongName {
    padding: 8px 12px 0px 12px;
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
  div.elementMadel>input{
    color: #666 !important;
    width:300px !important;
  }
  .app-main{
    overflow: auto !important;
    padding-bottom:10% !important;
  }

  div.l-form-item > label.el-form-item__label {
    width:200px;
  }
  div.fontSize > label {
    font-size: 19px;
  }
</style>
