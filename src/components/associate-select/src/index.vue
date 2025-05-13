<template>
  <div class="friendSearchContainer">
    <!--单击input-->
    <el-popover
      placement="bottom-start"
      ref="popoverRef"
      class="autoCompletePopover"
      :virtual-ref="inputRef"
      :visible="facPopoverShow"
      :width="tableWidth"
      popper-class="vxe-table--ignore-clear"
      @hide="hide"
    >
      <template #reference>
        <el-input
          v-model="input"
          placeholder=""
          autocomplete="off"
          ref="inputRef"
          :id="id"
          size="small"
          :disabled="disabled"
          clearable
          @click.stop="clickInput"
          @blur="emitBlur"
          @focus.self="emitFocus"
          @change="emitChange"
          @input="handleInput"
          @keydown="handleSearch"
          @clear="clearSelectValue"
          class="form-control smartInput"
          data-associate="true"
        >
          <template #suffix>
            <el-icon :size="13" class="search-icon" @click.native="clickIcon"><Search /></el-icon>
          </template>
        </el-input>
      </template>
      <div class="friendSearchList">
        <div style="margin-bottom: 10px">
          <el-input
            v-if="multiple"
            ref="multipleInputRef"
            type="text"
            v-model="searchContent"
            @keydown="handleSearch"
          ></el-input>
          <el-pagination
            small
            v-model:current-page="queryParams.pageNumber"
            v-model:page-size="queryParams.pageSize"
            :layout="pageLayout"
            :total="totalRows"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <el-table
          :data="tableData"
          max-height="280"
          style="width: 100%"
          ref="associateTable"
          border
          v-loading="loading"
          highlight-current-row
          highlight-selection-row
          @cell-click="clickOne"
          @select="handleSelectionChange"
          @select-all="handleSelectAll"
          @keydown="handleSearch"
        >
          <el-table-column type="selection" v-if="multiple" width="55"></el-table-column>
          <el-table-column
            v-for="(item, index) in tableColumn"
            :key="index"
            align="center"
            :width="item.width"
            :min-width="item.minWidth"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <span class="txt" :title="scope.row[item.prop]">
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="friendSearchModal" @click.stop="disappear"></div>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'ZAssociateSelect'
}
</script>
<script setup>
import { watch, getCurrentInstance, ref, reactive, defineProps, defineEmits, onMounted, nextTick } from 'vue'
import request from '../../../../utils/request'
const { proxy } = getCurrentInstance()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: null // 初始显示值
  },
  configs: {
    type: Object,
    default: () => ({
      url: '', //请求的接口参数
      tableColumns: [], // 显示列配置
      codeKey: '', //唯一标识字段
      nameKey: '' //标签展示的字段
    })
  },
  disabled: {
    type: Boolean,
    default: false //是否禁用
  },
  allowCreate: {
    type: Boolean,
    default: false //是否可输可选，//查不到数据时不清空输入框的值
  },
  setSelectVal: {
    type: Boolean,
    default: true //选择值是否回填
  },
  params: {
    type: Object,
    default: () => ({}) //查询参数
  },
  beforeRequest: {
    type: Function,
    default: null //调接口前的校验，返回布尔值
  },
  pageSize: {
    type: Number,
    default: 25
  },
  trigger: {
    type: String,
    default: 'input' //['input','icon']//弹窗的触发方式
  },
  uppercase: {
    type: Boolean, //输入自动转大写
    default: false
  },
  pageLayout: {
    type: String,
    default: 'total, prev, pager, next, jumper'
  },
  multiple: {
    type: Boolean,
    default: false //是否多选联想控件，如果是单选的可以不传值
  }
})

