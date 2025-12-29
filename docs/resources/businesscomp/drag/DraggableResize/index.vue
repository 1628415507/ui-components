<template>
  <div :class="state.isEditing ? 'is-editing' : ''">
    <!-- {{ activeTemplate.templateName }}{{ config.activeGroupName }} -->
    <div v-if="[ROLE_TYPE.SYSTEM, ROLE_TYPE.TENANT].includes(roleType)" class="icon-box" title="拖拽配置组件">
      <!-- {{ roleType }} -->
      <div v-if="!state.isEditing" class="flex-c icon-wrap" @click="openEdit">
        <el-icon><Lock /></el-icon>
      </div>
      <div v-if="state.isEditing" class="flex-c icon-wrap" @click="closeEdit">
        <el-icon><Unlock /></el-icon>
      </div>
      <!-- 删除分公司模板 -->
      <!-- <el-button class="flex-c menu-btn" @click="deleteTemplate(layoutTemplates?.tenantLevelTemplates)">删除</el-button> -->
    </div>
    <div v-if="state.isEditing" class="menu-btn-list">
      <!-- <div v-if="roleType === ROLE_TYPE.SYSTEM" class="menu-btn" @click="saveSYSTemplate">
        <svg-icon icon-class="save" size="1.1em" />
        <span>{{ '保存为系统模版' }}</span>
      </div>
      <div v-if="roleType === ROLE_TYPE.SYSTEM" class="menu-btn" @click="openSaveTemplateDialog">
        <svg-icon icon-class="save" size="1.1em" />
        <span>{{ '保存为租户模版' }}</span>
      </div>
      <div v-if="roleType === ROLE_TYPE.TENANT" class="menu-btn" @click="openSaveTemplateDialog">
        <svg-icon icon-class="save" size="1.1em" />
        <span>{{ '保存为分公司模板' }}</span>
      </div> -->
      <div v-if="state.isModuleDraggable" class="menu-btn" @click="closeModuleDraggable()">
        <el-icon><Setting /></el-icon>
        <span>退出编辑</span>
      </div>
      <template v-if="!state.isModuleDraggable">
        <!-- <div class="menu-btn" @click="templateAuthDialogVisible = true">
          <svg-icon icon-class="template_authorization" size="1.1em" />
          <span>模板授权</span>
        </div> -->
        <div class="menu-btn" @click="openModuleDraggable(true)">
          <el-icon size="16">
            <Rank />
          </el-icon>
          <span>版块拖动</span>
        </div>
        <div class="menu-btn" @click="openAddDrawer">
          <el-icon size="16">
            <CirclePlus />
          </el-icon>
          <span>元素增加</span>
        </div>
        <!-- <div class="menu-btn" @click="templateSwitchDialogVisible = true">
          <svg-icon icon-class="switch_template" size="1.1em" />
          <span>模板选择</span>
        </div> -->
      </template>
    </div>
    <!-- 主体内容 -->

    <slot v-if="state.hasRequest"></slot>
    <!-- 元素增加 -->
    <AddDrawer v-if="addDrawerVisible" v-model="addDrawerVisible" :config="config" @save="openSaveTemplateDialog" />
    <!-- 保存模板弹窗 -->
    <SaveTemplateDialog
      v-if="saveDialogVisible"
      v-model="saveDialogVisible"
      :roleType="roleType"
      :layoutTemplates="layoutTemplates"
      :activeTemplate="activeTemplate"
      @save="saveTemplate"
      @save-as="saveAsTemplate"
    />
    <!-- 模板授权 -->
    <TemplateAuthorizationDialog
      v-if="templateAuthDialogVisible"
      v-model="templateAuthDialogVisible"
      :roleType="roleType"
      :layoutTemplatesList="layoutTemplatesList"
      :activeTemplate="activeTemplate"
      @edit="updateTempName"
      @delete="deleteTemplate"
    />
    <!-- 模板切换 -->
    <SwitchTemplateDialog
      v-if="templateSwitchDialogVisible"
      v-model="templateSwitchDialogVisible"
      :roleType="roleType"
      :layoutTemplatesList="layoutTemplatesList"
      :activeTemplate="activeTemplate"
      @confirm="switchTemplate"
      @edit="updateTempName"
      @delete="deleteTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeMount, reactive, getCurrentInstance, provide } from 'vue'
