<template>
  <div class="layout-setting">
    <el-icon size="16" @click="openLayoutSettingDialog">
      <Setting />
    </el-icon>
    <!-- 保存布局弹窗-->
    <el-dialog
      v-if="dialogVisibleLayout"
      v-model="dialogVisibleLayout"
      append-to-body
      :title="$t('vxeTable.layoutSetting')"
      draggable
      align-center
      class="layout-dialog"
      :close-on-click-modal="false"
      destroy-on-close
      :width="[ROLE_TYPE.TENANT, ROLE_TYPE.USER].includes(roleType) ? 980 : 690"
    >
      <div v-loading="loading">
        <div class="flex-sc mb-05">
          <el-button type="primary" @click="saveLayout()">
            {{ $t('vxeTable.save') }}
          </el-button>
          <el-button v-if="[ROLE_TYPE.TENANT, ROLE_TYPE.USER].includes(roleType)" @click="saveAs">
            {{ $t('vxeTable.saveAs') }}
          </el-button>
          <el-button @click="resetDefaultLayout()">
            {{ $t('vxeTable.resetLayout') }}
          </el-button>
        </div>
        <div class="flex-sb content-wrap">
          <!-- 右侧布局列表 -->
          <div v-if="[ROLE_TYPE.TENANT, ROLE_TYPE.USER].includes(roleType)" class="layouts-wrap">
            <div class="layouts-list">
              <div
                v-for="(item, index) in layoutTemplatesList"
                :key="index"
                class="flex-sc layout-item"
                :class="{ current: currentItem[layoutIdProp] == item[layoutIdProp] }"
                @click="clickItem(item)"
              >
                <el-input
                  v-model="item.name"
                  trigger="icon"
                  :editStatus="editStatus"
                  class="layout-edit"
                  :readonly="item.level == TEMP_TYPE.TENANT || currentItem[layoutIdProp] != item[layoutIdProp]"
                  @change="onLayoutNameChange(item.name)"
                />
                <!-- <EditLabel
                  v-model="item.name"
                  trigger="icon"
                  :editStatus="editStatus"
                  class="layout-edit"
                  :readonly="item.level == TEMP_TYPE.TENANT || currentItem[layoutIdProp] != item[layoutIdProp]"
                  @change="onLayoutNameChange(item.name)"
                /> -->
                <span v-if="isDefault(item)" class="is-default">
                  {{ $t('vxeTable.defaultLayout') }}
                </span>
                <el-button
                  v-if="item.level == TEMP_TYPE.USER"
                  type="primary"
                  link
                  style="margin-left: auto"
                  @click="deleteLayoutClick(item)"
                >
                  {{ $t('vxeTable.delete') }}
                </el-button>
              </div>
            </div>
          </div>
          <el-row :gutter="0" style="height: 100%" class="columns-box">
            <!-- 显示列Display Columns -->
            <el-col :span="11" class="columns-wrap show">
              <div class="columns-container">
                <div class="flex-sb columns-container_header">
                  <div class="flex-sc">
                    <el-checkbox
                      v-model="showCheckAll"
                      size="large"
                      :indeterminate="showIndeterminate"
                      :label="`${$t('vxeTable.displayColumns')}(${showColumnsList.length}/${totalColumns})`"
                    />
                  </div>
                  <div class="arrow-icons">
                    <el-icon @click="moveUp" size="15" color="#bfbfbf">
                      <ArrowUp />
                    </el-icon>
                    <el-icon @click="moveDown" size="15" color="#bfbfbf">
                      <ArrowDown />
                    </el-icon>
                    <svg-icon icon-class="arrow_top" size="1.3em" @click="moveTop" />
                    <svg-icon icon-class="arrow_bottom" size="1.3em" @click="moveBottom" />
                  </div>
                </div>
                <div class="columns-container content">
                  <el-input v-model="showLabel" :placeholder="$t('vxeTable.pleaseEnter')" suffix-icon="Search" />
                  <el-checkbox-group v-model="showSelectedKeys" class="columns-list" size="large">
                    <draggable
                      v-model="filterShowColumnsList"
                      :group="groupConfig"
                      animation="200"
                      class="draggable-container"
                      ghost-class="column-ghost"
                      @add="(evt) => onDragAdd(evt, 'show')"
                      @remove="(evt) => onDragRemove(evt, filterShowColumnsList, showColumnsList)"
                      @start="onShowDragStart"
                      @end="onShowDragEnd"
                    >
                      <template #item="{ element: item, index }">
                        <div class="flex-sb">
                          <el-checkbox
                            :key="item[fieldProp]"
                            :label="item[fieldProp]"
                            :value="item[fieldProp]"
                            class="column-item flex-sc"
                            size="large"
                          >
                            <span v-if="item.isRequired" style="color: red">*</span>
                            <span class="label">{{ item[titleProp] }}</span>
                          </el-checkbox>
                          <div class="fixed-buttons">
                            <span title="冻结在左侧">
                              <vxe-button
                                :class="item.fixed == 'left' ? 'is-fixed' : ''"
                                mode="text"
                                :icon="item.fixed == 'left' ? 'vxe-icon-fixed-left-fill' : 'vxe-icon-fixed-left'"
                                @click="handleFixed(item, 'left')"
                              />
                            </span>
                            <span title="冻结在右侧">
                              <vxe-button
                                :class="item.fixed == 'right' ? 'is-fixed' : ''"
                                mode="text"
                                :icon="item.fixed == 'right' ? 'vxe-icon-fixed-right-fill' : 'vxe-icon-fixed-right'"
                                @click="handleFixed(item, 'right')"
                              />
                            </span>
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </el-checkbox-group>
                </div>
              </div>
            </el-col>
            <!-- 按钮 -->
            <el-col :span="2" class="layout-btn">
              <el-button type="primary" icon="ArrowRight" @click="moveToRight" style="margin-bottom: 10px" />
              <el-button icon="ArrowLeft" @click="moveToLeft" />
            </el-col>
            <!-- 隐藏列Hidden Columns -->
            <el-col :span="11" class="columns-wrap">
              <div class="columns-container">
                <el-row class="columns-container__header">
                  <el-checkbox
                    v-model="hideCheckAll"
                    size="large"
                    :indeterminate="hideIndeterminate"
                    :label="`${$t('vxeTable.hiddenColumns')}(${hideColumnsList.length}/${totalColumns})`"
                  />
                </el-row>
                <div class="columns-container__content">
                  <el-input v-model="hideLabel" :placeholder="$t('vxeTable.pleaseEnter')" suffix-icon="Search" />
                  <el-checkbox-group v-model="hideSelectedKeys" class="columns-list" size="large">
                    <draggable
                      v-model="filterHideColumnsList"
                      :group="groupConfig"
                      animation="200"
                      class="draggable-container"
                      :sort="false"
                      @add="(evt) => onDragAdd(evt, 'hidden')"
                      @remove="(evt) => onDragRemove(evt, filterHideColumnsList, hideColumnsList)"
                    >
                      <template #item="{ element: item }">
                        <el-checkbox
                          :key="item[fieldProp]"
                          :label="item[fieldProp]"
                          :value="item[fieldProp]"
                          class="column-item flex-sc"
                          size="large"
                        >
                          <span class="label">{{ item[titleProp] }}</span>
                        </el-checkbox>
                      </template>
                    </draggable>
                  </el-checkbox-group>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!-- :before-close="beforeClose" -->
    <!-- 名称弹框 -->
    <NewDialog
      v-if="layoutNameVisible"
      v-model="layoutNameVisible"
      @confirm="confirmNewDialog"
      @cancel="cancelNewDialog"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import 'vxe-pc-ui/es/style.css'
