<template>
  <div class="vxe-table-pro-example">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="success" @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button @click="handleClearFilter">清除筛选</el-button>
      <el-button @click="handleGetSorts">获取排序</el-button>
      <el-button @click="handleCheckEditData">检查是否有修改</el-button>
    </div>

    <!-- VxeTablePro 组件使用示例 -->
    <vxe-table-pro
      ref="tableRef"
      id="example-table"
      :data="tableData"
      :min-height="400"
      @sort-change="onSortChange"
      @current-change="onCurrentChange"
    >
      <vxe-column-pro field="name" title="姓名" width="200" :edit-render="{ name: 'input' }" :filterable="true" />
      <vxe-column-pro field="age" title="年龄" width="150" :filterable="true" />
      <vxe-column-pro field="email" title="邮箱" width="200" :edit-render="{ name: 'input' }" :filterable="true" />
      <vxe-column-pro
        field="status"
        title="状态"
        width="200"
        :edit-render="{
          name: 'select',
          options: statusOptions,
          props: { placeholder: '请选择状态' }
        }"
        :filterable="true"
      ></vxe-column-pro>
      <vxe-column-pro field="address" title="地址" width="250" :edit-render="{ name: 'input' }" />
      <vxe-column-pro field="createTime" title="创建时间" width="180" />
      <vxe-column-pro field="remark" title="备注" min-width="200" :edit-render="{ name: 'textarea' }" />

      <!-- 操作列 -->
      <vxe-column-pro field="operation" title="操作" width="100" fixed="right" type="operation">
        <template #default="params">
          <el-button type="primary" link @click="handleEdit(params?.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(params?.row)">删除</el-button>
        </template>
      </vxe-column-pro>
    </vxe-table-pro>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

// 表格引用
const tableRef = ref()

// 状态选项
const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    status: '1',
    address: '北京市朝阳区',
    createTime: '2024-01-01 10:00:00',
    remark: '备注信息1'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    status: '1',
    address: '上海市浦东新区',
    createTime: '2024-01-02 11:00:00',
    remark: '备注信息2'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    status: '0',
    address: '广州市天河区',
    createTime: '2024-01-03 12:00:00',
    remark: '备注信息3'
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    status: '1',
    address: '深圳市南山区',
    createTime: '2024-01-04 13:00:00',
    remark: '备注信息4'
  },
  {
    id: 5,
    name: '钱七',
    age: 22,
    email: 'qianqi@example.com',
    status: '0',
    address: '杭州市西湖区',
    createTime: '2024-01-05 14:00:00',
    remark: '备注信息5'
  }
])

// 新增数据
function handleAdd() {
  if (!tableRef.value) return
  const newRow = {
    id: Date.now(),
    name: '',
    age: 0,
    email: '',
    status: '1',
    address: '',
    createTime: new Date().toLocaleString(),
    remark: ''
  }
  tableRef.value.insert(newRow)
  ElMessage.success('新增成功，请编辑数据')
}

// 保存数据
function handleSave() {
  if (!tableRef.value) return

  // 检查是否有修改的数据
  if (tableRef.value.hasEditData && tableRef.value.hasEditData()) {
    const recordset = tableRef.value.getRecordset()
    console.log('新增的数据:', recordset.insertRecords)
    console.log('修改的数据:', recordset.updateRecords)
    console.log('删除的数据:', recordset.removeRecords)

    // 这里可以调用保存接口
    ElMessage.success('保存成功')
  } else {
    ElMessage.info('没有需要保存的数据')
  }
}

// 重置表格
function handleReset() {
  if (!tableRef.value) return
  tableRef.value.clearAll()
  ElMessage.success('重置成功')
}

// 清除筛选
function handleClearFilter() {
  if (!tableRef.value) return
  if (tableRef.value.clearFilterPro) {
    tableRef.value.clearFilterPro()
    ElMessage.success('清除筛选成功')
  }
}

// 获取排序信息
function handleGetSorts() {
  if (!tableRef.value) return
  if (tableRef.value.getSorts) {
    const sorts = tableRef.value.getSorts()
    console.log('排序信息:', sorts)
    ElMessage.success(`当前有 ${sorts.length} 个排序列`)
  }
}

// 检查是否有修改的数据
function handleCheckEditData() {
  if (!tableRef.value) return
  if (tableRef.value.hasEditData) {
    const hasEdit = tableRef.value.hasEditData()
    ElMessage[hasEdit ? 'warning' : 'success'](hasEdit ? '表格有未保存的修改' : '表格没有修改')
  }
}

// 编辑行
function handleEdit(row: any) {
  if (!tableRef.value) return
  tableRef.value.setEditRow(row)
  ElMessage.info('已进入编辑模式，点击单元格进行编辑')
}

// 删除行
function handleDelete(row: any) {
  ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (!tableRef.value) return
      tableRef.value.remove(row)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 排序变化事件
function onSortChange(params: any) {
  console.log('排序变化:', params)
  const { field, order, sortList } = params
  if (order) {
    ElMessage.info(`按 ${field} 字段${order === 'asc' ? '升序' : '降序'}排序`)
  } else {
    ElMessage.info('已取消排序')
  }
}

// 当前行变化事件
function onCurrentChange(params: any) {
  console.log('当前行变化:', params)
}

// 组件挂载后
onMounted(() => {
  console.log('表格组件已挂载')
  // 可以在这里进行一些初始化操作
})
</script>

<style lang="scss" scoped>
.vxe-table-pro-example {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .toolbar {
    margin-bottom: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  // 表格容器样式
  :deep(.vxe-table-pro) {
    flex: 1;
    overflow: hidden;
  }
}
</style>