const emit = defineEmits(['changeSelect', 'getCreateVal', 'blur'])
let count = ref(0)
const facPopoverShow = ref(false) // popover提示框
const tableScrollHeight = ref(0) //表格滚动条滚动的高度
const tableColumn = ref([])
const id = ref('')
const timer = ref(null)
const tableData = ref([]) // 获取后台的数据
const totalRows = ref(0)
const input = ref('')
const focusIndex = ref(0)
const getIndex = ref(0)
const selectionShow = ref(false) // 多选列是否显示
const selectOption = ref([]) // 记录多选行数据
const searchContent = ref('')
const queryParams = ref({
  pageNumber: 1,
  pageSize: props.pageSize,
  ...props.params
})
const loading = ref(false)
const chooseData = ref([]) //选择的数据
const chooseDataIndex = ref(0) //当前点击行所在的索引
const inputRef = ref()
const popoverRef = ref()
const clickCloseFlag = ref(false) //是否是点击关闭，避免点击和聚焦事件同事触发
const selectedRows = ref({})
// 初始化加载表格数据
function init() {
  if (!props.disabled) {
    id.value = new Date().getTime().toString()
    searchContent.value = ''
    // 重置当前页以及当前显示页数据
    queryParams.value.pageNumber = 1
    queryParams.value.pageSize = props.pageSize
    tableScrollHeight.value = 0
    proxy.$refs.associateTable.$refs.scrollBarRef.setScrollTop(0)
    requestData(input.value)
  }
}
function clickInput() {
  if (props.trigger == 'input') {
    count.value++
    init()
  }
}
function disappear(event) {
  clickCloseFlag.value = true
  closePopover()
}

// function isInputHidden(inputElement) {
//   return !inputElement || !inputElement.offsetParent
// }

// 输入时自动搜索
function handleSearch(event) {
  // 对于特殊的按键不做任何处理
  const returnKeys = [9, 12, 16, 17, 18, 20, 27, 32, 33, 34, 35, 36, 37, 39, 45, 46, 144]
  if (returnKeys.indexOf(event.keyCode) !== -1) {
    if (event.keyCode === 9) {
      facPopoverShow.value = false
    }
    return
  }
  // 回车输入时将默认选中数据返回
  if (event.keyCode === 13 && facPopoverShow.value && !loading.value) {
    // 找出当前控件的下一个可用input框
    // const inputDoms = document.getElementsByClassName('el-input__inner')
    // let inputIndex = 0
    // for (let i = 0; i < inputDoms.length; i++) {
    //   if (inputDoms[i].getAttribute('id') === id.value) {
    //     inputIndex = i + 1
    //     break
    //   }
    // }
    // for (let index = inputIndex; index < inputDoms.length; index++) {
    //   if (!isInputHidden(inputDoms[index])) {
    //     inputIndex = index
    //     break
    //   }
    // }
    // 选中第一行值
    if (tableData.value.length > 0) {
      if (!props.multiple) {
        clickOne(tableData.value[chooseDataIndex.value])
        // inputDoms[inputIndex].focus()
      } else {
        clickOne(tableData.value[chooseDataIndex.value])
        // 多选-回车选中-关闭弹窗
        clickCloseFlag.value = true //点击关闭
        tableScrollHeight.value = 0 //表格滚动条滚动高度置0
        proxy.$refs.associateTable.$refs.scrollBarRef.setScrollTop(0) //表格滚动条高度置0
        closePopover()
      }
    } else {
      facPopoverShow.value = false
    }
    return
  }
  // 上下键滑动表格
  if (event.keyCode === 40) {
    if (tableData.value.length > 0) {
      if (chooseDataIndex.value < tableData.value.length - 1) {
        chooseDataIndex.value = chooseDataIndex.value + 1
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[chooseDataIndex.value])
        scrollDown(true)
      }
    }
    return
  }
  if (event.keyCode === 38) {
    if (tableData.value.length > 0) {
      if (chooseDataIndex.value > 0) {
        chooseDataIndex.value = chooseDataIndex.value - 1
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[chooseDataIndex.value])
        scrollDown(false)
      }
    }
    return
  }
  loading.value = true
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    // 请求后台接口进行可选项过滤
    let val = props.multiple ? searchContent.value : input.value
    requestData(val)
  }, 500)
}

