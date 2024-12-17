<template>
  <div id="dragContentId" class="content-wrap">
    <!-- 已选中 -->
    <div class="selected-box">
      <div class="box-header">
        已选中
        <span class="tips">拖拽进行排序（{{ selectedList.length }}/10）</span>
      </div>
      <draggable
        ref="selectedBoxRef"
        itemKey="todoId"
        :group="dragGroup"
        :list="selectedList"
        ghost-class="ghost"
        :handle="`.${handleClass}`"
        filter=".forbid"
        class="drag-content select"
        :force-fallback="true"
        chosen-class="chosenClass"
        animation="300"
        :sort="true"
        :fallback-class="true"
        :fallback-on-body="true"
        :touch-start-threshold="50"
        :fallback-tolerance="50"
        :move="onMove"
        @start="startSelectedDrag"
        @end="endSelectedDrag"
      >
        <template #item="{ element }">
          <div :class="handleClass">
            <div class="drag-item select">
              <!-- <svg-icon icon-class="home-double-colon" /> -->
              <el-icon :size="16" color="#a6a6a6"><Rank /></el-icon>
              <span class="txt ellipsis" :title="element.text">{{ element.text }}</span>
              <el-button type="text" link @click="cancelSelect(element, index)">
                <el-icon :size="16" color="#a6a6a6"><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- 未选中 -->
    <div class="unselected-box">
      <div class="box-header flex-sc">
        未选中
        <span class="tips">拖拽进行排序</span>
      </div>
      <!-- v-for="(item, index) in unselectedList" :key="item.todoId" -->
      <draggable
        :disabled="dragDisabled"
        itemKey="todoId"
        :group="groupName"
        :list="unselectedList"
        ghost-class="ghost"
        :handle="`.${handleClass}`"
        filter=".forbid"
        class="drag-content unselected"
        :sort="true"
        :force-fallback="true"
        chosen-class="chosenClass"
        animation="300"
        :fallback-class="true"
        :fallback-on-body="true"
        :touch-start-threshold="50"
        :fallback-tolerance="50"
        :move="onMove"
        @start="startUnselectedDrag"
        @end="endUnselectedDrag"
      >
        <template #item="{ element }">
          <div :class="handleClass">
            <div class="drag-item unselected">
              <!-- <svg-icon icon-class="home-double-colon" /> -->
              <el-icon :size="16" color="#a6a6a6"><Rank /></el-icon>
              <span class="txt ellipsis" :title="element.text">{{ element.text }}</span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { todoListMock } from './mock.js'

const allConfigList = ref([]) //所有筛选项列表
const selectedList = ref([]) //已筛选列表
const selectedLimit = 10 //可挑选的数量
const unselectedList = ref([]) //未筛选列表
const handleClass = 'drag-handle' //拖拽手柄类名
const groupName = 'dragGroup' //拖拽组名称
const selectedBoxRef = ref()
let dragFlag = 0
const dragGroup = ref({
  name: groupName,
  //是否允许拖入
  put: () => {
    return selectedList.value.length < selectedLimit //最多maxNum个
  },
  pull: () => {
    return selectedList.value.length > 1 // 至少一个
  }
})
// 判断鼠标是否在div内
function isInside(event, $target) {
  // console.log('【 event, $el 】-266', event, $target.$el)
  const { clientX, clientY } = event // 获取鼠标相对于页面的位置
  let targetEl = $target.$el
  const rect = targetEl?.getBoundingClientRect() // 获取div的位置和大小
  const { left, right, top, bottom } = rect
  return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom
}
// 已筛选框-拖拽开始的事件
function startSelectedDrag(event) {
  // handleSelectstart(false)
  if (selectedList.value.length == 1) {
    ElMessage.warning('至少选中1个')
  }
  event.originalEvent.preventDefault()
}

// 已筛选框-拖拽结束的事件
function endSelectedDrag() {
  // handleSelectstart(true)
  if (selectedList.value.length < selectedLimit) {
    dragFlag = 0
  }
}
// 未筛选框-拖拽开始的事件
function startUnselectedDrag() {
  // handleSelectstart(false)
}
// 未筛选框-拖拽结束的事件
function endUnselectedDrag(params) {
  // handleSelectstart(true)
  let $target = selectedBoxRef.value
  if (isInside(params.originalEvent, $target) && selectedList.value.length == selectedLimit) {
    dragFlag++
    if (dragFlag > 1) {
      ElMessage.warning(`最多选中${selectedLimit}个`)
    }
  }
}

function handleSelectstart(val) {
  const el = document.getElementById('dragContentId')
  if (el) {
    el.onselectstart = function () {
      return false //val
    }
  }
}
// 取消选中
function cancelSelect(item, index) {
  selectedList.value.splice(index, 1)
  unselectedList.value.push(item)
}

// 初始化
function init() {
  // 已选中的id
  const selectedIdsMocks = todoListMock.filter((item) => item.isSelect === true).map((item) => item.todoId)
  console.log('【 selectedIdsMocks 】-198', selectedIdsMocks) // 已选中的id
  allConfigList.value = JSON.parse(JSON.stringify(todoListMock))
  selectedList.value = allConfigList.value.filter((item) => selectedIdsMocks.includes(item.todoId))
  unselectedList.value = allConfigList.value.filter((item) => !selectedIdsMocks.includes(item.todoId))
}
init()
onMounted(() => {
  nextTick(() => {
    handleSelectstart(false)
  })
})
</script>
<style lang="scss" scoped>
.content-wrap {
  min-height: 200px;
  width: 100%;
}

.box-header {
  margin-bottom: 13px;
  font-size: 14px;
  color: rgba(56, 56, 56, 1);
  .tips {
    font-weight: 400;
    margin-left: 8px;
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
  }
}
.drag-content {
  margin-bottom: 33px;
  display: grid;
  grid-template-columns: repeat(5, minmax(50px, 1fr));
  gap: 8px 8px;
  width: 100%;
}
.drag-item {
  box-sizing: border-box;
  padding: 0 12px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  border: 1px solid rgb(229, 229, 229);
  display: grid;
  grid-template-columns: 22px auto 14px;
  align-items: center;
  &.unselected {
    grid-template-columns: 22px auto !important;
  }
}
// 被选中目标放置时的样式
.ghost {
  border: 1px dashed var(--theme-color) !important;
  background: #f2fbff;
  border-radius: 4px;
  .drag-item {
    opacity: 0 !important; //隐藏
  }
}
// 被选中目标拖动时的样式
.chosenClass .drag-item {
  opacity: 1;
  cursor: pointer !important;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 4px;
  border: 1px solid  var(--theme-color) !important;
}
</style>
