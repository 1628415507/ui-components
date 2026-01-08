<template>
  <div
    :id="resizable ? resizableBoxId : undefined"
    class="z-info-card-wrap"
    :class="{
      resizable: resizable,
      border: border,
      'has-header': !!header || slotHeader,
      collapsed: isCollapsed
    }"
    :style="{ background }"
  >
    <!-- Header 区域 -->
    <div
      v-if="slotHeader || header"
      class="card-header"
      :class="{
        'icon-dot': headerIcon === 'dot',
        'icon-line': headerIcon === 'line'
      }"
    >
      <div v-if="slotHeader" :class="resizable ? '' : 'slot-header'">
        <slot name="header"></slot>
      </div>
      <div v-if="!slotHeader" class="title">{{ header }}</div>
      <el-icon v-if="collapsible" class="collapse-icon" @click="toggleCollapse">
        <ArrowDown v-if="!isCollapsed" />
        <ArrowRight v-else />
      </el-icon>
    </div>
    <!-- Body 区域 -->
    <div v-show="!isCollapsed" :class="['card-body', bodyClass]" :style="resizable ? customBodyStyle : finalBodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ZInfoCard'
})
import { defineProps, useSlots, computed, defineEmits, ref, onMounted, nextTick, onUnmounted } from 'vue'
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  header: {
    type: String, // 标题
    default: ''
  },
  // 标题图标
  headerIcon: {
    type: String, // 标题前缀图标
    default: 'line' // [可选值：dot，line，'空值则不显示' ]
  },
  // ======== 展开收缩 相关配置 =======
  collapsible: {
    type: Boolean, // 是否启用展开/收缩功能
    default: false
  },
  expand: {
    type: Boolean, // 默认是否展开
    default: true
  },
  // ======== resizable 相关配置 =======
  resizable: {
    type: Boolean, // 控制是否能被用户缩放
    default: false
  },
  resizeType: {
    type: String, // 控制缩放方向
    default: 'vertical' //'none' | 'both' | 'horizontal' | 'vertical'
  },
  scrollSelector: {
    type: String, // 所在的滚动区域的元素名称
    default: ''
  },
  // ============= 样式 =============
  background: {
    type: String, // 内容区域的样式类
    default: '#fbfcfe'
  },
  border: {
    type: Boolean, // 是否带有边框
    default: false
  },
  bodyStyle: {
    type: Object, // 自定义样式
    default: () => {}
  },
  bodyClass: {
    type: String, // 内容区域的样式类
    default: ''
  },
  minHeight: {
    type: String, // 最小高度
    default: '250px'
  },
  height: {
    type: String, // 高度
    default: '' // 默认为空，让内容自然撑开
  }
})
const slotHeader = computed(() => !!useSlots().header) // 父组件是否使用header插槽
const isAutoExpand = ref(true) // 自动收缩功能
// 折叠状态
const isCollapsed = computed({
  get() {
    if (props.collapsible) {
      return !isAutoExpand.value //自动收缩
    }
    return !props.expand //同步外部v-model的值
  },
  set(val) {
    emits('update:expand', !val)
  }
})
// 切换折叠状态
const toggleCollapse = () => {
  isAutoExpand.value = !isAutoExpand.value
  emits('expand-change', !isCollapsed.value)
}

// el-card 模式的 bodyStyle（支持 height 属性）
const finalBodyStyle = computed(() => {
  const { height, bodyStyle } = props
  // 如果用户明确传入了 height 属性，合并到 bodyStyle 中
  if (height) {
    return { height, ...bodyStyle }
  }
  // 否则让内容自然撑开
  return bodyStyle
})

// 可缩放模式的自定义样式
const customBodyStyle = computed(() => {
  const { header, resizeType, minHeight, height, bodyStyle } = props
  const minWidth = `${header.length * 15}px`
  // 可缩放模式如果没传 height，使用 minHeight 作为初始高度
  const finalHeight = height || minHeight
  return { resize: resizeType, minWidth, minHeight, height: finalHeight, ...bodyStyle }
})

const resizableBoxId = ref(Math.random())
let $resizableBox = null //可调整的对象
let $scrollContainer = null //可调整对象所在的区域元素
const emits = defineEmits(['resize', 'expand-change', 'update:expand'])
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
      // console.log('【 timer 】-99', timer)
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
        const addHeight = resizeH - startHeight > 50 ? 50 : resizeH - startHeight
        $scrollContainer.scrollTop = $scrollContainer.scrollTop + addHeight //滚动条移动的距离为新调整的距离
        // console.log('【  scrollHeight - scrollClientHeight 】-114', scrollHeight, scrollClientHeight, addHeight)
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
    // 可调整
    if (props.resizable) {
      $resizableBox = document.getElementById(resizableBoxId.value)
      $resizableBox.addEventListener('mousedown', resizableBox)
      if (props.scrollSelector) {
        $scrollContainer = document.querySelector(props.scrollSelector)
        // console.log('【 $scrollContainer  】-128', props.scrollSelector, $scrollContainer)
      }
    }
  })
})
onUnmounted(() => {
  // 移除监听事件
  $resizableBox?.removeEventListener('mousedown', resizableBox)
})
</script>

<style lang="scss">
.z-info-card-wrap {
  margin: 0 0 10px 0;
  max-width: 100%;
  border: none;
  overflow: visible;
  padding: 10px;

  // 带边框样式
  &.border {
    border: 1px solid #ccc !important;
  }

  // 收缩状态下减少下边距
  &.collapsed {
    margin-bottom: 5px;
  }

  // Header 区域
  .card-header {
    border-bottom: none !important;
    padding: 0px !important;
    margin-bottom: 8px;
    background-color: transparent;
    line-height: 10px;
    font-size: 14px !important;
    font-weight: 700;
    display: flex;
    align-items: center;
    .title:before {
      margin-right: 8px;
      content: '';
      display: inline-block;
      background-color: var(--el-color-primary) !important;
    }
    // 前缀图标-竖线
    &.icon-line {
      .title:before {
        width: 4px;
        height: 11px;
      }
    }
    // 前缀图标-圆点
    &.icon-dot {
      .title:before {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }

    // 展开收缩按钮
    .collapse-icon {
      margin-left: 10px;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.3s;
      color: #606266;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .slot-header {
      margin-top: -4px;
    }
  }

  // Body 区域
  .card-body {
    padding: 0 !important;
    height: 100%;
  }
}
// 可调节
.z-info-card-wrap.resizable {
  position: relative !important;
  max-width: 100%;

  .card-header {
    // position: absolute !important;
    // top: -9px;
    // left: 10px;
    // gap: 8px;
    // z-index: 1;
  }
  .card-body {
    overflow: visible;
    width: 100%;
    height: 250px;
    min-height: 250px;
    resize: vertical;
    overflow: auto;
    // height 通过 props 传递，不在这里固定
  }
}
</style>
