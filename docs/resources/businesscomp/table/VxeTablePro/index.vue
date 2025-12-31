<template>
  <div class="vxe-table-pro">
    <!-- 自定义列工具栏 -->
    <div v-if="showToolbar && xTableProRef" class="vxe-toolbar-wrap flex-c" :class="toolbarClass">
      <LayoutSetting :tableRef="xTableProRef" :limitFieldCount="limitFieldCount" style="margin-top: 4px" />
      <!-- <vxe-toolbar ref="toolbarRef" :custom="{ icon: '' }" /> -->
    </div>
    <!-- 表格 -->
    <!-- :checkbox-config="{ checkField: 'checked', trigger: 'row' }" -->
    <vxe-table
      ref="xTableProRef"
      :menu-config="menuConfig"
      :customConfig="(() => customConfig(xTableProRef))()"
      header-align="center"
      align="left"
      height="auto"
      :header-height="38"
      :min-height="minHeight"
      :keepSource="true"
      :autoResize="true"
      showOverflow="title"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      :column-config="{ drag: true, resizable: true, useKey: true }"
      :column-drag-config="{
        trigger: 'cell',
        checkMethod: ({ column }) => {
          return true //允许拖拽的条件:不是特殊列、不是固定列、不是必填列
        }
      }"
      @column-drag-end="columnDragEndEvent"
      :row-group-config="{ showTotal: true }"
      :sort-config="{
        multiple: true,
        remote: true
      }"
      :filter-config="{ showIcon: true }"
      :checkbox-config="{ range: false }"
      :row-config="mergedRowConfig"
      :stripe="true"
      :empty-text="emptyText"
      @custom="toolbarCustomEvent"
      @edit-closed="editClosedEvent"
      @edit-actived="editActivedEvent"
      @edit-blur="editBlurEvent"
      @data-change="dataChangeEvent"
      @resizable-change="(params) => resizableChange({ ...params, $table: $tablePro })"
      @menu-click="(context) => menuConfig.menuClickEvent(context, $tablePro)"
      @header-cell-menu="(context) => onHeaderCellMenu(context, $tablePro)"
      @sort-change="onSortChange"
      :row-style="rowStyle"
      @keydown="enterSwitch ? tableKeydown : null"
      v-bind="$attrs"
      v-on="$attrs"
      @current-change="onCurrentChangePro"
      @cell-mouseenter="onCellMouseenter"
    >
      <!-- <template #header>
        每次查询会重复渲染,不能放在这里
        <LayoutSetting :tableRef="xTableProRef" style="margin-top: 4px"/>
      </template> -->
      <vxe-column v-if="showSeq" type="seq" title=" " width="45" fixed="left" align="center" class-name="vxe-seq" />
      <vxe-column
        v-if="showCheckbox"
        type="checkbox"
        width="45"
        fixed="left"
        align="center"
        class-name="vxe-checkbox"
      />
      <slot></slot>
    </vxe-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VxeTablePro'
}
</script>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, defineExpose, onUnmounted, computed, useAttrs, nextTick, provide, defineEmits } from 'vue'
import useSaveTableParams from './utils/useSaveTableParams.ts' //表格公共方法
import useSetElTable from './utils/useSetElTable.ts' //表格公共方法
import LayoutSetting from './Layout/LayoutSettingDialog.vue' //表格公共方法
// import pageState from './utils/pageState'
import { getCurrentInstance } from 'vue'
import type { VxeToolbarInstance } from 'vxe-table'
import { exposeVxeTableMethods, isValidTableInstance, type IExtendsVxeTableInstance } from './utils/useExposeMethods'
import vxeTableExt from './utils/vxeTableExt'
import { tableKeydown } from './utils/keyboard.ts'

const route = useRoute()
const instance = getCurrentInstance()
const proxy = instance?.proxy
const attrs = useAttrs()
const pageStateInstance = {} //pageState.instance(route as any)

