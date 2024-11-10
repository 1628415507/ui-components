<!--
 * @Description:
 * @Date: 2024-04-07 17:57:15
 * @LastEditTime: 2024-10-29 10:10:35
-->
<template>
  <div class="z-vertical-steps">
    <el-steps :active="active" direction="vertical">
      <el-step
        v-for="(stepItem, index) in stepItems"
        :key="index"
        :title="stepItem.title || '-'"
        :status="stepItem.status"
        :description="stepItem.description"
      >
        <template #icon>
          <svg-icon v-if="nodeIcon == 'clock'" icon-class="iv_clock" />
          <div v-else class="circle" :class="firstNodeType" />
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script setup>
import { watch, ref, defineProps, computed, defineEmits, onMounted, onUnmounted, nextTick } from 'vue'
const props = defineProps({
  stepList: {
    type: Array,
    default: () => []
  },
  active: {
    type: Number,
    default: 1 //当前激活的步骤
  },
  titleProp: {
    type: String,
    default: 'title' //标题对应的字段
  },
  descProp: {
    type: String,
    default: 'description' //描述对应的字段
  },
  firstNodeType: {
    type: String,
    default: 'solid' // border,solid 第一个节点的样式
  },
  nodeIcon: {
    type: String,
    default: 'circle' // 节点样式，默认圆
  }
})
const stepItems = ref([])
watch(
  () => props.stepList,
  (newVal) => {
    console.log('【 newVal 】-57', newVal)
    stepItems.value = newVal
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss">
.z-vertical-steps {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  .el-step {
    margin-bottom: 0px;
    &:not(:first-child) {
      margin-top: -3px;
    }
    &:first-child {
      .circle.border {
        border: 1px solid var(--theme-color);
        background: transparent !important;
      }
    }
  }
  .el-step__head {
    // 修改节点的样式和大小
    .el-step__icon {
      // height: auto;
      background: transparent;
      border: none;
      .circle {
        width: 7px;
        height: 7px;
        border: 1px solid var(--theme-color);
        background: var(--theme-color);
        border-radius: 50%;
      }
    }
    .el-step__line {
      margin-top: 19px;
      background-color: transparent !important;
      width: 0px !important;
      border-left: 1px dashed rgba(213, 213, 215, 1) !important;
    }
  }
  .el-step__main {
    padding-left: 0px !important;
    display: flex;
    align-items: center;
    padding-bottom: 10px !important; //涉及虚线的长度
    .el-step__title {
      color: rgba(60, 60, 67, 1) !important;
      padding-bottom: 0px !important;
      font-weight: 500 !important;
      font-size: 14px !important;
    }
    .el-step__description {
      margin-top: 0px;
      margin-left: 9px;
      color: rgba(128, 128, 128, 1);
      font-size: 14px !important;
    }
  }
}
</style>
