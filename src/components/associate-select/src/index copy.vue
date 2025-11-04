<template>
  <!-- <div class="friendSearchContainer" ref="acWrapRef"> -->
  <!--单击input-->
  <el-popover
    ref="popoverRef"
    placement="bottom-start"
    :virtual-ref="inputRef"
    :visible="facPopoverShow"
    :width="tableWidth"
    :popper-class="`ac-poppor vxe-table--ignore-clear ${popoverClass}`"
    @hide="hidePopover"
    @show="showPopover"
  >
    <template #reference>
      <span :title="input" style="width: 100%">
        <el-input
          v-model="input"
          placeholder
          autocomplete="off"
          ref="inputRef"
          :id="inputId"
          :disabled="disabled"
          clearable
          :v-uppercase="uppercase"
          @click="clickInput"
          @blur="emitBlur"
          @focus.self="emitFocus"
          @change="emitChange"
          @input="handleInput"
          @keydown="handleSearch"
          @clear="clearSelectValue"
          class="search-input"
          data-associate="true"
        >
          <template #suffix>
            <el-icon :size="13" class="search-icon" @click.native="clickIcon">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </span>
    </template>
    <div class="friendSearchList">
      <div class="ac-page-wrap" @click.stop>
        <el-pagination
          ref="pageRef"
          @click.stop
          :pager-count="5"
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :layout="pageLayout"
          :total="totalRows"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-table
        @click.stop
        :data="tableData"
        max-height="280"
        style="width: 100%"
        ref="associateTable"
        border
        v-loading="loading"
        highlight-current-row
        highlight-selection-row
        @cell-click.self="cellClick"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @keydown="handleSearch"
      >
        <el-table-column v-if="multiple" type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          align="center"
          :min-width="item.minWidth"
          :prop="item.prop"
          :label="item.label"
        >
          <template #default="scope">
            <span class="txt" :title="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="friendSearchModal" @click.stop="disappear"></div> -->
  </el-popover>
  <!-- </div> -->