const props = defineProps({
  showToolbar: {
    type: Boolean,
    default: true
  },
  useExtend: {
    type: Boolean, //是否开启扩展方法
    default: true
  },
  onEditClosed: {
    type: Function,
    default: () => {}
  },
  minHeight: {
    type: Number,
    default: 96
  },
  wrapClass: {
    type: String,
    default: ''
  },
  toolbarClass: {
    type: String,
    default: ''
  },
  //展示序号列
  showSeq: {
    type: Boolean,
    default: true
  },
  //展示勾选列
  showCheckbox: {
    type: Boolean,
    default: true
  },
  //限制展示列数
  limitFieldCount: {
    type: Number,
    default: 0 //表示不限制
  },
  enterSwitch: {
    type: Boolean,
    default: false //回车切换
  },
  onCurrentChange: {
    type: Function,
    default: () => {}
  },
  beforeCurrentChange: {
    type: Function, //表格切换前校验
    default: null
  }
})

const useSetTable = useSetElTable()
const {
  initTableConfig,
  onHeaderCellMenu,
  resizableChange,
  columnDragEnd,
  menuConfig,
  toolbarCustomEvent,
  customConfig
} = useSaveTableParams()

// 合并默认的 row-config 和外部传入的配置
const mergedRowConfig = computed(() => {
  const defaultRowConfig = { isCurrent: true }
  const externalRowConfig = attrs['row-config'] || {}
  // 合并配置,外部传入的配置会覆盖默认配置
  return {
    ...defaultRowConfig,
    ...externalRowConfig
  }
})

// 国际化空数据提示
const emptyText = computed(() => {
  return proxy?.$t('tip.noData')
})

const toolbarRef = ref<VxeToolbarInstance>()
const xTableProRef = ref<IExtendsVxeTableInstance>()
let $tablePro: any = null
let vxeInsert: any = () => {}
const editingRowIndex = ref(null)
// 行样式配置(通过索引判断)
function rowStyle({ rowIndex }) {
  // 判断是否为编辑行(用索引对比)
  if (rowIndex === editingRowIndex.value) {
    return {
      backgroundColor: 'rgba(239, 246, 246, 1)' //编辑行背景色
    }
  }
  return {
    backgroundColor: '#fff'
  }
}
const isPromise = (func) => {
  return func instanceof Promise || func.constructor.name === 'AsyncFunction'
}

const currentRow = ref({})
async function onCurrentChangePro(params) {
  if (props.beforeCurrentChange) {
    let flag = true
    if (isPromise(props.beforeCurrentChange)) {
      flag = await props.beforeCurrentChange(params)
    } else {
      flag = props.beforeCurrentChange(params)
    }
    if (flag == false) {
      const fullData = $tablePro.getTableData().fullData
      if (Object.keys(currentRow.value).length !== 0) {
        $tablePro?.setCurrentRow(currentRow.value)
      } else {
        $tablePro?.setCurrentRow(fullData[0])
      }
      return
    }
  }
  currentRow.value = params.row
  props.onCurrentChange?.(params) // 执行父组件的事件
}
// 扩展原来的insert方法
function insert(params: any): any {
  if (Array.isArray(params)) {
    params.forEach((row: any) => {
      row.rowStatus = 4
    })
  } else {
    params.rowStatus = 4
  }
  return vxeInsert(params)
}

const resetFiltersTrigger = ref(-1)
provide('resetFiltersTrigger', resetFiltersTrigger)

function setColumnFilterOptions(tableData) {
  //是否有变化的数据
  resetFiltersTrigger.value++
  // useSetTable.setColumnFilterOptions ($tablePro, tableData)
  //设置表格列过滤值
}

// 是否有变化的数据
function hasEditData() {
  if (!isValidTableInstance($tablePro)) return false
  const { insertRecords, updateRecords, removeRecords } = $tablePro.getRecordset()
  return (insertRecords.length || updateRecords.length || removeRecords.length) > 0
}

// 判断页面为已修改状态
function checkPageModified() {
  // try {
  //   if (hasEditData()) {
  //     pageStateInstance.setModified(true)
  //     pageStateInstance.addVxeTableInstance($tablePro)
  //   } else {
  //     pageStateInstance.reset()
  //     pageStateInstance.removeVxeTableInstance($tablePro)
  //   }
  // } catch (error) {
  //   console.warn('pageState modify failed:', error)
  // }
}

