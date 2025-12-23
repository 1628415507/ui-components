<template>
  <div>
    <!-- clone="cloneConditionItem" -->
    <!-- :group="{ name: moduleItem.groupName, pull: 'clone', put: false }" -->
    <draggable
      itemkey="elementId"
      :list="moduleItem.hiddenElementLists"
      :sort="false"
      :group="groupConfig"
      :id="containerId"
      :data-draggable-id="containerId"
      :data-level="level"
      ghost-class="vuedraggable_ghost"
      chosen-class="condition-chosen"
      animation="300"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <template #item="{ element: el, index }">
        <div class="element-item">
          <el-checkbox :model-value="el.elementId" @change="(val) => clickCheckbox(val, el, index)" @click.stop>
            {{ getFieldText(el) }}
          </el-checkbox>
        </div>
      </template>
    </draggable>
    <div v-for="showIt in hiddenElementListsInShows" :key="showIt.elementId">
      <AddDrawerDrag :level="level + 1" :config="config" :moduleItem="showIt" :moduleId="moduleId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EL_ENUM } from './type/elementEnum'
import { ref, defineProps, defineExpose, computed, onMounted, reactive, withDefaults } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
import type { DragConfigPrivate, ModuleIFPrivate, ElementConfig } from '@/components/DraggableResize/type/index'

const props = withDefaults(
  defineProps<{
    config: DragConfigPrivate
    moduleItem: ModuleIFPrivate
    moduleId: string
    level: number
  }>(),
  { level: 1 }
)

const hiddenElementListsInShows = computed(() => {
  return props.moduleItem?.showElementLists?.filter((it) => it.hiddenElementLists) || []
})

const containerId = computed(() => {
  return props.level === 1 ? props.moduleId : props.moduleItem.elementId
})

// 获取字段显示文本
function getFieldText(el: ElementConfig): string {
  if (el.label) {
    return el.label
  } else if (el.childrens?.length) {
    return el.childrens.map((it) => it.label?.trim() || it.checkboxLabel).join('/')
  } else {
    return props.moduleItem.title || ''
  }
}

// 添加显示元素
function clickCheckbox(checked: boolean, element: ElementConfig, index: number) {
  const moduleItem = props.moduleItem
  if (!checked) {
    return
  }
  moduleItem?.showElementLists?.push(element)
  moduleItem?.hiddenElementLists?.splice(index, 1)
}

// ================================== 拖拽信息 Start ==================================
const dragState = reactive({
  startIndex: -1,
  startElement: {} as ElementConfig,
  showTip: true // 是否显示提示
})

const groupConfig = ref({
  name: props.moduleItem.groupName,
  put: () => false, // 不允许放置
  pull: (to: any, from: any, dragEl: any, evt: any) => {
    // 如果是同一个容器内的排序,允许拖拽
    if (to === from) {
      return true
    }

    // 插槽不允许跨组拖拽
    if (dragState.startElement?.uiType === EL_ENUM.SLOT) {
      const toEl = to.el
      const toLevel = Number(toEl.getAttribute('data-level'))
      const toDraggableId = toEl.getAttribute('data-draggable-id')
      const fromEl = from.el
      const fromLevel = Number(fromEl.getAttribute('data-level'))

      if (toDraggableId) {
        // 拖到外部同一级
        if (toDraggableId === containerId.value) {
          return true
        } else {
          if (fromLevel < toLevel) {
            return false
          } else {
            if (dragState.showTip) {
              ElMessage.warning(`${dragState.startElement.label}】只能在当前组内移动`)
            }
            dragState.showTip = false
            return false
          }
        }
      }
    }
    return true
  }
})

function onDragStart(evt: any) {
  dragState.startIndex = evt.oldIndex
  dragState.startElement = props.moduleItem.hiddenElementLists?.[evt.oldIndex] || ({} as ElementConfig)
}

function onDragEnd(evt: any) {
  dragState.showTip = true
}
// ================== 拖拽信息 End ==================

onMounted(() => {
  // 组件挂载时的初始化逻辑
})

defineExpose({})
</script>

<style lang="scss" scoped>
.element-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f5f7fa;
  background: rgba(244, 247, 250, 1);
  margin-bottom: 8px;
  cursor: move;

  &:last-child {
    border-bottom: none;
  }
}

:deep(.el-checkbox) {
  width: 100%;
}

.el-checkbox_label {
  width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.condition-chosen) {
  opacity: 0.5;
}

// 拖拽时的样式
:global(.vuedraggable_ghost) {
  border: 1px solid rgba(63, 169, 168, 1) !important;
  box-sizing: border-box;
  // z-index: 9999;
  // position: relative;
  // pointer-events: none;
  // background: // #409eff !important;
  // color: #fff;
  // border-radius: 4px;
  // padding: // padding: 8px 12px !important;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  // opacity: 0.8;
}

// 拖拽时完全穿透
// :global(.sortable-ghost) {
// // pointer-events: none !important;
// }
</style>
