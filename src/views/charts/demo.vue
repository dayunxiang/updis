<template>
  <div>
    <Tables
      :schema="schema['Role']"
      :columns='showUserColumns'
      :filters='userFilters'
      :options='userOptions'
      :userDefined="userDefined"
      ref="hmComplexTable"
    ></Tables>

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
          {name: '角色名', codeCamel: 'name', isSort: false},
          {name: '描述', codeCamel: 'description', isSort: false},
          {name: '简称', codeCamel: 'simpleName', isSort: false}
        ],
        userFilters: [
          {placeholder: '请输入角色名', name: {like: ''}, isShow: true}
        ],
        checkNode: [], // 存放选择的角色数据
        roleName: [] // 角色的全部名称
      }
    },
    components: {
      Tables: tables,
      'hm-complex-form': HmComplexForm
    },
    created() {
      this.schema = schema
      this.userOptions = {
        sortItem: 'create_time',
        sortOrder: 'desc',
        changeValue: {
          username: {1: 'Hm-isChecked', 0: 'Hm-noChecked'}
        },
        newData: {
          isShow: true,
          showUserColumns: [
            {
              name: '角色名', codeCamel: 'name', widgetType: 1,
              rule: [{required: true, message: '请输入姓名', trigger: 'blur'},
                {validator: this.validateName, trigger: 'blur'}]
            },
            {
              name: '描述', codeCamel: 'description', widgetType: 1,
              rule: {required: true, message: '请输入描述', trigger: 'blur'}
            },
            {
              name: '简称', codeCamel: 'simpleName', widgetType: 1,
              rule: {required: true, message: '请输入简称', trigger: 'blur'}
            }
          ],
          showUserButtons: [
            {type: 1, text: '确定', method: this.newSure},
            {type: 3, text: '取消', method: this.closeDialog}
          ],
          formSchema: schema['Role'],
          layout: {left: 0, middle: 24, right: 0}
        },
        editData: {
          isShow: true,
          showUserColumns: [
            {
              name: '角色名', codeCamel: 'name', widgetType: 1,
              rule: {required: true, message: '请输入姓名', trigger: 'blur'}
            },
            {
              name: '描述', codeCamel: 'description', widgetType: 1,
              rule: {required: true, message: '请输入描述', trigger: 'blur'}
            },
            {
              name: '简称', codeCamel: 'simpleName', widgetType: 1,
              rule: {required: true, message: '请输入简称', trigger: 'blur'}
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
        isShowSearch: true,
        showRefresh: false, // 刷新
        showExport: false, // 导出
        showDeleteButton: false,
        buttonGroup: false,
        showSelection: false,
        showOverflowTooltip: true
      }
      this.userDefined = {
        definedOperation: [
          {label: '删除', func: this.deleteOne},
          {label: '菜单分配', func: this.distributionMenu}
        ]
      }
      this.NameSure()
    },
    mounted() {},
    methods: {
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
       * 新建弹窗，点击确定按钮前的操作
       */
      NameSure() { // 新建的确定按钮
        const self = this
        request('roles', {
          params: {
            filters: {},
            pageSize: 10000
          }
        }).then(res => {
          self.roleName = []
        _.each(res.data, function (v) {
          self.roleName.push(v.name)
        })
      })
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
<style lang='scss' scoped>
  .uploadStyle {
    display: inline-block;
  }
</style>