function editClosedEvent(e: any) {
  // 自动去除所有字符串字段前后空格
  if (e && e.row && typeof e.row === 'object') {
    Object.keys(e.row).forEach((key) => {
      if (typeof e.row[key] === 'string') {
        e.row[key] = e.row[key].trim()
      }
    })
  }
  props.onEditClosed && props.onEditClosed(e)

  checkPageModified()
  editingRowIndex.value = null
}

function editActivedEvent(e: any) {
  // 编辑激活事件
  editingRowIndex.value = e.rowIndex
}

function editBlurEvent(e: any) {}

function dataChangeEvent(e: any) {
  // 数据变化事件
  checkPageModified()
}
// ---------------------------------------------------------------- 排序状态管理 Start
const sortColumns = ref<Array<{ field: string; order: string }>>([])
const emit = defineEmits(['sortChange'])
let sortMap = new Map()
const isControlKey = ref(false)
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Control') {
    isControlKey.value = true
  }
}
function onKeyup(event: KeyboardEvent) {
  if (event.key === 'Control') {
    isControlKey.value = false
  }
}

function onSortChange(params: any) {
  const { sortList, field, order } = params
  if (!isControlKey.value) {
    sortMap.clear()
  }
  if (order) {
    sortMap.set(field, params)
  } else {
    sortMap.delete(field)
  }
  if (!isControlKey.value) {
    removeBadge()
    if (order) {
      sortColumns.value = [
        {
          column: params.column,
          field: params.field,
          order: params.order,
          property: params.property,
          sortTime: params.sortTime
        }
      ]
      params.sortList = sortColumns.value
    } else {
      sortColumns.value = []
      params.sortList = []
    }
    $tablePro.clearSort()
    $tablePro.setSort([{ field: params.field, order: params.order }], true)
    emit('sortChange', params)
    return
  }

  // console.log(' 【 sortMap 】 -265', sortMap)
  if (sortList && sortList.length > 0) {
    sortColumns.value = sortList
  } else {
    sortColumns.value = []
  }
  // 更新排序序号显示
  nextTick(() => {
    isControlKey.value && updateSortOrderBadges()
  })
  emit('sortChange', params)
}
function removeBadge() {
  const tableEl = ($tablePro as any).$el
  // 移除所有现有的排序序号徽章
  const existingBadges = tableEl.querySelectorAll('.vxe-sort-order-badge')
  existingBadges.forEach((badge) => badge.remove())
}
// 更新排序序号徽章
function updateSortOrderBadges() {
  if (!isValidTableInstance($tablePro)) return

  const tableEl = ($tablePro as any).$el
  if (!tableEl) return
  removeBadge()
  // 如果没有排序列,直接返回
  if (sortColumns.value.length === 0) return
  const headerCells = tableEl.querySelectorAll('.vxe-header--column')
  // // 为每个排序列添加序号徽章
  sortColumns.value.forEach((sortCol, index) => {
    headerCells.forEach((cell: Element) => {
      // 通过 cell 属性查找对应的列
      const columnNode = $tablePro.getColumnNode(cell)
      const column = columnNode.item
      // console.log('columnNode】-265', columnNode, column)
      if (column && column.field === sortCol.field) {
        const fieldIndex = sortColumns.value.findIndex((item) => item.field === column.field)
        const sortOrder = fieldIndex + 1
        // 查找排序图标容器
        const sortIcon = cell.querySelector('.vxe-cell--sort') as HTMLElement
        if (sortIcon) {
          // 检查是否已存在徽章
          let badge = sortIcon.querySelector('.vxe-sort-order-badge') as HTMLElement
          if (!badge) {
            // 创建新的徽章元素
            badge = document.createElement('span')
            badge.className = 'vxe-sort-order-badge'
            // 确保排序图标容器是相对定位
            sortIcon.style.position = 'relative'
            sortIcon.appendChild(badge)
          }
          // 更新已存在徽章的数字
          badge.textContent = String(sortOrder)
        }
      }
    })
  })
}

/**
 * 获取排序信息
 * @returns 排序
 */