</template>
<script>
export default {
  name: 'ZAssociateSelect'
}
</script>
<script setup>
import {
  watch,
  getCurrentInstance,
  ref,
  reactive,
  defineProps,
  defineEmits,
  onMounted,
  nextTick,
  computed,
  onBeforeUnmount
} from 'vue'
import request from '../../../utils/request'
const { proxy } = getCurrentInstance()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  configs: {
    type: Object,
    default: () => ({
      url: '', //请求的接口参数
      multiple: false, // 是否多选
      showColumn: [], // 显示列配置
      codeKey: '', //唯一标识字段
      nameKey: '', //标签展示的字段
      listProp: '',
      listProp2: '',
      keywordProp: 'keyword'
    })
  },
  params: {
    type: Object,
    default: () => ({}) //查询条件
  },
  defValue: {
    type: String,
    default: null // 初始显示值
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
  defValueCode: {
    type: Number,
    default: null
  },
  beforeRequest: {
    type: Function,
    default: null //调接口前的校验，返回布尔值
  },
  pageSize: {
    type: Number,
    default: 10
  },
  trigger: {
    type: String,
    default: 'input' //['input','icon']//弹窗的触发方式
  },
  separator: {
    type: String,
    default: ',' //['input','icon']//弹窗的触发方式
  },
  pageLayout: {
    type: String,
    default: 'total, prev, pager, next, jumper'
  },
  uppercase: {
    //是否大小写
    type: Boolean,
    default: false
  },
  beforeSelect: {
    type: Function,
    default: null
  },
  customRequest: {
    type: Function, //自定义请求
    default: null
  }
})
const pageRef = ref()
const splitStr = props.separator //分割符号
const emit = defineEmits(['update:modelValue', 'update:defValue', 'handleAutoSelect', 'getCreateVal', 'blur'])
let count = ref(0)
const facPopoverShow = ref(false) // popover提示框
const tableScrollHeight = ref(0) //表格滚动条滚动的高度
const inputId = ref(new Date().getTime().toString())
const popoverClass = ref(`ac-popover-${inputId.value}`)
const popoverDom = ref()
const timer = ref(null)
const tableData = ref([]) // 获取后台的数据
const totalRows = ref(0)
const input = ref('')
const focusIndex = ref(0)
const getIndex = ref(0)
const multiple = ref(props.configs.multiple) // 是否多选
const singleOptions = ref([]) //单选选择的数据
const multipleOptions = ref([]) // 记录多选行数据
const queryParams = ref({
  ...props.params,
  pageSize: props.pageSize,
  currentPage: 1
})
let oldSearchKey = '' //记录上一次查询的key值
const loading = ref(false)
const currentRowIndex = ref(0) //当前点击行所在的索引
const inputRef = ref()
const popoverRef = ref()
const clickCloseFlag = ref(false) //是否是点击关闭，避免点击和聚焦事件同事触发
//保存勾选的key信息
const selectedKeysInfo = reactive({
  codeKeys: '',
  nameKeys: ''
})
// 初始化加载表格数据
function init() {
  if (!props.disabled) {
    // 重置当前页以及当前显示页数据
    queryParams.value.currentPage = 1
    queryParams.value.pageSize = props.pageSize
    tableScrollHeight.value = 0
    proxy.$refs.associateTable.$refs.scrollBarRef.setScrollTop(0)
    requestData()
  }
}
function getStrNum(str = '') {
  let num = 0
  for (let i = 0; i < str?.length; i++) {
    let a = str.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      num += 1
    } else {
      num += 0.5
    }
  }
  return num
}
function getMaxWidth(column) {
  let minWidth = column.minWidth
  for (let item of tableData.value) {
    let width = getStrNum(item[column.prop] || '') * 10
    if (width > minWidth) {
      minWidth = width
    }
  }
  return minWidth
}
function clickInput() {
  if (props.trigger == 'input') {
    count.value++
    init()
  }
}
function disappear(event) {
  clickCloseFlag.value = true
  closePopover('disappear')
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
    //   if (inputDoms[i].getAttribute('id') === inputId.value) {
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
    // 选中行值
    if (tableData.value.length > 0) {
      // 单选
      if (!multiple.value) {
        cellClick(tableData.value[currentRowIndex.value])
        // inputDoms[inputIndex].focus()
      } else {
        cellClick(tableData.value[currentRowIndex.value])
        // 多选-回车选中-关闭弹窗
        clickCloseFlag.value = true //点击关闭
        tableScrollHeight.value = 0 //表格滚动条滚动高度置0
        closePopover('handleSearch')
      }
    } else {
      facPopoverShow.value = false
    }
    return
  }
  // 上下键滑动表格
  if (event.keyCode === 40) {
    if (tableData.value.length > 0) {
      if (currentRowIndex.value < tableData.value.length - 1) {
        currentRowIndex.value = currentRowIndex.value + 1
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[currentRowIndex.value])
        scrollDown(true)
      }
    }
    return
  }
  if (event.keyCode === 38) {
    if (tableData.value.length > 0) {
      if (currentRowIndex.value > 0) {
        currentRowIndex.value = currentRowIndex.value - 1
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[currentRowIndex.value])
        scrollDown(false)
      }
    }
    return
  }
  clearTimeout(timer.value)
  // 多选&&判断输入的是分隔符
  const isSeparator = multiple.value && event.key === splitStr
  // 输入逗号时有匹配的新值，则选中该值
  if (isSeparator) {
    selectedBySeparator()
  } else {
    loading.value = true
    timer.value = setTimeout(() => {
      requestData()
    }, 300)
  }
}
// 获取查询的参数
function getSearchKey() {
  // 多选
  if (multiple.value) {
    const splitArr = input.value?.split(splitStr)
    const inputStr = splitArr.toString()
    const nameKeyStr = selectedKeysInfo.nameKeys?.split(splitStr).toString()
    // console.log('【 inputSplits 】-328', splitArr, inputStr, nameKeyStr)
    // 如果输入框的值等于已勾选的值，则查询参数为空，否则取最后一个分隔号后的值
    if (inputStr == nameKeyStr) {
      return ''
    } else {
      return splitArr.length ? splitArr[splitArr.length - 1] : ''
    }
  } else {
    return input.value
  }
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
  [() => props.modelValue, () => props.defValue],
  ([newModelValue, newDefValue]) => {
    // console.log('【 modelValue ===========】-317', newModelValue, newDefValue)
    // =============newDefValue=============
    input.value = newDefValue || ''
    selectedKeysInfo.nameKeys = newDefValue || ''

    // ==============newModelValue==============
    // if (!newModelValue) {
    //   console.log('【 newModelValue 】-328', newModelValue)
    //   emit('update:defValue', '')
    //   selectedKeysInfo.nameKeys = ''
    // }
    selectedKeysInfo.codeKeys = newModelValue || ''
    // 单选
    if (!multiple.value && !singleOptions.value.length) {
      const obj = {}
      obj[props.configs.codeKey] = selectedKeysInfo.codeKeys
      obj[props.configs.nameKey] = selectedKeysInfo.nameKeys
      if (newModelValue || newDefValue) {
        singleOptions.value = [obj]
      }
    }
  },
  { immediate: true }
)
// 组装lip类型的参数
// searchColumns属性
// {
//   type: 'keyword', //keyword会被替换成输入框的值
//   junction: 'or', //连接符,默认and
//   propertyName: 'esCustType',
//   dataType: 'S',
//   value: props.esCustType, //
//   operation: 'EQ' //值全等匹配，'LIKEIC' //模糊匹配：值会被拼接上%
//   isFilter: false, //是否过滤该条件,默认false不过滤
//   }

