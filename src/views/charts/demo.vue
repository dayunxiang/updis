<template>
  <el-table :data="list" border fit highlight-current-row :cell-style="cellStyle" ref="multipleTable"
            :style="tableStyle" @selection-change="handleSelectionChange" @sort-change="sortChange" @current-change="tableCurrentChange">
    <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
    <el-table-column type="selection" width="55" v-if="isShowSelection"></el-table-column>
    <el-table-column v-for="(column,index) in showColumns" :key="index" align="center" :label="column.name"
                     :prop="column.codeCamel" :sortable="column.isSort" :width="column.width" :show-overflow-tooltip="showOverflowTooltip">
      <template slot-scope="scope">
        <span v-if="(scope.row[column.codeCamel] !== false && scope.row[column.codeCamel] !== true )&& !column.render">{{ scope.row[column.codeCamel] }}</span>
        <el-checkbox v-if="(scope.row[column.codeCamel] === false || scope.row[column.codeCamel] === true) && !column.render" v-model="scope.row[column.codeCamel]" @change="column.checkbox(scope)"></el-checkbox>
        <span v-if='column.render' v-html="column.render(scope)"></span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" :width="operationWidth" v-if="isShowEditDataButton || isShowDeleteButton || definedOperation.length || isShowDetail">
      <template slot-scope="scope">
        <el-button @click="openDialog('editData',scope.row)" v-if="isShowEditDataButton" type="text" size="small">编辑</el-button>
        <el-button @click="deleteData(scope.row)" type="text" v-if="isShowDeleteButton" size="small">删除</el-button>
        <el-button @click="openDialog('detail',scope.row)" type="text" v-if="isShowDetail" size="small">详情</el-button>

        <el-button @click="operation.func(scope.row)" type="text" v-if="definedOperation.length && isShowOperation(scope.row, operation)" size="small"
                   v-for="(operation,index1) in definedOperation" :key="index1">{{statusFunc(scope.row, operation)}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>

</script>


<style>

</style>
