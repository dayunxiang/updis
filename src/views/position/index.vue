<template>
  <div class="app-container documentation-container">
    <!--<hm-complex-table :schema="schema['HmUser']"-->
                      <!--:columns="showUserColumns"-->
                      <!--:filters="userFilters"-->
                      <!--ref="hmComplexTable1"-->
                      <!--:options="userOptions1">-->
    <!--</hm-complex-table>-->
  </div>
</template>
<script>
  import HmComplexTable from '../haomo/components/tables/HmComplexTable.vue'
  import schema from '../haomo/schemas/hm_org_schema'
  // import request from '@/utils/request'
  // import { paramEncode } from '@/utils'
  import _ from 'lodash'

  export default {
    name: 'department',
    // 继承其他组件
    extends: {},
    // 使用其它组件
    components: {
      'hm-complex-table': HmComplexTable
    },
    data() {
      return {
        // activeName: 'first', // 显示那个tab页
        showUserColumns: [
          { name: '门店名称', codeCamel: 'username' },
          { name: '地址', codeCamel: 'username' },
          { name: '经纬度', codeCamel: 'username' },
          { name: '组织树对应层级', codeCamel: 'username' }
        ],
        userFilters: [
          { placeholder: '过滤时间', 'username': { 'like': '' }, isShow: true },
          { placeholder: '过滤组织层级', 'username': { 'like': '' }, isShow: true }
        ]
      }
    },
    filters: {},
    created() {
      const self = this
      self.schema = schema
      this.userOptions1 = {
        pageSize: 10,
        sortItem: 'id',
        sortOrder: 'desc',
        showRefresh: false, // 是否显示刷新按钮
        showExport: false, // 是否显示导出按钮
        buttonGroup: false, // 是否为按钮组样式
        showOverflowTooltip: true, // 是否悬停在单元格中显示表格内容
        showDeleteButton: true, // 默认不显示删除按钮
        isShowNewButton: true, // 是否显示新建
        isShowEditDataButton: true, // 是否显示编辑
        isShowPagination: true, // 是否显示分页
        isShowSearch: true, // 是否显示搜索按钮
        showSelection: true, // 是否显示复选框
        newData: {
          isShow: true,
          showUserColumns: [
            { name: '门店名称', codeCamel: 'username', widgetType: 1 },
            { name: '地址', codeCamel: 'username', widgetType: 1 },
            { name: '经纬度', codeCamel: 'username', widgetType: 1 },
            { name: '组织树对应层级', codeCamel: 'username', widgetType: 1 }
          ],
          showUserButtons: [
            {
              // type: 1,
              text: '确定',
              beforeSubmit: this.closeDialog,
              method: this.closeDialog
            },
            {
              type: 3,
              text: '取消',
              method: this.closeDialog
            }
          ],
          formSchema: schema['Department'],
          layout: { left: 0, middle: 24, right: 0 },
          tips: {},
          formStyle: {},
          formRefers: {},
          foreignFormFields: [],
          formRelates: []
        },
        editData: {
          isShow: true,
          showUserColumns: [
            { name: '门店名称', codeCamel: 'username', widgetType: 1 },
            { name: '地址', codeCamel: 'username', widgetType: 1 },
            { name: '经纬度', codeCamel: 'username', widgetType: 1 },
            { name: '组织树对应层级', codeCamel: 'username', widgetType: 1 }
          ],
          showUserButtons: [
            {
              // type: 1,
              text: '确定',
              method: this.closeDialog
            },
            {
              type: 3,
              text: '取消',
              method: this.closeDialog
            }
          ],
          formSchema: schema['Department'],
          layout: { left: 0, middle: 24, right: 0 },
          tips: {},
          formStyle: {},
          formRefers: {},
          foreignFormFields: [],
          formRelates: []
        }
      }
//      this.userOptions2 = {
//        pageSize: 10,
//        sortItem: 'id',
//        sortOrder: 'desc',
//        changeValue: {},
//        showRefresh: false,
//        showExport: false,
//        buttonGroup: false,
//        showOverflowTooltip: false,
//        showDeleteButton: false, // 默认不显示删除按钮
//        isShowNewButton: false, // 是否显示新建
//        isShowEditDataButton: false, // 是否显示编辑
//        isShowPagination: true, // 是否显示分页
//        isShowSearch: false // 是否显示搜索按钮
//      }
    },
    methods: {
      /**
       * 关闭弹窗
       */
      closeDialog: function() {
        this.$refs.hmComplexTable1.dialogFormVisible = false // 关闭弹窗
        this.$refs.hmComplexTable1.getList() // 刷新列表
      }
    },
    computed: {},
    mounted() {}
  }
</script>

<style>

</style>

