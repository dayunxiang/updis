<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
      :list="items"
      :options="options"
      class="board-column-content" v-if="isShowList">
      <div v-for="(departmentType, index) in items" :key="departmentType" class="board-item">
        <span style="width: 200px;">
          <input :id="input + index" placeholder="请输入部门类型名称" @change="clickFun(departmentType, 'edit', $event)" :value="departmentType" :disabled="departmentType === '公司'" style="outline: none;border: none;">
        </span>
        <span class="content-icon" v-if="departmentType !== '公司'" @click="clickFun(departmentType, 'delete')">-</span>
        <span class="content-icon" @click="clickFun(departmentType, 'add')">+</span>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import commonApi from '@/api/commonApi'
import request from '@/utils/request'
import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
import _ from 'lodash'

export default {
  name: 'DepartmentTypeKanban',
  components: {
    ElInput,
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isShowList: true, // 是否显示列表
      editTypeName: '', // 修改类型名称
      input: 'input'
    }
  },
  // 放置方法的地方
  methods: {
    clickFun(data, type, event) {
      const self = this
      self.isShowList = false
      if (type === 'add') {
        self.items.splice(_.indexOf(self.items, data) + 1,0,'')
        setTimeout(function () {
          document.getElementById(self.input + (_.indexOf(self.items, data) + 1) * 1).focus()
        },10)
      } else if (type === 'delete') {
        self.items.splice(_.indexOf(self.items, data),1)
      } else if (type === 'edit') {
        self.items.splice(_.indexOf(self.items, data), 1, event.currentTarget.value)
      }
      self.$emit('editItems', self.items)
      self.isShowList = true
    }
  }
}
</script>
<style lang="scss">
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #00BF8B;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);
    }

    .content-icon {
      font-size: 20px;
      margin: 0px 5px;
      float: right;
    }
  }
}
</style>

