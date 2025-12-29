<template>
  <draggable
    v-model="moduleList"
    :animation="200"
    item-key="moduleId"
    ghost-class="module-ghost"
    :disabled="!provideInfo.state?.isModuleDraggable"
    class="draggable-module"
    @end="endModuleDrag"
  >
    <template #item="{ element: moduleEl }">
      <el-col
        v-if="moduleEl.visible !== false"
        class="module-item"
        :span="moduleEl.span"
        :class="[
          {
            'drag-active': provideInfo.state?.isModuleDraggable
          }
        ]"
        :style="getColStyle(moduleEl)"
      >
        <div class="drag-module-content" :class="moduleEl.calssName">
          <slot :name="moduleEl.moduleId" :element="moduleEl">
            <!-- {{ moduleEl.moduleId }} -->
          </slot>
        </div>
      </el-col>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { defineProps, ref, computed, inject, onMounted, nextTick, watch, getCurrentInstance } from 'vue'
import { isEqual } from '../../../methods/tools'
import type { ProvideDragConfig, DragConfig, ModuleIFPrivate } from '@/components/DraggableResize/type/index'

const { proxy } = getCurrentInstance()

const props = defineProps<{
  groupName: string
  config: DragConfig
  gap: Number //间距。默认10
}>()

const provideInfo = inject<ProvideDragConfig>('provideInfo', {} as ProvideDragConfig)

const isInitStore = ref(false)
const moduleList = ref<ModuleIFPrivate[]>([])

function getColStyle(moduleEl: ModuleIFPrivate) {
  const showList = moduleList.value.filter((it: ModuleIFPrivate) => it.visible !== false)
  const findIndex = showList.findIndex((it: ModuleIFPrivate) => it.moduleId === moduleEl.moduleId)
  let preSpanCount = 0
  if (findIndex < 0) return ''
  if (findIndex > 0) {
    preSpanCount = showList.slice(0, findIndex).reduce((acc: number, mod: ModuleIFPrivate) => acc + mod.span, 0)
  } else {
    preSpanCount = 0
  }
  const remainingSpan = 24 - (preSpanCount % 24)
  // console.log(' preSpanCount】-49', moduleEl.title, preSpanCount, remainingSpan, moduleEl.span)
  // 位于当前行的第一个
  if (props.gap === 0) {
    return 'padding: 0 !important;'
  }
  if (remainingSpan === 0 || remainingSpan === 24) {
    return 'padding: 0'
  } else {
    return `padding-left: ${props.gap ?? 10}px`
  }
}

// 拖拽结束处理
function endModuleDrag(evt: any) {
  provideInfo.currentGroupInfo[props.groupName].moduleList = moduleList.value
}

// 更新模块属性
function updateModuleList() {
  const newModuleList = provideInfo.localGroupInfo[props.groupName]?.moduleList || []
  moduleList.value.forEach((moduleIt: ModuleIFPrivate) => {
    const newModuleItem: ModuleIFPrivate = newModuleList?.find((it) => moduleIt.moduleId === it.moduleId)
    if (newModuleItem) {
      moduleIt.visible = newModuleItem.visible
    }
  })
}

const oldInfo = ref([])

function formatElementLists(list: any[], level = 1, isSub = false) {
  list.forEach((it) => {
    if ((level === 1 || isSub) && it.elementLists && (it.showElementLists === undefined || it.showElementLists === null)) {
      it.showElementLists = JSON.parse(JSON.stringify(it.elementLists)) //formatElementLists(it.elementLists, cur++, false)
      const flag = it.elementLists?.some((i) => i.elementLists?.length > 0) //有递归
      if (flag) {
        it.showElementLists?.forEach((subIt) => {
          subIt.showElementLists = subIt.elementLists //formatElementLists (subIt.elementLists, cur++, true)
        })
      }
    }
    it.hiddenElementLists = []
  })
  return list
}

