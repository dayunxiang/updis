<template>
  <!--部门管理-->
  <div class="app-container documentation-container departemt">
    <div class="flex">
      <div class="organization">
        <div class="organization-title">
          组织架构
          <el-button v-if="isSuper === 1" style="display: inline-block;vertical-align: middle;margin-bottom: 10px;" type="primary" v-waves icon="el-icon-plus" @click="showAddDepartmentDialog('company')">新建公司</el-button>
        </div>
        <div class="organization-tree">
          <el-tree :data="departmentTree" :props="defaultProps" :highlight-current="true" :check-on-click-node="true"
                   @node-click="handleNodeClick" draggable node-key="id" @node-drag-end="handleDragEnd" ref="departmentTreeRef"></el-tree>
        </div>
      </div>
      <div class="flex-1">
        <el-tabs v-model="activeName">
          <!--组织架构-->
          <el-tab-pane label="部门设置" name="organizationalStructure">
            <div class="organization-select">
              <div class="btn-title" v-show="isDepSet">
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="showAddDepartmentDialog">创建部门
                </el-button>
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-close" @click="delDepartmentId">删除
                </el-button>
              </div>
              <hm-complex-form :schema="schema['Department']" :columns="showFormColumns"
                               :buttons="showFormButtons" :funObject="depSetFormFun"
                               :tips="tips" :tableId="selectedDepartment.id" ref="hmComplexForm">
              </hm-complex-form>
            </div>
          </el-tab-pane>
          <!--员工信息组件-->
          <el-tab-pane label="员工管理" name="personnelManage">
            <Tables :schema="schema['HmUser']" :columns='showUserColumns'
                    :includes='userIncludes' :options='userOptions' :userDefined="userDefined"
                    ref="hmComplexTable"></Tables>
          </el-tab-pane>
          <!--部门类型-->
          <el-tab-pane label="部门类型" name="departmentType" v-if="isShowDepType">
            <div class="departmentTypeStyle">
              <department-type headerText="部门类型" :items="departmentTypes" @editItems = 'getEditItems'></department-type>
              <div slot="footer" class="departemt dialog-footer" style="margin-top: 20px;">
                <el-button class="footBtn" type="primary" @click="selectDepartmentType()">保 存</el-button>
                <el-button class="footBtn" type="primary" style="margin-left: 60px;" @click="showDepartmentType">取 消</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--添加公司或部门-->
    <el-dialog title="创建公司" :visible.sync="adminShowCom" :show-close='true' v-show="adminShowCom">
      <hm-complex-form :schema="schema['Department']" :columns="newFormColumns" :buttons="newFormButtons"
                       :tips="newTips" ref="newDepartmentForm">
      </hm-complex-form>
    </el-dialog>
    <el-dialog title="创建部门" :visible.sync="adminShowDep" :show-close='true' v-show="adminShowDep">
      <hm-complex-form :schema="schema['Department']" :columns="newFormColumns1" :buttons="newFormButtons"
                       :tips="newTips" ref="newDepartmentForm">
      </hm-complex-form>
    </el-dialog>
    <!--设置主管-->
    <el-dialog title="设置主管" :visible.sync="adminTypeShow" width="500px" v-if="adminTypeShow">
      <div class="div_top">
        <div class="div_paidan">
          <span>主管:</span>
        </div>
        <el-select v-model="valueUser" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.username"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="departemt dialog-footer">
        <el-button class="footBtn" @click="adminTypeShow = false">取 消</el-button>
        <el-button class="footBtn" type="primary" @click="saveAdminType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tables from '../haomo/components/tables/HmComplexTable.vue'
  import HmComplexForm from '../haomo/components/forms/HmComplexForm.vue'
  import schema from '../haomo/schemas/hm_org_schema'
  import waves from '@/directive/waves' // 水波纹指令
  import DndList from '@/components/DndList'
  import DepartmentTypeKanban from '@/components/DepartmentTypeKanban'
  import { departments } from '../../api/department'
  import request from '@/utils/request'
  import commonApi from '@/api/commonApi'
  import { Loading } from 'element-ui'
  import _ from 'lodash'

  import { toTree } from '@/utils/util'

  export default {
    data() {
      return {
        hmDicts: [], // 存储后台字典定义
        userRoles: [],  // 当前用户的角色
        selectedDepartmentType: null, // 部门类型的默认值
        isDepSet: false, // 是否显示部门设置中的顶部按钮
        newDepType: '', // 新建部门的类型
        isSuper: 1, // 登录角色  1:是超级管理员 2:不是超级管理员
        adminTypeShow: false, // 设置主管
        options1: [], // 设置主管的人员信息
        valueUser: '', // 转单弹窗中页面上绑定的转单对象字段
        departmentTypesDict: {}, // 部门类型字典
        userInfo: '', // 登录人的信息
        activeName: 'organizationalStructure', // tab页显示哪个
        departmentLists: [], // 加载的所有部门数据
        departmentTree: [], // 要显示的树形结构的数据
        defaultProps: { // 树形结构的数据渲染规则
          children: 'children',
          label: 'name',
          value: 'id'
        },
        selectedDepartment: {}, // 选择的部门信息
        adminShowCom: false, // 是否显示添加公司的弹窗
        adminShowDep: false, // 是否显示添加部门弹窗
        showFormColumns: [ // 右侧表单显示字段
          { name: '部门编码', codeCamel: 'code', widgetType: 1,
            rule: { required: true, message: '请输入部门编码', trigger: 'blur' }},
          { name: '部门名称 ', codeCamel: 'name', widgetType: 1, default: '',
            rule: { required: true, message: '请输入部门名称 ', trigger: 'blur' }},
          { name: '部门简称', codeCamel: 'simpleName', widgetType: 1
          },
          { name: '部门类型', codeCamel: 'departmentType', widgetType: 1, disabled: true
          },
          { name: '地址', codeCamel: 'address', widgetType: 1
          },
          { name: '部门电话', codeCamel: 'depPhone', widgetType: 1,
            rule: [
              { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的部门电话', trigger: 'change,blur' }]
          }
        ],
        showFormButtons: [{ // 部门设置的表单按钮
          text: '保存',
          method: this.sure
        }
        ],
        newFormButtons: [ // 添加部门的按钮
          { text: '保存', method: this.saveDep },
          { type: 2, text: '取消', method: this.cancle}],
        tips: {
          hidde: false,
          editSuccess: { text: '编辑成功' }, // 编辑成功的提示
          editError: { text: '编辑失败' } // 编辑失败的提示

        },
        newFormColumns: [ // 添加公司的表单字段
          { name: '部门编码', codeCamel: 'code', widgetType: 1,
            rule: { required: true, message: '请输入部门编码', trigger: 'blur' }
          },
          { name: '部门名称 ', codeCamel: 'name', widgetType: 1, default: '',
            rule: { required: true, message: '请输入部门名称 ', trigger: 'blur' }
          },
          { name: '部门简称', codeCamel: 'simpleName', widgetType: 1
          },
          { name: '部门电话', codeCamel: 'depPhone', widgetType: 1,
            rule: [
              { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的部门电话', trigger: 'change,blur' }]
          },
          {
            name: '地址', codeCamel: 'description', widgetType: 1
          }
        ],
        newFormColumns1: [ // 添加部门的表单字段
          { name: '部门编码', codeCamel: 'code', widgetType: 1,
            rule: { required: true, message: '请输入部门编码', trigger: 'blur' }
          },
          { name: '部门名称 ', codeCamel: 'name', widgetType: 1, default: '',
            rule: { required: true, message: '请输入部门名称 ', trigger: 'blur' }
          },
          { name: '部门简称', codeCamel: 'simpleName', widgetType: 1
          },
          { name: '部门电话', codeCamel: 'depPhone', widgetType: 1,
            rule: [
              { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的部门电话', trigger: 'change,blur' }]
          },
          {
            name: '描述', codeCamel: 'description', widgetType: 1
          },
          { name: '营业时间', codeCamel: 'depTime', widgetType: 1, hide: true
          }
        ],
        newTips: {
          hidde: false, // 是否显示提示，默认false显示
          newSuccess: { text: '创建成功' } // 新建成功的提示
        },
        showUserColumns: [ // 员工管理的表单字段
          { name: '公司', codeCamel: 'topDepartmentname', isSort: false },
          { name: '部门', codeCamel: 'departmentname', isSort: false },
          { name: '用户姓名', codeCamel: 'username', isSort: false },
          { name: '电话', codeCamel: 'mobile', isSort: false },
          { name: '年龄', codeCamel: 'age', isSort: false },
          { name: '性别', codeCamel: 'sex', isSort: false },
          { name: '身份证', codeCamel: 'IDNumber', isSort: false },
          { name: '地址', codeCamel: 'address', isSort: false },
          { name: '籍贯', codeCamel: 'nativePlace', isSort: false },
          { name: '社保', codeCamel: 'codeCamel', isSort: false },
          { name: '邮箱', codeCamel: 'email', isSort: false },
          { name: '在职状态', codeCamel: 'jobStatus', isSort: false }
        ],
        userIncludes: { // 员工管理的表联查信息
          'department': {
            includes: ['department_id']
          },
          'role': {
            includes: ['role_id']
          }
        },
        isShowDepType: false, // 是否展示部门类型tab页
        departmentTypes: [],
        editItems: [], // 部门类型修改后的value值
        depSetFormFun: {
          beforeRender: this.depSetBefore
        }
      }
    },
    components: {
      Tables: tables,
      'hm-complex-form': HmComplexForm,
      'dnd-list': DndList,
      'department-type': DepartmentTypeKanban
    },
    directives: {
      waves,
      Loading
    },
    // 放置方法的地方
    methods: {
      /**
       * 加载字典表
       */
      getHmDicts() {
        return request('hm_dicts',{
          params: {
            pageSize: 10000
          }
        })
      },

      /**
       * 获取当前用户的角色清单
       */
      getCurrentUserRoles(userId) {
        return request('user_roles', {
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          params: {
            filters: {
              user_role: {
                user_id: {
                  equalTo:userId
                }
              }
            },
            includes: {
              role: {
                includes: ['role_id']
              }
            }
          }
        })
      },

      /**
       * 加载部门清单
       */
      loadDepartments() {
        let self = this
        // 当为超级管理员时，加载所有部门；当为管理员时，加载对应公司的管理部门
        let requestDepartment = null
        if(self.userRoles && _.map(self.userRoles, 'name').indexOf('superAdmin') >= 0){
          requestDepartment = request('departments', {
            method: 'GET',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            params: {
              pageNo: 1,
              pageSize: 10000
            }
          })
          self.isSuper = 1
        }else if(self.userRoles && (_.map(self.userRoles, 'name').indexOf('admin') >= 0 ||
            _.map(self.userRoles, 'name').indexOf('middleAdmin') >= 0)) {
          requestDepartment = request('getChildrenDepartments', {
            method: 'GET',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            params: {
              departmentId: self.userInfo.includes.hm_user.departmentId
            }
          })
          self.isSuper = 2
        }

        if(!requestDepartment) {
          // console.warn('只有超级管理员、中级管理员或者管理员才能查看部门！')
          return -1
        }

        // 加载部门信息
        requestDepartment.then(resp => {
          // 角色管理
          request('roles', {
            params: {
              filters: {
                'role': {
                  id: {}
                }
              }
            }
          }).then(reps => {
            self.departmentLists = _.sortBy(resp.data, 'name')
            self.departmentTree = toTree(self.departmentLists, 'parentDepartmentId')
            if (self.isSuper === 1) {
              _.each(reps.data, function(k) {
                self.userOptions.newData.showUserColumns[4].options.push({ 'value': k.id, 'label': k.name })
                self.userOptions.editData.showUserColumns[4].options.push({ 'value': k.id, 'label': k.name })
              })
            } else if (self.isSuper === 2) {
              _.each(reps.data, function(k, index) {
                if (k.name !== 'superAdmin') {
                  self.userOptions.newData.showUserColumns[4].options.push({ 'value': k.id, 'label': k.name })
                  self.userOptions.editData.showUserColumns[4].options.push({ 'value': k.id, 'label': k.name })
                }
              })
            }
          })
        })
      },

      /**
       * 员工新建的确认按钮
       */
      PeopleNewSure(data) {
        const self = this
        if (self.isDepSet) {
          self.$refs.hmComplexTable.$refs.hmComplexForm.$refs.form.validate((valid) => {
            if (valid) {
              const paramsNew = {
                departmentId: self.selectedDepartment.id,
                username: data.username,
                loginid: data.loginid,
                password: data.password,
                mobile: data.mobile,
                email: data.email,
                params: JSON.stringify({ 'age': data.age, 'sex': data.sex, 'IDNumber': data.IDNumber, 'address': data.address, 'nativePlace': data.nativePlace, 'codeCamel': data.codeCamel }),
                jobStatus: 0,
                type: 1
              }
              commonApi.create('hm_users', paramsNew).then(function(resUser) {
                if (resUser.data.message === '账号已存在') {
                  self.$message({
                    message: '该账号已存在',
                    type: 'warning'
                  })
                } else {
                  if (data.roleIds.length > 0) {
                    _.each(data.roleIds, function(v) {
                      commonApi.create('user_roles', {
                        roleId: v,
                        userId: resUser.data.id
                      }).then(function(res) {
                        self.closeDialog()
                      })
                    })
                  } else {
                    self.closeDialog()
                  }
                }
              })
            } else {
              self.$message({
                message: '验证未通过',
                type: 'error'
              })
              return false
            }
          })
        } else {
          self.$message({
            message: '请选择部门',
            type: 'warning'
          })
        }
      },
      /**
       * 员工编辑前的数据渲染
       */
      PeopleBeforeEdit(data, formModel) {
        const self = this
        request('user_roles', {
          params: {
            filters: {
              user_role: {
                user_id: {
                  equalTo: data[0].id
                }
              }
            }
          }
        }).then(res => {
          let roleIds = []
          if (res.data.length > 0) {
            _.each(res.data, function(v) {
              roleIds.push(v.roleId)
            })
          }
          if(data[0].params) {
            const parmas = JSON.parse(data[0].params)
            self.$set(formModel, 'age', parmas.age)
            self.$set(formModel, 'sex', parmas.sex)
            self.$set(formModel, 'IDNumber', parmas.IDNumber)
            self.$set(formModel, 'address', parmas.address)
            self.$set(formModel, 'nativePlace', parmas.nativePlace)
            self.$set(formModel, 'codeCamel', parmas.codeCamel)
          }
          self.$set(formModel, 'roleIds', roleIds)
          self.$set(formModel, 'id', data[0].id)
        })
        return formModel
      },
      /**
       * 员工编辑的确认按钮
       */
      PeopleEditSure(data) {
        const self = this
        self.$refs.hmComplexTable.$refs.hmComplexForm.$refs.form.validate((valid) => {
          if (valid) {
            const paramsNew = {
              username: data.username,
              password: data.password,
              mobile: data.mobile,
              email: data.email,
              params: JSON.stringify({ 'age': data.age, 'sex': data.sex, 'IDNumber': data.IDNumber, 'address': data.address, 'nativePlace': data.nativePlace, 'codeCamel': data.codeCamel }),
              type: 1
            }
            commonApi.edit('hm_users', data.id, paramsNew).then(function(resUser) {
              request('user_roles', {
                params: {
                  filters: {
                    'user_role': {
                      user_id: {
                        equalTo: data.id
                      }
                    }
                  }
                }
              }).then(resp => {
                if (resp.data.length > 0) {
                  const deletOptionId = { ids: [] }
                  _.each(resp.data, function(v) {
                    deletOptionId.ids.push(v.id)
                  })
                  request.post('user_roles/delete/batch?ids=' + encodeURIComponent(JSON.stringify(deletOptionId.ids)), {
                    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
                  }).then(resp => {
                    if (data.roleIds.length > 0) {
                      _.each(data.roleIds, function(v) {
                        commonApi.create('user_roles', {
                          roleId: v,
                          userId: data.id
                        }).then(function(res) {
                          self.$message({
                            message: '编辑成功',
                            type: 'success'
                          })
                          self.closeDialog()
                        })
                      })
                    } else {
                      self.$message({
                        message: '编辑成功',
                        type: 'success'
                      })
                      self.closeDialog()
                    }
                  })
                } else {
                  if (data.roleIds.length > 0) {
                    _.each(data.roleIds, function(v) {
                      commonApi.create('user_roles', {
                        roleId: v,
                        userId: data.id
                      }).then(function(res) {
                        // console.log(res.data)
                        self.$message({
                          message: '编辑成功',
                          type: 'success'
                        })
                        self.closeDialog()
                      })
                    })
                  } else {
                    self.$message({
                      message: '编辑成功',
                      type: 'success'
                    })
                    self.closeDialog()
                  }
                }
              })
            })
          } else {
            self.$message({
              message: '验证未通过',
              type: 'error'
            })
            return false
          }
        })
      },
      /**
       * 设置主管按钮
       */
      setAdmin() {
        const self = this
        self.adminTypeShow = true
        self.valueUser = ''
        if (self.selectedDepartment.id) {
          request('hm_users', {
            params: {
              filters: {
                'hm_user': {
                  department_id: {
                    equalTo: self.selectedDepartment.id
                  }
                }
              }
            }
          }).then(reps => {
            self.options1 = reps.data
            self.valueUser = self.selectedDepartment.supervisor === '{}' ? '' : self.selectedDepartment.supervisor
          })
        }
      },
      // 保存设置主管
      saveAdminType() {
        const self = this
        request({
          url: '/departments/' + self.selectedDepartment.id + '/edit',
          method: 'POST',
          params: {
            supervisor: self.valueUser
          }
        }).then(resp => {
          self.selectedDepartment = resp.data
          self.$message({
            message: '主管设置成功',
            type: 'success'
          })
          self.adminTypeShow = false
        })
      },
      /**
       * 点击树形节点
       */
      handleNodeClick(data) {
        const self = this
        request('departments', {
          params: {
            filters: {
              'department': {
                'id': {
                  equalTo: _.trim(data.id, '_')
                }
              }
            }
          }
        }).then(resp => {
          self.isDepSet = true
          self.selectedDepartment = resp.data[0]
          if (resp.data[0].parentDepartmentId) {
            // console.log('不是公司')
            self.isShowDepType = false
          } else {
            // console.log('是公司')
            self.isShowDepType = true
            self.showDepartmentType()
          }
          request('get/TopDepartment', {
            params: {
              deartmentId: _.trim(data.id, '_')
            }
          }).then(resp => {
            request('hm_dicts', {
              params: {
                filters: {
                  'hm_dict': {
                    'key': {
                      equalTo: resp.data.id
                    }
                  }
                }
              }
            }).then(respDic => {
              if (respDic.data[0].value.length > 0) {
                _.each(_.words(respDic.data[0].value, /[^,]+/g), function(v, index) {
                  if(_.trim(_.trim(v, '[]'), '\"') === data.departmentType ) {
                    self.newDepType = _.trim(_.trim(_.words(respDic.data[0].value, /[^,]+/g)[index + 1], '[]'), '\"')
                  }
                })
              }
            })
          })
          const interval = setInterval(() => {
            if (self.$refs.paramsForm) {
              clearInterval(interval)
              self.$refs.paramsForm.getList()
            }
          }, 10)
          self.$refs.hmComplexTable.getList()
        })
      },
      /**
       * 部门设置中表单数据的渲染(拖拽结束后的回调)
       */
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        const self = this
        if (dropType === 'none') {
          return false
        }
        if (draggingNode.parent == null) {
          draggingNode.data.parentDepartmentId = ''
        }
        if (dropType === 'inner') {
          draggingNode.data.parentDepartmentId = _.trim(dropNode.data.id, '_')
        }
        commonApi.edit('departments', _.trim(draggingNode.data.id, '_'), draggingNode.data).then(function(res) {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      },
      /**
       * 部门设置中的删除按钮
       */
      delDepartmentId() {
        const self = this
        this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request('delete_department', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            params: {
              departmentId: self.selectedDepartment.id
            }
          }).then(resp =>{
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            // 刷新树形结构
            self.loadDepartments()
          })
        }).catch(() => {
          self.$message({
            message: '已取消删除',
            type: 'success'
          })
        })
      },
      /**
       * 部门设置表单编辑前数据的渲染
       */
      depSetBefore(data, formModel) {
        const self = this
        console.log(data,formModel)
        formModel.id = data[0].id
        if (!formModel.simpleName || formModel.simpleName === 'undefined') {
          formModel.simpleName = ''
        }
        if (JSON.parse(data[0].params)) {
          JSON.parse(data[0].params).depPhone ? formModel.depPhone = JSON.parse(data[0].params).depPhone : formModel.depPhone = ''
          JSON.parse(data[0].params).depTime ? formModel.depTime = JSON.parse(data[0].params).depTime : formModel.depTime = ''
          JSON.parse(data[0].params).address ? formModel.address = JSON.parse(data[0].params).address : formModel.address = ''
        } else {
          formModel.depPhone = ''
          formModel.depTime = ''
          formModel.address = ''
        }
        return formModel
      },
      /**
       * 显示新增部门
       */
      showAddDepartmentDialog: function(value) {
        const self = this
        if (value === 'company') {
          self.adminShowCom = true
        } else {
          self.adminShowDep = true
        }
        setTimeout(() => {
          self.$refs.newDepartmentForm.formModel = {}
          if (value === 'company') {
            self.$refs.newDepartmentForm.formModel.parentDepartmentId = null
            self.$refs.newDepartmentForm.formModel.departmentType = '公司'
          } else {
            self.$refs.newDepartmentForm.formModel.parentDepartmentId = self.selectedDepartment.id
            self.$refs.newDepartmentForm.formModel.departmentType = self.newDepType
          }
        }, 300)
      },
      /**
       * 创建部门取消按钮
       */
      cancle: function() {
        const self = this
        self.adminShowCom = false
        self.adminShowDep = false
      },
      /**
       * 编辑部门
       */
      sure: function(data) {
        const self = this
        self.$refs.hmComplexForm.$refs.form.validate((valid) => {
          if (valid) {
            request('departments', {
              params: {
                filters: {
                  'department': {
                    'code': {
                      equalTo: data.code
                    },
                    'id': {
                      notEqualTo: self.selectedDepartment.id
                    }
                  }
                }
              }
            }).then(resp => {
              console.log(resp.data)
              if (resp.data.length > 0) {
                self.$message({
                  message: '部门编码重复，请重新输入！',
                  type: 'error'
                })
                return false
              } else {
                console.log("部门编码不重复")
                const paramsNew = {
                  code: data.code,
                  name: data.name,
                  simpleName: data.simpleName,
                  params: JSON.stringify({ 'depPhone': data.depPhone, 'depTime': data.depTime, 'address': data.address }),
                }
                commonApi.edit('departments', data.id, paramsNew).then(function(resUser) {
                  self.loadDepartments()
                })
              }
            })
          } else {
            self.$message({
              message: '验证未通过',
              type: 'error'
            })
            return false
          }
        })
      },
      /**
       * 创建部门
       */
      saveDep: function(data) {
        const self = this
        self.$refs.newDepartmentForm.$refs.form.validate((valid) => {
          if (valid) {
            request('departments', {
              params: {
                filters: {
                  'department': {
                    'code': {
                      equalTo: data.code
                    },
                    'id': {
                      notEqualTo: self.selectedDepartment.id
                    }
                  }
                }
              }
            }).then(resp => {
              console.log(resp.data)
              if (resp.data.length > 0) {
                self.$message({
                  message: '部门编码重复，请重新输入！',
                  type: 'error'
                })
                return false
              } else {
                console.log("部门编码不重复")
                commonApi.create('departments', {
                  parentDepartmentId: data.parentDepartmentId,
                  departmentType: data.departmentType,
                  code: data.code,
                  name: data.name,
                  simpleName: data.simpleName,
                  params: JSON.stringify({'depPhone': data.depPhone, 'depTime': data.depTime, 'address': data.address})
                }).then(function (res) {
                  if (self.adminShowCom === true) { // 创建的是公司
                    commonApi.create('hm_dicts', {
                      type: '部门类型',
                      key: res.data.id,
                      value: JSON.stringify(['公司'])
                    }).then(function (resDic) {
                      self.adminShowCom = false
                    })
                  }
                  self.adminShowDep = false
                  // 刷新树形结构
                  console.log('self.departmentLists:', self.departmentLists)
                  self.departmentLists.push(res.data)
                  self.departmentTree = toTree(self.departmentLists, 'parentDepartmentId')
                  self.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                })
              }
            })
          }else {
            self.$message({
              message: '验证未通过',
              type: 'error'
            })
            return false
          }
        })
      },
      /**
       * 关闭弹窗
       */
      closeDialog: function() {
        this.$refs.hmComplexTable.dialogFormVisible = false // 关闭弹窗
        this.$refs.hmComplexTable.getList() // 刷新列表
      },
      /**
       * 导入
       */
      uploadSucc(data) {
        const self = this
        console.log('导入成功',data)
        if (data["员工"].length > 0 && data["部门"].length === 0) {
          self.$message({
            message: '部分人员导入失败!',
            type: 'warning'
          })
        } else if(data["部门"].length > 0 && data["员工"].length === 0) {
          self.$message({
            message: '部分部门导入失败!',
            type: 'warning'
          })
        } else if(data["员工"].length > 0 && data["部门"].length > 0) {
          self.$message({
            message: '部分人员和部门导入失败!',
            type: 'warning'
          })
        } else {
          self.$message({
            message: '导入成功',
            type: 'success'
          })
        }
        self.$refs.hmComplexTable.$refs.upload[0].clearFiles()
        self.loadDepartments()
      },
      /**
       * 导出
       */
      export1: function() {
        const self = this
        console.log('导出')
        window.open(request.defaults.baseURL + '/export_people?filters=' + encodeURIComponent(JSON.stringify(self.exportParams)) + '&pageSize=9999&pageNo=1&sortItem=create_time&sortOrder=desc&fields=' + encodeURIComponent(JSON.stringify(
          {"username":"用户姓名","mobile":"电话","age":"年龄","sex":"性别","IDNumber":"身份证","address":"地址","nativePlace":"籍贯","codeCamel":"社保","email":"邮箱",'在职状态':"jobStatus"})) + '&fileName=部门管理-员工表')
      },
      /**
       * 全部删除员工
       */
      delAllUsers: function() {
        const self = this
        const params = {
          pageNo: 1,
          pageSize: 10000,
          sortItem: 'create_time',
          sortOrder: 'desc'
        }
        if (this.selectedDepartment.id != null) {
          params.filters = { 'hm_user': { 'department_id': { 'like': this.selectedDepartment.id }}}
        }
        self.$confirm('该删除信息中存在关联信息，是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            commonApi.getAll('hm_users', params).then((res) => {
              const allUsers = res.data
              const ids = []
              _.each(allUsers, function(v) {
                ids.push(v.id)
              })
              commonApi.batchDelete('hm_users', ids).then((res) => {
                self.$message({
                  message: '全部删除成功',
                  type: 'success'
                })
                self.$refs.hmComplexTable.getList() // 刷新列表
              })
            })
          }).catch(() => {
            self.$message({
              message: '已取消删除',
              type: 'success'
            })
          })
        }).catch(() => {
          self.$message({
            message: '已取消删除',
            type: 'success'
          })
        })
      },
      /**
       *启用/禁用员工
       */
      handleCommand: function(status) {
        const multipleSelection = this.$refs.hmComplexTable.multipleSelection
        var message
        if (status === 0) {
          message = '启用'
        } else {
          message = '禁用'
        }
        const slef = this
        this.$confirm(`确定${message}用户, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _.each(multipleSelection, function(item) {
            item.jobStatus = status
            commonApi.edit('hm_users', item.id, item).then((res) => {
              slef.$message({
                message: `${message}成功`,
                type: 'success'
              })
              slef.$refs.hmComplexTable.getList() // 刷新列表
            })
          })
        }).catch(() => {
          this.$message({
            message: '已取消操作',
            type: 'success'
          })
        })
      },

      /**
       * 部门类型
       */
      showDepartmentType() {
        const self = this
        self.getHmDicts().then(function (res) {
          self.hmDicts = res.data
          const showTypes = _.filter(self.hmDicts, item => {
            return item.type === '部门类型' && item.key === self.selectedDepartment.id
          })
          if (showTypes.length === 0) {
            self.departmentTypes = ['公司']
          } else {
            self.departmentTypes = []
            _.each(_.words(showTypes[0].value, /[^,]+/g), function(v) {
              self.departmentTypes.push(_.trim(_.trim(v, '[]'), '\"'))
            })
          }
        })
      },
      /**
       * 部门类型弹出框确定
       */
      getEditItems(data) {
        const self = this
        self.editItems = data
      },
      selectDepartmentType() {
        const self = this
        request('hm_dicts', {
          params: {
            filters: {
              hm_dict: {
                type: {
                  equalTo: '部门类型'
                },
                key: {
                  equalTo: self.selectedDepartment.id
                }
              }
            }
          }
        }).then(resp => {
          if (resp.data.length > 0) {
            commonApi.edit('hm_dicts', resp.data[0].id, {
              value: JSON.stringify(self.editItems)
            }).then(res => {
              self.$message({
                message: '保存成功',
                type: 'success'
              })
            })
          } else {
            commonApi.create('hm_dicts', {
              type: '部门类型',
              key: self.selectedDepartment.id,
              value: JSON.stringify(self.editItems)
            }).then(function(res) {
              self.$message({
                message: '保存成功',
                type: 'success'
              })
            })
          }
        })
      },
    },
    created() {
      const self = this
      this.schema = schema
      this.userOptions = { // 员工管理的表格
        pageSize: 10,
        sortItem: 'create_time',
        sortOrder: 'desc',
        changeValue: {
          jobStatus: { 1: '离职', 0: '在职' },
          sex: { 1: '男', 2: '女' }
        },
        newData: { // 新建
          isShow: true,
          showUserColumns: [
            { name: '用户姓名', codeCamel: 'username', widgetType: 1,
              rule: { required: true, message: '请输入用户姓名', trigger: 'blur' }
            },
            { name: '登录账号', codeCamel: 'loginid', widgetType: 1,
              rule: { required: true, message: '请输入登录账号', trigger: 'blur' }
            },
            { name: '密码', codeCamel: 'password', widgetType: 11,
              rule: { required: true, message: '请输入密码', trigger: 'blur' }
            },
            { name: '电话', codeCamel: 'mobile', widgetType: 1,
              rule: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
                { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的电话号码', trigger: 'change,blur' }
              ]
            },
            { name: '角色', codeCamel: 'roleIds', widgetType: 2, options: [], multiple: true
            },
            { name: '年龄', codeCamel: 'age', widgetType: 1,
              rule: [
                { pattern: /^\d+$/, message: '请输入正确的年龄', trigger: 'change,blur' }]
            },
            { name: '性别', codeCamel: 'sex', widgetType: 2,
              options: [{ value: '1', label: '男' }, { value: '2', label: '女' }],
              multiple: false
            },
            { name: '身份证', codeCamel: 'IDNumber', widgetType: 1,
              rule: [
                { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'change,blur' }]
            },
            { name: '地址', codeCamel: 'address', widgetType: 1
            },
            { name: '籍贯', codeCamel: 'nativePlace', widgetType: 1
            },
            { name: '社保', codeCamel: 'codeCamel', widgetType: 1,
              rule: [
                { pattern: /^\d{18}$/, message: '请输入正确的社保号', trigger: 'change,blur' }]
            },
            { name: '邮箱', codeCamel: 'email', widgetType: 1,
              rule: [
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
              ]
            }
          ],
          showUserButtons: [
            { text: '确定', method: this.PeopleNewSure },
            { type: 3, text: '取消', method: this.closeDialog }
          ],
          formSchema: schema['HmUser'],
          layout: { left: 0, middle: 24, right: 0 }
        },
        editData: { // 修改设置
          isShow: true,
          showUserColumns: [
            { name: '用户姓名', codeCamel: 'username', widgetType: 1,
              rule: { required: true, message: '请输入用户姓名', trigger: 'blur' }
            },
            { name: '登录账号', codeCamel: 'loginid', widgetType: 1, disabled: true,
              rule: { required: true, message: '请输入登录账号', trigger: 'blur' }
            },
            { name: '密码', codeCamel: 'password', widgetType: 11,
              rule: { required: true, message: '请输入密码', trigger: 'blur' }
            },
            { name: '电话', codeCamel: 'mobile', widgetType: 1,
              rule: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
                { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的电话号码', trigger: 'change,blur' }
              ]
            },
            { name: '角色', codeCamel: 'roleIds', widgetType: 2, options: [], multiple: true
            },
            { name: '年龄', codeCamel: 'age', widgetType: 1,
              rule: [
                { pattern: /^\d+$/, message: '请输入正确的年龄', trigger: 'change,blur' }]
            },
            { name: '性别', codeCamel: 'sex', widgetType: 2,
              options: [{ value: '1', label: '男' }, { value: '2', label: '女' }],
              multiple: false
            },
            { name: '身份证', codeCamel: 'IDNumber', widgetType: 1,
              rule: [
                { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'change,blur' }]
            },
            { name: '地址', codeCamel: 'address', widgetType: 1
            },
            { name: '籍贯', codeCamel: 'nativePlace', widgetType: 1
            },
            { name: '社保', codeCamel: 'codeCamel', widgetType: 1,
              rule: [
                { pattern: /^\d{18}$/, message: '请输入正确的社保号', trigger: 'change,blur' }]
            },
            { name: '邮箱', codeCamel: 'email', widgetType: 1,
              rule: [
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
              ]
            }
          ],
          showUserButtons: [
            { text: '确定', method: this.PeopleEditSure },
            { type: 3, text: '取消', method: this.closeDialog }
          ],
          formSchema: schema['HmUser'],
          layout: { left: 0, middle: 24, right: 0 },
          funObject: {
            beforeRender: this.PeopleBeforeEdit
          }
        },
        showDetail: {
          isShow: false
        },
        cellStyle: {},
        tableStyle: { width: '100%' },
        isShowPagination: true, // 分页
        isShowSearch: true, // 搜索
        showSelection: true, // 下拉
        showRefresh: false, // 刷新
        showExport: false, // 导出
        showDeleteButton: true, // 删除按钮
        buttonGroup: false,
        showOverflowTooltip: true, // 限制宽度
        isBatchRemove: true, // 是否显示批量删除
        useTableTotal: false, // 是否使用了组件的total
        promiseProcessing(value, params, definedOperate) { // 查表后显示的数据
          const data = new Promise(function(resolve, reject) {
            if (self.selectedDepartment.id) {
              const paramsPeo = {
                params: {
                  filters: {
                    'hm_user': {
                      'department_id': {
                        equalTo: self.selectedDepartment.id
                      },
                      'username': {}
                    }
                  },
                  pageNo: params.pageNo,
                  pageSize: params.pageSize,
                  sortItem: params.sortItem,
                  sortOrder: params.sortOrder
                }
              }
              definedOperate[0].value ? paramsPeo.params.filters.hm_user.username.like = '%' + definedOperate[0].value + '%' : delete paramsPeo.params.filters.hm_user.username
              request('hm_users', paramsPeo).then(resp => {
                self.exportParams = paramsPeo.params.filters
                request('get/TopDepartment', {
                  params: {
                    deartmentId: self.selectedDepartment.id
                  }
                }).then(resTop => {
                  const tableArr = []
                  self.$refs.hmComplexTable.total = resp.headers.total * 1
                  _.each(resp.data, function(item, index) {
                    console.log('resp.data', item)
                    tableArr[index] = item // 先将原有的值赋值给数组
                    if (item.params) {
                      const parmas = JSON.parse(item.params)
                      tableArr[index]['age'] = parmas.age ? parmas.age : ''
                      tableArr[index]['sex'] = parmas.sex === '1' ? '男' : parmas.sex === '2' ?  '女' : ''
                      tableArr[index]['IDNumber'] = parmas.IDNumber
                      tableArr[index]['address'] = parmas.address
                      tableArr[index]['nativePlace'] = parmas.nativePlace
                      tableArr[index]['codeCamel'] = parmas.codeCamel
                    }
                    tableArr[index]['topDepartmentname'] = resTop.data.name
                    tableArr[index]['departmentname'] = self.selectedDepartment.name
                    tableArr[index]['departmentId'] = item.departmentId
                    tableArr[index]['jobStatus'] = item.jobStatus === 1 ? '离职' : '在职'
                  })
                  resolve(tableArr)
                })
              })
            } else {
              self.$refs.hmComplexTable.total = 0
            }
          })
          return data
        }
      }
      this.userDefined = { // 员工管理的自定义信息
        definedOperate: [
          {type: 'input', label: '', placeholder: '请输入用户名', code: 'username', value: ''},
          { type: 'upload', label: '导入', url: request.defaults.baseURL + '/import_people', param: 'file', icon: 'el-icon-search', uploadSuccess: this.uploadSucc },
          { type: 'button', label: '导出', icon: 'el-icon-search', func: this.export1 },
          { type: 'button', label: '设置主管', icon: 'el-icon-edit', func: this.setAdmin },
          { type: 'button', label: '全部删除', icon: 'el-icon-delete', func: this.delAllUsers }
        ],
        singleOperate: [
          {
            type: 'dropdown',
            label: '启用/禁用',
            icon: 'el-icon-search',
            handleCommand: this.handleCommand,
            option: [{
              status: 0,
              text: '启用员工'
            }, {
              status: 1,
              text: '禁用员工'
            }]
          }
        ]
      }

      self.getHmDicts().then(function(res){
        self.hmDicts = res.data
      })

      commonApi.getRegisterInfo().then(function(res) {
        // 当前登录人的信息
        self.userInfo = res.data[0]
        request('departments', {
          params: {
            filters: {
              'department': {
                'id': {
                  equalTo: self.userInfo.includes.hm_user.departmentId
                }
              }
            }
          }
        }).then(resp => {
          self.userDep = resp.data[0]
          // 加载用户角色信息
          self.getCurrentUserRoles(self.userInfo.includes.hm_user.id).then(resp => {
            self.userRoles = _.map(resp.data, item => {
              return item.includes.role
            })
            console.log('self.userRoles: ', self.userRoles)
            self.loadDepartments()
          })
        })
      })
    }
  }
</script>
<style lang="scss">
  .el-table__fixed-right{
    z-index: 1;
  }
  .departemt .el-tree-node__content {
    height: 30px;
  }
  /* 设置主管样式*/
  .div_paidan{
    display: inline-block;
    color: black;
    font-size: 15px;
    margin-left:80px;
    margin-right:10px;
  }
  .el-dropdown-menu .el-dropdown-menu__item {
    padding: 0 38px;
  }

  .departemt .el-input.is-disabled .el-input__inner {
    color: #666666
  }

  .departemt .dialog-footer {
    text-align: center
  }

  .departemt .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #00BF8B;
    color: #ffffff
  }
  /* 员工管理样式修改*/
  .el-button--medium {
    display: block;
    padding: 10px 13px;
  }
  .el-col>.el-button--medium {
    display: inline-block;
  }
  .el-form-item__content>span>.el-button--medium {
    margin: 15px 0 0 0;
  }
  /*搜索框的宽度*/
  .hm-complex-table__filter-span {
    width: 165px !important;
    /*filter-item hm-complex-table__filter-span */
  }
  /*表单*/
  .cell,.el-table__fixed-right{
    text-align: center;
  }
</style>

<style lang='scss' scoped>
  .flex {
    display: flex;

    .flex-1 {
      flex: 1;
      width: 100%;
      min-width: 700px;
    }
  }

  .organization {
    flex: 0 0 220px;

    .organization-title {
      font-size: 20px;
      line-height: 40px;
      height: 40px;
      font-weight: 600;
      color: #333;
      padding-left: 20px;

      .el-button {
        padding: 7px 5px;
        margin-left: 14px;
        vertical-align: middle;
      }
    }

    .organization-tree {
      height: 747px;
      border-right: 1px solid #dddddd;
      padding: 10px 0px;
    }
  }

  .departmentTypeStyle {
    width: 300px;
    margin: 30px 30%;
  }
  .organization-select {
    .btn-title {
      border-bottom: 1px solid #dddddd;
      padding-left: 20px;
      margin-bottom: 32px;

      .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
      }
    }
  }
  .dialog-footer {
  .footBtn {
    display: inline-block;
  }
  .board-column {
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;
  }
}
</style>