function getSorts(dataField?: string, sortOrder?: string) {
  if (!isValidTableInstance($tablePro)) return []
  const sortcolumns = Array.from(sortMap.values()) // $tablePro.getSortColumns()
  const sorts: Array<any> = []
  sortcolumns.forEach((column, idx) => {
    if (column.order && (!dataField || column.field === dataField)) {
      sorts.push({
        propertyName: column.field,
        sortDirection: column.order.toUpperCase(),
        sortOrder: idx + 1
      })
    }
  })
  return sorts
}
// ---------------------------------------------------------------- 排序状态管理 End ----------------------------------------------------------------

//列拖拽结束事件
function columnDragEndEvent(params: any) {
  const { newIndex, oldIndex, column } = params
  if (newIndex !== oldIndex) {
    //调用自动保存布局
    columnDragEnd({ $table: $tablePro, column, newIndex, oldIndex })
  }
}
//清除筛选触发器,用于通知子组件执行 clearFilter
// const clearFilterTrigger = ref(0)
// 提供清除筛选的方法给子组件
// provide('clearFilterTrigger', clearFilterTrigger)
function clearFilterPro() {
  $tablePro.clearFilter()
  // 触发所有子列组件执行 clearFilter
  // clearFilterTrigger.value++
}
// 扩展方法
function extendsMethods() {
  if (!isValidTableInstance($tablePro)) return
  $tablePro.hasEditData = hasEditData
  $tablePro.clearFilterPro = clearFilterPro
  $tablePro.setColumnFilterOptions = setColumnFilterOptions
  $tablePro.insert = insert
  $tablePro.getSorts = getSorts
}

// ---------------------------------------------------------------- 拖拽选择功能 Start ----------------------------------------------------------------
/**
 * 拖拽选择功能
 * 在序号列或复选框列上拖拽,可以批量切换行的复选框状态
 * 注意:由于使用了 :checkbox-config="{ range: false }",所以需要自定义实现拖拽选择功能
 * 拖拽范围内的行:已勾选的行会变成未勾选,未勾选的行会变成已勾选
 * 拖拽范围外的行:不受影响
 * 每次拖拽操作都是独立的,可以累积选择
 */
const dragColumns = ['seq', 'checkbox']
const hoveringCell = ref({}) //当前移入的单元格

function isInSpecialColumn(event: MouseEvent): 'seq' | 'checkbox' | null {
  if (!isValidTableInstance($tablePro)) return null
  const target = event.target as HTMLElement
  if (!target) return null
  // 向上查找单元格元素
  let element = target
  while (element && element !== document.body) {
    // 检查是否是序号列单元格(使用多种方式匹配)
    //closest():从当前元素开始,向上遍历其所有祖先元素(包括自身),直到找到第一个匹配指定 CSS 选择器的元素。
    if (element.closest('.vxe-seq')) {
      return 'seq'
    }
    // 检查是否是勾选列单元格(使用多种方式匹配)
    if (element.closest('.vxe-checkbox')) {
      return 'checkbox'
    }
    element = element.parentElement as HTMLElement
  }
  return null
}

// 单元格移入事件
function onCellMouseenter(e) {
  hoveringCell.value = e
}
/**
 * 鼠标按下事件
 */
const mouseDownSeq = ref(-1) // 鼠标按下时的序号
function handleMouseDown(event: MouseEvent) {
  if (!dragColumns.includes(hoveringCell.value?.column?.type)) {
    return
  }
  mouseDownSeq.value = hoveringCell.value.seq
}
/**
 * 鼠标释放事件
 */
function handleMouseUp(event: MouseEvent) {
  // 判断鼠标是否在表格区域内
  if (!isValidTableInstance($tablePro)) return
  const tableEl = ($tablePro as any).$el
  if (!tableEl || !tableEl.contains(event.target as Node)) {
    return
  }

  if (!dragColumns.includes(hoveringCell.value?.column?.type)) {
    return
  }
  const downSeq = mouseDownSeq.value
  const upSeq = hoveringCell.value.seq
  if (downSeq === upSeq) {
    return
  }
  const startSeq = Math.min(downSeq, upSeq)
  const endSeq = Math.max(downSeq, upSeq)
  console.log('【seq】-724', startSeq, endSeq)
  const fullData = $tablePro.getTableData().fullData
  const mouseList = fullData.slice(startSeq - 1, endSeq)
  mouseList.forEach((row) => {
    $tablePro.toggleCheckboxRow(row)
  })
}

