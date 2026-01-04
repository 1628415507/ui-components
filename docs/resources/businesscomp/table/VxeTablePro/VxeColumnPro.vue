<template>
  <vxe-column
    ref="xColumnProRef"
    :sortable="!isSpecialColumn"
    :filters="columnFilters"
    :filter-method="filterMethod"
    v-bind="$attrs"
  >
    <!-- :header-class-name="hasFiltr ? 'pro filter-active': 'pro'" -->
    <!-- 筛选搜索模板:当启用筛选搜索且不是特殊列时显示 -->
    <template #filter="params">
      <div class="filter-panel" :ref="(el) => setFilterPanelRef(el, params)">
        <el-input
          v-model="filterSearchTexts[colField]"
          size="small"
          :placeholder="$t ? $t('tip.pleaseEnter') : '请输入'"
          clearable
          style="margin-bottom: 8px"
          suffix-icon="Search"
        />
        <div>
          <el-button type="primary" link @click="selectAllOptions(params)">全选</el-button>
          <el-button type="primary" link @click="clearAllOptions(params)">清除</el-button>
          <el-button type="primary" link @click="invertAllOptions(params)">反选</el-button>
        </div>
        <div class="filter-options">
          <el-checkbox
            v-for="(option, index) in searchFilteredOptions"
            v-model="option.tempChecked"
            :key="index"
            :title="option.label"
            :label="option.label"
            :true-value="true"
            :false-value="false"
            style="display: block; margin-bottom: 4px"
            @change="(val) => onOptionChange(params, val, option)"
          />
          <div v-if="!searchFilteredOptions?.length" class="empty-list">暂无数据</div>
        </div>
        <div class="filter-footer">
          <el-button type="primary" :disabled="!hasAnyOptionChecked(params)" @click="confirmFilter(params)">
            确认
          </el-button>
          <el-button @click="resetFilter(params)">重置</el-button>
          <el-button @click="cancelFilter(params)">取消</el-button>
        </div>
      </div>
    </template>
    <!-- 透传其他插槽 -->
    <template v-for="name in otherSlots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </vxe-column>
</template>

<script lang="ts">
export default {
  name: 'VxeColumnPro'
}
</script>

<script setup lang="ts">
import { VxeTable, VxeColumn } from 'vxe-table'
import useSetElTable from './utils/useSetElTable' //表格公共方法
import {
  getCurrentInstance,
  defineProps,
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  useSlots,
  inject,
  watch,
  type Ref
} from 'vue'

const props = defineProps({
  // 是否启用筛选搜索功能
  filterable: {
    type: Boolean,
    default: true
  }
})

const instance = getCurrentInstance()
const proxy = instance?.proxy
const slots = useSlots()
const specialColumn = ['seq', 'checkbox', 'expand', 'operation']
// 获取 $t 函数用于国际化
const $t = proxy?.$t || ((key: string) => key)
const colField = ref<string | undefined>(instance?.attrs.field as string | undefined)
const isSpecialColumn = computed(() => {
  const columnType = instance?.attrs.type as string | undefined
  return columnType ? specialColumn.includes(columnType) : false
})
// 获取所有插槽名称,排除 filter 插槽(如果启用筛选搜索)
const otherSlots = computed(() => {
  const slotNames = Object.keys(slots)
  if (props.filterable && !isSpecialColumn.value && colField.value) {
    return slotNames.filter((name) => name !== 'filter')
  }
  return slotNames
})