function formatIlpParams() {
  const OPERATION_TYPE = {
    LIKEIC: 'LIKEIC',
    EQ: 'EQ'
  }

  const argsSearchColumns = JSON.parse(JSON.stringify(queryParams.value?.searchColumns)) //.filter((item) => item.isFilter !== true)
  const mainModelName = queryParams.value.mainModelName
  let propertyNameMap = new Map()
  argsSearchColumns.forEach((item, index) => {
    //区分自定义sql和ES查询参数
    if (props.configs.url.indexOf('ILP_es') > 0) {
      propertyNameMap.set(item.propertyName + index, item.propertyName)
      item.propertyName = item.propertyName + index
    } else {
      propertyNameMap.set(item.propertyName, item.propertyName)
    }
  })
  function getReqArgs() {
    let reqArgs = {}
    for (let item of argsSearchColumns) {
      const { propertyName, operation, value } = item
      if (operation == 'ISN' || operation == 'ISNN') {
        continue
      }
      if (value.toString()) {
        let val = value
        if (item.uppercase) {
          val = value.toUpperCase()
        }
        if (operation == OPERATION_TYPE.LIKEIC) {
          reqArgs[propertyName] = `%${val}%`
        } else {
          reqArgs[propertyName] = val
        }
      }
    }
    return reqArgs
  }
  function getSqlItem(item) {
    const { propertyName, value, operation } = item
    const OPT = {
      LIKEIC: 'LIKE',
      EQ: '=',
      NEQ: '!=',
      GT: '>',
      ISN: 'IS NULL'
    }
    let str = ''

    if (operation == 'IN') {
      str = `${mainModelName}.${propertyNameMap.get(propertyName)} IN( :${propertyName})`
    } else if (operation == 'NIN') {
      str = `${mainModelName}.${propertyNameMap.get(propertyName)} NOT IN( :${propertyName})`
    } else if (operation == 'ISN') {
      str = `${mainModelName}.${propertyNameMap.get(propertyName)} IS NULL`
    } else if (operation == 'ISNN') {
      str = `${mainModelName}.${propertyNameMap.get(propertyName)} IS NOT NULL`
    } else {
      str = `${mainModelName}.${propertyNameMap.get(propertyName)} ${OPT[operation] || operation} :${propertyName}`
    }
    return str
  }
  function formatWhere() {
    let whereStr = ''
    // 获取所有 or 条件
    const orList = argsSearchColumns.filter((item) => item.junction === 'or').filter((item) => !!item.value?.toString())
    let orSql = ''
    // 拼接有值的 or 语句
    for (let item of orList) {
      let sqlItem = getSqlItem(item)
      if (!orSql) {
        orSql = sqlItem
      } else {
        orSql = `${orSql} OR ${sqlItem}`
      }
    }
    // 如果有 or 条件，需要用括号包裹
    if (orSql) {
      whereStr = `(${orSql})` // 如果有 orSql，先把它赋值给 whereStr
    }
    // 拼接 and 语句
    const elseList = argsSearchColumns.filter((item) => item.junction !== 'or')
    for (let item of elseList) {
      let sqlItem = getSqlItem(item)
      if (!whereStr) {
        whereStr = sqlItem
      } else {
        whereStr = `(${whereStr} AND ${sqlItem})`
      }
    }
    return whereStr
  }
  const params = JSON.parse(JSON.stringify(queryParams.value))
  delete params.searchColumns
  const obj = {
    ...params,
    currentPage: queryParams.value.currentPage,
    pageSize: queryParams.value.pageSize,
    where: formatWhere(),
    reqArgs: getReqArgs()
  }
  return obj
}
function formatRequestData(requestValue) {
  if (propsConfig.keywordProp) {
    queryParams.value[propsConfig.keywordProp] = requestValue
  }
  if (props.defValueCode) {
    queryParams.value.defValueCode = props.defValueCode
  }
  // 将keyword类型的值替换成输入框的值
  if (queryParams.value?.searchColumns) {
    for (let item of queryParams.value.searchColumns) {
      if (item.type == 'keyword') {
        item.value = requestValue || ''
      }
    }
  }
  queryParams.value.searchColumns = queryParams.value?.searchColumns.filter((item) => item.isFilter !== true)
  // params格式的数据
  if (propsConfig.paramType == 'params') {
    const obj = { sum: false, queryResultType: 'page', ...queryParams.value }
    // delete obj.searchColumns
    return { params: obj }
  }
  // ilp格式的数据
  if (propsConfig.paramType == 'ilp') {
    let params = formatIlpParams()
    return params
  }
  // FormData格式的数据
  if (propsConfig.contentType == 'form-data') {
    const formData = new FormData()
    for (let key in queryParams.value) {
      if (Array.isArray(queryParams.value[key])) {
        if (key == 'searchColumns') {
          for (let item of queryParams.value[key]) {
            if (item.type == 'keyword') {
              const obj = { ...item }
              delete obj.type
              requestValue && formData.append('searchColumns', JSON.stringify(obj))
            } else {
              if (item.condition !== false) {
                formData.append('searchColumns', JSON.stringify(item))
              }
            }
          }
        } else {
          for (let item of queryParams.value[key]) {
            formData.append(key, JSON.stringify(item))
          }
        }
      } else {
        formData.append(key, queryParams.value[key] ?? '')
      }
    }
    return formData
  }
  // 默认传参
  return queryParams.value
}
function emitAutoSelect(item, target) {
  console.log('【 emitAutoSelect 】-485', selectedKeysInfo, item, target)
  // 同步更新绑定值
  const { codeKey, nameKey } = props.configs
  let codeText = null
  let nameText = null
  if (multiple.value) {
    if (item?.length) {
      codeText = item.map((obj) => obj[codeKey]).join(splitStr) ?? null
      nameText = item.map((obj) => obj[nameKey]).join(splitStr) ?? null
    }
  } else {
    codeText = item ? item[codeKey] : null
    nameText = item ? item[nameKey] : null
  }
  emit('handleAutoSelect', item, { modelValue: codeText, defValue: nameText })
  emit('update:modelValue', codeText ?? null)
  emit('update:defValue', nameText ?? null)
}