function scrollDown(downOrUp) {
  if (downOrUp) {
    tableScrollHeight.value = tableScrollHeight.value + 20
  } else {
    tableScrollHeight.value = tableScrollHeight.value - 20
  }
  proxy.$refs.associateTable.$refs.scrollBarRef.setScrollTop(tableScrollHeight.value)
}

watch(
  () => props.label,
  (newVal) => {
    input.value = newVal || ''
    if (!newVal) {
      emit('update:modelValue', '')
      selectedRows.value[props.configs.codeKey] = ''
    }
    selectedRows.value[props.configs.nameKey] = newVal || ''
  },
  { immediate: true }
)
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      emit('update:label', '')
      selectedRows.value[props.configs.nameKey] = ''
    }
    selectedRows.value[props.configs.codeKey] = newVal || ''
    if (!props.multiple && newVal && !chooseData.value.length) {
      chooseData.value = [selectedRows.value]
    }
  },
  { immediate: true }
)

const multipleInputRef = ref()

function emitAutoSelect(items) {
  // 同步更新绑定值
  const { codeKey, nameKey } = props.configs
  let codeText = ''
  let nameText = ''
  if (props.multiple) {
    if (items?.length) {
      codeText = items.map((obj) => obj[codeKey]).join(';')
      nameText = items.map((obj) => obj[nameKey]).join(';')
    }
  } else {
    codeText = items ? items[codeKey] : ''
    nameText = items ? items[nameKey] : ''
  }
  emit('update:modelValue', codeText)
  emit('update:label', nameText)
  emit('changeSelect', items)
}
/**
 * 请求方法
 * @param value
 */
function requestData(value) {
  if (count.value < 2) {
    let flag = props.beforeRequest ? props.beforeRequest() : true // 调用校验方法
    if (flag == false) {
      loading.value = false
      return
    }
  } else {
    count.value = 0
    loading.value = false
    return
  }
  let requestValue = null
  if (value) {
    requestValue = !props.multiple ? value : searchContent.value
  } else {
    if (!(chooseData.value && chooseData.value.length > 0)) {
      emitAutoSelect(null)
    }
    requestValue = null
  }
  if (queryParams.value) {
    for (let key in queryParams.value) {
      if (key === 'keyword' || key === 'name') {
        queryParams.value[key] = requestValue
      }
    }
  }
  loading.value = true
  request({
    url: props.configs.url,
    method: 'post',
    data: queryParams.value,
    headers: {
      isSetBase: true
    },
    globalParams: proxy?.globalParams || {}
  })
    .then((res) => {
      // 请求后台
      tableData.value = []
      if (res.data.rows?.length > 0) {
        tableData.value = res.data.rows
      }
      if (res.data.list?.length > 0) {
        tableData.value = res.data.list.map((item) => {
          return item || {}
        })
      }
      totalRows.value = res.data.total
      if (tableData.value.length <= 0 && res.data?.length > 0) {
        tableData.value = res.data.map((item) => {
          return item || {}
        })
        totalRows.value = res.data.length
      }
      tableData.value = tableData.value.map((item, index) => {
        item.rowIndex = index //保存每行的索引
        return item
      })
      // 有值时，返回结果等于选择的值
      // if (!props.multiple && value && value == props.label && res.data.rows?.length) {
      //   chooseData.value = res.data.rows
      // }
      chooseDataIndex.value = 0
      // 表格加载之后进行选中渲染
      nextTick(() => {
        // if (!props.multiple) {
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[chooseDataIndex.value])
        // }
        multiSelectedValue()
      })
    })
    .finally(() => {
      const focusElement = inputRef.value?.$el?.querySelector('.el-input__inner')
      //  console.log('【 inputRef 】-399', focusElement == document.activeElement)
      // 如果请求完毕,并且当前焦点在input上,则打开弹窗
      // 如果输入框已经移到其他地方,请求完毕后,不打开弹窗
      if (document.activeElement == focusElement) {
        facPopoverShow.value = true // 请求完毕再打开弹窗，避免无法正确获取表格高度
      }
      loading.value = false
      selectOption.value = createArray(selectedRows.value) // 初始化所有勾选的数据
      if (props.multiple) {
        nextTick(() => {
          multipleInputRef.value?.focus() //多选自动聚焦到查询输入框上
        })
      }
    })
}