import { VxeUI, VxeIcon, VxeButton } from 'vxe-pc-ui'
import draggable from 'vuedraggable'
import { nextTick, getCurrentInstance, ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import EditLabel from '@/components/EditLabel/EditLabel.vue'
import NewDialog from './newDialog.vue'
// import { useUserStore } from '@/store'
import dxGridLayout from './dataGridLayout.ts'
import { isEqual } from '../../../../methods/tools'
import { ElMessage } from 'element-plus'

const enum ROLE_TYPE {
  USER = 'U', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'S', // 系统级布局 principal_group_code = 1000
  TENANT = 'T' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}

// 模板类型
const enum TEMP_TYPE {
  USER = 'USER', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'SYS', // 系统级布局 principal_group_code = 1000
  TENANT = 'TENANT' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}

const userInfo = {} //useUserStore().user
const { proxy } = getCurrentInstance()
const props = defineProps({
  tableRef: {
    type: Object,
    required: false,
    default() {
      return {}
    }
  },
  limitFieldCount: {
    type: Number,
    default: 0 // 表示不限制
  }
})

const roleType = ref() //当前用户类型
const route = useRoute()

const layoutPath = computed(() => {
  if (route?.meta?.originUrl) {
    if (route?.meta?.originUrl.indexOf('?') >= 0) {
      return route.meta.originUrl.split('?')[0]
    }
    return route.meta.originUrl
  } else {
    return route.path + '.html'
  }
})

// ---------- 名称弹框
let layoutNameVisible = ref(false)
// ---------- 表格
const tableConfig = reactive({
  layoutIdProp: 'mdInterfaceTemplateId', //布局id字段映射
  fieldProp: 'field',
  titleProp: 'title',
  specailColumns: ['seq', 'checkbox', 'radio', 'expand'], //特殊列
  SYSTEM_TEMP_NAME: '系统级模板', //系统级名称
  TENANT_TEMP_NAME: '租户级模板', //租户级名称
  DEFAULT_TEMP_NAME: 'Default', //默认模板
  layoutPath: layoutPath.value //
})
const { SYSTEM_TEMP_NAME, TENANT_TEMP_NAME, DEFAULT_TEMP_NAME, specailColumns, layoutIdProp, fieldProp, titleProp } =
  tableConfig
const $layoutTable = props.tableRef
let fullColumnOptions = ref([]) //表格的所有列数据
const totalColumns = computed(() => {
  return showColumnsList.value.length + hideColumnsList.value.length
})
let dialogVisibleLayout = ref(false)
let layoutForm = reactive({
  fixedColumns: 0,
  layoutName: ''
})
const tableApi = new dxGridLayout($layoutTable, tableConfig)
function editStatus(val) {
  const isValid = layoutTemplatesList.value.filter((it) => it.name == val)
  if (isValid.length > 1) {
    ElMessage.error(proxy.$t('vxeTable.nameNotRepeat'))
  }
  return isValid.length <= 1
}
function handleFixed(item, direction) {
  if (item.fixed == direction) {
    item.fixed = false
  } else {
    item.fixed = direction
  }
}
// 处理布局名称变更
function onLayoutNameChange(val) {
  currentItem.value.name = val
}
//当前选中的布局行
const currentItem = ref({
  mdInterfaceTemplateId: 0,
  name: '', //布局名称
  contentParse: {}
})
const layoutTableId = $layoutTable?.id
// ---------------------------------------------------------------------------------------------------- 显示列
const showCheckAll = computed({
  get() {
    return showColumnsList.value.length && showSelectedKeys.value.length == showColumnsList.value.length
  },
  set(val) {
    if (val) {
      showSelectedKeys.value = showColumnsList.value.map((it) => it[fieldProp])
    } else {
      showSelectedKeys.value = []
    }
  }
})
const showIndeterminate = computed(() => {
  const checkedCount = showSelectedKeys.value.length
  return checkedCount > 0 && checkedCount < showColumnsList.value.length
})
const showLabel = ref('') //搜索字段
const showColumnsList = ref([])
const showSelectedKeys = ref([])
const showSelectedItems = computed(() => {
  const source = JSON.parse(JSON.stringify(showColumnsList.value))
  return source.filter((it) => showSelectedKeys.value.includes(it[fieldProp]))
})
const filterShowColumnsList = computed({
  get() {
    if (!showLabel.value) {
      return showColumnsList.value
    }
    return showColumnsList.value.filter((it) => it[titleProp].indexOf(showLabel.value) >= 0)
  },
  set(val) {
    if (val.length == showColumnsList.value.length) {
      showColumnsList.value = val //排序
    }
  }
})
// ---------------------------------------------------------------------------------------------------- 隐藏列
const hideCheckAll = computed({
  get() {
    return hideColumnsList.value.length && hideSelectedKeys.value.length == hideColumnsList.value.length
  },
  set(val) {
    if (val) {
      hideSelectedKeys.value = hideColumnsList.value.map((it) => it[fieldProp])
    } else {
      hideSelectedKeys.value = []
    }
  }
})
const hideIndeterminate = computed(() => {
  const checkedCount = hideSelectedKeys.value.length
  return checkedCount > 0 && checkedCount < hideColumnsList.value.length
})
const hideLabel = ref('') //搜索字段
const hideColumnsList = ref([])
const hideSelectedKeys = ref([])
const hideSelectedItems = computed(() => {
  const source = JSON.parse(JSON.stringify(hideColumnsList.value))
  return source.filter((it) => hideSelectedKeys.value.includes(it[fieldProp]))
})
const filterHideColumnsList = computed({
  get() {
    if (!hideLabel.value) {
      return hideColumnsList.value
    }
    return hideColumnsList.value.filter((it) => it[titleProp].indexOf(hideLabel.value) >= 0)
  },
  set(val) {
    if (val.length == hideColumnsList.value.length) {
      hideColumnsList.value = val
    }
  }
})
const devDefaultColumns = ref() //开发布局
// 系统级允许的字段列表
const sysAllowedFields = computed(() => {
  const { sysLevelTemplate } = layoutTemplates.value
  const tenantContent = sysLevelTemplate?.templateContent ? JSON.parse(sysLevelTemplate.templateContent) : {}
  const allowedFields = tenantContent.layout?.map((it) => it.field) || []
  return allowedFields
})
// 租户级允许的字段列表
const tenantAllowedFields = computed(() => {
  const { tenantLevelTemplate } = layoutTemplates.value
  const tenantContent = tenantLevelTemplate?.templateContent ? JSON.parse(tenantLevelTemplate.templateContent) : {}
  const allowedFields = tenantContent.layout?.map((it) => it.field) || []
  return allowedFields
})
const isRestoredFromParent = ref(false) //标记是否刚恢复了上级布局
//默认布局
function useDefaultLayout() {
  // console.log('useDefaultLayout')
  const userDefaultTemplate = layoutTemplates.value.userLevelTemplates?.find(
    (it) => it.templateName == DEFAULT_TEMP_NAME
  )
  console.log('userDefaultTemplate', userDefaultTemplate)
  saveLayoutApi({
    ...userDefaultTemplate,
    templateContent: JSON.stringify({ layout: { version: new Date().getTime() } }),
    templateName: DEFAULT_TEMP_NAME,
    isDefault: 1,
    level: TEMP_TYPE.USER,
    showTip: false
  })
}
// 【恢复默认布局】一级级向上查找默认布局
async function resetDefaultLayout(config = {}) {
  const { closeDialog = false, isRender = false } = config
  let targetLayout = null
  const tempLevel = currentItem.value.level
  const { tenantLevelTemplate, sysLevelTemplate } = layoutTemplates.value
  // 根据当前级别,向上查找布局
  if (tempLevel == TEMP_TYPE.SYSTEM) {
    // 系统级 -> 恢复成本地默认布局(开发时的默认布局)
    targetLayout = devDefaultColumns.value
  } else if (tempLevel == TEMP_TYPE.TENANT) {
    // 租户级 -> 查找系统级布局
    targetLayout = sysLevelTemplate?.contentParse?.layout
  } else if (tempLevel == TEMP_TYPE.USER) {
    // 用户级 -> 先查找租户级布局,如果没有再查找系统级
    targetLayout = (tenantLevelTemplate || sysLevelTemplate)?.contentParse?.layout
  }
  // 没有则使用开发时的默认列配置重建显示列
  if (!targetLayout) {
    targetLayout = devDefaultColumns.value
  }
  // 使用找到的上级布局
  currentItem.value.contentParse.layout = targetLayout
  loadColumsList()
  isRender && renderColumns(targetLayout)
  // 清空未显示列
  hideColumnsList.value = []

  // 清空选择状态
  showSelectedKeys.value = []
  hideSelectedKeys.value = []

  // 更新旧数据源,标记为已修改
  oldShowDataSource.value = []

  // 标记为已从上级恢复
  isRestoredFromParent.value = true
  closeDialog && (dialogVisibleLayout.value = false)
}
const oldShowDataSource = ref()
// 应用列数限制到表格(用于初始化时直接限制)
function applyColumnLimit() {
  if (!props.limitFieldCount || props.limitFieldCount <= 0) return
  if (!$layoutTable) return

  try {
    const fullColumn = $layoutTable.getTableColumn().fullColumn
    let visibleCount = 0
    fullColumn.forEach((col) => {
      //跳过特殊列(序号列、勾选列)
      if (specailColumns.includes(col.type)) {
        return
      }
      // 如果已经超过限制,隐藏该列
      if (visibleCount >= props.limitFieldCount) {
        col.visible = false
      } else if (col.visible !== false) {
        // 保持已设置为显示的列
        col.visible = true
        visibleCount++
      }
    })
    // 重新加载列
    $layoutTable.reloadColumn(fullColumn)
  } catch (error) {
    console.warn('应用列数限制失败:', error)
  }
}
const isUserDefaultActive = computed(() => {
  return layoutTemplatesList.value.length && currentItem.value.templateName === DEFAULT_TEMP_NAME
})
// 【加载Columns配置】
function loadColumsList() {
  // 默认模板不显示配置列
  if (isUserDefaultActive.value) {
    showColumnsList.value = []
    hideColumnsList.value = []
    oldShowDataSource.value = JSON.parse(JSON.stringify(showColumnsList.value))
    return
  }
  const editRules = $layoutTable.props?.editRules || {}
  let visibleColumns = []
  let useLocal = true //是否使用本地配置
  if (layoutTemplatesList.value.length || currentItem.value.contentParse?.layout?.length) {
    useLocal = false
    visibleColumns = currentItem.value.contentParse?.layout || []
  } else {
    visibleColumns = $layoutTable.getColumns() //获取表格的可视的列,实时的列信息,如最新宽度
  }
  // 获取基础列配置
  let baseColumns = $layoutTable.getTableColumn().fullColumn
  // 如果是租户级模板且有系统级权限过滤,则过滤出系统级允许的字段作为基础
  if (
    layoutTemplates.value.sysLevelTemplate &&
    (currentItem.value.level === TEMP_TYPE.TENANT || roleType.value === ROLE_TYPE.TENANT)
  ) {
    baseColumns = baseColumns.filter((col) => {
      //特殊列(序号、勾选)始终保留
      if (specailColumns.includes(col.type)) {
        return true
      }
      return sysAllowedFields.value.includes(col[fieldProp]) // 只保留租户级允许的字段
    })
  }
  // 如果是用户级模板且有租户级权限过滤,则过滤出租户级允许的字段作为基础
  if (
    layoutTemplates.value.tenantLevelTemplate &&
    (currentItem.value.level === TEMP_TYPE.USER || roleType.value === ROLE_TYPE.USER)
  ) {
    baseColumns = baseColumns.filter((col) => {
      //特殊列(序号、勾选)始终保留
      if (specailColumns.includes(col.type)) {
        return true
      }
      return tenantAllowedFields.value.includes(col[fieldProp]) // 只保留租户级允许的字段
    })
  }
  fullColumnOptions.value = baseColumns
  //排除序号列和勾选列和不可控制隐藏显示的列
  const excludeFields = fullColumnOptions.value
    .filter((item) => specailColumns.includes(item.type))
    .map((item) => item[fieldProp])
  // 过滤掉特殊列
  const filteredVisibleColumns = visibleColumns.filter((item) => !specailColumns.includes(item.type))
  // 应用列数限制
  let displayColumns = filteredVisibleColumns
  let extraColumns = []
  if (props.limitFieldCount > 0 && filteredVisibleColumns.length > props.limitFieldCount) {
    // 如果超过限制,将超出的列移到隐藏列
    displayColumns = filteredVisibleColumns.slice(0, props.limitFieldCount)
    extraColumns = filteredVisibleColumns.slice(props.limitFieldCount)
  }
  // 显示列
  showColumnsList.value = []
  displayColumns.forEach((showItem, index) => {
    const columnOption = fullColumnOptions.value.find((it) => showItem[fieldProp] == it[fieldProp])
    // const columnOption = fullColumnOptions.value.find((it) => {
    //   if (showItem[fieldProp]) {
    //     return showItem[fieldProp] == it[fieldProp]
    //   } else {
    //     //没有id就根据标签查找
    //     return showItem[titleProp] == it[titleProp]
    //   }
    // })
    const isRequired = editRules[showItem[fieldProp]]?.[0]?.required
    let obj = {
      isRequired: isRequired,
      seq: index,
      isShow: true,
      fixed: useLocal ? columnOption.fixed : showItem.fixed, // ? showItem.fixed: false,
      width: showItem?.width || columnOption?.resizeWidth || columnOption?.renderWidth || columnOption?.width
    }
    if (columnOption) {
      obj[fieldProp] = columnOption[fieldProp]
      obj[titleProp] = columnOption[titleProp]
    }
    showColumnsList.value.push(obj)
  })
  // 保存旧数据
  oldShowDataSource.value = JSON.parse(JSON.stringify(showColumnsList.value))
  const visibleFields = displayColumns.map((it) => it[fieldProp])
  // 隐藏列信息
  hideColumnsList.value = fullColumnOptions.value
    .filter((item) => {
      return !visibleFields.includes(item[fieldProp]) && !excludeFields.includes(item[fieldProp])
    })
    .map((item, index) => {
      // 如果是列数限制的列,使用其原始索引
      const extraIndex = extraColumns.findIndex((it) => it[fieldProp] == item[fieldProp])
      let obj = {
        isShow: false,
        seq: extraIndex >= 0 ? props.limitFieldCount + extraIndex : item.sortNumber,
        fixed: item.fixed || false
        // disabled: false
      }
      obj[fieldProp] = item[fieldProp]
      obj[titleProp] = item[titleProp]
      return obj
    })
    .sort((a, b) => a.seq - b.seq)
  showSelectedKeys.value = []
  hideSelectedKeys.value = []
}
// 获取模板列表
const layoutTemplatesList = computed(() => {
  const { sysLevelTemplate, tenantLevelTemplate, userLevelTemplates } = layoutTemplates.value
  if (roleType.value === ROLE_TYPE.SYSTEM) {
    return sysLevelTemplate ? [sysLevelTemplate] : []
  }
  let list = []
  if (roleType.value === ROLE_TYPE.TENANT) {
    if (tenantLevelTemplate) {
      list = [tenantLevelTemplate, ...userLevelTemplates]
    } else {
      list = userLevelTemplates
    }
  }
  if (roleType.value === ROLE_TYPE.USER) {
    list = userLevelTemplates || []
  }
  return list.filter((it) => it.templateName !== DEFAULT_TEMP_NAME) //默认布局不显示
})
const layoutTemplates = ref({})
// 获取已保存的布局数据√
async function getTableData() {
  layoutTemplates.value = await tableApi.getTableTemplates()
  // console.log('【 layoutTemplates 】 -374', layoutTemplates.value)
  $layoutTable.$layout.userTemplates.value = layoutTemplates.value.userLevelTemplates || []
  const defaultLayout = getDefaultTemplate()
  // console.log('【 defaultLayout 】 -399', defaultLayout)
  //过滤出默认数据
  if (defaultLayout) {
    loadRowLayout(defaultLayout) //包含loadColumsList
  } else {
    resetParams()
    resetDefaultLayout({ isRender: true }) //没有已存默认布局时
  }
  return Promise.resolve()
}
function resetParams() {
  layoutForm.fixedColumns = 0
  showSelectedKeys.value = []
  hideSelectedKeys.value = []
  showColumnsList.value = []
  hideColumnsList.value = []
  currentItem.value = {
    mdInterfaceTemplateId: 0,
    name: DEFAULT_TEMP_NAME,
    templateName: DEFAULT_TEMP_NAME,
    contentParse: { layout: $layoutTable.getColumns() }
  }
}
const isDataChange = computed(() => {
  // const hasNewChange = currentItem.value[layoutIdProp] < 0
  const hasColumnsChange = !isEqual(showColumnsList.value, oldShowDataSource.value)
  return hasColumnsChange // || hasColumnsChange //数据是否修改保存
})
function openLayoutSettingDialog() {
  dialogVisibleLayout.value = true
  // 重置恢复标记
  isRestoredFromParent.value = false
  getTableData({ closeDialog: false })
  loadColumsList() //加载Colums配置
}
// -------------------------------- 拖拽移动 Start --------------------------------
// 左移
function moveToLeft() {
  if (!hideSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  // 检查列数限制
  if (props.limitFieldCount > 0) {
    const currentShowCount = showColumnsList.value.length
    const willAddCount = hideSelectedItems.value.length
    const totalAfterMove = currentShowCount + willAddCount
    if (totalAfterMove > props.limitFieldCount) {
      const availableSlots = props.limitFieldCount - currentShowCount
      ElMessage.error(
        proxy.$t('vxeTable.columnLimitExceeded', { limit: props.limitFieldCount, available: availableSlots })
      )
      return
    }
  }
  hideSelectedItems.value.forEach((t) => (t.isShow = true))
  showColumnsList.value = showColumnsList.value.concat(hideSelectedItems.value) //.sort((a, b) => a.seq - b.seq)
  removeSelectedItems(hideColumnsList, hideSelectedItems.value)
  hideSelectedKeys.value = []
}
// 右移
function moveToRight() {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  // 如果是全选的话则直接过滤出必填项
  if (showSelectedItems.value.length == showColumnsList.value.length) {
    showSelectedKeys.value = showSelectedItems.value
      .filter((t) => !(t.fixed || t.isRequired))
      .map((it) => it[fieldProp])
  } else {
    const hasRequireItems = showSelectedItems.value
      .filter((item) => item.isRequired)
      .map((item) => item[titleProp])
      .join('、')
    if (hasRequireItems) {
      return ElMessage.error(proxy.$t('tip.cannotHide', { item: hasRequireItems }))
    }
    showSelectedItems.value = showSelectedItems.value.filter((t) => !t.fixed)
  }
  showSelectedItems.value.forEach((t) => (t.isShow = false))
  hideColumnsList.value = hideColumnsList.value.concat(showSelectedItems.value).sort((a, b) => a.seq - b.seq)
  removeSelectedItems(showColumnsList, showSelectedItems.value)
  showSelectedKeys.value = []
}
// 从数组中移除指定项
function removeSelectedItems(source, deleteItems) {
  const deleteKeys = deleteItems.map((item) => item[fieldProp])
  source.value = source.value.filter((item) => {
    return !deleteKeys.includes(item[fieldProp])
  })
}
// 上移
function moveUpItems(selectItems) {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  let addSeq = 0
  selectItems.forEach((t) => {
    if (t.seq >= 0) {
      let fixedSeq = 0
      for (let i = 0; i < showColumnsList.value.length; i++) {
        if (t.seq > showColumnsList.value[i].seq) {
          // if (!showColumnsList.value[i].fixed) {
          // } else {
          //   fixedSeq = showColumnsList.value[i].seq + 1
          //   addSeq = addSeq + 1
          // }
          showColumnsList.value[i].seq = showColumnsList.value[i].seq + 1
        }
      }
      for (let j = 0; j < hideColumnsList.value.length; j++) {
        if (t.seq > hideColumnsList.value[j].seq) {
          hideColumnsList.value[j].seq = hideColumnsList.value[j].seq + 1
        }
      }
      if (fixedSeq == 0) {
        t.seq = addSeq
        showColumnsList.value.splice(addSeq, 0, t)
        addSeq = addSeq + 1
      } else {
        t.seq = fixedSeq
        showColumnsList.value.splice(addSeq, 0, t)
      }
    }
  })
}
// 移动之后取消勾选
function clearSelectedShowItems() {
  // setTimeout(() => { showSelectedKeys.value = [] // },200)
}
// 置顶
function moveTop() {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  // showSelectedItems.value = showSelectedItems.value.filter((t) => !t.fixed)
  const selectedItems = JSON.parse(JSON.stringify(showSelectedItems.value))
  removeSelectedItems(showColumnsList, selectedItems)
  moveUpItems(selectedItems)
  clearSelectedShowItems()
}
// 置顶
function moveBottom() {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  // showSelectedItems.value = showSelectedItems.value.filter((t) => !t.fixed)
  const selectedItems = JSON.parse(JSON.stringify(showSelectedItems.value))
  let count = showColumnsList.value.length + hideColumnsList.value.length + selectedItems.length
  removeSelectedItems(showColumnsList, selectedItems)
  moveDownItems(selectedItems)
  selectedItems.forEach((t, index) => (t.seq = count + index))
  showColumnsList.value = showColumnsList.value.concat(selectedItems)
  clearSelectedShowItems()
}
function resetUpSeq(seq) {
  for (let j = hideColumnsList.value.length - 1; j >= 0; j--) {
    if (seq - 1 == hideColumnsList.value[j].seq) {
      seq = hideColumnsList.value[j].seq
      hideColumnsList.value[j].seq = hideColumnsList.value[j].seq + 1
    }
  }
  return seq
}
// 上移
function moveUp() {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  const source = JSON.parse(JSON.stringify(showColumnsList.value))
  const selectedItems = JSON.parse(JSON.stringify(showSelectedItems.value))
  // selectedItems = selectedItems.filter((t) => !t.fixed)
  const selectedKeys = selectedItems.map((it) => it[fieldProp])
  selectedItems.forEach((item) => {
    const index = source.findIndex((it) => it[fieldProp] == item[fieldProp])
    let isPrevSelected = selectedKeys.includes(source[index - 1]?.[fieldProp]) //上一个也是勾选项,不处理
    // if (index > 0 && !source[index - 1].fixed && !isPrevSelected) {
    if (index > 0 && !isPrevSelected) {
      let seq = item.seq
      item.seq = source[index - 1].seq //获取当前项前一个的seq
      source[index - 1].seq = resetUpSeq(seq)
      source.splice(index, 1)
      source.splice(index - 1, 0, item)
    }
  })
  showColumnsList.value = source
}
function resetDownSeq(seq) {
  for (let j = 0; j < hideColumnsList.value.length; j++) {
    if (seq + 1 == hideColumnsList.value[j].seq) {
      seq = hideColumnsList.value[j].seq
      hideColumnsList.value[j].seq = hideColumnsList.value[j].seq - 1
    }
  }
  return seq
}
//下移
function moveDown() {
  if (!showSelectedKeys.value.length) {
    return ElMessage.error(proxy.$t('tip.checkData'))
  }
  let source = JSON.parse(JSON.stringify(showColumnsList.value))
  const selectedItems = JSON.parse(JSON.stringify(showSelectedItems.value))
  // selectedItems = selectedItems.filter((t) => !t.fixed)
  const selectedKeys = selectedItems.map((it) => it[fieldProp])
  selectedItems.reverse().forEach((item) => {
    const index = source.findIndex((it) => it[fieldProp] == item[fieldProp])
    let isPrevSelected = selectedKeys.includes(source[index + 1]?.[fieldProp]) //上一个也是勾选项,不处理
    if (index < source.length - 1 && !isPrevSelected) {
      let seq = item.seq
      item.seq = source[index + 1].seq
      source[index + 1].seq = resetDownSeq(seq)
      source.splice(index, 1)
      source.splice(index + 1, 0, item)
    }
  })
  showColumnsList.value = source
}
const dragState = reactive({
  startIndex: -1,
  showTip: true // 是否显示提示
})
const groupConfig = ref({
  name: 'tableColumnsDrag',
  put: true,
  pull: (to, from, dragEl, evt) => {
    // 如果是同一个容器内的排序,允许拖拽
    if (to === from) {
      return true
    }
    // 必填项不允许隐藏
    if (dragState.startElement?.isRequired === true) {
      if (dragState.showTip) {
        ElMessage.error(proxy.$t('tip.cannotHide', { item: dragState.startElement[titleProp] }))
      }
      dragState.showTip = false
      return false
    }
    return true
  }
})
// 拖拽事件处理函数
const onDragAdd = (evt, type) => {
  const { oldIndex, newIndex } = evt
  // console.log('( onDragAdd】-374', evt, filterShowColumnsList.value)
  // 显示列新增
  if (type === 'show') {
    const addFilterItem = filterHideColumnsList.value[oldIndex]
    const showFilterItem = filterShowColumnsList.value[newIndex]
    if (showFilterItem) {
      // 根据showFilterItem获取在showColumnsList中的实际索引
      const draggedFromIndex = showColumnsList.value.findIndex((it) => it[fieldProp] == showFilterItem[fieldProp])
      if (draggedFromIndex >= 0 && addFilterItem) {
        showColumnsList.value.splice(draggedFromIndex, 0, addFilterItem) //插入到原始列表showFilterItem前面
      }
    } else {
      addFilterItem && showColumnsList.value.push(addFilterItem) //插入数据
    }
  } else {
    //隐藏列新增
    const addFilterItem = filterShowColumnsList.value[oldIndex]
    addFilterItem && hideColumnsList.value.push(addFilterItem) //插入数据
  }
  // 清空选择状态
  showSelectedKeys.value = []
  hideSelectedKeys.value = []
}
// 拖拽移除时的处理逻辑
function onDragRemove(evt, filterColumnsList, columnsList) {
  const { oldIndex } = evt
  const filterItem = filterColumnsList[oldIndex]
  // 根据过滤列表中的数据项,获取在实际列表中的实际索引
  const draggedFromIndex = columnsList.findIndex((it) => it[fieldProp] == filterItem[fieldProp])
  if (draggedFromIndex >= 0) {
    columnsList.splice(draggedFromIndex, 1) //从原始列表移除选择的数据
  }
}
function onShowDragStart(evt) {
  dragState.startIndex = evt.oldIndex
  dragState.startElement = filterShowColumnsList.value[evt.oldIndex] || null
}
function onShowDragEnd(evt) {
  dragState.showTip = true
  dragState.startElement = null
}
// 拖拽移动 End
// 获取接口的默认模褥(1111th, 2025 11:18 上午)
function getDefaultTemplate(level) {
  const { userLevelTemplates, tenantLevelTemplate, sysLevelTemplate } = layoutTemplates.value
  const userTemplate = userLevelTemplates?.find((it) => it.isDefault === 1)
  if (userTemplate?.templateName === DEFAULT_TEMP_NAME) {
    //用户角色的默认布局为上级布局
    userTemplate.contentParse.layout =
      tenantLevelTemplate?.contentParse?.layout || sysLevelTemplate?.contentParse?.layout || devDefaultColumns.value
  }
  if (level) {
    if (level === TEMP_TYPE.SYSTEM) {
      return sysLevelTemplate
    }
    if (level === TEMP_TYPE.TENANT) {
      return tenantLevelTemplate
    }
    if (level === TEMP_TYPE.USER) {
      return userTemplate
    }
    return null
  }
  let defaultLayout = null
  if (roleType.value === ROLE_TYPE.SYSTEM) {
    defaultLayout = sysLevelTemplate
  } else {
    if (userTemplate?.templateName === DEFAULT_TEMP_NAME) {
      if (roleType.value === ROLE_TYPE.TENANT) {
        return tenantLevelTemplate //租户角色的默认布局为租户布局
      } else {
        return userTemplate
      }
    }
    defaultLayout = userTemplate || tenantLevelTemplate
  }
  return defaultLayout
}
function isDefault(item) {
  const defaultLayout = getDefaultTemplate()
  return defaultLayout[layoutIdProp] === item[layoutIdProp]
}
function clickItem(item) {
  if (item[layoutIdProp] === currentItem.value[layoutIdProp]) {
    return
  }
  setCurrentItem(item)
}
// 【切换行】
async function setCurrentItem(item, valid = true) {
  // console.log('setCurrentItem', item)
  if (valid && isDataChange.value) {
    try {
      await proxy.$modal.confirm(proxy.$t('vxeTable.confirmSave'))
      await saveLayout({ closeDialog: false, showTip: true })
    } catch {}
  }
  // 设置切换模板标记,防止自动保存
  $layoutTable.$layout.isChangingTemplate = true
  // 重置恢复标记
  isRestoredFromParent.value = false
  currentItem.value = JSON.parse(JSON.stringify(item))
  loadColumsList()
  // 延迟清除标记,确保相关操作完成
  setTimeout(() => {
    $layoutTable.$layout.isChangingTemplate = false
  }, 1000)
}
// 更新默认布局
function updateDefaultLayout(layoutItem) {
  loadRowLayout(layoutItem, { notCloseDialog: true, isTemp: false })
  saveUserLayout({ showTip: false, onlyUpdateDefault: true }) //将切换的模板设为默认并保存
}
// 将当前行设置为表格布局
async function loadRowLayout(rowData, config = {}) {
  const { notCloseDialog = true, isRender = true } = config
  // 设置切换模板标记,防止自动保存
  $layoutTable.$layout.isChangingTemplate = true
  setCurrentItem(rowData, false)
  isRender && renderColumns(rowData.contentParse.layout)
  if (!notCloseDialog) {
    dialogVisibleLayout.value = false //关闭当前弹窗
  }
  // 延迟清除标记,确保相关操作完成
  setTimeout(() => {
    $layoutTable.$layout.isChangingTemplate = false
  }, 1000)
}
function confirmNewDialog(layoutName) {
  currentItem.value.name = layoutName
  saveUserLayout({ isNew: true })
}
function formatContentStr() {
  // 组装content参数
  let contentObj = currentItem.value.contentParse || {}
  // let layoutColumns = contentObj.layout || []
  // 加回被过滤的序号列和复选框列
  // const staticColumns = fullColumnOptions.value.filter((item) => {
  //   return specailColumns.includes(item.type)
  // })
  // const stateColumns = $layoutTable.getColumns()
  // let mergeColumns = []
  // let newColumns = []
  let fixedColumns
  // 表格直接操作保存
  // if (optType === 'table') {
  //   newColumns = stateColumns // 表格的最新列数据
  //   fixedColumns = stateColumns.filter((it) => it.fixed).length - staticColumns.length
  // } else {
  //   // 弹框内操作保存
  //   mergeColumns = staticColumns.concat(showColumnsList.value) //.concat(hideColumnsList.value)
  //   // // .sort((a, b) => a.seq - b.seq)//t.seq//从隐藏列移到序号列,要放在最后面
  //   fixedColumns = Number(layoutForm.fixedColumns) || 0
  //   const fixedNumActul = fixedColumns + staticColumns.length //(不包括序号列和复选框列)
  //   mergeColumns.forEach((t, idx) => {
  //     const lst = layoutColumns?.find((x) => x[fieldProp] == t[fieldProp]) //|| {}
  //     const stateItem = stateColumns?.find((x) => x[fieldProp] == t[fieldProp]) //获取最新的列宽度
  //     if (lst) {
  //       let obj = Object.assign({}, lst)
  //       obj.width = stateItem.width || lst.width
  //       obj.visible = t.isShow
  //       obj.sortNumber = idx //t.seq//从隐藏列移到序号列,要放在最后面
  //       obj.fixed = idx < fixedNumActul ? true : false // 从第0列到第fixedNum列都固定
  //       newColumns.push(obj)
  //     }
  //   })
  // }
  // contentObj.layout = newColumns
  //兼容angular的数据layout
  const stateColumns = $layoutTable.getTableColumn().fullColumn
  // 判断是弹窗保存还是表格直接保存
  if (dialogVisibleLayout.value && !isUserDefaultActive.value) {
    // 弹窗打开时:使用 showColumnsList 的顺序(用户在弹窗中拖拽的顺序)
    contentObj.layout = showColumnsList.value.map((t) => {
      const stateColumn = stateColumns?.find((stateCol) => stateCol[fieldProp] == t[fieldProp])
      // const stateColumn = stateColumns?.find((stateCol) => {
      //   if (stateCol[fieldProp]) {
      //     return stateCol[fieldProp] == t[fieldProp]
      //   } else {
      //     // return stateCol[titleProp] == t[titleProp] //没有id就根据标签查找
      //   }
      // })
      // 如果刚从上级恢复布局,使用 showColumnsList 中的宽度(即上级的宽度)
      // 否则优先使用表格的实时宽度
      const width = isRestoredFromParent.value
        ? t.width
        : stateColumn?.resizeWidth || stateColumn?.renderWidth || t.width
      return {
        field: t[fieldProp],
        fieldLabel: t[titleProp], //临时标签
        width: width,
        fixed: t.fixed
      }
    })
  } else {
    //弹窗关闭时:使用表格的实际列顺序(用户在表格中拖拽的顺序)
    contentObj.layout = stateColumns
      .filter((col) => !specailColumns.includes(col.type)) // 过滤特殊列
      .filter((col) => col.visible !== false) //只保存可见的列
      .map((col) => {
        return {
          field: col.field,
          fieldLabel: col[titleProp], //临时标签
          width: col.resizeWidth || col.renderWidth || col.width,
          fixed: col.fixed
        }
      })
  }
  contentObj.fixedColumns = fixedColumns || 0
  contentObj.version = contentObj.version ? contentObj.version + 1 : new Date().getTime()
  return JSON.stringify(contentObj)
}
async function saveLayout(config = {}) {
  if (isUserDefaultActive.value) {
    ElMessage.error(proxy.$t('tip.selectData'))
    return Promise.resolve()
  }
  // 用户没有模板时,点击保存按钮,则直接保存一个用户级模板,模板名称按照当前用户名称作为模板名称
  if (
    roleType.value === ROLE_TYPE.USER &&
    (!layoutTemplates.value.userLevelTemplates?.length || currentItem.value?.templateName === DEFAULT_TEMP_NAME)
  ) {
    currentItem.value.level = TEMP_TYPE.USER
    currentItem.value.name = userInfo.userName
    await saveUserLayout({ isNew: true, ...config })
  } else {
    if (roleType.value === ROLE_TYPE.SYSTEM) {
      await saveSystemLayout(config)
    } else {
      if (currentItem.value.level === TEMP_TYPE.USER) {
        await saveUserLayout(config)
      }
      if (currentItem.value.level === TEMP_TYPE.TENANT) {
        await saveTenantLayout(config)
      }
    }
  }
  return Promise.resolve()
}
// 保持用户级布局
async function saveUserLayout(config = {}) {
  const { isNew = false, showTip = true, onlyUpdateDefault = false, closeDialog = true } = config
  // 模板名称不能与系统级和租户级冲突
  if ([SYSTEM_TEMP_NAME, TENANT_TEMP_NAME, DEFAULT_TEMP_NAME].includes(currentItem.value.name)) {
    return ElMessage.error(
      proxy.$t('vxeTable.nameNotDefault', {
        name: [SYSTEM_TEMP_NAME, TENANT_TEMP_NAME].join('、')
      })
    )
  }
  let obj = currentItem.value
  if (isNew) {
    obj[layoutIdProp] = undefined
  }
  await saveLayoutApi(
    {
      ...obj,
      // 只是切换默认布局。列布局数据不变
      templateContent: onlyUpdateDefault ? currentItem.value.templateContent : formatContentStr(),
      templateName: currentItem.value.name,
      isDefault: 1,
      level: TEMP_TYPE.USER
    },
    { showTip, closeDialog }
  )
  return Promise.resolve()
}
// 保存租户级
async function saveTenantLayout(config = {}) {
  // 重新获取最新的布局数据,确保 recordVersion 是最新的
  let obj = layoutTemplates.value.tenantLevelTemplate || {}
  await saveLayoutApi(
    {
      ...obj,
      templateContent: formatContentStr(),
      templateName: TENANT_TEMP_NAME,
      isDefault: 1,
      level: TEMP_TYPE.TENANT
    },
    config
  )
  return Promise.resolve()
}
// 保存系统级
async function saveSystemLayout() {
  if (!currentItem.value.name) {
    currentItem.value.name = SYSTEM_TEMP_NAME
  }
  let obj = layoutTemplates.value.sysLevelTemplate
  await saveLayoutApi({
    ...obj,
    templateContent: formatContentStr(),
    templateName: SYSTEM_TEMP_NAME,
    isDefault: 1,
    level: TEMP_TYPE.SYSTEM
  })
  return Promise.resolve()
}
const loading = ref(false)
// 保存接口
async function saveLayoutApi(postData, config = {}) {
  const { closeDialog = true, showTip = true } = config
  // 模板名称不能为空
  if (!postData.templateName) {
    return ElMessage.error(proxy.$t('vxeTable.nameNotEmpty'))
  }
  // 模板名称不能为空
  if (!layoutTableId) {
    return ElMessage.error('表格id不能为空')
  }
  // 至少显示一列
  if (!showColumnsList.value.length) {
    return ElMessage.error('至少显示一列')
  }
  loading.value = true
  try {
    let res = await tableApi.postSaveLayout({
      ...postData,
      sysUserId: userInfo.sysUserId,
      tableId: layoutTableId,
      url: layoutPath.value,
      templateType: 'TABLE' // 传递当前的布局类型
    })
    if (res.success) {
      if (showTip) {
        ElMessage.success(proxy.$t('tip.saveSuccessfully'))
      }
      await getTableData()
      loading.value = false
      // 重置恢复标记
      isRestoredFromParent.value = false
      if (closeDialog) {
        dialogVisibleLayout.value = false
        layoutNameVisible.value = false
      }
      // $layoutTable.$layout.tempDefault.value = false
      return Promise.resolve()
    }
  } catch {
    loading.value = false
    return Promise.reject()
  }
}
// 处理需要自适应的情况
function isAutoWidth(layout) {
  if (!layout.length) {
    return
  }
  const tableContainer = document.getElementById($layoutTable.id)
  const columnsWidthCount = layout //计算显示列的总宽度
    .reduce((pre, cur) => {
      return Number(cur.width) + pre
    }, 0)
  return columnsWidthCount < tableContainer?.clientWidth //新的列表宽度小于原来的容器宽度
}
// 渲染表格列
function renderColumns(layoutObj) {
  let layout = layoutObj || currentItem.value.contentParse.layout || []
  // 应用列数限制
  if (props.limitFieldCount > 0 && layout.length > props.limitFieldCount) {
    layout = layout.slice(0, props.limitFieldCount)
  }
  const isAuto = isAutoWidth(layout)
  const visibleFields = layout.map((it) => it.field)
  const fullColumn = $layoutTable.getTableColumn().fullColumn
  fullColumn.forEach((col) => {
    const saveItem = layout.find((it) => {
      if (it[fieldProp]) {
        return col[fieldProp] == it[fieldProp]
      } else {
        return col[titleProp] == it.fieldLabel || col[titleProp] == it[titleProp]
      }
      //没有id就根据标签查找
    })
    col.visible = visibleFields.includes(col[fieldProp]) || specailColumns.includes(col.type)
    if (col.visible && !specailColumns.includes(col.type)) {
      col.fixed = saveItem?.fixed || ''
      //如果有保存的宽度,优先使用保存的固定宽度,不走自适应逻辑
      if (saveItem?.width) {
        col.width = saveItem.width
        col.resizeWidth = saveItem.width
        col.renderWidth = saveItem.width
      } else if (isAuto) {
        // 没有保存宽度时,才使用自适应
        col.minWidth = col.width
        delete col.width
      }
      //如果既没有保存宽度也不自适应,保持列原有的宽度不变
    }
  })
  fullColumn.sort((a, b) => {
    const indexA = layout.findIndex((it) => a[fieldProp] == it.field)
    const indexB = layout.findIndex((it) => b[fieldProp] == it.field)
    return indexA - indexB
  })
  // console.log(' fullColumn】 -1271', fullColumn)
  $layoutTable.loadColumn(fullColumn)
  // $layoutTable.reloadColumn(fullColumn)//会把筛选结果也清空
  // // 加载布局后,更新缓存
  // layoutForm.layoutName = currentItem.value.name
  // if (layoutForm.layoutName == DEFAULT_TEMP_NAME) {
  //   layoutForm.layoutName = ''
  // }
  // loadColumsList()
}
function deleteLayoutClick(item) {
  proxy.$modal
    .confirm(proxy.$t('tip.confirmDeletion'))
    .then(async () => {
      // let tmpName = row.data.name
      let success = await tableApi.deleteLayout(item[layoutIdProp])
      if (success) {
        ElMessage.success(`${item.name} Delete Success!`)
        getTableData()
      }
    })
    .catch((err) => {
      // proxy.$modal.msgWarning('undeleted')
    })
}
function saveAs() {
  layoutNameVisible.value = true
}
function openNew(type) {
  dialogVisibleLayout.value = false
  layoutNameVisible.value = true
}
function setExtendMethods() {
  if (!$layoutTable.$layout) {
    $layoutTable.$layout = {} //表格布局信息
  }
  // console.log('【 $layoutTable.$layout 】 -786', $layoutTable.$layout)
  $layoutTable.$layout.tempDefault = ref(false)
  $layoutTable.$layout.isChangingTemplate = false // 初始化切换模板标记
  if (!$layoutTable.$layout.userTemplates) {
    $layoutTable.$layout.userTemplates = ref([])
  }
  // 添加 showColumnsList 和 hideColumnsList 引用,用于拖拽和右键操作时同步更新
  $layoutTable.$layout.tableConfig = tableConfig
  $layoutTable.$layout.showColumnsList = showColumnsList
  $layoutTable.$layout.hideColumnsList = hideColumnsList
  $layoutTable.$layout.isUserDefaultActive = isUserDefaultActive
  $layoutTable.$layout.updateDefaultLayout = updateDefaultLayout
  $layoutTable.$layout.deleteLayoutClick = deleteLayoutClick
  $layoutTable.$layout.saveLayoutApi = saveLayoutApi
  $layoutTable.$layout.saveUserLayout = saveUserLayout
  $layoutTable.$layout.saveTenantLayout = saveTenantLayout
  $layoutTable.$layout.saveSystemLayout = saveSystemLayout
  $layoutTable.$layout.openNew = openNew
  $layoutTable.$layout.saveAs = saveAs
  $layoutTable.$layout.useDefaultLayout = useDefaultLayout
  $layoutTable.$layout.resetDefaultLayout = resetDefaultLayout
  $layoutTable.$layout.openLayoutSettingDialog = openLayoutSettingDialog
  console.log('【 $layoutTable.layoutConfig】 -1423', $layoutTable)
}
async function initTableTemplate() {
  const { principalGroupCode, isSuperAdmin } = userInfo
  if (principalGroupCode == 1000) {
    roleType.value = ROLE_TYPE.SYSTEM
  } else if (principalGroupCode != 1000 && isSuperAdmin == 'Y') {
    roleType.value = ROLE_TYPE.TENANT
  } else if (principalGroupCode != 1000 && isSuperAdmin != 'Y') {
    roleType.value = ROLE_TYPE.USER
  }
  // roleType.value = ROLE_TYPE.TENANT //测试TODO
  $layoutTable.$layout.roleType = roleType.value
  await getTableData()
  if (roleType.value === ROLE_TYPE.TENANT && !layoutTemplates.value.tenantLevelTemplate) {
    // 如果当前租户公司没有租户级模板,则自动创建一条,然后该板不能删除,不能改名字
    // console.log('【租户没有模板】-374')
    saveTenantLayout({ showTip: false })
  }
}
onMounted(() => {
  nextTick(() => {
    const layout = $layoutTable.getTableColumn().fullColumn
    devDefaultColumns.value = JSON.parse(JSON.stringify(layout)) //开发环境测试时,需要每次刷新才能获取到正确值
    setExtendMethods()
    //如果设置了列数限制,在获取布局数据前先应用限制
    if (props.limitFieldCount > 0) {
      applyColumnLimit()
    }
    initTableTemplate()
  })
})
function cancelNewDialog() {
  layoutNameVisible.value = false
}
</script>

<style lang="scss" scoped>
.content-wrap {
  padding: 10px 0;
  width: 100%;
  height: 450px;
  ::-webkit-scrollbar {
    height: 5px !important;
    width: 5px !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #888; /* 滑块颜色 */
  }
}
.layouts-wrap {
  margin-right: 20px;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid #e5e5e5;
  padding-right: 5px;
  min-width: 259px;
  .layouts-list {
    overflow: auto;
    height: 100%;
    width: 259px;
  }
  .layout-item {
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
    font-size: 14px;
    :deep(.layout-edit svg.svg-icon) {
      display: none !important;
    }
    &.current {
      background: rgba(239, 246, 246, 1);
    }
    &:hover {
      cursor: pointer;
    }
  }
}
:deep(.layout-edit svg.svg-icon) {
  display: inline-block !important;
}
.is-default {
  white-space: nowrap;
  margin-left: 5px;
  display: inline-block;
  width: 48px;
  height: 20px;
  opacity: 1;
  border-radius: 4px;
  background: rgba(63, 169, 168, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 4px 0px 4px;
  color: #fff;
  font-size: 10px;
}
// 拖拽样式
.column-item {
  height: 25px !important;
  line-height: 25px !important;
  &[draggable='true'] {
    cursor: move;
    transition: all 0.2s ease;
    &:hover {
      background-color: #f5f7fa;
    }
    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }
}
.columns-box {
  min-width: 650px;
  width: calc(100% - 290px);
}
.columns-wrap {
  height: 100%;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  &.show {
    .column-item {
      width: calc(100% - 60px);
      overflow: hidden;
      :deep(.el-checkbox_label) {
        width: 100%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.fixed-buttons {
  width: 59px;
}
.vxe-button.type--text.is-fixed {
  color: var(--el-color-primary) !important;
}
.vxe-button.type--text:hover {
  color: var(--el-color-primary) !important;
}
.columns-container {
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  .columns-container_header {
    border-bottom: 1px solid #e5e5e5;
    height: 39px;
    line-height: 39px;
    padding: 0 15px;
    color: #8c8c8c;
    :deep(.el-checkbox) {
      .el-checkbox_label {
        color: #8c8c8c !important;
      }
    }
  }
  .columns-container_content {
    height: calc(100% - 39px);
    padding: 10px 15px;
    overflow: hidden;
    box-sizing: border-box;
    .el-checkbox {
      height: 32px;
      .label {
        color: #666;
      }
    }
  }
}
.columns-list {
  box-sizing: border-box;
  margin: 5px auto;
  overflow: auto;
  height: calc(100% - 24px);
}
.layout-dialog {
  position: relative;
  .layout-icon {
    top: 4px;
    cursor: pointer;
  }
}
.arrow-icons {
  cursor: pointer;
  i {
    margin-right: 2px;
  }
}
.layout-btn {
  height: 100%;
  display: flex !important;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .el-button {
    margin: 0;
    width: 22px;
    text-align: center;
  }
}
</style>
<style lang="scss">
//拖拽过程中的样式
.draggable-container {
  height: 100%;
}
.column-ghost {
  border-top: 1px solid #3fa9a8;
  // background-color: #ffffee;
}
</style>