function normalRequest(requestValue) {
  const formData = formatRequestData(requestValue)
  const requestConfig = {
    url: props.configs.url,
    method: 'post',
    data: formData
  }
  // 表单格式
  if (propsConfig.contentType == 'form-data') {
    requestConfig.headers = {
      isSetBase: true,
      'Content-Type': 'multipart/form-data'
    }
  }
  return request(requestConfig)
}
/**
 * 请求方法
 * @param value
 */
function requestData() {
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
  let requestValue = getSearchKey()
  let func = () => {}
  if (props.customRequest) {
    func = () => {
      return props.customRequest(requestValue, queryParams.value)
    }
  } else {
    func = normalRequest
  }
  loading.value = true
  func(requestValue)
    .then((res) => {
      // 请求后台
      loading.value = false
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
      tableData.value = tableData.value
        .map((item) => {
          return item || {}
        })
        .map((item, index) => {
          item.rowIndex = index //保存每行的索引
          return item
        })
      currentRowIndex.value = 0
      // 表格加载之后进行选中渲染
      nextTick(() => {
        proxy.$refs.associateTable?.setCurrentRow(tableData.value[currentRowIndex.value])
        multiple.value && multiSelectedValue()
      })
    })
    .finally(() => {
      nextTick(() => {
        calculateTableWidth() // 在组件挂载后计算表格宽度
      })
      oldSearchKey = requestValue //记录上一次查询的key值
      const focusElement = inputRef.value?.$el?.querySelector('.el-input__inner')
      const focusElementWrapper = inputRef.value?.$el?.querySelector('.el-input__wrapper')
      // 解决dev表格无法自动聚焦的问题
      if (document.activeElement == focusElementWrapper) {
        focusElement?.focus()
      }
      // 如果请求完毕,并且当前焦点在input上,则打开弹窗, focusElementWrapper
      // 如果输入框已经移到其他地方,请求完毕后,不打开弹窗
      if ([focusElement].includes(document.activeElement)) {
        facPopoverShow.value = true // 请求完毕再打开弹窗，避免无法正确获取表格高度
      }
      loading.value = false
      if (multiple.value) {
        multipleOptions.value = createArray(selectedKeysInfo) // 初始化所有勾选的数据
      }
    })
}

