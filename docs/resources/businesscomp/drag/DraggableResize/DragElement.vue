<template>
  <div class="draggable-element" :class="{ collapsible: collapsible && !provideInfo?.state.isEditing }">
    <div class="collapse-btn" v-if="collapsible && !provideInfo?.state.isEditing">
      <el-button v-show="isCollapse" type="primary" link @click="isCollapse = false">
        <el-icon><ArrowDown /></el-icon>
        展开
      </el-button>
      <el-button v-show="!isCollapse" type="primary" link @click="isCollapse = true">
        <el-icon><ArrowUp /></el-icon>
        收缩
      </el-button>
    </div>
    <div class="draggable-main" :style="collapseStyle">
      <draggable
        v-model="moduleInfo.showElementLists"
        itemKey="elementId"
        class="draggable-container"
        animation="300"
        ghost-class="element-ghost"
        :id="containerId"
        :data-draggable-id="containerId"
        :data-level="level"
        :disabled="dragDisabled"
        :group="groupConfig"
        @add="onDragAdd"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element: colEl, index: colIndex }">
          <el-col
            v-show="colEl.isVisible !== false"
            class="drag-col"
            :span="colEl.span"
            :data-element-id="colEl.elementId"
            :class="{
              'drag-active': !dragDisabled,
              'has-child': colEl?.elementLists?.length > 0
            }"
          >
            <!-- 拖拽调整宽度的手柄TODO LEVEL -->
            <div
              v-if="!dragDisabled && !colEl?.elementLists?.length"
              class="drag-col_resize"
              :class="{
                'is-resizing': resizingState.isResizing && resizingState.currentElement.elementId === colEl.elementId
              }"
              title="宽度调整"
              @mousedown="startResize($event, colEl)"
              @mouseup="stopColResize()"
            ></div>
            <!-- 内容 -->
            <div class="drag-col_content" :class="colEl.calssName">
              <el-icon
                v-if="!colEl.required && colEl.deletable !== false && !dragDisabled"
                @click="removeDragItem(colEl, colIndex)"
                color="#7a7b7d"
                :size="16"
                class="close-icon"
              >
                <CircleCloseFilled />
              </el-icon>
              <!-- 无嵌套拖拽 -->
              <template v-if="!colEl?.elementLists?.length">
                <div v-if="!colEl?.childrens?.length" class="element-item">
                  <ElementSetting
                    :groupName="groupName"
                    :config="config"
                    :colEl="colEl"
                    :formRef="formRef"
                    :formRules="formRules"
                  />
                </div>
                <div class="element-item_content" :class="colEl.class" :style="colEl.style">
                  <!-- 插槽(只支持组内拖拽) -->
                  <slot v-if="colEl.uiType === EL_ENUM.SLOT" :name="colEl.elementId" :element="colEl"></slot>
                  <component
                    v-else-if="
                      colEl.uiType === EL_ENUM.COMPONENT &&
                      (colEl.component || (components && components[colEl.componentName]))
                    "
                    :is="getComponent(colEl)"
                    :formValue="formValue"
                    :colEl="colEl"
                    :componentParams="componentParams"
                  />
                  <Element v-else :groupName="groupName" :formValue="formValue" :colEl="colEl" :config="config" />
                </div>
              </template>
              <!-- 多个元素 -->
              <el-row v-else>
                <el-col
                  v-for="childEl in colEl.childrens"
                  :span="childEl.span || 24 / colEl.childrens.length"
                  :key="childEl.elementId"
                  class="element-item"
                >
                  <ElementSetting
                    :groupName="groupName"
                    :config="config"
                    :formRef="formRef"
                    :formRules="formRules"
                    :colEl="childEl"
                  />
                  <div class="element-item_content" :class="childEl.class" :style="childEl.style">
                    <slot v-if="childEl.uiType === EL_ENUM.SLOT" :name="childEl.elementId" :element="childEl"></slot>
                    <component
                      v-else-if="
                        childEl.uiType === EL_ENUM.COMPONENT &&
                        (childEl.component || (components && components[childEl.componentName]))
                      "
                      :is="getComponent(childEl)"
                      :formValue="formValue"
                      :colEl="childEl"
                      :componentParams="componentParams"
                    />
                    <Element v-else :groupName="groupName" :formValue="formValue" :colEl="colEl" :config="config" />
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 限制最多递归两级 -->
            <DragElement
              v-if="level < 2 && colEl?.elementLists?.length"
              :level="level + 1"
              :groupName="groupName"
              :moduleId="moduleId"
              :parentCol="colEl"
              :config="config"
              :formRef="formRef"
              :formValue="formValue"
              :formRules="formRules"
              :components="components"
              :componentParams="componentParams"
              :collapseHeight="collapseHeight"
              :collapsible="collapsible"
            />
          </el-col>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EL_ENUM } from './type/elementEnum'