import { ElMessage } from 'element-plus'
// import { useRoute } from 'vue-router'
import AddDrawer from './AddDrawer.vue'
import SaveTemplateDialog from './SaveTemplateDialog.vue'
import TemplateAuthorizationDialog from './TemplateAuthorizationDialog.vue'
import SwitchTemplateDialog from './SwitchTemplateDialog.vue'
import {
  ProvideDragConfig,
  DragConfig,
  ConfigState,
  ModuleIFPrivate,
  GroupIF,
  Template,
  LayoutTemplates
} from '@/components/DraggableResize/type/index'
import { ROLE_TYPE, TEMP_TYPE } from './type/SystemEnum.ts'
import type { ElementConfig } from '@/components/DraggableResize/type/element'
import useTemplate from './utils/useTemplate'

const IS_MOCK = true //是否开启本地调试使用,跳过接口请求逻辑

const props = defineProps<{
  config: DragConfig
}>()

const { proxy } = getCurrentInstance()
// const route = useRoute()
const templateUtils = new useTemplate(props.config, 'route.meta?.originUrl')

// 响应式状态
const templateAuthDialogVisible = ref(false)
const addDrawerVisible = ref(false)
const saveDialogVisible = ref(false)
const templateSwitchDialogVisible = ref(false)
// const originGroupInfo = ref<Record<string, GroupIF>>()
const state: ConfigState = reactive({
  hasRequest: false,
  isEditing: false,
  isModuleDraggable: false,
  isElDraggable: false
})
const changeModules = reactive({})

// 数据是否变化
function isModuleChange() {
  // console.log(' 【store】', changeModules)
  let changed = false
  for (let key in changeModules) {
    const validChange = changeModules[key]
    const res = validChange()
    if (res) {
      // console.log(' 【store】-273'('getChange-132', key, res)
      changed = true
      break
    }
  }
  // return changed
  return false
}

// 获取所有元素项信息
function getAllElementsByGroupInfo(groupInfo: Record<string, GroupIF>) {
  const groupObj: Record<string, Record<string, ElementConfig>> = {}
  for (const groupKey in groupInfo) {
    let obj: Record<string, ElementConfig> = {}
    const groupInfoItem = groupInfo[groupKey] || {}
    if (!groupInfoItem?.moduleList?.length) {
      groupObj[groupKey] = {}
    } else {
      groupInfoItem.moduleList.forEach((moduleIt: ModuleIFPrivate) => {
        moduleIt.elementLists.forEach((elementIt: ElementConfig) => {
          const showElementIt = moduleIt?.showElementLists?.find((it) => it.elementId === elementIt.elementId) || null
          if (!elementIt?.elementLists?.length && !elementIt?.childrens?.length) {
            obj[elementIt.elementId] = showElementIt || elementIt
          }
          elementIt?.elementLists?.forEach((subItem: ElementConfig) => {
            const subShowIt = elementIt?.showElementLists?.find((it) => it.elementId === subItem.elementId) || null
            obj[subItem.elementId] = subShowIt || subItem
          })
          elementIt?.childrens?.forEach((subItem: ElementConfig) => {
            obj[subItem.elementId] = subItem
          })
        })
      })
      groupObj[groupKey] = obj
    }
  }
  return groupObj
}

//存在更新的GroupInfo
function updateActiveGroupInfo() {
  const groupName = props.config.activeGroupName
  const curGroupInfo = props.config?.currentGroupInfo?.[groupName] //当前配置
  const localGroupInfo = provideInfo.localGroupInfo[groupName] //本地配置
  if (localGroupInfo?.moduleList?.length && !curGroupInfo?.moduleList?.length) {
    provideInfo.currentGroupInfo[groupName] = JSON.parse(JSON.stringify(localGroupInfo || '{}'))
  }
}