const tableWidth = ref(0) // 表格宽度
const associateTable = ref(null) // 表格的引用

// 计算表格宽度
const calculateTableWidth = () => {
  if (associateTable.value) {
    let width = 0 // associateTable.value.$el.offsetWidth
    tableColumn.value?.forEach((item) => {
      width += item.minWidth
    })
    if (offsetWidth < width) {
      offsetWidth = width
    }
    tableWidth.value = offsetWidth //associateTable.value.$el.offsetWidth
  }
}
let listProp = ''
let listProp2 = ''
let propsConfig
watch(
  () => props.configs,
  (newVal) => {
    // tableColumn.value = newVal.showColumn?.filter((item) => item.isFilter !== true)
    listProp = newVal.listProp
    listProp2 = newVal.listProp2
    propsConfig = props.configs
  },
  { deep: true, immediate: true }
)
const tableColumn = computed(() => {
  return propsConfig.showColumn
    ?.filter((item) => item.isFilter !== true)
    .map((column) => {
      if (tableData.value.length) {
        column.minWidth = getMaxWidth(column)
      }
      return column
    })
})
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

// 点击其他区域关闭弹窗
function clickElseClose(event, isBlur = false) {
  // console.log('【 clickElseClose 】-653', event, isBlur)
  const clickNode = event.target
  // console.log('【 clickNode 】-655', clickNode, popoverDom.value)
  if (isBlur) {
    // if (event.relatedTarget == popoverDom.value) {
    //   return
    // }
    // popoverDom.value = document.querySelector(`.${popoverClass.value}`)
    if (!popoverDom.value?.contains(event.relatedTarget)) {
      closePopover('clickElseClose-isBlur')
    }
  } else {
    if (!popoverDom.value || !popoverDom.value?.contains(clickNode)) {
      closePopover('clickElseClose')
    }
  }
}
onBeforeUnmount(() => {
  // document.onclick = null
  document.removeEventListener('mousedown', clickElseClose)
})