import draggable from 'vuedraggable'
import { ArrowDown, ArrowUp, CircleCloseFilled } from '@element-plus/icons-vue'
import Element from './Element.vue'
import ElementSetting from './ElementSetting.vue'
import DragElement from './DragElement.vue'
import {
  defineProps,
  ref,
  computed,
  inject,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  withDefaults,
  reactive
} from 'vue'
import type {
  ProvideDragConfig,
  DragConfig,
  ModuleIFPrivate,
  ElementConfig
} from '@/components/DraggableResize/type/index'
import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash-es'

// Props接口
interface Props {
  groupName: string
  moduleId: string
  config: DragConfig
  formRef: FormInstance
  formValue: Record<string, any>
  formRules: FormRules
  components?: Object
  componentParams?: Record<string, any>
  level: number
  parentCol?: ElementConfig
  collapseHeight: string
  collapsible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  formValue: () => ({}),
  level: 1,
  collapseHeight: '110px',
  collapsible: false
})

// ================================== 展开收缩 ==================================
const provideInfo = inject<ProvideDragConfig>('provideInfo', {} as ProvideDragConfig)
const isCollapse = ref(true)
const collapseStyle = computed(() => {
  if (props.collapsible && !provideInfo.state?.isEditing) {
    return {
      height: isCollapse.value ? props.collapseHeight : 'auto'
    }
  }
  return {}
})

// ================================== 宽度调整 Start ==================================
interface ResizingState {
  isResizing: boolean
  currentElement: ElementConfig | null
  startX: number
  startSpan: number
}

//宽度调整相关状态
const resizingState = reactive<ResizingState>({
  isResizing: false,
  currentElement: null,
  startX: 0,
  startSpan: 0
})

//开始调整宽度
const startResize = (event: MouseEvent, colEl: ElementConfig) => {
  event.preventDefault()
  event.stopPropagation()

  resizingState.isResizing = true
  resizingState.currentElement = colEl
  resizingState.startX = event.clientX
  resizingState.startSpan = colEl.span || 12

  document.addEventListener('mousemove', onColResize)
  document.addEventListener('mouseup', stopColResize)
  document.body.style.userSelect = 'none' // 禁用文字选中功能,避免冲突
}

// 调整宽度过程中
const onColResize = (event: MouseEvent) => {
  if (!resizingState.isResizing || !resizingState.currentElement) return

  const deltaX = event.clientX - resizingState.startX
  const containerWidth = (event.target as HTMLElement)?.closest('.draggable-container')?.clientWidth || 1200
  // const containerWidth = (event.target as HTMLElement)?.closest('.draggable-container')?.offsetWidth || 1200

  // 计算移动距离对应的span 变化(24栅格系统)
  const spanPerPixel = 24 / containerWidth
  const deltaSpan = Math.round(deltaX * spanPerPixel)
  let curSpan = resizingState.startSpan + deltaSpan
  const newSpan = Math.max(1, Math.min(24, curSpan)) // 限制 span 在1-24 之间
  // 更新 span 值
  resizingState.currentElement.span = newSpan
}

// 停止调整宽度
const stopColResize = () => {
  resizingState.isResizing = false
  resizingState.currentElement = null
  document.removeEventListener('mousemove', onColResize)
  document.removeEventListener('mouseup', stopColResize)
  document.body.style.userSelect = ''
}
// ================================== 宽度调整 End ==================================

// ================================== 拖拽信息 Start ==================================
const dragState = reactive({
  startIndex: -1,
  startElement: {} as ElementConfig,
  showTip: true // 是否显示提示
})

const containerId = computed(() => {
  return props.level === 1 ? props.moduleId : props.parentCol.elementId
})

const dragDisabled = computed(() => {
  const { activeGroupName } = props.config
  return !provideInfo.state?.isElDraggable || activeGroupName !== props.groupName
})