// 判断当前模块数据是否变化
function isModuleChange() {
  const newInfo = provideInfo.currentGroupInfo?.[props.groupName]?.moduleList
  const curOldInfo = formatElementLists(oldInfo.value)
  // console.log(' oldInfo】', oldInfo.value)
  // console.log(' isModuleChange】', newInfo, curOldInfo)
  // console.log(' moduleList.value】', moduleList.value, oldInfo.value)
  // const isChanged = !isDeepEqual(
  const isChanged = !isEqual(
    { info: newInfo },
    { info: curOldInfo },
    {
      // 需要判断的字段
      includesProps: [
        'info',
        'groupName',
        'moduleId',
        'elementId',
        'elementLists',
        'showElementLists',
        'hiddenElementLists',
        'moduleId',
        'span',
        'required'
      ],
      propsDefaultValue: {
        required: false //给字段设置默认值
      }
    }
  )
  return isChanged
}

//初始化存储的模块列表
function initStoreModuleList() {
  if (provideInfo.currentGroupInfo?.[props.groupName]?.moduleList) {
    moduleList.value = provideInfo.currentGroupInfo[props.groupName].moduleList || []
    // console.log('initStoreModuleList】 -86', props.groupName, moduleList.value)
    setOldInfo()
    // 延迟设置初始化状态,避免和updateDragInfo的监听同时触发
    setTimeout(() => {
      isInitStore.value = true
    }, 1000)
  }
}

// 监听分组信息变化
watch(
  () => provideInfo.localGroupInfo[props.groupName]?.moduleList,
  (val: ModuleIFPrivate[] | undefined) => {
    if (isInitStore.value && val) {
      updateModuleList()
    }
  },
  { deep: true }
)

const curModuleListSort = computed(() => {
  return moduleList.value.map((it) => it.moduleId).join(',')
})

// 监听当前分组信息的顺序变化
watch(
  () => props.config?.currentGroupInfo?.[props.groupName]?.moduleList,
  (val: ModuleIFPrivate[] | undefined) => {
    const newSort = val?.map((it) => it.moduleId).join(',')
    // console.log('【newSort】 -117', groupName, moduleList.value, newSort, curModuleListSort.value)
    if (newSort !== curModuleListSort.value) {
      initStoreModuleList()
    }
  },
  { deep: true }
)

function setOldInfo() {
  const storeGroupInfo = provideInfo.storeGroupInfo?.[props.groupName] //本地配置
  const localGroupInfo = provideInfo.localGroupInfo[props.groupName] //本地配置
  const oldModuleList = storeGroupInfo?.moduleList || localGroupInfo?.moduleList || []
  // console.log('oldModuleList】 -174', oldModuleList, provideInfo)
  oldInfo.value = JSON.parse(JSON.stringify(oldModuleList))
  if (provideInfo.changeModules) {
    provideInfo.changeModules[props.groupName] = isModuleChange
  }
}

// 监听清除筛选触发器,执行清除操作
watch(
  () => provideInfo.refreshTrigger,
  (val) => {
    // initStoreModuleList()
    setOldInfo()
  }
)

watch(
  () => props.groupName,
  () => {
    initStoreModuleList()
  }
)

onMounted(() => {
  // 确保当前分组信息存在
  if (provideInfo.currentGroupInfo && !provideInfo.currentGroupInfo?.[props.groupName]) {
    provideInfo.currentGroupInfo[props.groupName] = JSON.parse(
      JSON.stringify(provideInfo.localGroupInfo[props.groupName] || {})
    )
  }
  initStoreModuleList()
})

defineExpose({})
</script>

<style lang="scss" scoped>
.draggable-module {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  $gap: 4px;
  // gap: 0 5px;

  .module-item {
    &.drag-active {
      margin-bottom: 10px;
      // background: #bcf;

      .drag-module-content {
        cursor: move;
        border: 1px dashed rgba(63, 169, 168, 1);
        background-color: #f5f7fa;
        width: calc(100% - $gap * 2);
        border-radius: 5px;
        overflow: hidden;
      }
    }
  }
}

// 拖拽过程中的样式
:deep(.module-ghost) {
  .drag-module-content {
    opacity: 0.5;
    background-color: rgba(220, 232, 234, 1) !important;
  }
}
</style>