// 多选-设置选中状态
function multiSelectedValue() {
  if (multiple.value && input.value) {
    const strsItem = props.modelValue?.split(splitStr) || []
    const uniqueKey = props.configs.codeKey
    for (let filteredObj of tableData.value) {
      for (let checkObj of strsItem) {
        if (filteredObj[uniqueKey] === checkObj) {
          proxy.$refs.associateTable?.toggleRowSelection(filteredObj, true)
        }
      }
    }
    multipleOptions.value = clearRepeat(
      multipleOptions.value.concat(proxy.$refs.associateTable?.getSelectionRows() || [])
    )
  }
}
// 可视列的prop
const vsibleColumnFields = computed(() => {
  return tableColumn.value.map((item) => item.prop)
})
// 分隔符选中
function selectedBySeparator() {
  const { codeKey } = props.configs
  // 查找满足输入条件的第一个元素
  const obj = tableData.value.find((item) => {
    return vsibleColumnFields.value.some((prop) => {
      return item[prop] && item[prop]?.toUpperCase() === oldSearchKey?.toUpperCase()
    })
  })
  let row = obj
  // 如果没有满足条件的，且未勾选数据，则选中第一个
  if (!obj && !input.value.toString()) {
    row = tableData.value[0]
  }
  console.log('【 row 】-728', row)
  if (!row) {
    return
  }
  getIndex.value = row.rowIndex
  currentRowIndex.value = row.rowIndex
  let selectedRows = createArray(selectedKeysInfo)
  let selection = JSON.parse(JSON.stringify(selectedRows))
  // 未选择
  if (selectedKeysInfo.codeKeys.indexOf(row[codeKey]) < 0) {
    selection.push(row)
    const allSelectedRows = selection
    multipleOptions.value = allSelectedRows
    emitAutoSelect(allSelectedRows, 'selectedBySeparator')
  }
  nextTick(() => {
    proxy.$refs.associateTable?.toggleRowSelection(row, true) //选中值
    requestData() //选完值之后重新查询
  })
}
// 选中行数据
function cellClick(row) {
  if (props.beforeSelect) {
    props.beforeSelect(row, tableData)
  }
  getIndex.value = row.rowIndex
  currentRowIndex.value = row.rowIndex
  clearTimeout(timer.value)
  // 多选状态
  if (multiple.value) {
    const uniqueKey = props.configs.codeKey
    // 处理选中状态
    for (let filteredObj of tableData.value) {
      if (filteredObj[uniqueKey] === row[uniqueKey]) {
        // 已存在，取消选中
        if (selectedKeysInfo.codeKeys.indexOf(row[uniqueKey]) > -1) {
          proxy.$refs.associateTable?.toggleRowSelection(row, false) //取消选中
        } else {
          proxy.$refs.associateTable?.toggleRowSelection(row, true)
        }
      }
    }
    let keywordList = createArray(selectedKeysInfo)
    let selection = [] //所有勾选的数据
    for (let keyword of keywordList) {
      if (keyword[uniqueKey] !== row[uniqueKey]) {
        selection.push(keyword)
      }
    }
    if (selectedKeysInfo.codeKeys.indexOf(row[uniqueKey]) < 0) {
      selection.push(row)
    }
    handleSelectionChange(selection, row)
  } else {
    singleOptions.value = [row]
    focusIndex.value = row.rowIndex
    // 单选状态
    const value = row[props.configs.nameKey]
    if (props.setSelectVal) {
      input.value = value
    }
    // 返回选中的行数据
    emitAutoSelect(row, 'cellClick')
    clickCloseFlag.value = true
    closePopover('cellClick')
  }
}
// 关闭联想控件
function closePopover(target = 'custom') {
  proxy.$refs.associateTable?.$refs.scrollBarRef?.setScrollTop(0) //表格滚动条高度置0
  count.value = 0
  tableWidth.value = 0
  facPopoverShow.value = false
  associateTable.value = null
}
function formatInputVal(list = []) {
  const inputText = list.map((item) => item[props.configs.nameKey]).join(splitStr)
  return inputText
}
// 全选/取消全选
function handleSelectAll(selection) {
  const uniqueKey = props.configs.codeKey
  let allSelectedRows = multipleOptions.value
  if (!selection.length) {
    const deleteCodeKeys = tableData.value.map((item) => item[uniqueKey]) //需要取消的选项
    allSelectedRows = allSelectedRows.filter((item) => !deleteCodeKeys.includes(item[uniqueKey]))
  } else {
    const oldCodeKeys = multipleOptions.value.map((item) => item[uniqueKey]) //已存在的选项
    for (let item of selection) {
      if (!oldCodeKeys.includes(item[uniqueKey])) {
        // console.log('【新选项  】-515')
        allSelectedRows.push(item)
      }
    }
  }
  input.value = formatInputVal(allSelectedRows)
  multipleOptions.value = allSelectedRows
  emitAutoSelect(allSelectedRows, 'handleSelectAll')
}

// 获取多选行数据
function handleSelectionChange(selection, row) {
  const uniqueKey = props.configs.codeKey
  const isChecked = selection.some((item) => item[uniqueKey] === row[uniqueKey]) //判断是勾选还是取消勾选操作
  let allSelectedRows = [] //记录所有分页勾选的总数据
  // 勾选
  if (isChecked) {
    allSelectedRows = createArray(selectedKeysInfo)
    allSelectedRows.push(row) // 添加勾选的数据
  } else {
    // 删除未勾选的数据
    allSelectedRows = multipleOptions.value.filter((item) => item[uniqueKey] !== row[uniqueKey])
  }
  input.value = formatInputVal(allSelectedRows) // allSelectedRows.map((item) => item[nameKey]).join(';')
  multipleOptions.value = allSelectedRows
  emitAutoSelect(allSelectedRows, 'handleSelectionChange')
}

