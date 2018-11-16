<template>
  <div style="padding-top:20px;">
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
      <!--<el-button class="AddButton" type="primary" icon="el-icon-plus" circle
                 @click="handleAddTab(activeNameTest)"></el-button>-->
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               @tab-click="handleClick">
        <el-tab-pane label="建筑和小区" name="0" algin="center">
          <!--表格-->
          <el-table :data="buildSquare.slice((currentPage-1) * pageSizeNum1 , currentPage * pageSizeNum1)" style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum1 * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"    align="center" width="105" :sortable="true" :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ"  align="center" width="130" :sortable="true" :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"    align="center" width="175" :sortable="true" :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"    align="center" width="130" :sortable="true" :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"   align="center" width="160" :sortable="true" :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"    align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
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
              @current-change="currentChange"
              @size-change="sizeChange1"
              :page-sizes="pageSizeData"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalFrist">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="公园绿地" name="1" algin="center">
          <!--表格-->
          <el-table :data="parkSquare.slice( (currentPage-1)*pageSizeNum2 , currentPage*pageSizeNum2 )" style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum2 * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"  align="center" width="160" sortable :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
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
              @current-change="currentChange"
              @size-change="sizeChange2"
              :page-sizes="pageSizeData"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSecond">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="道路广场" name="2" algin="center">
          <!--表格-->
          <el-table :data="roadSquare.slice( (currentPage-1)*pageSizeNum3 , currentPage*pageSizeNum3 )" style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum3 * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"  align="center" width="160" sortable :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
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
              @current-change="currentChange"
              @size-change="sizeChange3"
              :page-sizes="pageSizeData"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalThree">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="河道治理" name="4" algin="center">
          <!--表格-->
          <el-table style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSize * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"  align="center" width="160" sortable :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination style="width:100%;text-align: center; margin:10px 0px;"
                         background
                         layout="prev, pager, next"
                         :total="100">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="涉水基础设施" name="5" algin="center">
          <!--表格-->
          <el-table style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSize * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"  align="center" width="160" sortable :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination style="width:100%;text-align: center; margin:10px 0px;"
                         background
                         layout="prev, pager, next"
                         :total="100">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="PPP项目" name="6" algin="center">
          <!--表格-->
          <el-table style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSize * (currentPage - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" :sort-method="sortChange" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>
            <el-table-column prop="ZLKZL"  align="center" width="160" sortable :show-overflow-tooltip="true" label="年径流总量控制率"></el-table-column>
            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row)" type="text" size="small" v-model="hodelView">编辑</el-button>
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, item.mingcheng)">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination style="width:100%;text-align: center; margin:10px 0px;"
                         background
                         layout="prev, pager, next"
                         :total="100">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>

      <!--获取信息-->
      <el-dialog :title="this.hodelView === ''?'查看信息':'编辑信息'" :visible.sync="dialogVisible" data="optionData"
                 @click="dialogVisible = false">
        <el-form :label-position="labelPosition" label-width="200px" :model="optionData">
          <!--<h2 style="padding:0px 0px 10px 35px;"><span>类型名称：</span>  123</h2>-->
          <el-form-item label="编号：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px;" v-model="optionData.name"></el-input>
          </el-form-item>
          <el-form-item label="用地类型：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.YDLX"></el-input>
          </el-form-item>
          <el-form-item label="建设状态：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.JSZT"></el-input>
          </el-form-item>
          <el-form-item label="项目名称：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.XMMC"></el-input>
          </el-form-item>
          <el-form-item label="排入河道：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.PRHD"></el-input>
          </el-form-item>
          <el-form-item label="所属流域：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.SSLY"></el-input>
          </el-form-item>
          <el-form-item label="所属排水分区：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.SSPSFQ"></el-input>
          </el-form-item>
          <el-form-item label="是否为正本清源项目：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.ZBQY"></el-input>
          </el-form-item>
          <el-form-item label="海绵建设情况：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.JSQK"></el-input>
          </el-form-item>
          <el-form-item label="年径流总量控制率：">
            <el-input class="elementMadel"
                      :disabled="this.hodelView == 'view' ? false : true"
                      style="width:300px"
                      v-model="optionData.ZLKZL"></el-input>
          </el-form-item>
        </el-form>


        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-show="this.hodelView == 'view' ? false : true" type="primary"
                     @click="dialogVisible = false">确 定</el-button>
          <el-button v-show="this.hodelView == 'view' ? true : false" type="primary"
                     @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加信息-->
      <el-dialog title="添加信息" :visible.sync="dialogAdd" data="option4" @click="dialogAdd = false">
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
        /*表头输入框数据*/
        projects:[],
        project: {
          creatorId: '',
          geometry_type:''
        },
        formInline:{
          user:'',
          region:''
        },
        pageNo : 1,
        projectId: '',

        buildSquare: [], // 公园绿地
        roadSquare: [],  // 道路广场
        parkSquare: [],  // 建筑小区
        total: 0,//默认数据总数
        totalFrist : 0,
        totalSecond: 0,
        totalThree: 0,
        pageSize: 10,//每页的数据条数
        pageSizeNum1: 10,//每页的数据条数
        pageSizeNum2: 10,//每页的数据条数
        pageSizeNum3: 10,//每页的数据条数
        currentPage: 1,//默认开始页面
        pageSizeData: [10,20,50],

        ListTest: [],
        dialogVisible: false,     // 查看获取的用户的信息
        dialogAdd: false,         // 添加
        labelPosition: 'right',   // label文字向右对齐
        activeNameTest: '0',      // 表格标签页
        hodelView: '',            // 查看input禁用编辑input显示
        listTitle: '',            // 类型名称
        optionData: '',             // 查看编辑获取表格中的数据
        tongName: [],             // 表格中的全部数据
        option4: {                // 添加类型中的表数据
          name: "",
          mingcheng: []
        },
        rules: {                  // 表单验证
          name: [
            {required: true, message: '请输入类型名称', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ]
        },
        targetName: ''
      }
    },
    created() {
    },
    mounted() {
      this.ProductInit();
      this.Test();
      this.getProjectsInfo();
    },
    methods: {
      //请求所有项目
      getProjectsInfo(){
        axios('/api/projects').then(this.getProjectSuccess);
      },
      getProjectSuccess(res){
        const self = this;
        self.projects = res.data;
      },
      // 查询事件
      handleSelect(){
        var self = this;
        var selectObject = {
          project_id: self.project.creatorId,
          geometry_type : self.project.geometry_type
        };
        // 向后端发起请求接口为 /shapes 拿到数据
        request('shapes',{
          params:{
            pageNo: 1,
            pageSize:100,
            filters: {
              'shape': {
                'project_id': {
                  equalTo: selectObject.project_id
                },
                'category':{
                  equalTo: 'SUBCATCHMENTS'
                }
              }
            }
          }
        }).then(resp =>{
          this.tableData = resp.data;
          self.totall = Number(resp.headers.total);
        })
      },
      /**
       * 获取项目进度表数据
       */
      ProductInit (){
        const self = this;
        request('shapes', {
          params: {
            pageNo: 1,
            pageSize: 20000000,
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
        }).then(resp => {
          this.roadData(resp);
        })
      },
      roadData(res){
        const self = this;
        var data = res.data;
        _.each(data, function (L) {
          var TestData = JSON.parse(L.properties);    // 解析
          var letter = ( TestData.properties.YDLX ).substr(0, 1);     // 截取字符
          var threeTest = ( TestData.properties.YDLX ).substr(0, 3);  // 截取字符
          /**
           * 道路广场
           */
          if ( TestData.properties.YDLX === "道路" || letter === "S" ) {
            var RoadTest = {};
            RoadTest.name = TestData.properties.name;
            RoadTest.YDLX = TestData.properties.YDLX;
            RoadTest.JSZT = TestData.properties.JSZT;
            RoadTest.XMMC = TestData.properties.XMMC;
            RoadTest.HMLX = TestData.properties.HMLX;
            RoadTest.PRHD = TestData.properties.PRHD;
            RoadTest.SSLY = TestData.properties.SSLY;
            RoadTest.SSPSFQ = TestData.properties.SSPSFQ;
            RoadTest.ZBQY = TestData.properties.ZBQY;
            RoadTest.area = ((TestData.properties.area)/10000).toFixed(2);
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "40%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = TestData.properties.JSZT + '';
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "65%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "40%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              debugger
              RoadTest.JSQK = TestData.properties.JSZT + '';
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
              RoadTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = "规划管控" + '';
              RoadTest.ZLKZL = "65%";
            }
            self.roadSquare.push(RoadTest);
          } else
          /**
           * 建筑小区
           */
          if ( letter === "R" || letter === "M" || letter === "C" || threeTest === "GIC" ) {
            var builTest = {};
            builTest.name = TestData.properties.name;
            builTest.YDLX = TestData.properties.YDLX;
            builTest.JSZT = TestData.properties.JSZT;
            builTest.XMMC = TestData.properties.XMMC;
            builTest.HMLX = TestData.properties.HMLX;
            builTest.PRHD = TestData.properties.PRHD;
            builTest.SSLY = TestData.properties.SSLY;
            builTest.SSPSFQ = TestData.properties.SSPSFQ;
            builTest.ZBQY = TestData.properties.ZBQY;
            builTest.area = ((TestData.properties.area)/10000).toFixed(2);
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "65%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "50%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "70%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "50%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
              builTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              builTest.JSQK = "规划管控" + '';
              builTest.ZLKZL = "65%";
            }
            self.buildSquare.push(builTest);
          } else
          /**
           * 公园绿地
           */
          if ( letter === "G"  ) {
            var parkTest = {};
            parkTest.name = TestData.properties.name;
            parkTest.YDLX = TestData.properties.YDLX;
            parkTest.JSZT = TestData.properties.JSZT;
            parkTest.XMMC = TestData.properties.XMMC;
            parkTest.HMLX = TestData.properties.HMLX;
            parkTest.PRHD = TestData.properties.PRHD;
            parkTest.SSLY = TestData.properties.SSLY;
            parkTest.SSPSFQ = TestData.properties.SSPSFQ;
            parkTest.ZBQY = TestData.properties.ZBQY;
            parkTest.area = ((TestData.properties.area)/10000).toFixed(2);
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "70%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "80%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "60%";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
              parkTest.ZLKZL = "";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = "" + '';
              parkTest.ZLKZL = "80%";
            }
            self.parkSquare.push(parkTest);
          }
        });
        this.totalFrist = self.buildSquare.length;
        this.totalSecond = self.parkSquare.length;
        this.totalThree = self.roadSquare.length;
        /*console.log("道路广场: ", self.roadSquare);
        console.log("建筑小区: ", self.buildSquare);
        console.log("公园绿地: ", self.parkSquare); */
      },
      /**
       * 排水分区排序
       */
      sortChange(a, b){
        //return a.SSPSFQ-b.SSPSFQ
        var removeChines1 = a.SSPSFQ.replace(/[\u4e00-\u9fa5]/g, '');
        var number1 = removeChines1.replace(/#/g, '')
        var removeChines2 = b.SSPSFQ.replace(/[\u4e00-\u9fa5]/g, '');
        var number2 = removeChines2.replace(/#/g, '')
        return number1-number2
      },
      /**
       * 标签页
       */
      handleClick(tab, event, res) {
        const self = this;
      },
      /**
       * 分页部分
       */
      sizeChange1(pageSizeNum1){
        this.pageSizeNum1 = pageSizeNum1;
      },
      sizeChange2(pageSizeNum2){
        this.pageSizeNum2 = pageSizeNum2;
      },
      sizeChange3(pageSizeNum3){
        this.pageSizeNum3 = pageSizeNum3;
      },
      currentChange(currentPage){
        this.currentPage = currentPage;
      },

      /**
       * 查看信息
       */
      handleCheck (row) {
        const self = this;
        self.hodelView = "";
        self.dialogVisible = true;
        self.optionData = row;
        console.log("进入查看信息页面", self);
      },
      /**
       * 编辑信息
       * */
      handleEditor(row) {
        const self = this;
        self.hodelView = "view";
        self.dialogVisible = true;
        self.optionData = row;
        console.log("进入编辑信息页面");
      },
      /**
       * 提交信息
       * */
      handleSubmit() {
        const self = this;
        if (self.option4.name !== '') {
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
      },
      /**
       * 路由跳转
       */
      Test() {
        this.projectId = this.$route.query.projectId;
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