watch(
  () => props.config.activeGroupName,
  () => {
    updateActiveGroupInfo()
  }
  // {
  //   immediate: true
  // }
)

function setActiveGroupName(val) {
  // console.log(' 【store】-273'(' 【val】-194', val)
}

// ---------------- 拖拽管理 Start -----------------
// 编辑模式控制
function openEdit() {
  state.isEditing = true
  toggleElDraggable(true)
}

// 退出模式控制
async function closeEdit() {
  const hasChanged = isModuleChange()
  if (hasChanged) {
    try {
      const res = await (proxy as any).$modal.confirm('数据未保存，是否确认退出？')
      if (res === 'confirm') {
        await initStoreModuleList()
        setActiveTemplate()
      }
    } catch {
      console.log(' 【不退出】-213')
      return
    }
  }
  state.isEditing = false
  state.isModuleDraggable = false
  state.isElDraggable = false
}

// 拖拽控制
const toggleElDraggable = (val: boolean) => {
  state.isModuleDraggable = false
  state.isElDraggable = val
}

// 开启板块拖拽
const openModuleDraggable = (val: boolean) => {
  state.isElDraggable = false
  state.isModuleDraggable = val
}

// 关闭版块拖拽
function closeModuleDraggable() {
  state.isModuleDraggable = false
  state.isElDraggable = true
}

// 抽屉控制
function openAddDrawer() {
  addDrawerVisible.value = true
  toggleElDraggable(true)
}

// ---------------- 模板管理 Start -----------------

const layoutTemplates = ref<LayoutTemplates>({})

const roleType = computed<string>(() => {
  return IS_MOCK ? ROLE_TYPE.SYSTEM : layoutTemplates.value.userType
})

const tempLevel = computed<string>(() => {
  return roleType.value === ROLE_TYPE.SYSTEM ? TEMP_TYPE.TENANT : TEMP_TYPE.USER
})

const activeTemplate = ref({})

function getDefaultTemplate(): Template {
  const { sysLevelTemplate, tenantLevelTemplates, userLevelTemplates } = layoutTemplates.value
  const tenantTemplate = tenantLevelTemplates?.find((it) => it.isDefault === 1)
  if (roleType.value === ROLE_TYPE.SYSTEM || roleType.value === ROLE_TYPE.TENANT) {
    return tenantTemplate || sysLevelTemplate
  }
  // 用户级
  const userTemplate = userLevelTemplates?.find((it) => it.isDefault === 1)
  return userTemplate || tenantTemplate || sysLevelTemplate
}

function setActiveTemplate(temp?: Template) {
  if (!temp) {
    const defaultTemp = getDefaultTemplate()
    defaultTemp && (temp = defaultTemp)
  }
  activeTemplate.value = temp || {}
  const store = temp?.templateContent
    ? JSON.parse(temp.templateContent)
    : JSON.parse(JSON.stringify(props.config.groupInfo || {}))
  const curStoreInfo: Record<string, GroupIF> = JSON.parse(JSON.stringify(store.groupInfo || {}))
  provideInfo.currentGroupInfo = curStoreInfo
  updateActiveGroupInfo()
  provideInfo.storeGroupInfo = store?.groupInfo || null
  provideInfo.refreshTrigger++
}

// 分级获取
const layoutTemplatesList = computed<Template[]>(() => {
  const { sysLevelTemplate, tenantLevelTemplates = [], userLevelTemplates = [] } = layoutTemplates.value
  if (roleType.value === ROLE_TYPE.SYSTEM) {
    // if (sysLevelTemplate) {
    //   return [...userLevelTemplates, ...tenantLevelTemplates, sysLevelTemplate]
    // }
    return [...userLevelTemplates, ...tenantLevelTemplates]
  } else {
    return [...userLevelTemplates, ...tenantLevelTemplates]
  }
})