function createArray(selectedObj) {
  const keywordList = []
  if (selectedObj) {
    const uniqueKey = props.configs.codeKey
    const nameKey = props.configs.nameKey
    const codeKeyArray = selectedKeysInfo.codeKeys?.split(splitStr) || []
    const nameKeyArray = selectedKeysInfo.nameKeys?.split(splitStr) || []
    if (codeKeyArray.length > 0) {
      for (let i = 0; i < codeKeyArray.length; i++) {
        if (codeKeyArray[i]) {
          const existRow = reactive({})
          existRow[uniqueKey] = codeKeyArray[i]
          existRow[nameKey] = nameKeyArray[i]
          keywordList.push(existRow)
        }
      }
    }
  }
  return keywordList
}

// 数组去重
function clearRepeat(oldArr) {
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
  queryParams.value.currentPage = currentPage
  // 实现翻页光标不消失
  /*  nextTick(() => {
                                                                                                                                                                                                                    proxy.$refs[inputId.value].focus()
                                                                                                                                                                                                                  })*/
  requestData()
  scrollViewport()
}
// 切换展示条数
function handleSizeChange(size) {
  queryParams.value.pageSize = size
  // 实现翻页光标不消失
  nextTick(() => {
    proxy.$refs[inputId.value].focus()
  })
  requestData()
}