const tableWidth = ref(0) // 表格宽度
const associateTable = ref(null) // 表格的引用

// 计算表格宽度
const calculateTableWidth = () => {
  if (associateTable.value) {
    tableWidth.value = associateTable.value.$el.offsetWidth
  }
}
watch(
  () => props.configs,
  (newVal) => {
    tableColumn.value = newVal.tableColumns
  },
  { deep: true, immediate: true }
)
// 监听配置searchColumns
watch(
  () => props.params,
  (newVal) => {
    queryParams.value = {
      ...queryParams.value,
      ...newVal
    }
  },
  { deep: true, immediate: true }
)
// 在组件挂载后计算表格宽度
onMounted(() => {
  calculateTableWidth()
})
// 多选值
function multiSelectedValue() {
  if (props.multiple && input.value) {
    const strsItem = props.modelValue?.split(';') || []
    const uniqueKey = props.configs.codeKey
    for (let filteredObj of tableData.value) {
      for (let checkObj of strsItem) {
        if (filteredObj[uniqueKey] === checkObj) {
          proxy.$refs.associateTable?.toggleRowSelection(filteredObj, true)
        }
      }
    }
    chooseData.value = clear_repeat(chooseData.value.concat(proxy.$refs.associateTable?.getSelectionRows() || []))
  }
}
// 选中行数据
function clickOne(row) {
  chooseData.value = [row]
  getIndex.value = row.rowIndex
  chooseDataIndex.value = row.rowIndex
  clearTimeout(timer.value)
  if (props.multiple) {
    // 多选状态
    const uniqueKey = props.configs.codeKey
    for (let filteredObj of tableData.value) {
      if (filteredObj[uniqueKey] === row[uniqueKey]) {
        if (selectedRows.value[uniqueKey].indexOf(row[uniqueKey]) > -1) {
          proxy.$refs.associateTable?.toggleRowSelection(filteredObj, false)
        } else {
          proxy.$refs.associateTable?.toggleRowSelection(filteredObj, true)
        }
      }
    }
    let keywordList = createArray(selectedRows.value)
    let changeArray = []
    for (let keyword of keywordList) {
      if (keyword[uniqueKey] !== row[uniqueKey]) {
        changeArray.push(keyword)
      }
    }
    if (selectedRows.value[uniqueKey].indexOf(row[uniqueKey]) < 0) {
      changeArray.push(row)
    }
    handleSelectionChange(changeArray, row)
  } else {
    focusIndex.value = row.rowIndex
    // 单选状态
    const value = row[props.configs.nameKey]
    if (props.setSelectVal) {
      input.value = value
    }
    // 返回选中的行数据
    emitAutoSelect(row)
    clickCloseFlag.value = true
    closePopover()
  }
}
// 关闭联想控件
function closePopover() {
  count.value = 0
  tableWidth.value = 0
  facPopoverShow.value = false
  associateTable.value = null
}
function formatInputVal(list = []) {
  const labels = list.map((item) => item[props.configs.nameKey]).join(';')
  return labels
}
// 全选/取消全选
function handleSelectAll(selection) {
  const uniqueKey = props.configs.codeKey
  let allSelectedRows = selectOption.value
  if (!selection.length) {
    const deleteCodeKeys = tableData.value.map((item) => item[uniqueKey]) //需要取消的选项
    allSelectedRows = allSelectedRows.filter((item) => !deleteCodeKeys.includes(item[uniqueKey]))
  } else {
    const oldCodeKeys = selectOption.value.map((item) => item[uniqueKey]) //已存在的选项
    for (let item of selection) {
      if (!oldCodeKeys.includes(item[uniqueKey])) {
        // console.log('【新选项  】-515')
        allSelectedRows.push(item)
      }
    }
  }
  input.value = formatInputVal(allSelectedRows)
  chooseData.value = allSelectedRows
  selectOption.value = allSelectedRows
  emitAutoSelect(allSelectedRows)
}