// ---------------------------------------------------------------- 筛选框 Start----
const { getOptionsByField, filterHandlerToVxe, filters } = useSetElTable()
const columnFilters = computed(() => {
  if (props.filterable === false || isSpecialColumn.value) return null
  return filters
})
const filterMethod = computed(() => {
  if (props.filterable === false || isSpecialColumn.value) return null
  return filterHandlerToVxe
})
// 筛选搜索文本,用于存储每个列的搜索关键词
const filterSearchTexts = ref<Record<string, string>>({})
//存储筛选面板的引用和参数
const panelRefsMap = ref<Map<string, { el: HTMLElement | null; params: any }>>(new Map())
// 跟踪当前打开的面板,避免重复执行全选
const openedPanels = ref<Set<string>>(new Set())
//存储每个列打开时的初始筛选状态(用于判断是否有变化)
const initialFilterStates = ref<Map<string, Map<any, boolean>>>(new Map())
//标记是否有操作发生(按钮点击或选项变化)
const hasFilterChanged = ref<Map<string, boolean>>(new Map())
let filterOptions = ref<any[]>([])
// const hasFiltr = ref(false) //是否存在筛选项
// let currentTableOptionsMap = new Map() // 筛选选项映射表
// 注入父组件提供的清除筛选触发器
// const clearFilterTrigger = inject<Ref<number>>('clearFilterTrigger', ref(0))
const resetFiltersTrigger = inject<Ref<number>>('resetFiltersTrigger', ref(0))

// // 监听清除筛选触发器,执行清除操作
// watch(clearFilterTrigger, () => {
//   if (clearFilterTrigger.value > 0) {
//     // clearFilter()
//   }
// })

// const isClearFilter = ref(false)
//清除所有筛选项
// function clearFilter() {
//   // isClearFilter.value = true
//   // hasFiltr.value = false
//   // currentTableOptionsMap.delete(colField.value)
// }

let isResetFilter = false
function setFilterOptions(params, isReset = false) {
  console.log('【setFilterOptions】 -150')
  try {
    let $table = $colTable
    const column = $table.getColumnByField(colField.value)
    const isFilter = $table.isFilter(colField.value) //判断当前列是否是筛选列,不是则获取最新数据
    // console.log('【 isFilter】 -154', isFilter)
    //当前列未筛选或表格重新查询,则获取当前表格显示的数据作为选项
    const isResetTrigger = oldFilterTrigger != resetFiltersTrigger.value
    // console.log('oldFilterTrigger】 -157', oldFilterTrigger, resetFiltersTrigger.value)
    if (!isFilter || isResetTrigger) {
      const vxeData = $table.getTableData()
      let optionData = vxeData?.tableData //获取当前表格列筛选后显示的数据
      // 表格重新查询
      if (isResetTrigger) {
        optionData = vxeData?.fullData
        oldFilterTrigger = resetFiltersTrigger.value
        isResetFilter = true //记录是否需要重置筛选项
      }
      if (optionData.length) {
        const options = getOptionsByField($table, optionData, column)
        // 获取排序前的筛选值
        const activeFilterCol = $table.getCheckedFilters().find((item) => item.field === colField.value)
        const activeFilterValues = activeFilterCol?.values || []
        filterOptions.value = options.map((option) => {
          return {
            label: option.label,
            value: option.value,
            tempChecked: isResetTrigger && isFilter ? activeFilterValues.includes(option.value) : true
          }
        })
        // // 给filterOptions.value赋值完再重置Filters
        if (!isFilter && isResetFilter) {
          isResetFilter = false
          $table.setFilter(column, options)
        }
      }
    }
    // 若有筛选,则取筛选前的数据
  } catch {
    console.error('【setFilterOptions】 -220')
  }
}

let oldFilterTrigger = 0
//关闭面板
function closeFilterPanel() {
  initialFilterStates.value.delete(colField.value)
}

