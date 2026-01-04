# VxeTablePro 表格组件

基于 [vxe-table](https://vxetable.cn/#/table/start/install) 封装的增强型表格组件，提供了列布局设置、筛选、排序、编辑等丰富的功能。

## 基础用法

基础的表格展示用法。

:::demo

```vue
<template>
  <vxe-table-pro ref="tableRef" id="basic-table" :data="tableData">
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="age" title="年龄" width="80" />
    <vxe-column-pro field="email" title="邮箱" width="200" />
    <vxe-column-pro field="address" title="地址" min-width="200" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com', address: '北京市朝阳区' },
  { name: '李四', age: 30, email: 'lisi@example.com', address: '上海市浦东新区' },
  { name: '王五', age: 28, email: 'wangwu@example.com', address: '广州市天河区' }
])
</script>
```

:::

## 显示序号和复选框

通过 `show-seq` 和 `show-checkbox` 属性可以显示序号列和复选框列。

:::demo

```vue
<template>
  <vxe-table-pro
    ref="tableRef"
    id="seq-checkbox-table"
    :data="tableData"
    :show-seq="true"
    :show-checkbox="true"
  >
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="age" title="年龄" width="80" />
    <vxe-column-pro field="email" title="邮箱" width="200" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
  { name: '王五', age: 28, email: 'wangwu@example.com' }
])
</script>
```

:::

## 可编辑表格

通过 `edit-render` 属性配置列的编辑方式，支持 `input`、`select`、`textarea` 等类型。

:::demo

```vue
<template>
  <vxe-table-pro ref="tableRef" id="edit-table" :data="tableData">
    <vxe-column-pro
      field="name"
      title="姓名"
      width="120"
      :edit-render="{ name: 'input' }"
    />
    <vxe-column-pro
      field="age"
      title="年龄"
      width="80"
      :edit-render="{ name: 'input', props: { type: 'number' } }"
    />
    <vxe-column-pro
      field="status"
      title="状态"
      width="120"
      :edit-render="{
        name: 'select',
        options: statusOptions,
        props: { placeholder: '请选择状态' }
      }"
    />
    <vxe-column-pro
      field="remark"
      title="备注"
      min-width="200"
      :edit-render="{ name: 'textarea' }"
    />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, status: '1', remark: '备注信息1' },
  { name: '李四', age: 30, status: '1', remark: '备注信息2' },
  { name: '王五', age: 28, status: '0', remark: '备注信息3' }
])

const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]
</script>
```

:::

## 列筛选

通过 `filterable` 属性启用列的筛选功能，支持搜索和多选筛选。

:::demo

```vue
<template>
  <vxe-table-pro ref="tableRef" id="filter-table" :data="tableData">
    <vxe-column-pro field="name" title="姓名" width="120" :filterable="true" />
    <vxe-column-pro field="age" title="年龄" width="80" :filterable="true" />
    <vxe-column-pro field="email" title="邮箱" width="200" :filterable="true" />
    <vxe-column-pro field="status" title="状态" width="120" :filterable="true" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com', status: '启用' },
  { name: '李四', age: 30, email: 'lisi@example.com', status: '启用' },
  { name: '王五', age: 28, email: 'wangwu@example.com', status: '禁用' }
])
</script>
```

:::

## 列排序

支持单列和多列排序，按住 `Ctrl` 键点击表头可以添加多个排序列。

:::demo

```vue
<template>
  <vxe-table-pro
    ref="tableRef"
    id="sort-table"
    :data="tableData"
    @sort-change="onSortChange"
  >
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="age" title="年龄" width="80" />
    <vxe-column-pro field="email" title="邮箱" width="200" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
  { name: '王五', age: 28, email: 'wangwu@example.com' }
])

function onSortChange(params) {
  const { field, order } = params
  if (order) {
    ElMessage.info(`按 ${field} 字段${order === 'asc' ? '升序' : '降序'}排序`)
  }
}
</script>
```

:::

## 列布局设置

通过工具栏的设置图标可以配置列的显示/隐藏、顺序、冻结等，布局配置会自动保存。

:::demo

```vue
<template>
  <vxe-table-pro
    ref="tableRef"
    id="layout-table"
    :data="tableData"
    :show-toolbar="true"
  >
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="age" title="年龄" width="80" />
    <vxe-column-pro field="email" title="邮箱" width="200" />
    <vxe-column-pro field="address" title="地址" min-width="200" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com', address: '北京市朝阳区' },
  { name: '李四', age: 30, email: 'lisi@example.com', address: '上海市浦东新区' },
  { name: '王五', age: 28, email: 'wangwu@example.com', address: '广州市天河区' }
])
</script>
```

:::

## 限制显示列数

通过 `limit-field-count` 属性限制表格显示的列数，超出部分会自动隐藏。

:::demo

```vue
<template>
  <vxe-table-pro
    ref="tableRef"
    id="limit-table"
    :data="tableData"
    :limit-field-count="3"
  >
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="age" title="年龄" width="80" />
    <vxe-column-pro field="email" title="邮箱" width="200" />
    <vxe-column-pro field="address" title="地址" min-width="200" />
    <vxe-column-pro field="phone" title="电话" width="150" />
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25, email: 'zhangsan@example.com', address: '北京市朝阳区', phone: '13800138000' },
  { name: '李四', age: 30, email: 'lisi@example.com', address: '上海市浦东新区', phone: '13800138001' },
  { name: '王五', age: 28, email: 'wangwu@example.com', address: '广州市天河区', phone: '13800138002' }
])
</script>
```

:::

## 自定义列内容

通过插槽可以自定义列的内容显示。

:::demo

```vue
<template>
  <vxe-table-pro ref="tableRef" id="custom-table" :data="tableData">
    <vxe-column-pro field="name" title="姓名" width="120" />
    <vxe-column-pro field="status" title="状态" width="120">
      <template #default="{ row }">
        <el-tag :type="row.status === '1' ? 'success' : 'danger'">
          {{ row.status === '1' ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </vxe-column-pro>
    <vxe-column-pro field="operation" title="操作" width="150" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </vxe-column-pro>
  </vxe-table-pro>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', status: '1' },
  { name: '李四', status: '1' },
  { name: '王五', status: '0' }
])

function handleEdit(row) {
  ElMessage.info(`编辑 ${row.name}`)
}

function handleDelete(row) {
  ElMessage.warning(`删除 ${row.name}`)
}
</script>
```

:::

## VxeTablePro Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| id | 表格唯一标识，用于保存布局配置 | string | — | — |
| data | 表格数据 | array | — | [] |
| show-toolbar | 是否显示工具栏（布局设置按钮） | boolean | — | false |
| show-seq | 是否显示序号列 | boolean | — | true |
| show-checkbox | 是否显示复选框列 | boolean | — | true |
| limit-field-count | 限制显示的列数，0 表示不限制 | number | — | 0 |
| enter-switch | 是否启用回车切换单元格 | boolean | — | false |
| min-height | 表格最小高度 | number | — | 96 |
| use-extend | 是否开启扩展方法 | boolean | — | true |
| on-edit-closed | 编辑关闭回调函数 | function | — | — |
| on-current-change | 当前行变化回调函数 | function | — | — |
| before-current-change | 切换当前行前的校验函数，返回 false 可阻止切换 | function | — | null |

> 注意：`id` 属性是必需的，用于保存和加载列的布局配置。如果不提供 `id`，布局设置功能将无法正常工作。

> 组件支持 vxe-table 的所有原生属性和事件，可以通过 `v-bind` 和 `v-on` 透传。

## VxeTablePro Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| sort-change | 排序变化时触发 | `{ field, order, sortList, column, property, sortTime }` |
| current-change | 当前行变化时触发 | `{ row, rowIndex, column, columnIndex, $rowIndex, $columnIndex }` |
| edit-closed | 编辑关闭时触发 | `{ row, rowIndex, column, columnIndex, cell, cellValue, $rowIndex, $columnIndex }` |
| edit-actived | 编辑激活时触发 | `{ row, rowIndex, column, columnIndex, cell, cellValue, $rowIndex, $columnIndex }` |
| edit-blur | 编辑失焦时触发 | `{ row, rowIndex, column, columnIndex, cell, cellValue, $rowIndex, $columnIndex }` |
| data-change | 数据变化时触发 | `{ row, rowIndex, column, columnIndex, cell, cellValue, $rowIndex, $columnIndex }` |

> 组件支持 vxe-table 的所有原生事件。

## VxeTablePro Methods

通过 ref 可以获取到表格实例并调用实例方法。

### 扩展方法

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| hasEditData | 检查是否有修改的数据（新增、修改、删除） | — | boolean |
| clearFilterPro | 清除所有列的筛选条件 | — | — |
| setColumnFilterOptions | 设置列的筛选选项 | `tableData` | — |
| getSorts | 获取排序信息 | `dataField?`, `sortOrder?` | Array |
| insert | 插入新行（扩展方法，自动设置 rowStatus） | `row` 或 `rows[]` | — |

### vxe-table 原生方法

组件暴露了 vxe-table 的所有原生方法，常用的包括：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| getTableData | 获取表格数据 | — |
| getRecordset | 获取记录集（新增、修改、删除的记录） | — |
| setCurrentRow | 设置当前行 | `row` |
| setEditRow | 设置编辑行 | `row` |
| clearAll | 清空所有数据 | — |
| remove | 删除行 | `row` |
| clearFilter | 清除筛选 | — |
| clearSort | 清除排序 | — |
| setSort | 设置排序 | `sortConfigs`, `trigger` |
| toggleCheckboxRow | 切换行的复选框状态 | `row` |
| getCheckedRecords | 获取选中的行 | — |

:::demo 方法调用示例

```vue
<template>
  <div>
    <el-button @click="handleAdd">新增</el-button>
    <el-button @click="handleSave">保存</el-button>
    <el-button @click="handleCheckEdit">检查修改</el-button>
    <el-button @click="handleGetSorts">获取排序</el-button>
    <vxe-table-pro ref="tableRef" id="methods-table" :data="tableData">
      <vxe-column-pro field="name" title="姓名" width="120" :edit-render="{ name: 'input' }" />
      <vxe-column-pro field="age" title="年龄" width="80" />
    </vxe-table-pro>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const tableData = ref([
  { name: '张三', age: 25 },
  { name: '李四', age: 30 }
])

function handleAdd() {
  tableRef.value.insert({ name: '', age: 0 })
  ElMessage.success('新增成功')
}

function handleSave() {
  if (tableRef.value.hasEditData()) {
    const recordset = tableRef.value.getRecordset()
    console.log('新增:', recordset.insertRecords)
    console.log('修改:', recordset.updateRecords)
    console.log('删除:', recordset.removeRecords)
    ElMessage.success('保存成功')
  } else {
    ElMessage.info('没有需要保存的数据')
  }
}

function handleCheckEdit() {
  const hasEdit = tableRef.value.hasEditData()
  ElMessage[hasEdit ? 'warning' : 'success'](
    hasEdit ? '表格有未保存的修改' : '表格没有修改'
  )
}

function handleGetSorts() {
  const sorts = tableRef.value.getSorts()
  console.log('排序信息:', sorts)
  ElMessage.info(`当前有 ${sorts.length} 个排序列`)
}
</script>
```

:::

## VxeColumnPro Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| field | 字段名 | string | — | — |
| title | 列标题 | string | — | — |
| width | 列宽度 | number/string | — | — |
| min-width | 最小列宽度 | number/string | — | — |
| align | 对齐方式 | string | left/center/right | left |
| fixed | 固定列 | string | left/right | — |
| type | 列类型 | string | seq/checkbox/radio/expand/operation | — |
| filterable | 是否启用筛选功能 | boolean | — | true |
| edit-render | 编辑渲染配置 | object | — | — |
| sortable | 是否可排序 | boolean | — | true |

### edit-render 配置项

| 参数 | 说明 | 类型 | 可选值 |
|------|------|------|--------|
| name | 渲染类型 | string | input/select/textarea |
| options | 选项数据（select 类型） | array | — |
| props | 传递给渲染组件的属性 | object | — |

> 组件支持 vxe-column 的所有原生属性。

## VxeColumnPro Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 自定义列内容 | `{ row, rowIndex, column, columnIndex, $rowIndex, $columnIndex }` |
| header | 自定义表头内容 | `{ column, columnIndex, $columnIndex }` |
| filter | 自定义筛选面板 | `{ column, columnIndex, $columnIndex }` |

## 高级功能

### 拖拽选择

在序号列或复选框列上拖拽可以批量切换行的复选框状态。拖拽范围内的行：已勾选的行会变成未勾选，未勾选的行会变成已勾选。

### 多列排序

按住 `Ctrl` 键点击表头可以添加多个排序列，排序序号会显示在排序图标旁边。

### 列布局保存

列的显示/隐藏、顺序、宽度、冻结状态等配置会自动保存到服务器，下次打开页面时会自动恢复。

### 编辑模式

点击单元格即可进入编辑模式，编辑完成后自动去除字符串字段的前后空格。

## 注意事项

1. **表格 ID**：必须为每个表格设置唯一的 `id`，用于保存布局配置。
2. **列字段名**：`VxeColumnPro` 的 `field` 属性必须唯一且不能为空。
3. **布局配置**：布局配置需要后端接口支持，请确保相关接口已配置。
4. **扩展方法**：只有在 `use-extend` 为 `true` 时才能使用扩展方法。
5. **筛选功能**：筛选功能会自动从表格数据中提取选项，支持搜索和多选。

## 完整示例

:::demo 完整功能示例

```vue
<template>
  <div class="vxe-table-pro-example">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="success" @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button @click="handleClearFilter">清除筛选</el-button>
      <el-button @click="handleGetSorts">获取排序</el-button>
    </div>

    <vxe-table-pro
      ref="tableRef"
      id="full-example-table"
      :data="tableData"
      :show-toolbar="true"
      :show-seq="true"
      :show-checkbox="true"
      :min-height="400"
      @sort-change="onSortChange"
      @current-change="onCurrentChange"
    >
      <vxe-column-pro field="name" title="姓名" width="120" :edit-render="{ name: 'input' }" :filterable="true" />
      <vxe-column-pro field="age" title="年龄" width="80" :filterable="true" />
      <vxe-column-pro field="email" title="邮箱" width="200" :edit-render="{ name: 'input' }" :filterable="true" />
      <vxe-column-pro
        field="status"
        title="状态"
        width="120"
        :edit-render="{
          name: 'select',
          options: statusOptions,
          props: { placeholder: '请选择状态' }
        }"
        :filterable="true"
      >
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </vxe-column-pro>
      <vxe-column-pro field="address" title="地址" min-width="200" :edit-render="{ name: 'input' }" />
      <vxe-column-pro field="operation" title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-column-pro>
    </vxe-table-pro>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VxeTablePro from './VxeTablePro/index.vue'
import VxeColumnPro from './VxeTablePro/VxeColumnPro.vue'

const tableRef = ref()
const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    status: '1',
    address: '北京市朝阳区'
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    status: '1',
    address: '上海市浦东新区'
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    status: '0',
    address: '广州市天河区'
  }
])

function handleAdd() {
  tableRef.value.insert({
    id: Date.now(),
    name: '',
    age: 0,
    email: '',
    status: '1',
    address: ''
  })
  ElMessage.success('新增成功，请编辑数据')
}

function handleSave() {
  if (tableRef.value.hasEditData()) {
    const recordset = tableRef.value.getRecordset()
    console.log('新增的数据:', recordset.insertRecords)
    console.log('修改的数据:', recordset.updateRecords)
    console.log('删除的数据:', recordset.removeRecords)
    ElMessage.success('保存成功')
  } else {
    ElMessage.info('没有需要保存的数据')
  }
}

function handleReset() {
  tableRef.value.clearAll()
  ElMessage.success('重置成功')
}

function handleClearFilter() {
  tableRef.value.clearFilterPro()
  ElMessage.success('清除筛选成功')
}

function handleGetSorts() {
  const sorts = tableRef.value.getSorts()
  console.log('排序信息:', sorts)
  ElMessage.info(`当前有 ${sorts.length} 个排序列`)
}

function handleEdit(row) {
  tableRef.value.setEditRow(row)
  ElMessage.info('已进入编辑模式')
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      tableRef.value.remove(row)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

function onSortChange(params) {
  const { field, order } = params
  if (order) {
    ElMessage.info(`按 ${field} 字段${order === 'asc' ? '升序' : '降序'}排序`)
  }
}

function onCurrentChange(params) {
  console.log('当前行变化:', params)
}
</script>

<style scoped>
.vxe-table-pro-example {
  padding: 20px;
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
```

:::