// 获取多选行数据
function handleSelectionChange(selection, row) {
  const uniqueKey = props.configs.codeKey
  const isChecked = selection.some((item) => item[uniqueKey] === row[uniqueKey]) //判断是勾选还是取消勾选操作
  let allSelectedRows = [] //记录所有分页勾选的总数据
  // 勾选
  if (isChecked) {
    //  console.log('【 新增勾选 】-551', chooseData.value)
    allSelectedRows = createArray(selectedRows.value)
    allSelectedRows.push(row) // 添加勾选的数据
  } else {
    // 删除未勾选的数据
    allSelectedRows = selectOption.value.filter((item) => item[uniqueKey] !== row[uniqueKey])
  }
  input.value = formatInputVal(allSelectedRows) // allSelectedRows.map((item) => item[nameKey]).join(';')
  //  console.log('【 allSelectedRows 】-558', input.value, allSelectedRows)
  chooseData.value = allSelectedRows
  selectOption.value = allSelectedRows
  emitAutoSelect(allSelectedRows)
}

function createArray(selectedObj) {
  const keywordList = []
  if (selectedObj) {
    const uniqueKey = props.configs.codeKey
    const nameKey = props.configs.nameKey
    const codeKeyArray = selectedRows.value[uniqueKey]?.split(';') || []
    const nameKeyArray = selectedRows.value[nameKey]?.split(';') || []
    for (let i = 0; i < codeKeyArray.length; i++) {
      if (codeKeyArray[i]) {
        const existRow = reactive({})
        existRow[uniqueKey] = codeKeyArray[i]
        existRow[nameKey] = nameKeyArray[i]
        keywordList.push(existRow)
      }
    }
  }
  return keywordList
}

// 数组去重
function clear_repeat(oldArr) {
  const uniqueKey = props.configs.codeKey
  // 根据数组中对象的id去重
  return oldArr.reduce(function (accumulator, currentValue) {
    // 根据 传入的 codekey去重  原来使用的id 在业务场景中可能是不存在的
    const findex = accumulator.find((ele) => ele[uniqueKey] === currentValue[uniqueKey])
    if (findex === undefined) {
      accumulator.push(currentValue)
    }
    return accumulator
  }, [])
}

// 点击分页请求数据
function handleCurrentChange(currentPage) {
  clearTimeout(timer.value)
  tableScrollHeight.value = 0
  proxy.$refs.associateTable.$refs.scrollBarRef.setScrollTop(tableScrollHeight.value)
  // 动态改变
  queryParams.value.pageNumber = currentPage
  // 实现翻页光标不消失
  /*  nextTick(() => {
      proxy.$refs[id.value].focus()
    })*/
  if (searchContent.value) {
    requestData(searchContent.value)
  } else {
    requestData(input.value)
  }
  scrollViewport()
}
// 切换展示条数
function handleSizeChange(size) {
  queryParams.value.pageSize = size
  // 实现翻页光标不消失
  nextTick(() => {
    proxy.$refs[id.value].focus()
  })
  if (searchContent.value) {
    requestData(searchContent.value)
  } else {
    requestData(input.value)
  }
}