const groupConfig = ref({
  name: props.groupName,
  put: (to: any, from: any, dragEl: any, evt: any) => {
    bindObjReferenceAddress()
    const fromGroupName = from?.options?.group?.name
    // console.log('fromGroupName:', fromGroupName, props.groupName)
    // 不同的拖拽组,不允许互相拖拽
    if (fromGroupName !== props.groupName) {
      return false
    }
    // 如果是同一个容器内的排序,允许拖拽
    const fromEl = from.el
    const fromDraggableId = fromEl.getAttribute('data-draggable-id')
    if (containerId.value === fromDraggableId) {
      return true
    }
    // 子元素存在showElementLists时,当前层不允许拖拽放置
    const allowPut = moduleInfo.value?.showElementLists?.some((it) => {
      return it.showElementLists?.length > 0
    })
    return !allowPut
  },
  pull: (to: any, from: any, dragEl: any, evt: any) => {
    // 如果是同一个容器内的排序,允许拖拽
    if (to === from) {
      return true
    }
    // 处理嵌套拖拽限制
    if (props.parentCol) {
      const toEl = to.el
      const toLevel = Number(toEl.getAttribute('data-level'))
      const toDraggableId = toEl.getAttribute('data-draggable-id')
      const fromEl = from.el
      const fromLevel = Number(fromEl.getAttribute('data-level'))
      // 拖到上级时进行限制
      if (toLevel < fromLevel) {
        if (
          (toLevel === 1 && toDraggableId === props.moduleId) ||
          (toLevel > 1 && toDraggableId === props.parentCol.elementId)
        ) {
          return false
        }
      }
      // 插槽不允许跨组拖拽
      if (dragState.startElement?.uiType === EL_ENUM.SLOT) {
        dragState.showTip = false
        return false
      }
    }
    return true
  }
})

// 拖拽事件处理函数
const onDragAdd = (evt: any) => {}

function onDragStart(evt: any) {
  bindObjReferenceAddress()
  dragState.startIndex = evt.oldIndex
  dragState.startElement = moduleInfo.value.showElementLists?.[evt.oldIndex] || ({} as ElementConfig)
}

function onDragEnd(evt: any) {
  dragState.showTip = true
}
// ================================== 拖拽信息 End ==================================

const moduleInfo = ref<ModuleIFPrivate>({} as ModuleIFPrivate)
const isInitStore = ref(false)

// 关联引用地址,和AddDrawer弹框的数据同步
function bindObjReferenceAddress() {
  if (props.level > 1 && moduleInfo.value !== props.parentCol) {
    moduleInfo.value = props.parentCol as any
  }
}

const removeDragItem = (item: ElementConfig, colIndex: number) => {
  bindObjReferenceAddress()
  if (!moduleInfo.value.hiddenElementLists) {
    moduleInfo.value.hiddenElementLists = []
  }
  moduleInfo.value.showElementLists?.splice(colIndex, 1)
  moduleInfo.value.hiddenElementLists.push(item)
}

function getComponent(item: ElementConfig) {
  const groupInfoEl = provideInfo.allLocalElementsMap[props.groupName]
  const mapItem = groupInfoEl[item.elementId] || {}
  return mapItem?.component || props.components?.[item.componentName]
}

// 更新指定属性
function updateDragInfo(list: ModuleIFPrivate[] | undefined, isInit?: boolean) {
  const newDragInfo = list?.find((it) => it.moduleId === props.moduleId) || ({} as ModuleIFPrivate)
  const groupInfoEl = provideInfo.allLocalElementsMap[props.groupName] || {}
  if (moduleInfo.value.showElementLists?.length) {
    moduleInfo.value.showElementLists.forEach((showIt: ElementConfig) => {
      const newShowItem = groupInfoEl[showIt.elementId]
      if (newShowItem) {
        if (showIt.uiType === EL_ENUM.DICT_SELECT && newShowItem.dictOption?.length) {
          showIt.dictOption = newShowItem.dictOption
        }
        if (!isInit) {
          showIt.disabled = newShowItem.disabled
          showIt.customLabel && (showIt.customLabel = newShowItem.customLabel)
          newShowItem.childrens && (showIt.childrens = newShowItem.childrens)
          // 修复:同步更新 isVisible 属性
          showIt.isVisible = newShowItem.isVisible
        }
      }
    })
  } else {
    moduleInfo.value.showElementLists = newDragInfo.elementLists
  }
  if (!moduleInfo.value.hiddenElementLists) {
    moduleInfo.value.hiddenElementLists = []
  }
}

// 处理嵌套数据,关联引用地址
function initSubDragInfo() {
  if (!props.parentCol) return

  if (!props.parentCol?.showElementLists) {
    props.parentCol.showElementLists = props.parentCol.elementLists
  }
  if (!props.parentCol?.hiddenElementLists) {
    props.parentCol.hiddenElementLists = []
  }
  moduleInfo.value = (props.parentCol as any) || ({} as any)
}

