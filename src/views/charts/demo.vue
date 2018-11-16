<template>
  <div>

    <el-form :inline="true"  class="demo-form-inline" style="padding:10px 10px;">
      <!--<el-form-item label="项目名称">-->
        <!--<el-select placeholder="请选择">-->
          <!--&lt;!&ndash;<el-option v-for="project in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>&ndash;&gt;-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="点类型">-->
        <!--<el-select  placeholder="请选择点类型">-->
          <!--<el-option label="排口"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="编号">
        <el-input placeholder="请输入要查询的编号"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" >查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" >添加</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success">导出</el-button>
      </el-form-item>
    </el-form>

    <el-tabs class="tongName"
             tab-position="top"
             @tab-click="handleClick">
      <el-tab-pane label="建筑和小区" name="0" algin="center">
        <Tables
          :schema="schema['Shape']"
          :columns='showUserColumns'
          :options='userOptions'
          :userDefined="userDefined"
          ref="hmComplexTable">
          <!--:filters='userFilters'-->
        </Tables>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import tables from '../haomo/components/tables/HmComplexTable.vue'
  import schema from '../haomo/schemas/hm_org_schema'
  import HmComplexForm from '../haomo/components/forms/HmComplexForm.vue'
  import {menuList} from '../../api/menu'
  import {funcList} from '../../api/func'
  import {toTree} from '../../utils/util'
  import request from '@/utils/request'
  import _ from 'lodash'
  import {roleMenuAllDelete, roleMenuNew, roleMenu} from '../../api/role_menu'
  import {param, paramEncode} from '@/utils'
  import commonApi from '@/api/commonApi'

  export default {
    data() {
      return {
        removeTreeData: [],
        allTree: [],
        treeDateTmp: [],
        roleShow: false, // 角色分配弹框
        currentRoleId: [], // 当前角色的id
        deleteRoleMenuArr: [],
        // 存储角色分配
        roleMenuArr: [],
        roleMenuObj: {
          roleId: '',
          menuId: ''
        },
        props: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
        checkTree: [], // 树形菜单默认值(只有叶子节点)
        deleteMenuTree: [], // 树形菜单默认值(父级、叶子)
        showUserColumns: [
          { width:105, isSort: true, codeCamel:'name',   name:'地块编号'},
          { width:105, isSort: true, codeCamel:'YDLX',   name:'用地类型'},
          { width:105, isSort: true, codeCamel:'JSZT',   name:'建设状态'},
          { width:105, isSort: true, codeCamel:'XMMC',   name:'项目名称'},
          { width:105, isSort: true, codeCamel:'PRHD',   name:'排入河道'},
          { width:105, isSort: true, codeCamel:'SSLY',   name:'所属流域'},
          { width:105, isSort: true, codeCamel:'SSPSFQ', name:'所属排水分区'},
          { width:105, isSort: true, codeCamel:'ZBQY',   name:'是否为正本清源项目'},
          { width:105, isSort: true, codeCamel:'JSQK',   name:'海绵建设情况'},
          { width:105, isSort: true, codeCamel:'ZLKZL',  name:'年径流总量控制率'},
          { width:105, isSort: true, codeCamel:'area',   name:'面积'}
        ],
        userFilters: [
          { isShow: false, placeholder: '请输入角色名', name: {like: ''}}
        ],
        checkNode: [], // 存放选择的角色数据
        roleName : []   // 角色的全部名称
      }
    },
    components: {
      Tables: tables,
      'hm-complex-form': HmComplexForm
    },
    created() {
      const self = this
      this.schema = schema,
      this.userOptions = {
        sortItem: 'create_time',
        sortOrder: 'desc',   // 排序
        changeValue: {
          username: {1: 'Hm-isChecked', 0: 'Hm-noChecked'}
        },
        newData: {
          isShow: false,
          showUserColumns: [
            {
              name: '地块编号', codeCamel: 'name', widgetType: 1,
              rule: [{required: true, message: '请输入编号', trigger: 'blur'},
                {validator: this.validateName, trigger: 'blur'}]
            },
            {
              name: '用地类型', codeCamel: 'YDLX', widgetType: 1,
              rule: {required: true, message: '请输入用地类型', trigger: 'blur'}
            },
            {
              name: '建设状态', codeCamel: 'JSZT', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '项目名称', codeCamel: 'XMMC', widgetType: 1,
              rule: {required: true, message: '请输入项目名称', trigger: 'blur'}
            },
            {
              name: '排入河道', codeCamel: 'PRHD', widgetType: 1,
              rule: {required: true, message: '请输入排入河道', trigger: 'blur'}
            },
            {
              name: '海绵类型', codeCamel: 'HMLX', widgetType: 1,
              rule: {required: true, message: '请输入海绵类型', trigger: 'blur'}
            },
            {
              name: '所属流域', codeCamel: 'SSLY', widgetType: 1,
              rule: {required: true, message: '请输入所属流域', trigger: 'blur'}
            },
            {
              name: '所属排水分区', codeCamel: 'SSPSFQ', widgetType: 1,
              rule: {required: true, message: '请输入所属排水分区', trigger: 'blur'}
            },
            {
              name: '是否为正本清源项目', codeCamel: 'ZBQY', widgetType: 1,
              rule: {required: true, message: '请输入简称', trigger: 'blur'}
            },
            {
              name: '海绵建设情况', codeCamel: 'HMCS', widgetType: 1,
              rule: {required: true, message: '请输入简称', trigger: 'blur'}
            },
            {
              name: '年径流总量控制率', codeCamel: 'MJGQ', widgetType: 1,
              rule: {required: true, message: '请输入面积', trigger: 'blur'}
            }
          ],
          showUserButtons: [
            {type: 1, text: '确定', method: this.newSure},
            {type: 3, text: '取消', method: this.closeDialog}
          ],
          formSchema: schema['Shape'],
          layout: {left: 0, middle: 24, right: 0}
        },      //新建按钮
        editData: {
          isShow: false,
          showUserColumns: [
            {
              name: '地块编号', codeCamel: 'name', widgetType: 1,
              rule: {required: true, message: '请输入编号', trigger: 'blur'}
            },
            {
              name: '用地类型', codeCamel: 'YDLX', widgetType: 1,
              rule: {required: true, message: '请输入用地类型', trigger: 'blur'}
            },
            {
              name: '建设状态', codeCamel: 'JSZT', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '项目名称', codeCamel: 'XMMC', widgetType: 1,
              rule: {required: true, message: '请输入项目名称', trigger: 'blur'}
            },
            {
              name: '海绵类型', codeCamel: 'HMLX', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '排入河道', codeCamel: 'PRHD', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '所属流域', codeCamel: 'SSLY', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '所属排水分区', codeCamel: 'SSPSFQ', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '是否为正本清源项目', codeCamel: 'ZBQY', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '海绵建设情况', codeCamel: 'HMCS', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '年径流总量控制率', codeCamel: 'MJGQ', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            },
            {
              name: '面积', codeCamel: 'area', widgetType: 1,
              rule: {required: true, message: '请输入建设状态', trigger: 'blur'}
            }
          ],
          showUserButtons: [
            {type: 1, text: '确定', method: this.closeDialog},
            {type: 3, text: '取消', method: this.closeDialog}
          ],
          formSchema: schema['Shape'],
          layout: {left: 0, middle: 24, right: 0}
        },
        cellStyle: {},       // 自定义单元格的样式
        tableStyle: {width: '100%'},
        isShowPagination: true,    // 是否显示分页
        isShowSearch: false,       // 是否显示搜索按钮
        showRefresh:  false,       // 刷新
        showExport:   false,       // 导出
        showDeleteButton: false,   // 是否显示删除
        buttonGroup: false,        // 默认不以按钮组的方式呈现button
        showSelection: false,      // 是否显示多选
        showOverflowTooltip: true, // 设置当内容过长被隐藏时显示 tooltip
        useTableTotal:true,        // 是否使用了组件的total
        promiseProcessing(value, params, definedOperate) { // 处理返回后的数据,必须return Promise对象
          const data = new Promise(function(resolve,req) {
            request('shapes', {
              params: {
                pageNo: params.pageNo,
                sortItem: params.sortItem,
                pageSize: params.pageSize, //
                sortOrder: params.sortOrder,
                filters: {
                  'shape': {
                    'category': {
                      equalTo: "SUBCATCHMENTS"
                    },
                    'projectId': {
                      equalTo: '3'
                    }
                  },
                },
              }
            }).then(res => {
              let DataList = [];
              let i = 0 ;
              _.each(res.data, function (ls) {
                var TestData = JSON.parse(ls.properties);    // 解析
                var objTest = TestData.properties;
                var threeTest = objTest.YDLX.substr(0, 3);  // 截取字符
                var letter    = objTest.YDLX.substr(0, 1);     // 截取字符
                debugger
                if ( objTest.YDLX === "道路" || letter === "S" ) {
                  debugger
                  DataList[i] = ls;
                  DataList[i][name] = objTest.name;
                  DataList[i][YDLX] = objTest.YDLX;
                  DataList[i][JSZT] = objTest.JSZT;
                  DataList[i][XMMC] = objTest.XMMC;
                  DataList[i][HMLX] = objTest.HMLX;
                  DataList[i][PRHD] = objTest.PRHD;
                  DataList[i][SSLY] = objTest.SSLY;
                  DataList[i][SSPSFQ] = objTest.SSPSFQ;
                  DataList[i][ZBQY] = objTest.ZBQY;
                  DataList[i][area] = ((objTest.area)/10000).toFixed(2);
                  /**
                   * 判断海绵建设情况
                   */
                  /*if( TestData.properties.JSZT === "现状" && TestData.properties.HMCS === "已落实海绵" ) {
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
                  self.roadSquare.push(RoadTest);*/
                  i++;
                } else
                if ( letter === "R" || letter === "M" || letter === "C" || threeTest === "GIC" ) {
                  debugger
                  DataList[i] = ls;
                  DataList[i][name] = objTest.name;
                  DataList[i][YDLX] = objTest.YDLX;
                  DataList[i][JSZT] = objTest.JSZT;
                  DataList[i][XMMC] = objTest.XMMC;
                  DataList[i][HMLX] = objTest.HMLX;
                  DataList[i][PRHD] = objTest.PRHD;
                  DataList[i][SSLY] = objTest.SSLY;
                  DataList[i][SSPSFQ] = objTest.SSPSFQ;
                  DataList[i][ZBQY] = objTest.ZBQY;
                  DataList[i][area] = ((objTest.area)/10000).toFixed(2);
                  i++;
                } else
                if ( letter === "G" ) {
                  debugger
                  DataList[i] = ls;
                  DataList[i][name] = objTest.name;
                  DataList[i][YDLX] = objTest.YDLX;
                  DataList[i][JSZT] = objTest.JSZT;
                  DataList[i][XMMC] = objTest.XMMC;
                  DataList[i][HMLX] = objTest.HMLX;
                  DataList[i][PRHD] = objTest.PRHD;
                  DataList[i][SSLY] = objTest.SSLY;
                  DataList[i][SSPSFQ] = objTest.SSPSFQ;
                  DataList[i][ZBQY] = objTest.ZBQY;
                  DataList[i][area] = ((objTest.area)/10000).toFixed(2);
                  i++;
                }
              })
              resolve(DataList);
              self.$refs.hmComplexTable.total = i ;
              console.log("res.data: ", res.data);
            })
          });
          return data
        }
      }
      this.userDefined = {
        definedOperation: [
          {label: '删除', func: this.deleteOne}
          /*{label: '菜单分配', func: this.distributionMenu}*/
        ]
      }
      //this.NameSure()
    },
    mounted() {
    },
    methods: {
      /*** 标签页 */
      handleClick(tab, event) {
        /*console.log(tab, event);*/
      },
      /**
       * 起始数据
       */
      /*NameSure() {
        const self = this;
        request('shapes', {
          params: {
            pageSize: 10,
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
          this.roleName = [];
        _.each(res.data, function (v) {
          var testInit = JSON.parse(v.properties);
          self.roleName.push(testInit.properties.name)
          // self.dataInit.push(testInit)
        });
        // console.log("起始数据2: ", self.roleName);
      })
      },
      /!**
       * 新建的确认按钮
       *!/
      newSure: function() {
        const self = this
        self.NameSure()
        self.$refs.hmComplexTable.dialogFormVisible = false // 关闭弹窗
        self.closeDialog()
      },
      /!**
       * 验证密码
       *!/
      validateName: function(rule, value, callback) {
        const self = this
        if (!value) {
          callback(new Error('请输入角色名'))
        } else if (_.indexOf(self.roleName, value) > -1) {
          callback(new Error('角色名重复，请重新输入！'))
        } else {
          callback()
        }
      },
      /!**
       * 删除单条角色数据
       * @param params
       *!/
      deleteOne: function(data) {
        console.log(data)
        const self = this
        self.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request('user_roles', {
          params: {
            filters: {
              'user_role': {
                'roleId': {
                  equalTo: data.id
                }
              }
            }
          }
        }).then(resp => {
          console.log(resp.data)
        if (resp.data.length > 0) {
          console.log('提示不能删除')
          self.$message({
            message: '该角色下有人员，无法删除',
            type: 'warning'
          })
        } else {
          console.log('可以删除')
          commonApi.delete('roles', data.id).then(function (res) {
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            self.$refs.hmComplexTable.getList() // 刷新列表
          })
        }
      })
      }).catch(() => {
          self.$message({
          message: '已取消删除',
          type: 'success'
        })
      })
      },
      /!**
       * 菜单分配弹窗数据显示
       * @param params
       *!/
      distributionMenu(params) {
        const self = this
        // 获取菜单表的树形结构
        menuList().then(res => {
          self.treeData = _.remove(res.data, function (item) {
          return item.type === 'necessarily'
        })
        console.log('树形结构的数据：', self.treeData)
        self.treeData = commonApi.toTree(res.data, 'id', 'superlorMenuId')
        // 获取某一角色现有的菜单数组
        self.checkTree = [] // 当前角色中选定的菜单
        roleMenu(params.id).then(resp => { // 获取数据库中现有的角色
          self.currentRoleId = params.id
        _.each(resp.data, function (v) {
          if (v.includes.menu.type === 'finally') {
            self.checkTree.push(v.includes.menu.id)
          }
          self.deleteMenuTree.push(v.includes.menu.id)
        })
        console.log('checkTree______:', self.checkTree)
        console.log('treeData______:', self.treeData)
        self.roleShow = true
      })
      })
      },
      /!**
       * 菜单分配弹窗取消按钮
       * @param params
       *!/
      roleCancle() {
        this.roleShow = false
      },
      /!**
       * 批量创建菜单
       *!/
      createMenuIds() {
        const self = this
        // 批量创建该角色新选择的角色菜单表
        var mainData = self.$refs.roleTree.getCheckedNodes(false)
        mainData = _.concat(mainData, self.$refs.roleTree.getHalfCheckedNodes())
        let createDatas = []
        _.each(mainData, function (item) {
          self.roleMenuObj = {
            roleId: '',
            menuId: ''
          }
          self.roleMenuObj.roleId = self.currentRoleId
          self.roleMenuObj.menuId = item.id
          createDatas.push(self.roleMenuObj)
        })
        createDatas = JSON.stringify(createDatas)
        roleMenuNew(createDatas).then(function (res) {
          console.log(res)
          self.roleShow = false
        })
      },
      /!**
       * 菜单分配弹窗确定按钮
       * @param params
       *!/
      roleSure() {
        const self = this
        if (self.deleteMenuTree.length === 0) {
          self.createMenuIds()
        } else {
          request('role_menus', {
            params: {
              filters: {
                'role_menu': {
                  'menuId': {
                    in: self.deleteMenuTree
                  },
                  'roleId': {
                    equalTo: self.currentRoleId
                  }
                }
              },
              pageSize: 1000,
            }
          }).then(resp => {
            const deleteIds = []
            _.each(resp.data, function (v) {
            deleteIds.push(v.id)
          })
          // 批量删除该角色之前的角色菜单表
          const deleteParams = {
            ids: JSON.stringify(deleteIds)
          }
          roleMenuAllDelete(deleteParams).then(function (res) {
            self.createMenuIds()
          })
        })
        }
      },
      /!**
       * 关闭弹窗
       *!/
      closeDialog: function () {
        this.$refs.hmComplexTable.dialogFormVisible = false // 关闭弹窗
        this.$refs.hmComplexTable.getList() // 刷新列表
      }*/
    }
  }
</script>
<style lang="scss">
  .el-table__fixed-right {
    z-index: 0;
  }
  .el-button--medium {
    padding:10px 12px;
  }
  .dialog-footer>button{
    display: inline-block;
  }
</style>

<style lang="scss">
  div.tongName {
    padding: 8px 12px 0px 12px;
  }
  .app-main {
    overflow: auto !important;
    padding-bottom: 10% !important;
  }
</style>