// 在上下键索引后调整视口
function scrollViewport() {
  getIndex.value = focusIndex.value
}
// 处理可输入值
function handleCreateValEmit() {
  if (props.multiple) {
    return
  }
  // 判断是否是可输入值
  let chooseLabel = chooseData.value[0]?.[props.configs.nameKey]
  if (chooseLabel !== input.value) {
    chooseData.value = [] //清空选项
  }
  const isCreateVal = chooseLabel !== input.value
  // 单选状态
  if (isCreateVal) {
    if (!props.allowCreate) {
      input.value = ''
      emitAutoSelect({})
    }
    if (props.allowCreate) {
      emit('getCreateVal', input.value)
    }
  }
}
// 如果没有已选择的值，失去焦点时把控件的值清除
function hide() {
  handleCreateValEmit()
  clickCloseFlag.value = false
}
// 失去焦点触发事件
function emitBlur(event) {
  count.value = 0
  if (!facPopoverShow.value) {
    handleCreateValEmit()
  }

  // if (!props.multiple) {
  //   facPopoverShow.value = false
  // }
  emit('blur', event)
}
// 获取焦点触发事件
function emitFocus(event) {
  if (props.trigger == 'input' && !clickCloseFlag.value) {
    count.value++
    init()
  }
}
// 输入转大写
function handleInput(val) {
  if (val && props.uppercase) {
    input.value = input.value.toUpperCase()
  }
}
// input框值发生改变触发事件
function emitChange(val) {
  //requestData(val)
  if (val) {
    if (chooseData.value && chooseData.value.length > 0) {
      if (props.multiple) {
        let keywordList = []
        const strsItem = input.value?.split(';') || []
        const uniqueKey = props.configs.nameKey
        for (let filteredObj of chooseData.value) {
          for (let checkObj of strsItem) {
            if (filteredObj[uniqueKey] === checkObj) {
              keywordList.push(filteredObj)
            }
          }
        }
        emitAutoSelect(keywordList)
      }
    }
  } else {
    if (props.multiple) {
      emitAutoSelect([])
    } else {
      emitAutoSelect({})
    }
  }
}
function clickIcon() {
  if (props.trigger == 'icon') {
    count.value++
    init()
  }
}
function clearSelectValue() {
  input.value = ''
  selectOption.value = []
  chooseData.value = []
  queryParams.value.keyword = ''
  if (props.multiple) {
    emitAutoSelect([])
  } else {
    emitAutoSelect({})
  }
}
defineExpose({ clearSelectValue, closePopover })
</script>

<style lang="scss" scoped>
.smartInput {
  // 固定搜索图标在最右侧

  :deep(.el-input__wrapper) {
    .el-input__inner {
      padding-right: 15px;
    }
    .el-input__suffix-inner {
      position: relative !important;
      .el-icon {
        position: absolute !important;
        // top: 4px !important;
      }
      .el-input__clear {
        right: 15px;
      }
      .search-icon {
        cursor: pointer;
        right: 0;
      }
    }
  }
}

.autoCompletePopover {
  max-height: 320px;
  /* (高度自行选择) */
  /* //overflow: auto; */
  padding: 0;
}

.smartInput {
  width: 100%;
  :deep(.el-input__suffix svg) {
    height: 1em !important;
    width: 0.99em !important;
  }
}

.friendSearchContainer {
  width: 100%;
  position: relative;
  margin-top: -2px;
}

.friendSearchList {
  width: auto;
  max-height: 330px;
  overflow: auto;
  z-index: 10;
  position: relative;
  :deep(.el-table__body tr) {
    &.current-row > td.el-table__cell {
      background-color: rgba(196, 223, 251, 0.8);
    }

    &:hover > td.el-table__cell {
      background-color: rgba(229, 229, 229, 1);
    }
  }
}

.friendSearchList tr {
  padding: 3px 12px;
}

.friendSearchModal {
  position: fixed;
  top: 0;
  left: -383px;
  margin-top: -313px;
  height: 326%;
  width: 282%;
  z-index: 1;
}

.el-table th,
.el-table td {
  padding: 2px 0;
}
.txt {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.friendSearchList {
  :deep(.el-table) {
    .el-table__cell {
      padding: 2px 0;
    }
    .el-table__header-wrapper th,
    .el-table__fixed-header-wrapper th {
      height: 30px !important;
    }
    .cell {
      height: 20px !important;
      line-height: 20px;
    }
  }
}
</style>