function initStoreDragInfo() {
  // console.log(' 【initStoreDragInfo】 -385')
  if (props.level === 1) {
    const localModuleItem =
      provideInfo.localGroupInfo[props.groupName]?.moduleList?.find((it) => props.moduleId === it.moduleId) ||
      ({} as ModuleIFPrivate)
    const storeGroupInfo = provideInfo.storeGroupInfo?.[props.groupName]?.moduleList || []
    const storeModuleList = JSON.parse(JSON.stringify(storeGroupInfo))
    const storeDragInfo = storeModuleList?.find((it) => it.moduleId === props.moduleId)
    provideInfo.currentGroupInfo?.[props.groupName]?.moduleList?.forEach((curModuleIt) => {
      if (curModuleIt.moduleId === props.moduleId) {
        if (storeDragInfo?.showElementLists?.length) {
          curModuleIt.showElementLists = storeDragInfo.showElementLists
        } else {
          curModuleIt.showElementLists = localModuleItem.elementLists
            ? JSON.parse(JSON.stringify(localModuleItem.elementLists))
            : []
        }
        if (storeDragInfo?.hiddenElementLists?.length) {
          curModuleIt.hiddenElementLists = storeDragInfo.hiddenElementLists
        } else {
          curModuleIt.hiddenElementLists = []
        }
        moduleInfo.value = curModuleIt
      }
    })
  } else {
    initSubDragInfo()
  }
  isInitStore.value = true
}

// 监听分组信息变化
watch(
  () => provideInfo.localGroupInfo[props.groupName]?.moduleList,
  (val: ModuleIFPrivate[] | undefined) => {
    if (isInitStore.value && val) {
      nextTick(() => {
        updateDragInfo(val)
      })
    }
  },
  { deep: true }
)

// 监听当前分组信息变化
watch(
  () => provideInfo.currentGroupInfo,
  () => {
    bindObjReferenceAddress()
  },
  { deep: true }
)

// 监听 groupName变化,重新绑定 moduleInfo 引用
watch([() => props.groupName, () => provideInfo.refreshTrigger], () => {
  // console.log(' moduleInfo.value】 -452', moduleInfo.value.title)
  initStoreDragInfo()
})

// 监听存储分组信息变化
// watch(
//   () => provideInfo.storeGroupInfo?.[props.groupName],
//   (storeVal) => {
//     // console.log('I storeGroupInfo】 -452', moduleInfo.value.title)
//     initStoreDragInfo()
//   },
//   {
//     deep: true
//   }
// )

onMounted(() => {
  nextTick(() => {
    initStoreDragInfo()
  })
})

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener('mousemove', onColResize)
  document.removeEventListener('mouseup', stopColResize)
})
</script>

<style lang="scss" scoped>
$gap: 4px;
$zIndex: 99;

.draggable-element {
  position: relative;

  .collapse-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
  }

  &.collapsible .draggable-main {
    overflow: hidden;
  }
}

.draggable-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.drag-col {
  position: relative;
  padding-right: 0 !important;
  padding-left: 0 !important;
  // .element-item_content {
  // // overflow: hidden;//隐藏会影响表单校验的显示
  // // background-color: #bfc;
  // }
  // 宽度调整手柄
  .drag-col_resize {
    // opacity: 0;
    position: absolute;
    top: 0;
    right: 4px;
    width: 8px;
    height: 100%;
    cursor: e-resize; //col-resize;
    z-index: $zIndex + 1;
    transition: background-color 0.2s;

    &:hover::before {
      opacity: 1;
    }
  }

  .close-icon {
    position: absolute;
    top: -7px;
    right: 0px;
    z-index: $zIndex + 2;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .drag-col_content {
    padding: 0 $gap;
  }
}

.drag-col.drag-active {
  margin-bottom: 10px;
  // background: #bcf;
}

.drag-col.has-child .drag-col_content {
  background-color: transparent !important;
  padding: 5px;
}

.drag-col_content {
  cursor: move;
  border: 1px dashed #e4e7ed;
  background-color: #f5f7fa;
  width: calc(100% - $gap * 2);
  min-height: 55px;
  border-radius: 5px;
  // overflow: hidden;
}

.element-item {
  position: relative;
  // background-color: red;
  &:hover {
    // background-color: red;
    .setting-icon {
      display: block !important;
    }
  }
}

:deep(.element-ghost) {
  .drag-col_content {
    opacity: 0.5;
    background-color: #409eff !important;
  }
}
</style>