let $colTable
//设置筛选面板引用
function setFilterPanelRef(el: any, params: any) {
  if (!el) {
    closeFilterPanel() //关闭面板
    return
  }
  // 打开面板,确保打开时只执行一次
  if (initialFilterStates.value.has(colField.value)) {
    return
  }
  // nextTick(() => {
  openFilterPanel(el, params)
  // })
}
// 打开面板
function openFilterPanel(el, params) {
  const { column, $panel, $table } = params
  console.log('【 openFilterPanel】 -122', el, params)
  // 处理 Vue 3 ref 回调的类型
  const element = el as HTMLElement | null
  // nextTick(() => {
  panelRefsMap.value.set(colField.value, { el: element, params })
  // })
  if (!$colTable) {
    $colTable = $table
  }
  setFilterOptions(params)
  const vxeData = $table.getTableData()
  const newFilters = getOptionsByField($table, vxeData.fullData, column)
  if (!column.filters.length && newFilters.length) {
    $table.setFilter(column, newFilters)
  }
  // 面板打开时,保存初始状态
  if (!initialFilterStates.value.has(colField.value)) {
    saveInitialOptionState(params)
    // 重置变化标记
    hasFilterChanged.value.set(colField.value, false)
    // 添加点击外部监听
    addOutsideClickListener(params)
  }
}
let oldOptions = [] //记录旧的筛选项
const searchFilteredOptions = computed(() => {
  let curOptions = filterOptions.value
  const searchText = (filterSearchTexts.value[colField.value] || '').toLowerCase()
  if (!searchText) {
    return curOptions
  }
  return curOptions.filter((option) => {
    const label = (option.label || '').toString().toLowerCase()
    const value = (option.value || '').toString().toLowerCase()
    return label.includes(searchText) || value.includes(searchText)
  })
})
// 保存初始筛选状态
function saveInitialOptionState(params: any) {
  const options = filterOptions.value
  if (!colField.value || !options || !Array.isArray(options)) {
    return
  }
  // 保存每个选项的初始 checked 状态
  const initialOptionsState = new Map()
  options.forEach((option) => {
    initialOptionsState.set(option.label, option.tempChecked === true)
  })
  initialFilterStates.value.set(colField.value, initialOptionsState)
  // console.log('【 initialFilterStates 】 -122', initialOptionsState, initialFilterStates)
}
// 检查筛选状态是否有变化
function hasOptionStateChanged(params: any): boolean {
  const options = filterOptions.value
  if (!colField.value || !options || !Array.isArray(options)) {
    return false
  }
  const initialOptionsState = initialFilterStates.value.get(colField.value)
  if (!initialOptionsState) {
    return false
  }
  // 比较当前状态和初始状态
  for (const option of options) {
    const initialChecked = initialOptionsState.get(option.label) || false
    const currentChecked = option.tempChecked === true
    if (initialChecked !== currentChecked) {
      return true
    }
  }
  return false
}
// 处理筛选选项变化
const onOptionChange = (params: any, checked: any, option: any) => {
  // 标记有变化
  if (colField.value) {
    hasFilterChanged.value.set(colField.value, true)
  }
}
// 添加点击外部监听
function addOutsideClickListener(params: any) {
  // 先移除旧的监听
  const oldHandler = (params as any)?._outsideClickHandler
  if (oldHandler) {
    document.removeEventListener('click', oldHandler, true)
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (!colField.value) return
    const panelRef = panelRefsMap.value.get(colField.value)
    if (!panelRef || !panelRef.el) return
    // 检查点击是否在筛选面板外部
    const target = event.target as HTMLElement
    // 同时检查是否点击在 vxe-table 筛选图标上(避免关闭)
    const isFilterIcon = target.closest('.vxe-table--filter-wrapper') || target.closest('.vxe-table--filter-trigger')
    if (panelRef.el && !panelRef.el.contains(target) && !isFilterIcon) {
      // 点击外部,检查是否有选中项和过滤项
      const hasChecked = hasAnyOptionChecked(params)
      if (!hasChecked && !filterSearchTexts.value?.[colField.value]) {
        // 没有选中任何选项,直接关闭面板,不执行筛选
        cancelFilter(params)
        removeOutsideClickListener()
        return
      }
      // 有选中项,检查是否有变化
      const hasChanged = hasFilterChanged.value.get(colField.value) || hasOptionStateChanged(params)
      if (hasChanged || filterSearchTexts.value?.[colField.value]) {
        //有变化,执行确认筛选
        if (params?.$panel) {
          confirmFilter(params)
        }
      } else {
        // 没有变化,直接关闭面板,不执行筛选
        cancelFilter(params)
      }
      // 移除监听
      removeOutsideClickListener()
    }
  }
  // 使用 setTimeout 确保事件在下一个事件循环中添加,避免立即触发
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick, true)
    //存储事件处理函数以便后续移除
    ;(params as any)._outsideClickHandler = handleOutsideClick
  }, 0)
}
// 移除点击外部监听
function removeOutsideClickListener() {
  panelRefsMap.value.forEach((panelRef) => {
    const handler = (panelRef.params as any)?._outsideClickHandler
    if (handler) {
      document.removeEventListener('click', handler, true)
      delete (panelRef.params as any)._outsideClickHandler
    }
  })
  panelRefsMap.value.clear()
}
// 检查是否有任何选项被选中
function hasAnyOptionChecked(params: any): boolean {
  // const { column } = params
  // const { filters: options } = column
  const options = filterOptions.value
  if (!options || !Array.isArray(options)) {
    return false
  }
  return options.some((option) => option.tempChecked === true)
}
// 全选所有过滤项
function selectAllOptions(params) {
  const { $panel, column } = params
  const { filters: options } = column
  if (!$panel || !options || !Array.isArray(options)) {
    return
  }
  // 操作所有选项,不仅仅是过滤后的
  filterOptions.value.forEach((option) => {
    if (option.tempChecked !== true) {
      option.tempChecked = true
      $panel.changeOption(null, true, option)
    }
  })
  // 标记有变化
  if (colField.value) {
    hasFilterChanged.value.set(colField.value, true)
  }
}
//清除所有过滤项
function clearAllOptions(params) {
  const { $panel, column } = params
  const options = filterOptions.value
  if (!options || !Array.isArray(options) || !$panel) {
    return
  }
  const curOptions = filterOptions.value
  // 操作所有选项,不仅仅是过滤后的
  curOptions.forEach((option) => {
    if (option.tempChecked === true) {
      option.tempChecked = false
      $panel.changeOption(null, false, option)
    }
  })
  // 标记有变化
  if (colField.value) {
    hasFilterChanged.value.set(colField.value, true)
  }
}
//反选所有过滤项
function invertAllOptions(params) {
  const { $panel } = params
  const curOptions = filterOptions.value
  // 操作所有选项,不仅仅是过滤后的
  curOptions.forEach((option) => {
    const newChecked = !option.tempChecked
    option.tempChecked = newChecked
    $panel.changeOption(null, newChecked, option)
  })
  // 标记有变化
  if (colField.value) {
    hasFilterChanged.value.set(colField.value, true)
  }
}
//确认筛选
function confirmFilter(params: any) {
  const { $panel, column } = params
  if (!$panel) {
    return
  }
  // 检查是否有选中项,如果没有则不允许确认
  if (!hasAnyOptionChecked(params)) {
    return
  }
  const isAllChecked = filterOptions.value.every((option) => option.tempChecked === true)
  if (isAllChecked && !filterSearchTexts.value?.[colField.value]) {
    resetFilter(params)
    return
  }
  if (!isAllChecked || filterSearchTexts.value?.[colField.value]) {
    //非全选,隐藏的选项全部取消勾选
    const curFilterValues = searchFilteredOptions.value.map((it) => it.value)
    filterOptions.value.forEach((option) => {
      if (!curFilterValues.includes(option.value)) {
        option.tempChecked = false
      }
    })
  }
  console.log('【column.filters】 -446', column.filters, filterOptions.value)
  filterOptions.value.forEach((it) => {
    const option = column.filters.find((filterIt) => filterIt.value === it.value)
    if (option) {
      $panel.changeOption(null, it.tempChecked === true, option)
    } else {
      console.log('【it】 -446', it)
    }
  })
  // const vxeData = $table.getTableData()
  // oldOptions = JSON.parse(JSON.stringify(filteredData))
  // 移除外部点击监听
  removeOutsideClickListener()
  // 清除状态
  if (colField.value) {
    openedPanels.value.delete(colField.value)
    hasFilterChanged.value.delete(colField.value)
    // 清空搜索框内容
    filterSearchTexts.value[colField.value] = ''
  }
  $panel.confirmFilter()
}
// 重置筛选
function resetFilter(params) {
  const { $table, $panel, column } = params
  const options = filterOptions.value
  // hasFiltr.value = false
  if (!$panel || !options || !Array.isArray(options)) {
    return
  }
  // 移除外部点击监听
  removeOutsideClickListener()
  // const keysMap = Array.from(currentTableOptionsMap.keys())
  // const fieldIndex = keysMap.indexOf(colField.value)
  // // console.log('fieldIndex】-433', fieldIndex)
  // // 删除顺序大于 fieldIndex 的数据
  // if (fieldIndex !== -1) {
  //   // 从后往前删除,避免索引变化影响
  //   for (let i = keysMap.length - 1; i > fieldIndex; i--) {
  //     currentTableOptionsMap.delete(keysMap[i])
  //   }
  // }
  // currentTableOptionsMap.delete(colField.value)
  filterSearchTexts.value[colField.value] = '' // 清空搜索框内容
  // 清除所有选项的选中状态
  $table.resetFilter(colField.value) //手动重置指定列筛选
  // 恢复所有选项的选中状态
  options.forEach((option) => {
    option.tempChecked = true
    $panel.changeOption(null, true, option)
  })
  //标记有变化(重置操作本身就是一个变化)
  if (colField.value) {
    hasFilterChanged.value.set(colField.value, true)
  }
}
//取消筛选(关闭面板,不应用筛选)
function cancelFilter(params: any) {
  const { $table, $panel, column } = params
  if (!$table) {
    return
  }
  // 移除外部点击监听
  removeOutsideClickListener()
  if (colField.value) {
    // 恢复初始勾选状态
    const initialOptionsState = initialFilterStates.value.get(colField.value)
    if (initialOptionsState && $panel && filterOptions.value && Array.isArray(filterOptions.value)) {
      filterOptions.value.forEach((option) => {
        const initialChecked = initialOptionsState.get(option.label) || false
        if (option.tempChecked !== initialChecked) {
          option.tempChecked = initialChecked
          $panel.changeOption(null, initialChecked, option)
        }
      })
    }
    // 清除状态
    openedPanels.value.delete(colField.value)
    hasFilterChanged.value.delete(colField.value)
    // 清空搜索框内容
    filterSearchTexts.value[colField.value] = ''
  }
  $table.closeFilter() //手动关闭筛选面板
}
// ---------------------------------------------------------------- 筛选框 End ----------------------------------------------------------------
const xColumnProRef = ref()
// 暴露表格所有的属性方法
function exposedVxeColumn() {
  if (xColumnProRef.value && instance?.exposed) {
    const entries = Object.entries(xColumnProRef.value)
    for (const [key, value] of entries) {
      instance.exposed[key] = value
    }
  }
}

