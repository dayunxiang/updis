<template>
  <div class="dndList">
    <div class="dndList-list" :style="{width:width1}">
      <h3>{{list1Title}}</h3>
      <div style="position:absolute;right:0px;">
        <span style="float: right ;margin-top: -28px;margin-right:30px;" @click="createEle()">
          <i style="color:#ff4949; font-size: 20px;" class="el-icon-circle-plus-outline"></i>
        </span>
      </div>
      <draggable :list="list1" class="dragArea" :options="{group:'article',chosenClass:'selected',animation:150}">
        <div v-for="(element,index) in list1" :key='element.id'>
          <div class="list-complete-item" :class="element.selected?'selected':''">
            <div class="list-complete-item-handle" @click="list1Click(element,list1Clicked,index)">{{element.value}}</div>
            <!--<el-input class="list-complete-item-handle" @click="list1Click(element,list1Clicked,index)">[{{element.key}}] {{element.value}}</el-input>-->
            <div style="position:absolute;right:0px;">
              <span style="float: right ;margin-top: -22px;margin-right:10px;" @click="deleteEle(element)">
                <i style="color:#ff4949; font-size: 20px;" class="el-icon-delete"></i>
              </span>
              <span style="float: right ;margin-top: -22px;margin-right:10px;" @click="editEle(element)">
                <i style="color:#ff4949; font-size: 20px;" class="el-icon-edit"></i>
              </span>
            </div>
          </div>
        </div>
      </draggable>
    </div>
    <!--修改弹窗-->
    <el-dialog title="编辑设置" :visible.sync="adminTypeShow" width="500px" v-if="adminTypeShow" style="margin-top: 90px;">
      <div class="div_top">
        <div class="div_paidan">
          <span>编辑:</span>
        </div>
         <el-input placeholder="请输入编辑内容" v-model="updateds" style="width: 70%;"></el-input>
      </div>
      <el-button type="primary" @click="succes()" style="margin-top: 20px;margin-left: 340px;">确 定</el-button>
    </el-dialog>
    <!--新建弹窗-->
    <el-dialog title="新建设置" :visible.sync="adminTypeShow2" width="500px" v-if="adminTypeShow2" style="margin-top: 90px;">
      <div class="div_top">
        <div class="div_paidan">
          <span>新建:</span>
        </div>
        <el-input placeholder="请输入编辑内容" v-model="updateds1" style="width: 70%;"></el-input>
      </div>
      <el-button type="primary" @click="succes2()" style="margin-top: 20px;margin-left: 340px;">确 定</el-button>
    </el-dialog>

    <!--<div class="dndList-list" :style="{width:width2}" v-if="showList2">-->
      <!--<h3>{{list2Title}}</h3>-->
      <!--<draggable :list="filterList2" class="dragArea" :options="{group:'article'}">-->
        <!--<div class="list-complete-item" v-for="element in filterList2" :key='element.id'>-->
          <!--<div class='list-complete-item-handle2' @click="pushEle(element)"> [{{element.key}}] {{element.value}}</div>-->
        <!--</div>-->
      <!--</draggable>-->
    <!--</div>-->

  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import commonApi from '@/api/commonApi'
  import request from '@/utils/request'

  export default {
    data() {
      return {
        adminTypeShow: false, // 设置修改弹窗
        adminTypeShow2: false, // 设置新建弹窗
        updateds: '', // 修改数据绑定
        updateds1: '', // 新建数据绑定
        checkedInfo: {}, // 部门管理选择的对象
//        checkedDepInfo: {} // 父组件中选择的部门
      }
    },
    name: 'DndList',
    components: { draggable },
    computed: {
      filterList2() {
        return this.list2.filter(v => {
          if (this.isNotInList1(v)) {
            return v
          }
          return false
        })
      }
    },
    props: {
      list1: {
        type: Array,
        default() {
          return []
        }
      },
      checkedDepInfo: {
        type: Object
      },
//      list2: {
//        type: Array,
//        default() {
//          return []
//        }
//      },
      list1Title: {
        type: String,
        default: 'list1'
      },
      list2Title: {
        type: String,
        default: 'list2'
      },
      width1: {
        type: String,
        default: '48%'
      },
      width2: {
        type: String,
        default: '48%'
      },
      showList2: {
        type: Boolean,
        default: false
      },
      list1Clicked: {
        type: Function
      }
    },
    methods: {
      isNotInList1(v) {
        return this.list1.every(k => v.id !== k.id)
      },
      isNotInList2(v) {
        return this.list2.every(k => v.id !== k.id)
      },
      // 删除功能
      deleteEle(ele) {
        const self = this
        console.log('删除', ele)
        commonApi.delete('hm_dicts', ele.id).then(function (res) {
          self.$emit('showDepartmentType')
        })
//        for (const item of this.list1) {
//          if (item.id === ele.id) {
//            const index = this.list1.indexOf(item)
//            this.list1.splice(index, 1)
//            break
//          }
//        }
//        if (this.isNotInList2(ele)) {
//          this.list2.unshift(ele) // 删除选中的数据
//        }
//        console.log('删除功能')
      },
      // 修改功能
      editEle(ele) {
        const self = this
        self.adminTypeShow = true
        self.updateds = ele.value // 给编辑的input框赋值
        self.checkedInfo = ele // 选择的信息
        console.log('修改功能', ele) // 这里是点击之后获取的一条数据
      },
      // 编辑确定功能
      succes(ele) {
        const self = this
//        self.updateds = ele
        console.log(self.updateds)
        commonApi.edit('hm_dicts', self.checkedInfo.id, {
          value: self.updateds
        }).then(resp => {
          console.log('刷新数据', resp.data)
          self.$emit('showDepartmentType')
        })
        self.adminTypeShow = false
        console.log('编辑确定功能')
      },
      // 新建功能
      createEle() {
        const self = this
        self.adminTypeShow2 = true
        console.log('新建功能')
      },
      // 新建确定功能
      succes2() {
        const self = this
        console.log('新建确定功能', self.checkedDepInfo)
        request('get/TopDepartment', {
          params: {
            deartmentId: self.checkedDepInfo.id
          }
        }).then(resp => {
          commonApi.create('hm_dicts', {
            type: '部门类型',
            key: resp.data.id,
            value: self.updateds1
          }).then(function(res) {
            self.$emit('showDepartmentType')
            self.adminTypeShow2 = false
          })
        })
      },
      pushEle(ele) {
        this.list1.push(ele)
      },
      // select的选择
      list1Click(element, callback, index) {
        // 循环把默认的样式都设为false
        for (let i = 0; i < this.list1.length; i++) {
          this.list1[i].selected = false
        }
        // 当前选中的数据
        element.selected = true
        this.list1.splice(index, 1, element)
        // 修改成功执行用户回调
        if (typeof (callback) === 'function') {
          callback(element)
        }
      }
    }
  }
</script>
<style lang="scss">
  .v-modal {
    z-index: 1 !important;
  }
  .div_paidan {
    margin-left: 35px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .dndList {
    background: #fff;
    padding-bottom: 40px;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .dndList-list {
      float: left;
      padding-bottom: 30px;

      &:first-of-type {
        margin-right: 2%;
      }

      .dragArea {
        margin-top: 15px;
        min-height: 50px;
        padding-bottom: 30px;
      }
    }
  }
  .list-complete-item {
    cursor: pointer;
    position: relative;
    font-size: 14px;
    padding: 5px 12px;
    margin-top: 4px;
    border: 1px solid #bfcbd9;
    transition: all 1s;
  }

  .selected {
    color: #fff;
    background-color: #00BF8B;
    border-color: #00BF8B;
  }

  .list-complete-item-handle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 50px;
  }

  .list-complete-item-handle2 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20px;
  }

  .list-complete-item.sortable-chosen {
    background: #4AB7BD;
  }

  .list-complete-item.sortable-ghost {
    background: #30B08F;
  }

  .list-complete-enter,
  .list-complete-leave-active {
    opacity: 0;
  }
</style>