// 在上下键索引后调整视口
function scrollViewport() {
  getIndex.value = focusIndex.value
}
// 处理可输入值
function handleCreateValEmit() {
  if (multiple.value) {
    return
  }
  // 判断是否是可输入值
  let chooseLabel = singleOptions.value[0]?.[props.configs.nameKey]
  if (chooseLabel !== input.value) {
    singleOptions.value = [] //清空选项
  }
  const isCreateVal = chooseLabel !== input.value
  // 单选状态
  if (isCreateVal) {
    if (!props.allowCreate) {
      input.value = ''
      if (chooseLabel) {
        emitAutoSelect(null, 'handleCreateValEmit') //原本有选值才发送更新事件
      }
    }
    if (props.allowCreate) {
      emit('getCreateVal', input.value)
    }
  }
}
function hidePopover() {
  handleCreateValEmit() // 如果没有已选择的值，失去焦点时把控件的值清除
  clickCloseFlag.value = false
  // document.onclick = null
  document.removeEventListener('mousedown', clickElseClose)
  pageInput.value?.removeEventListener('blur', pageBlur)
}
let pageInput = ref()
function showPopover() {
  // if (isInDev.value) {
  nextTick(() => {
    popoverDom.value = document.querySelector(`.${popoverClass.value}`)
    const pageEl = pageRef.value.$el
    console.log('【 pageEl 】-1039', pageEl)
    pageInput.value = pageEl?.querySelector ? pageEl.querySelector('.el-input__inner') : null
    pageInput.value?.addEventListener('blur', pageBlur)
  })
  document.addEventListener('mousedown', clickElseClose)
  // } else {
  //   document.onclick = clickElseClose
  // }
}
function pageBlur(event) {
  clickElseClose(event, true)
}
// 失去焦点触发事件
function emitBlur(event) {
  count.value = 0
  if (!facPopoverShow.value) {
    handleCreateValEmit()
  }
  clickElseClose(event, true)
  // if (!multiple.value) {
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
// 移除脏数据
function removeDirtyItems() {
  const strsItem = input.value?.split(splitStr) || []
  const filterList = multipleOptions.value.filter((item) => {
    return strsItem.includes(item[props.configs.nameKey])
  })
  let filterNameKeys = filterList.map((item) => item[props.configs.nameKey]).join(splitStr)
  // 判断最后一个字符是否为逗号
  if (input.value.charAt(input.value.length === splitStr)) {
    filterNameKeys = filterNameKeys + splitStr
  }
  if (filterNameKeys !== input.value) {
    console.log('【移除脏数据 】-1003', filterNameKeys, selectedKeysInfo.nameKeys, input.value)
    emitAutoSelect(filterList, 'removeDirtyItems')
    input.value = filterNameKeys
  }
}
function handleInput(val) {
  // 输入转大写
  if (val && props.uppercase) {
    input.value = input.value.toUpperCase()
  }
  if (multiple.value) {
    // 判断是否是删除操作
    if (selectedKeysInfo.nameKeys.length > input.value.length && multipleOptions.value.length) {
      removeDirtyItems()
    }
  }
}
// input框值发生改变触发事件
function emitChange(val) {
  if (val) {
    if (multiple.value) {
      removeDirtyItems()
    }
  } else {
    emitAutoSelect(null, 'emitChange')
  }
}
function clickIcon() {
  if (props.trigger == 'icon') {
    count.value++
    init()
  }
}
function clearSelectValue() {
  facPopoverShow.value = false
  input.value = ''
  multipleOptions.value = []
  singleOptions.value = []
  queryParams.value[propsConfig.keywordProp] = ''
  if (queryParams.value.searchColumns?.length) {
    queryParams.value.searchColumns.forEach((item) => {
      if (item.type == 'keyword') {
        item.value = ''
      }
    })
  }
  emitAutoSelect(null, 'clearSelectValue')
}
function handleClick() {
  proxy.$refs.inputRef.click()
}
function handleFocus() {
  proxy.$refs.inputRef.focus()
}
const isInDev = ref(false)
// const acWrapRef = ref()
function isInDevFunc() {
  const cellNode = inputRef.value?.$el?.parentNode //document.querySelector('.dodx-editor-cell')
  const classList = cellNode?.classList
  // 判断是在Dev表格中编辑,则自动聚焦
  if (classList?.value.indexOf('dx-editor-cell') >= 0) {
    isInDev.value = true
  }
}
const offsetWidth = ref(0)
onMounted(() => {
  nextTick(() => {
    isInDevFunc()
    offsetWidth.value = associateTable.value.$el.offsetWidth
    calculateTableWidth() // 在组件挂载后计算表格宽度
  })
})
defineExpose({ clearSelectValue, closePopover, handleFocus, handleClick })
</script>
<style>
.ac-poppor {
  padding: 0 !important;
  border: 1px solid #c4c4c4 !important;
  border-radius: 0 !important;
}
</style>
<style lang="scss" scoped>
.search-input {
  width: 100%;
  height: 24px;
  // 固定搜索图标在最右侧
  :deep(.el-input__wrapper) {
    padding: 1px 20px 1px 7px;
    &.is-focus {
      // border:1px solid red;
      box-shadow: 0 0 0 2px #000 inset;
    }
    .el-input__inner {
      padding-right: 15px;
    }
    .el-input__suffix-inner {
      position: relative !important;
      .el-icon {
        position: absolute !important;
        // top: 4px !important;
      }
      // 避免清空图标和搜索图标重叠
      .el-input__clear {
        right: 0px; //避免清空图标和搜索图标重叠
        display: block !important;
      }
      // 避免清空图标和搜索图标重叠
      .search-icon {
        cursor: pointer;
        right: -15px;
      }
    }
  }
}

// .friendSearchContainer {
//   width: 100%;
//   position: relative;
//   // height: 24px !important;
// }

.friendSearchList {
  width: auto;
  max-height: 330px;
  overflow: auto;
  z-index: 10;
  position: relative;
  :deep(.el-table) {
    th,
    td {
      padding: 2px 0;
    }
    --el-table-border: 1px solid #c4c4c4;
    border-top: var(--el-table-border);
    .el-table__cell {
      font-family: arial, 苹方字体, 宋体, SimSun, 'Microsoft YaHei', Arial, 'sans-serif';
      padding: 2px 0;
      border-left: none !important;
      border-left: none !important;
      border-bottom: var(--el-table-border);
      color: #333;
    }
    .el-table__header-wrapper th,
    .el-table__fixed-header-wrapper th {
      height: 23px !important;
      background: #eeeeee;
    }
    .cell {
      font-weight: 400;
      height: 20px !important;
      line-height: 20px;
    }
    .el-table__body {
      .el-table__cell {
        padding: 2px 0;
        border-left: none !important;
        border-bottom: none !important;
      }
      tr {
        &.current-row > td.el-table__cell {
          background-color: #dde7ff;
        }

        &:hover > td.el-table__cell {
          background-color: rgba(229, 229, 229, 1);
        }
      }
    }
  }
}

// .friendSearchModal {
//   position: fixed;
//   top: 0;
//   left: -383px;
//   margin-top: -313px;
//   height: 326%;
//   width: 282%;
//   z-index: 1;
// }

.txt {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: left;
}
.ac-page-wrap {
  padding: 2px;
}
</style>
