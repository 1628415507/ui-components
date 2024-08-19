<!--
 * @Description:信息框
 * @Date: 2024-03-28 15:08:57
 * @LastEditTime: 2024-07-31 15:35:43
-->
<template>
  <!-- 可缩放 -->
  <div v-if="resizable" :id="resizableBoxId" class="resizable-card-wrap">
    <div class="header">{{ header }}</div>
    <div class="body" :class="[resizable ? 'resizable' : '', bodyClass]" :style="customBodyStyle">
      <slot></slot>
    </div>
  </div>
  <!-- 不可缩放（默认） -->
  <el-card
    v-else
    v-bind="$attrs"
    :header="header"
    :bodyStyle="bodyStyle"
    :bodyClass="bodyClass"
    class="z-info-card-wrap"
    shadow="never"
  >
    <template #header v-if="slotHeader">
      <div class="slot-header">
        <slot name="header"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>
<script setup>
import { ref, defineProps, useSlots, computed, defineEmits, onMounted,onUnmounted ,nextTick  } from 'vue'
const props = defineProps({
  header: {
    type: String, // 标题
    default: ''
  },
  resizable: {
    type: Boolean, // 控制是否能被用户缩放
    default: false
  },
  resizeType: {
    type: String, // 控制缩放方向
    default: 'vertical' //'none' | 'both' | 'horizontal' | 'vertical'
  },
  bodyStyle: {
    type: Object, // 自定义样式
    default: () => {}
  },
  bodyClass: {
    type: String, // 样式类
    default: ''
  },
  minHeight: {
    type: String, // 最小高度
    default: ''
  },
  scrollSelector: {
    type: String, // 所在的滚动区域的元素名称
    default: ''
  }
})
const slotHeader = computed(() => {
  return !!useSlots().header // 父组件是否使用header插槽
})
// 自定义样式
const customBodyStyle = computed(() => {
  const { header, resizeType, minHeight, bodyStyle } = props
  const minWidth = header.length * 15 + 'px'
  return { resize: resizeType, minWidth, minHeight, ...bodyStyle }
})

let resizableBoxId = ref(Math.random())
let $resizableBox = null //可调整的对象
let $scrollContainer = null //可调整对象所在的区域元素
const emits = defineEmits('resize')
// 调整时触发的事件
function resizableBox(e) {
  const box = $resizableBox
  // let startX = e.clientX //开始拖拽的X坐标
  // let startY = e.clientY //开始拖拽的Y坐标

  // getComputedStyle()这个方法来获取元素当前的样式，是window的方法，可以直接使用
  // const startWidth = parseFloat(getComputedStyle(box).width.replace('px', ''))
  const startHeight = parseFloat(getComputedStyle(box).height.replace('px', ''))
  // 绑定监听事件
  document?.documentElement?.addEventListener('mousemove', handleResizing)
  document?.documentElement?.addEventListener('mouseup', stopResize)
  let timer
  // 拖动过程中触发的事件
  function handleResizing(event) {
    // const deltaY = event.clientY - startY
    // startY = event.clientY
    // const width = startWidth + event.clientX - startX + 'px'
    // const height = startHeight + event.clientY - startY
    if (timer) {
      console.log('【 timer 】-99', timer)
      // clearTimeout(timer)
      return
    }
    timer = setTimeout(() => {
      // resizing(event)
      if (!$scrollContainer) {
        return
      }
      const scrollHeight = $scrollContainer.scrollHeight //滚动区域的滚动高度
      const scrollClientHeight = $scrollContainer.clientHeight //滚动区域的视野高度
      const resizeH = parseFloat(getComputedStyle(box).height.replace('px', '')) //拖动过程中的高度
      if (scrollHeight - scrollClientHeight > 0 && resizeH > startHeight) {
        // $scrollContainer.scrollTop = scrollHeight - scrollClientHeight//滚动条直接滚动到底部
        // $scrollContainer.scrollTop = $scrollContainer.scrollTop + 10 //每次滚动加10
        // let addHeight = resizeH - startHeight// > 50 ? 50 : resizeH - startHeight
        let addHeight = resizeH - startHeight > 50 ? 50 : resizeH - startHeight
        $scrollContainer.scrollTop = $scrollContainer.scrollTop + addHeight //滚动条移动的距离为新调整的距离
        console.log('【  scrollHeight - scrollClientHeight 】-114', scrollHeight, scrollClientHeight, addHeight)
        // $scrollContainer.scrollTop = scrollHeight - startHeight
        // console.log('【  $scrollContainer.scrollHeight 】-113', scrollHeight - height,scrollHeight, startHeight, height)
      }
      emits('resizing', event)
      clearTimeout(timer)
      timer = null
    }, 100)
  }
  // 停止拖拽
  function stopResize() {
    // emits('resize', { width: w.value, height: resizeHeight.value })
    document?.documentElement?.removeEventListener('mousemove', handleResizing)
    document?.documentElement?.removeEventListener('mouseup', stopResize)
  }
}
onMounted(() => {
  nextTick(() => {
    $resizableBox = document.getElementById(resizableBoxId.value)
    // 可调整
    if (props.resizable) {
      $resizableBox.addEventListener('mousedown', resizableBox)
      if (props.scrollSelector) {
        $scrollContainer = document.querySelector(props.scrollSelector)
        console.log('【 $scrollContainer  】-128', props.scrollSelector, $scrollContainer)
      }
    }
  })
})
onUnmounted(() => {
  // 移除监听事件
  $resizableBox?.removeEventListener('mousedown', resizableBox)
})
</script>

<style lang="scss" >
.z-info-card-wrap {
  margin: 10px 0 0 0 !important;
  max-width: 100%;
  border: 1px solid #ccc;
  position: relative !important;
  overflow: visible;
  .el-card__header {
    position: absolute !important;
    border-bottom: none !important;
    padding: 0px !important;
    top: -9px;
    left: 10px;
    background-color: transparent;
    height: 10px;
    font-size: 12px;
    font-weight: 700;
    .slot-header {
      margin-top: -4px;
    }
  }
  .el-card__body {
    padding: 10px !important;
  }
}
// 可调节
.resizable-card-wrap {
  margin: 10px 0px 0 0 !important;
  position: relative !important;
  max-width: 100%;
  // background-color: transparent;
  .header {
    position: absolute !important;
    top: -9px;
    left: 10px;
    font-size: 12px;
    font-weight: 700;
  }
  .body {
    overflow: visible;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 4px;
    // border: none;
    // box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    box-shadow: 0 0 0 1px #ccc inset;
    &.resizable {
      min-height: 250px;
      height: 250px;
      resize: vertical;
      overflow: auto;
      // background-color: #bcf;
    }
  }
}
</style>
