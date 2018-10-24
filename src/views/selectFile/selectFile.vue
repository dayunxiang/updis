<template>
  <div class="selectFile">
    <el-tree :data="treeFile"
             :ref="columns.ref"
             :show-checkbox="true"
             node-key="id"
             :accordion="true"
             :check-strictly="columns.checkStrictly || false"
             @node-click="handleNodeChange"
             @check-change="(data, checked, indeterminate)=>{ return handleCheckChange(data, checked, indeterminate, columns.codeCamel, columns.checkStrictly)}"
             :props="treeProps">
    </el-tree>
  </div>
</template>
<script>
  // import HmComplexTable from '../haomo/components/tables/HmComplexTable.vue'
  // import schema from '../haomo/schemas/hm_org_schema'
  import { param } from '@/utils'
  import request from '@/utils/request'
  import _ from 'lodash'
  import commonApi from '@/api/commonApi'
  export default {
    name: 'selectFile',
    components: {
    },
    props: {
      /**
       * 必传，指定要显示的表单字段及类型
       * 示例：{
       *    name: '选择其他模块文件', codeCamel: 'file1',
       *    widgetType: 10, ref: 'file1', checkStrictly: true
       * }
       *
       */

      columns: {
        type: Object,
        required: true
      },
      /**
       * 表单数据对象
       * 示例：{
       *    name: '',
       *    pwd: '',
       *    file: ''
       * }
       *
       */

      formModel: {
        type: Object,
        required: true
      }
      /**
       * 登陆用户id
       * 示例：
       * id: '716'
       *
       */

      // userId: {
      //   type: String,
      //   required: true
      // }
    },
    data() {
      return {
        i: 0, // 树形单选时 点选的次数
        // 树形选项配置
        treeProps: {
          label: 'label',
          // value: 'value',
          children: 'children'
        },
        props: { label: 'fileName', children: 'children' },
        // 树形数据
        treeFile: [],
        data2: [
          {
            id: 'notification', label: '通知通报',
            children: [
              // { id: 10, label: '刘云山' }
            ]
          },
          {
            id: 'conferenceManagement', label: '会议管理',
            children: [
              { id: 11, label: '毛晓东' },
              { id: 12, label: '方建国' }
            ]
          },
          {
            id: 3, label: '公文流转',
            children: [
              { id: 13, label: '司马南' },
              { id: 14, label: '褚随山' }
            ]
          },
          {
            id: 'issueCollection', label: '议题收集',
            children: [
              { id: 15, label: '司马南' }, { id: 16, label: '褚随山' }
            ]
          },
          // {
          //   id: 5,
          //   label: '检查课堂',
          //   children: [
          //     { id: 17, label: '司马南' }, { id: 18, label: '褚随山' }
          //   ]
          // },
          // {
          //   id: 6, label: '公文模板',
          //   children: [
          //     { id: 19, label: '司马南' }, { id: 20, label: '褚随山' }
          //   ]
          // },
          // {
          //   id: 7, label: '大事记',
          //   children: [
          //     { id: 21, label: '司马南' }, { id: 22, label: '褚随山' }
          //   ]
          // },
          {
            id: 'ocrRecognition', label: 'OCR识别',
            children: [
              { id: 23, label: '司马南' }, { id: 24, label: '褚随山' }
            ]
          },
          {
            id: 'publicityCorner', label: '宣传园地',
            children: [
              { id: 25, label: '司马南' }, { id: 26, label: '褚随山' }
            ]
          },
          {
            id: 'documentFlow', label: '公文流转',
            children: [
              { id: 25, label: '司马南' }, { id: 26, label: '褚随山' }
            ]
          }

        ]
      }
    },
    filters: {
    },
    created() {
      this.getFile()
      this.getNextCloud()
    },
    watch: {
    },
    methods: {
      // 获取用户其他模块已上传(审批)的文件
      getFile() {
        const self = this
        let userId = ''
        commonApi.getRegisterInfo().then(function(res) {
          userId = res.data[0].includes.hm_user.id
          // 定义参数
          const params = {
            user_id: JSON.stringify(userId),
            module_names: JSON.stringify([
              { 'module_name': 'notification' },
              { 'module_name': 'conferenceManagement' },
              { 'module_name': 'issueCollection' },
              { 'module_name': 'ocrRecognition' },
              { 'module_name': 'speechRecognition' },
              // { 'module_name': 'publicityCorner' },
              // { 'module_name': 'documentTemplateAutomatic' },
              // { 'module_name': 'inspectClass' },
              { 'module_name': 'documentFlow' }
              // { 'module_name': 'events' },
            ])
          }
          // 获取文件
          request('get_approved_files', {
            method: 'post',
            params: params,
            headers: {
              'LoginType': 'web',
              'OperatingModule': encodeURI('通知通报')
            },
            transformRequest: param
          }).then(res => {
            const resData = res.data
            console.log(139, res.data)
            _.each(resData, function(item, key) {
              const temp = {}
              temp.id = key
              temp.children = []
              // 定义模块名
              if (key === 'notification') {
                temp.label = '通知通报'
              } else if (key === 'conferenceManagement') {
                temp.label = '会议管理'
              } else if (key === 'issueCollection') {
                temp.label = '议题收集'
              } else if (key === 'ocrRecognition') {
                temp.label = 'OCR识别'
              } else if (key === 'speechRecognition') {
                temp.label = '语音识别'
              } else if (key === 'documentTemplateAutomatic') {
                temp.label = '公文模板生成'
              } else if (key === 'documentFlow') {
                temp.label = '公文流转'
              }
              // 给子级赋值(file_path、file_name)
              _.each(item, function(file, k) {
                const temp1 = {}
                temp1.id = self.getRandom()
                temp1.fileId = file.id
                temp1.label = file.file_name
                temp1.filePath = file.file_path
                temp.children.push(temp1)
              })
              self.treeFile.push(temp)
            })
            console.log('处理后的树形', self.treeFile)
          })
        })
      },
      // 获取nextCloud文件
      getNextCloud() {
        const self = this
        let userId = ''
        commonApi.getRegisterInfo().then(function(res) {
          userId = res.data[0].includes.hm_user.id
          // 个人网盘
          const params1 = {
            userId: userId,
            modular: 1,
            addEmptyFolder: false
          }
          request('get_nextcloud_folders', {
            method: 'post',
            params: params1,
            transformRequest: param,
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              'LoginType': 'web',
              'OperatingModule': encodeURI('通知通报')
            }
          }).then(res => {
            console.log('个人网盘', res)
            self.dealData(res.data, '个人网盘', 'networkdisk')
          })
          // 共享文件夹
          const params2 = {
            userId: userId,
            modular: 2,
            addEmptyFolder: false
          }
          request('get_nextcloud_folders', {
            method: 'post',
            params: params2,
            transformRequest: param,
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              'LoginType': 'web',
              'OperatingModule': encodeURI('通知通报')
            }
          }).then(res => {
            console.log('共享文件夹', res)
            self.dealData(res.data, '共享文件夹', 'shrefile')
          })
          // 文档管理
          const params3 = {
            userId: userId,
            modular: 3,
            addEmptyFolder: false
          }
          request('get_nextcloud_folders', {
            method: 'post',
            params: params3,
            transformRequest: param,
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              'LoginType': 'web',
              'OperatingModule': encodeURI('通知通报')
            }
          }).then(res => {
            console.log('文档管理', res)
            // if (res.data.list.length > 0) {
            self.dealData(res.data, '文档管理', 'documentmanagement')
            // }
          })
        })

        const res1 = {
          'absolutePath': '/data/nextcloud/networkdisk/data/19803130208/files/',
          'list': [
            {
              'children': [
                { 'children': [], 'name': 'Photos/Hummingbird.jpg', 'state': 'open', 'type': 'file' },
                { 'children': [], 'name': 'Photos/Coast.jpg', 'state': 'open', 'type': 'file' },
                { 'children': [], 'name': 'Photos/Nut.jpg', 'state': 'open', 'type': 'file' }
              ],
              'name': 'Photos',
              'state': 'closed',
              'type': 'folder'
            },
            {
              'children': [],
              'name': 'Nex tcloud.mp4',
              'state': 'open',
              'type': 'file'
            },
            {
              'children': [],
              'name': 'B02D88149D896F1D004B03F4076D218E.jpg',
              'state': 'open',
              'type': 'file'
            },
            {
              'children': [
                { 'children': [], 'name': 'Documents/About.odt', 'state': 'open', 'type': 'file' },
                { 'children': [], 'name': 'Documents/About.txt', 'state': 'open', 'type': 'file' }
              ],
              'name': 'Documents',
              'state': 'closed',
              'type': 'folder'
            }
          ]
        }
        // const data = _.cloneDeep(res1)
        // self.dealData(data, '个人网盘', 'networkdisk')
      },
      // 处理nextCloud返回的数据
      dealData(data, label, id) {
        const temp1 = {}
        const self = this
        _.each(data.list, function(item, key) {
          item.id = self.getRandom()
          if (item.name === 'Photos') {
            item.label = '图片'
          } else if (item.name === 'Documents') {
            item.label = '文档'
          } else if (item.name === 'Videos') {
            item.label = '视频'
          } else {
            item.label = item.name
          }
          if (item.children.length > 0) {
            _.each(item.children, function(item2, key2) {
              item2.id = self.getRandom()
              if (item2.name.indexOf('/') > 0) {
                item2.label = item2.name.slice(item2.name.indexOf('/') + 1)
              } else {
                item2.label = item2.name
              }
              item2.absolutePath = data.absolutePath
              item2.children = ''
            })
          } else {
            item.absolutePath = data.absolutePath
            item.children = ''
          }
        })
        console.log('处理后的data', data)
        temp1.label = label
        temp1.id = id
        temp1.children = data.list
        self.treeFile.push(temp1)
        console.log('处理的temp1', temp1, self.treeFile)
      },
      // 点击节点时的函数
      handleNodeChange(data, node, com) {

      },
      // 获取6位数的随机数
      getRandom() {
        let num = ''
        for (let i = 0; i < 8; i++) {
          num += Math.floor(Math.random() * 10)
        }
        return num
      },
      // 节点选中状态变化时的函数
      handleCheckChange(data, checked, indeterminate, code, checkStrictly) {
        console.log(data, checked, indeterminate)
        console.log(this.$refs[code].getCheckedNodes(true))
        const self = this
        // 实现单选
        if (checkStrictly) {
          self.i++
          if (self.i % 2 === 0) {
            if (checked) {
              // 点击 先清空再选中当前项
              self.$refs[code].setCheckedNodes([])
              self.$refs[code].setCheckedNodes([data])
            } else {
              // 点击已经选中的节点，清空
              self.$refs[code].setCheckedNodes([])
            }
          }
        }
        self.formModel[code] = self.$refs[code].getCheckedNodes(true)
      }
    }
  }
</script>
<style>
  .changeWork .el-input__prefix{
    color: #666
  }
</style>