async function deleteTemplate(temp: Template) {
  if (!temp?.mdInterfaceTemplateId) return
  try {
    await proxy.$modal.confirm('确认删除该模板吗？')
    await templateUtils.deleteLayout(String(temp.mdInterfaceTemplateId))
    await initStoreModuleList()
    setActiveTemplate()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除模板失败:', error)
  }
}

// 打开保存模板弹窗
function openSaveTemplateDialog() {
  saveDialogVisible.value = true
}

// 保存模板
async function saveConfig(level: string, saveTemp: Partial<Template>, showTip = true): Promise<any> {
  try {
    const res = await templateUtils.saveMdInterfaceTemplate(level, saveTemp)
    saveDialogVisible.value = false
    if (showTip) {
      ElMessage.success('保存成功')
    }
    return res
  } catch (error) {
    console.error('保存配置失败:', error)
    return null
  }
}

// 修改模板名称
function updateTempName(temp: Template) {
  saveConfig(temp.level, temp, true)
}

// 处理模板切换对话框中的模板点击
function switchTemplate(temp: Template) {
  setActiveTemplate(temp)
  templateSwitchDialogVisible.value = false
  // let templateContent = JSON.parse(temp.templateContent)
  // temp.templateContent = JSON.stringify({
  //   ...templateContent,
  //   version: new Date().getTime() //更新版本
  // })
  // await saveConfig(temp.level, temp, showTip)
}

// 处理系统模板保存
async function saveSYSTemplate() {
  const { sysLevelTemplate } = layoutTemplates.value
  await saveConfig(TEMP_TYPE.SYSTEM, {
    ...sysLevelTemplate,
    templateName: '系统级模板',
    templateContent: JSON.stringify({
      groupInfo: provideInfo.currentGroupInfo,
      version: new Date().getTime()
    })
  })
  await initStoreModuleList()
  setActiveTemplate(layoutTemplates.value.sysLevelTemplate)
}

// 处理模板保存
async function saveTemplate() {
  const res = await saveConfig(activeTemplate.value.level, {
    ...activeTemplate.value,
    templateContent: JSON.stringify({
      groupInfo: provideInfo.currentGroupInfo,
      version: new Date().getTime()
    })
  })
  await initStoreModuleList()
  const activeTemp = layoutTemplatesList.value.find((it: Template) => it.mdInterfaceTemplateId == res.records)
  setActiveTemplate(activeTemp)
}

//处理模板另存为
async function saveAsTemplate(name: string) {
  const res = await saveConfig(tempLevel.value, {
    ...activeTemplate.value,
    mdInterfaceTemplateId: undefined,
    templateName: name,
    templateContent: JSON.stringify({
      groupInfo: provideInfo.currentGroupInfo,
      version: new Date().getTime()
    })
  })
  await initStoreModuleList()
  const activeTemp = layoutTemplatesList.value.find((it: Template) => it.mdInterfaceTemplateId == res.records)
  setActiveTemplate(activeTemp)
}

// ---------------- 模板管理 End -----------------

async function initStoreModuleList() {
  try {
    const res = IS_MOCK ? {} : await templateUtils.getLayoutTemplates()
    state.hasRequest = true
    layoutTemplates.value = res || {}
    provideInfo.layoutTemplates = res
    // // console.log(' 【store】-273'(' 【initStoreModuleList】-198', allSystemElementsMap, allTenantElementsMap)
    // // console.log(' 【store】-273'(' 【layoutTemplatesList 】-160', layoutTemplatesList)
  } catch (error) {
    const originInfo = JSON.parse(JSON.stringify(provideInfo.localGroupInfo || {}))
    provideInfo.currentGroupInfo = originInfo
    console.error('初始化存储模块列表失败:', error)
  }
}

// 所有系统级元素项信息
const allSystemElementsMap = computed<Record<string, ElementConfig>>(() => {
  const { sysLevelTemplate } = layoutTemplates.value
  const templateContent = JSON.parse(sysLevelTemplate?.templateContent || '{}')
  const groupInfo = templateContent.groupInfo
  const groupObj = getAllElementsByGroupInfo(groupInfo)
  return groupObj
})

