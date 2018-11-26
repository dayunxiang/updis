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
      <!--<el-button class="AddButton" type="primary" icon="el-icon-plus" circle
                 @click="handleAddTab(activeNameTest)"></el-button>-->
      <el-tabs class="tongName"
               tab-position="top"
               v-model="activeNameTest"
               @tab-click="handleClick">
        <el-tab-pane label="建筑和小区" name="0" algin="center">
          <!--表格-->
          <el-table :data="buildSquare.slice(( currentPageNum1 - 1 ) * pageSizeNum1 , currentPageNum1 * pageSizeNum1)"
                    :default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change'
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

        <el-tab-pane label="公园绿地" name="1" algin="center">
          <!--表格-->
          <el-table :data="parkSquare.slice( (currentPageNum2 - 1 ) * pageSizeNum2 , currentPageNum2*pageSizeNum2 )"
                    :default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change'
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum2 * (currentPageNum2 - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>

            <el-table-column prop="XZKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>

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
              @current-change="currentChange2"
              @size-change="sizeChange2"
              :page-sizes="pageSizeData"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSecond">
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="道路广场" name="2" algin="center">
          <!--表格-->
          <el-table :data="roadSquare.slice( (currentPageNum3-1)*pageSizeNum3 , currentPageNum3*pageSizeNum3 )"
                    :default-sort = "{prop: 'outlay', order: 'descending'}" @sort-change='sort_change'
                    style="width: 100%" border>
            <el-table-column align="center" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{ scope.$index + 1 + pageSizeNum3 * (currentPageNum3 - 1) }}
              </template>
            </el-table-column>
            <el-table-column prop="name"   align="center" width="105" sortable :show-overflow-tooltip="true" label="地块编号"></el-table-column>
            <el-table-column prop="YDLX"   align="center" width="105" sortable :show-overflow-tooltip="true" label="用地类型"></el-table-column>
            <el-table-column prop="JSZT"   align="center" width="105" sortable :show-overflow-tooltip="true" label="建设状态"></el-table-column>
            <el-table-column prop="XMMC"   align="center" width="105" sortable :show-overflow-tooltip="true" label="项目名称"></el-table-column>
            <el-table-column prop="PRHD"   align="center" width="105" sortable :show-overflow-tooltip="true" label="排入河道" ></el-table-column>
            <el-table-column prop="SSLY"   align="center" width="105" sortable :show-overflow-tooltip="true" label="所属流域"></el-table-column>
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>

            <el-table-column prop="XZKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>

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
              @current-change="currentChange3"
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
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>

            <el-table-column prop="XZKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>

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
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>

            <el-table-column prop="XZKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="120" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>

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
            <el-table-column prop="SSPSFQ" align="center" width="130" sortable :show-overflow-tooltip="true" label="所属排水分区"></el-table-column>
            <el-table-column prop="ZBQY"   align="center" width="175" sortable :show-overflow-tooltip="true" label="是否为正本清源项目"></el-table-column>
            <el-table-column prop="JSQK"   align="center" width="130" sortable :show-overflow-tooltip="true" label="海绵建设情况"></el-table-column>

            <el-table-column prop="XZKZL"   align="center" width="170" :sortable="true" :show-overflow-tooltip="true" label="现状年径流总量控制率"></el-table-column>
            <el-table-column prop="GHKZL"   align="center" width="170" :sortable="true" :show-overflow-tooltip="true" label="规划年径流总量控制率"></el-table-column>

            <el-table-column prop="area"   align="center" width="120" sortable :show-overflow-tooltip="true" label="面积(公顷)"></el-table-column>
            <el-table-column align="center" fixed="right" width="160" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleCheck(scope.row)" type="text" size="small" v-model="hodelView">查看</el-button>
                <el-button @click="handleEditor(scope.row, 'optionData')" type="text" size="small" v-model="hodelView">编辑</el-button>
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
        buildSquare: [], // 建筑小区
        roadSquare: [],  // 道路广场
        parkSquare: [],  // 公园绿地
        saveArray1: [],  // 建筑小区
        saveArray2: [],  // 道路广场
        saveArray3: [],  // 公园绿地
        total: 0,        // 默认数据总数
        totalFrist : 0,
        totalSecond: 0,
        totalThree: 0,
        pageSize: 10,    //每页的数据条数
        pageSizeNum1: 10,//每页的数据条数
        pageSizeNum2: 10,//每页的数据条数
        pageSizeNum3: 10,//每页的数据条数
        currentPage: 1,  //默认开始页面
        currentPageNum1: 1,//默认开始页面
        currentPageNum2: 1,//默认开始页面
        currentPageNum3: 1,//默认开始页面
        pageSizeData: [10,20,50],
        ListTest: [],
        dialogVisible: false,     // 查看获取的用户的信息
        dialogAdd: false,         // 添加
        labelPosition: 'right',   // label文字向右对齐
        activeNameTest: '0',      // 表格标签页
        hodelView: '',            // 查看input禁用编辑input显示
        listTitle: '',            // 类型名称
        optionData: '',           // 查看编辑获取表格中的数据
        tongName: [],             // 表格中的全部数据
        option4: {                // 添加类型中的表数据
          name: "",
          mingcheng: []
        },
        targetName: '',
        /**
         *  表单验证
         */
        rules: {
          name: [
            { required: true, message: '地块编号', trigger: 'blur' }
          ],
          YDLX: [
            { required: true, message: '用地类型', trigger: 'blur' }
          ],
          JSZT: [
            { required: true, message: '建设状态', trigger: 'blur' }
          ],
          XMMC: [
            { required: true, message: '项目名称', trigger: 'blur' }
          ],
          PRHD: [
            { required: true, message: '排入河道', trigger: 'blur' }
          ],
          SSLY: [
            { required: true, message: '所属流域', trigger: 'blur' }
          ],
          SSPSFQ: [
            { required: true, message: '所属排水分区', trigger: 'blur' }
          ],
          ZBQY: [
            { required: true, message: '是否为正本清源项目', trigger: 'blur' }
          ],
          JSQK: [
            { required: true, message: '海绵建设情况', trigger: 'blur' }
          ],
          XZKZL: [
            { required: true, message: '现状年径流总量控制率', trigger: 'blur' }
          ],
          GHKZL: [
            { required: true, message: '规划年径流总量控制率', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '面积', trigger: 'blur' }
          ]
        },
        rulers: {
          name: [
            { required: false, message: '地块编号', trigger: 'blur' }
          ],
          YDLX: [
            { required: false, message: '用地类型', trigger: 'blur' }
          ],
          JSZT: [
            { required: false, message: '建设状态', trigger: 'blur' }
          ],
          XMMC: [
            { required: false, message: '项目名称', trigger: 'blur' }
          ],
          PRHD: [
            { required: false, message: '排入河道', trigger: 'blur' }
          ],
          SSLY: [
            { required: false, message: '所属流域', trigger: 'blur' }
          ],
          SSPSFQ: [
            { required: false, message: '所属排水分区', trigger: 'blur' }
          ],
          ZBQY: [
            { required: false, message: '是否为正本清源项目', trigger: 'blur' }
          ],
          JSQK: [
            { required: false, message: '海绵建设情况', trigger: 'blur' }
          ],
          XZKZL: [
            { required: false, message: '现状年径流总量控制率', trigger: 'blur' }
          ],
          GHKZL: [
            { required: false, message: '规划年径流总量控制率', trigger: 'blur' }
          ],
          area: [
            { required: false, message: '面积', trigger: 'blur' }
          ]
        },
        rulersTest: {},
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
            RoadTest.XZKZL = TestData.properties.现状控制率;
            RoadTest.GHKZL = TestData.properties.规划控制率;
            RoadTest.area = Math.abs(((TestData.properties.area)/10000).toFixed(2));
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              debugger
              RoadTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              RoadTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              RoadTest.JSQK = "规划管控" + '';
            }
            self.roadSquare.push(RoadTest);
            self.saveArray2.push(RoadTest)
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
            builTest.XZKZL = TestData.properties.现状控制率;
            builTest.GHKZL = TestData.properties.规划控制率;
            builTest.area = Math.abs(((TestData.properties.area)/10000).toFixed(2));
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              builTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              builTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              builTest.JSQK = "规划管控" + '';
            }
            self.buildSquare.push(builTest);
            self.saveArray1.push(builTest)
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
            parkTest.XZKZL = TestData.properties.现状控制率;
            parkTest.GHKZL = TestData.properties.规划控制率;
            parkTest.area = Math.abs(((TestData.properties.area)/10000).toFixed(2));
            /**
             * 判断海绵建设情况
             */
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "在建" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = TestData.properties.JSZT + '';
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "已落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + TestData.properties.HMCS;
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === "未落实海绵" ) {
              parkTest.JSQK = TestData.properties.JSZT + "无海绵";
            }
            if( TestData.properties.JSZT === "规划" && TestData.properties.HMCS === null ) {
              parkTest.JSQK = "规划管控" + '';
            }
            self.parkSquare.push(parkTest);
            self.saveArray3.push(parkTest)
          }
        });
        this.totalFrist = self.buildSquare.length;
        this.totalSecond = self.parkSquare.length;
        this.totalThree = self.roadSquare.length;
        /*console.log("道路广场: ", self.roadSquare);
        console.log("建筑小区: ", self.buildSquare);
        console.log("公园绿地: ", self.parkSquare);*/
      },
      /**
       * 排水分区排序
       */

      sort_change(column) {
        const self = this;
        console.log("order:", column.prop);
        if (column.prop === null){
          self.buildSquare = self.saveArray1;
          self.roadSquare  = self.saveArray2;
          self.parkSquare  = self.saveArray3;
        }
        if (column.prop === 'area') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var area1 = a.area;
              var area2 = b.area;
              return area2 - area1
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var area1 = a.area;
              var area2 = b.area;
              return area1 - area2
            })
          }
        }
        if (column.prop === 'XZKZL') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var XZKZL1 = a.XZKZL.replace(/%/g, '');
              var XZKZL2 = b.XZKZL.replace(/%/g, '');
              return XZKZL2 - XZKZL1
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var XZKZL1 = a.XZKZL.replace(/%/g, '');
              var XZKZL2 = b.XZKZL.replace(/%/g, '');
              return XZKZL1 - XZKZL2
            })
          }
        }
        if (column.prop === 'GHKZL') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var GHKZL1 = a.GHKZL.replace(/%/g, '');
              var GHKZL2 = b.GHKZL.replace(/%/g, '');
              return GHKZL2 - GHKZL1
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var GHKZL1 = a.GHKZL.replace(/%/g, '');
              var GHKZL2 = b.GHKZL.replace(/%/g, '');
              return GHKZL1 - GHKZL2
            })
          }
        }
        if (column.prop === 'SSPSFQ') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var SSPSFQ1 = a.SSPSFQ.replace(/#|[\u4e00-\u9fa5]/g, '');
              var SSPSFQ2 = b.SSPSFQ.replace(/#|[\u4e00-\u9fa5]/g, '');
              return SSPSFQ2 - SSPSFQ1
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var SSPSFQ1 = a.SSPSFQ.replace(/#|[\u4e00-\u9fa5]/g, '');
              var SSPSFQ2 = b.SSPSFQ.replace(/#|[\u4e00-\u9fa5]/g, '');
              return SSPSFQ1 - SSPSFQ2
            })
          }
        }
        if (column.prop === 'JSZT') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var JSZT1 = a.JSZT;
              var JSZT2 = b.JSZT;
              return JSZT2.localeCompare(JSZT1)
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var JSZT1 = a.JSZT;
              var JSZT2 = b.JSZT;
              return JSZT1.localeCompare(JSZT2)
            })
          }
        }
        if (column.prop === 'JSQK') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var JSQK1 = a.JSQK;
              var JSQK2 = b.JSQK;
              return JSQK2.localeCompare(JSQK1)
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var JSQK1 = a.JSQK;
              var JSQK2 = b.JSQK;
              return JSQK1.localeCompare(JSQK2)
            })
          }
        }
        if (column.prop === 'SSLY') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var SSLY1 = a.SSLY;
              var SSLY2 = b.SSLY;
              return SSLY2.localeCompare(SSLY1)
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var SSLY1 = a.SSLY;
              var SSLY2 = b.SSLY;
              return SSLY1.localeCompare(SSLY2)
            })
          }
        }
        if (column.prop === 'PRHD') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var PRHD1 = a.PRHD;
              var PRHD2 = b.PRHD;
              return PRHD2.localeCompare(PRHD1)
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var PRHD1 = a.PRHD;
              var PRHD2 = b.PRHD;
              return PRHD1.localeCompare(PRHD2)
            })
          }
        }
        if (column.prop === 'name') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var name1 = a.name.substr(0, 2);
              var name2 = b.name.substr(0, 2);
              return name2 - name1
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var name1 = a.name.substr(0, 2);
              var name2 = b.name.substr(0, 2);
              return name1 - name2
            })
          }
        }
        if (column.prop === 'YDLX') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var YDLX1 = a.YDLX.replace(/\+/g, '');
              var YDLX2 = b.YDLX.replace(/\+/g, '');
              return (YDLX2 + '').localeCompare(YDLX1 + '')
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              var YDLX1 = a.YDLX.replace(/\+/g, '');
              var YDLX2 = b.YDLX.replace(/\+/g, '');
              return (YDLX1 + '').localeCompare(YDLX2 + '')
            })
          }
        }
        if (column.prop === 'XMMC') {
          if (column.order === 'descending') {
            self.buildSquare = self.buildSquare.sort(function(a,b){
              console.log(a.XMMC,b.XMMC)
              if(b.XMMC !== null && a.XMMC !== null) {
                var XMMC1 = a.XMMC.replace(/[&\|\\\*^%（）$#@\-]/g,"");
                var XMMC2 = a.XMMC.replace(/[&\|\\\*^%（）$#@\-]/g,"");
                return XMMC2.localeCompare(XMMC1)
              }else {
                return XMMC2 - XMMC1
              }
            })
          } else
          if (column.order === 'ascending') {
            self.buildSquare = self.buildSquare.sort(function (a, b) {
              if (b.XMMC !== null && a.XMMC !== null) {
                var XMMC1 = a.XMMC.replace(/[&\|\\\*^%（）$#@\-]/g, "");
                var XMMC2 = a.XMMC.replace(/[&\|\\\*^%（）$#@\-]/g, "");
                return XMMC1.localeCompare(XMMC2)
              }else{
                return XMMC2 - XMMC1
              }
            })
          }
        }
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
      currentChange1(currentPageNum1){
        this.currentPageNum1 = currentPageNum1;
      },
      currentChange2(currentPageNum2){
        this.currentPageNum2 = currentPageNum2;
      },
      currentChange3(currentPageNum3){
        this.currentPageNum3 = currentPageNum3;
      },
      /**
       * 查看信息
       */
      handleCheck (row) {
        const self = this;
        self.hodelView = "";
        self.dialogVisible = true;
        self.optionData = row;
        self.rulersTest = self.rulers;
        console.log("进入查看信息页面", self.rulersTest);
      },
      /**
       * 编辑信息
       * */
      handleEditor(row, formRule) {
        const self = this;
        self.hodelView = "view";
        self.dialogVisible = true;
        self.optionData = row;
        self.rulersTest = self.rules;
        self.$refs[formRule].resetFields();
        console.log("进入编辑信息页面", self.rulers);
      },
      quxiao(formRule){
        const self = this;
        self.dialogVisible = false;
        self.$refs[formRule].resetFields();
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