/**
 * 包装的鼠标按下事件处理(只处理特殊列)
 */
function wrappedHandleMouseDown(event: MouseEvent) {
  // 检查是否在序号列或复选框列上
  const target = isInSpecialColumn(event)
  if (!target) return // 不在特殊列上,不处理
  handleMouseDown(event)
}

/**
 * 初始化拖拽选择功能
 */
function initDragCheckbox() {
  if (!isValidTableInstance($tablePro)) return

  const tableEl = ($tablePro as any).$el
  if (!tableEl) return

  // 使用事件委托,在表格容器上监听,但只处理序号列和复选框列的事件
  // 通过 wrappedHandleMouseDown 和 wrappedHandleMouseMove 函数来过滤
  tableEl.addEventListener('mousedown', wrappedHandleMouseDown, true)

  // mouseup 和 mouseleave 需要监听 document 和表格容器
  document.addEventListener('mouseup', handleMouseUp, true)

  // 返回清理函数
  return () => {
    tableEl.removeEventListener('mousedown', wrappedHandleMouseDown, true)
    document.removeEventListener('mouseup', handleMouseUp, true)
  }
}
// ---------------------------------------------------------------- 拖拽选择功能 End ----------------------------------------------------------------

onMounted(() => {
  if (!isValidTableInstance(xTableProRef.value)) return
  $tablePro = xTableProRef.value
  // 自动注册表格实例到页面状态管理
  if ($tablePro) {
    pageStateInstance.addVxeTableInstance($tablePro)
  }
  if (!$tablePro.id) {
    console.error('【表格id不能为空】', $tablePro)
  }
  initTableConfig($tablePro, toolbarRef.value)

  // 使用新的方法暴露函数
  exposeVxeTableMethods($tablePro, instance)

  if (props.useExtend && $tablePro.insert) {
    vxeInsert = $tablePro.insert
  }
  if (props.useExtend) {
    extendsMethods()
  }
  // 排序变化事件-监听
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)

  // 初始化拖拽选择功能
  nextTick(() => {
    initDragCheckbox()
  })
})

onUnmounted(() => {
  // 排序变化事件-移除
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('keyup', onKeyup)
  // 清理拖拽选择事件
  if ($tablePro) {
    const tableEl = ($tablePro as any).$el
    if (tableEl) {
      tableEl.removeEventListener('mousedown', wrappedHandleMouseDown, true)
    }
  }
  document.removeEventListener('mouseup', handleMouseUp, true)
})

// 暴露整个表格实例
const getTableInstance = () => {
  if (!$tablePro) return null
  return vxeTableExt.proxy($tablePro, {}, proxy)
}

defineExpose({
  ...getTableInstance(),
  getTable: getTableInstance
})
</script>

<style scoped lang="scss">
.vxe-table-pro {
  height: 100%;
  position: relative;
  width: 100%;
  // font-size: 14px;

  .vxe-toolbar-wrap {
    position: absolute;
    top: 7px;
    z-index: 100;
    margin-left: 0;
    width: 45px;
    // 工具栏样式
    .vxe-toolbar {
      background-color: transparent !important;
      padding: 0 !important;
    }
  }

  :deep(.vxe-table--body-wrapper) {
    overflow-y: auto;
    min-height: v-bind(minHeight + 'px');
  }
}
</style>
<style lang="scss">
.vxe-seq {
  user-select: none;
}
.vxe-table-custom-wrapper.placement--top-right {
  top: 43px !important;
  left: 0px !important;
  right: unset !important;
}

.vxe-table {
  font-family: 'Source Han Sans Regular', sans-serif !important;
}
.vxe-header--column {
  font-weight: 500 !important;
}
// 表格布局
.vxe-context-menu--option-wrapper {
  .begin-group {
    border-top: 1px solid #ccc; //右键菜单分隔线
  }
  .layout-checked {
    &:before {
      content: 'V'; //默认布局勾选
      color: #008000;
    }
  }
}

// 表头-排序图标-序号
.vxe-cell--sort {
  // 排序序号徽章样式
  .vxe-sort-order-badge {
    position: absolute;
    top: -8px;
    right: 0px;
    color: #b0b0b1;
    font-size: 9px;
  }
}
</style>