// 所有租户级元素项信息
const allTenantElementsMap = computed<Record<string, ElementConfig>>(() => {
  const { tenantLevelTemplates } = layoutTemplates.value
  const tenantTemplate = tenantLevelTemplates?.find((it) => it.isDefault === 1)
  const templateContent = JSON.parse(tenantTemplate?.templateContent || '{}')
  const groupInfo = templateContent.groupInfo
  const groupObj = getAllElementsByGroupInfo(groupInfo)
  return groupObj
})

// 所有本地元素项信息
const allLocalElementsMap = computed<Record<string, ElementConfig>>(() => {
  const groupObj = getAllElementsByGroupInfo(props.config.groupInfo)
  return groupObj
})

function init() {
  props.config.isEditing = computed(() => {
    return state.isEditing
  })
  // props.config.setActiveGroupName = setActiveGroupName
  provideInfo.allLocalElementsMap = allLocalElementsMap
  provideInfo.allSystemElementsMap = allSystemElementsMap
  provideInfo.allTenantElementsMap = allTenantElementsMap
  provideInfo.activeTemplate = activeTemplate
  provideInfo.state = state
  provideInfo.changeModules = changeModules
  // console.log(' 【provideInfo】-456', provideInfo)
  // formatOriginInfo()
}

// 监听分组信息变化
watch(
  () => props.config?.groupInfo,
  (newGroupInfo) => {
    provideInfo.localGroupInfo = newGroupInfo
    // formatOriginInfo()
  },
  { deep: true }
)

// ======================================= provide Start =======================================
const provideInfo: ProvideDragConfig = reactive({
  refreshTrigger: -1,
  localGroupInfo: props.config.groupInfo,
  storeGroupInfo: null,
  currentGroupInfo: props.config.groupInfo,
  allLocalElementsMap: allLocalElementsMap,
  allSystemElementsMap: allSystemElementsMap,
  allTenantElementsMap: allTenantElementsMap,
  activeTemplate: activeTemplate
})

provide('provideInfo', provideInfo)
// ======================================= provide End =======================================

onBeforeMount(async () => {
  await initStoreModuleList()
  if (roleType.value === ROLE_TYPE.SYSTEM && layoutTemplates.value.sysLevelTemplate) {
    setActiveTemplate(layoutTemplates.value.sysLevelTemplate)
  } else {
    setActiveTemplate()
  }
  // console.log(' 【store】-273'(' 【props.config.currentGroupInfo】-453', provideInfo.currentGroupInfo)
})

onMounted(() => {
  init()
})

defineExpose({
  state
})
</script>

<style lang="scss" scoped>
.is-editing {
  padding-top: 13px;
}

.icon-box {
  position: fixed;
  bottom: 25px; //calc(100vh - 90px - 495px );
  right: 5px;
  z-index: 999;

  .icon-wrap {
    cursor: pointer;
    background-color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: -2px 3px 6px rgba(183, 183, 183, 0.25);
  }
}

.menu-btn-list {
  position: fixed;
  z-index: 999;
  top: 35%;
  right: 41px;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 40px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: width 0.3s ease;

  &:hover {
    width: 150px;

    .menu-btn {
      justify-content: flex-start;
      padding-left: 10px;
      gap: 6px;

      > span:nth-child(2) {
        width: auto;
        opacity: 1;
        margin-left: 6px;
      }
    }
  }

  .menu-btn {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #e4e7ed;
    color: #303133;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    white-space: nowrap;

    &:last-child {
      border-bottom: none;
    }

    // 隐藏文字
    > span:nth-child(2) {
      width: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      margin: 0;
    }

    &:hover {
      background: #f5f7fa;
      color: var(--el-color-primary);
    }

    &:active {
      background: #e4e7ed;
    }

    .el-icon {
      font-size: 16px;
    }

    .menu-btn-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      height: 100%;

      > span:last-child {
        width: 0;
        opacity: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        margin: 0;
      }
    }
  }

  &:hover .menu-btn .menu-btn-inner > span:last-child {
    width: auto;
    opacity: 1;
    margin-left: 6px;
  }
}
</style>