onMounted(async () => {
  exposedVxeColumn() //暴露表格所有的属性方法
})

onUnmounted(() => {
  // 组件卸载时移除所有事件监听
  removeOutsideClickListener()
})
</script>

<style scoped lang="scss">
.filter-panel {
  padding: 8px;
  width: 300px;
  overflow: hidden;
}

.filter-options {
  padding-top: 8px;
  margin-top: 10px;
  max-height: 250px;
  overflow-y: auto;
  border-top: 1px solid #dadce0;
}

.el-checkbox {
  width: 100%;
  margin-right: 0;

  :deep(.el-checkbox__label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 95%;
  }
}

.filter-footer {
  margin-top: 10px;
  padding: 0 30px;
  padding-top: 8px;
  border-top: 1px solid #dadce0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.el-button {
  flex: 1;
}

.empty-list {
  line-height: 32px;
  text-align: center;
  color: #999;
}
</style>
<style lang="scss">
// 隐藏 vxe-table 默认的筛选和重置按钮
.vxe-table--filter-footer {
  display: none !important;
}
//.filter-active,
.is--filter-active {
  background-color: var(--vxe-bg-filter-active);
  .vxe-table-icon-funnel:before {
    content: url('@/assets/icons/search_active.svg') !important;
  }
}
</style>
