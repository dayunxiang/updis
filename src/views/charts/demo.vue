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

      <el-tab-pane label="公园绿地" name="1" algin="center">
        <Tables
          :schema="schema['Shape']"
          :columns='showUserColumns'
          :options='userOptions'
          :userDefined="userDefined"
          ref="hmComplexTable">
          <!--:filters='userFilters'-->
        </Tables>
      </el-tab-pane>

      <el-tab-pane label="道路广场" name="2" algin="center">
        <Tables
          :schema="schema['Shape']"
          :columns='showUserColumns'
          :options='userOptions'
          :userDefined="userDefined"
          ref="hmComplexTable">
          <!--:filters='userFilters'-->
        </Tables>
      </el-tab-pane>

      <el-tab-pane label="河道治理" name="3" algin="center">
        <Tables
          :schema="schema['Shape']"
          :columns='showUserColumns'
          :options='userOptions'
          :userDefined="userDefined"
          ref="hmComplexTable">
          <!--:filters='userFilters'-->
        </Tables>
      </el-tab-pane>

      <el-tab-pane label="涉水基础设施" name="4" algin="center">
        <Tables
          :schema="schema['Shape']"
          :columns='showUserColumns'
          :options='userOptions'
          :userDefined="userDefined"
          ref="hmComplexTable">
          <!--:filters='userFilters'-->
        </Tables>
      </el-tab-pane>

      <el-tab-pane label="PPP项目" name="5" algin="center">
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

    <el-dialog title="菜单分配" :visible.sync="roleShow" :show-close='true' v-if="roleShow">
      <el-tree :data='treeData'
               :props='props'
               show-checkbox
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys='checkTree'
               ref='roleTree'>
      </el-tree>
      <span slot="footer" class="dialog-footer">
            <el-button @click="roleCancle">取 消</el-button>
            <el-button type="primary" @click="roleSure">确 定</el-button>
        </span>
    </el-dialog>
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
        dataInit: [],   //获取块儿数据
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
          {name: '地块编号', codeCamel: 'name', isSort: false},
          {name: '用地类型', codeCamel: 'YDLX', isSort: false},
          {name: '建设状态', codeCamel: 'JSZT', isSort: false},
          {name: '项目名称', codeCamel: 'XMMC', isSort: false},
          {name: '海绵类型', codeCamel: 'HMLX', isSort: false},
          {name: '排入河道', codeCamel: 'PRHD', isSort: false},
          {name: '所属流域', codeCamel: 'SSLY', isSort: false},
          {name: '所属排水分区', codeCamel: 'SSPSFQ', isSort: false},
          {name: '是否为正本清源项目', codeCamel: 'ZBQY', isSort: false},
          {name: '海绵建设情况', codeCamel: 'JSQK', isSort: false},
          {name: '年径流总量控制率', codeCamel: 'ZLKZL', isSort: false}
        ],
        /*userFilters: [
          {placeholder: '请输入角色名', name: {like: ''}, isShow: true}
        ],*/
        checkNode: [], // 存放选择的角色数据
        roleName: [] // 角色的全部名称
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
        sortOrder: 'desc',
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
          formSchema: schema['Role'],
          layout: {left: 0, middle: 24, right: 0}
        }, //新建按钮
        editData: {
          isShow: true,
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
            }
          ],
          showUserButtons: [
            {type: 1, text: '确定', method: this.closeDialog},
            {type: 3, text: '取消', method: this.closeDialog}
          ],
          formSchema: schema['Role'],
          layout: {left: 0, middle: 24, right: 0}
        },
        cellStyle: {},
        tableStyle: {width: '100%'},
        isShowPagination: true,
        isShowSearch: false,
        showRefresh: false, // 刷新
        showExport: false, // 导出
        showDeleteButton: false,
        buttonGroup: false,
        showSelection: false,
        showOverflowTooltip: true,
        useTableTotal:true,
        promiseProcessing(value, params, definedOperate) { // 处理返回后的数据,必须return Promise对象
          const data = new Promise(function(resolve,req) {
            request('shapes', {
              params: {
                filters: {
                  'shape': {
                    'category': {
                      equalTo: "SUBCATCHMENTS"
                    },
                    'projectId': {
                      equalTo: '4'
                    }
                  },
                },
                pageNo: params.pageNo,
                sortItem: params.sortItem,
                pageSize: params.pageSize, //
                sortOrder: params.sortOrder,
              }
            }).then(res => {
              console.log("res.data: " ,res.data);
              let showData = [];
              let i = 0;
              _.each(res.data, function (v) {
                var n = v ;
                console.log(n);
                var testInit = (JSON.parse(v.properties)).properties
                var letter = (testInit.YDLX).substr(0, 1);    // 截取字符首字母
                //console.log("v: ", testInit)
                debugger
                if( testInit.YDLX === "道路" || letter === "S" ) {
                  showData[i] = v;
                  showData[i]['name'] = testInit.name;
                  showData[i]['YDLX'] = testInit.YDLX;
                  showData[i]['JSZT'] = testInit.JSZT;
                  showData[i]['XMMC'] = testInit.XMMC;
                  showData[i]['HMLX'] = testInit.HMLX;
                  showData[i]['PRHD'] = testInit.PRHD;
                  showData[i]['SSLY'] = testInit.SSLY;
                  showData[i]['SSPSFQ'] = testInit.SSPSFQ;
                  showData[i]['ZBQY'] = testInit.ZBQY;
                  /**
                   * 判断海绵建设情况
                   */
                  if( testInit.JSZT === "现状" && testInit.HMCS === "已落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "现状" && testInit.HMCS === "未落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "现状" && testInit.HMCS === null ) {
                    showData[i]['JSQK'] = testInit.JSZT + '';
                  }
                  if( testInit.JSZT === "在建" && testInit.HMCS === "已落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "在建" && testInit.HMCS === "未落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "在建" && testInit.HMCS === null ) {
                    showData[i]['JSQK'] = testInit.JSZT + '';
                  }
                  if( testInit.JSZT === "规划" && testInit.HMCS === "已落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "规划" && testInit.HMCS === "未落实海绵" ) {
                    showData[i]['JSQK'] = testInit.JSZT + testInit.HMCS;
                  }
                  if( testInit.JSZT === "规划" && testInit.HMCS === null ) {
                    showData[i]['JSQK'] = testInit.JSZT + '';
                  }
                  i++ ;
                }

              })
              self.$refs.hmComplexTable.total = i ;
              resolve(showData)
            })
          })
          return data
        }
      }
      this.userDefined = {
        definedOperation: [
          {label: '删除', func: this.deleteOne}
          /*{label: '菜单分配', func: this.distributionMenu}*/
        ]
      }
      this.NameSure()
    },
    mounted() {

    },
    methods: {
      /* 点击标签页 */
      handleClick(tab, event, res) {
        /*console.log(tab, event);*/
        const self = this;
        if(tab.index === 1) {}
        console.log("位置: ", tab.index);
      },
      /**
       * 起始数据
       */
      NameSure() {
        const self = this;
        request('shapes', {
          params: {
            pageSize: 100,
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
        }).then(res => {
          self.roleName = [];
        _.each(res.data, function (v) {
          var testInit = JSON.parse(v.properties);
          self.roleName.push(testInit.properties.name)
          // self.dataInit.push(testInit)
        });
        // console.log("起始数据2: ", self.roleName);
        })
      },








      /**
       * 新建的确认按钮
       */
      newSure: function() {
        const self = this
        self.NameSure()
        self.$refs.hmComplexTable.dialogFormVisible = false // 关闭弹窗
        self.closeDialog()
      },
      /**
       * 验证密码
       */
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
      /**
       * 删除单条角色数据
       * @param params
       */
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
      /**
       * 菜单分配弹窗数据显示
       * @param params
       */
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
      /**
       * 菜单分配弹窗取消按钮
       * @param params
       */
      roleCancle() {
        this.roleShow = false
      },
      /**
       * 批量创建菜单
       */
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
      /**
       * 菜单分配弹窗确定按钮
       * @param params
       */
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
      /**
       * 关闭弹窗
       */
      closeDialog: function () {
        this.$refs.hmComplexTable.dialogFormVisible = false // 关闭弹窗
        this.$refs.hmComplexTable.getList() // 刷新列表
      }
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
