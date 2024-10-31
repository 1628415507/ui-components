<!--
 * @Description:
 * @Date: 2024-04-07 17:57:15
 * @LastEditTime: 2024-10-29 09:58:38
-->
<template>
  <div class="z-row-steps">
    <el-steps :active="active" align-center>
      <el-step
        v-for="(stepItem, index) in stepItems"
        :class="setClass(stepItem, index)"
        :key="index"
        :title="stepItem.title || '-'"
        :status="stepItem.status"
      >
        <!-- <template #icon v-if="stepItem.status == 'error'">
          <span class="error-node"></span>
        </template> -->
      </el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  name: 'ZRowSteps'
}
</script>
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
  }
})
const stepItems = ref([])
watch(
  () => props.stepList,
  (newVal) => {
    stepItems.value = newVal
  },
  { immediate: true, deep: true }
)

function setClass(stepItem, index) {
  const nextItem = props.stepList[index + 1] || {}
  return `next-${nextItem.status}`
}
</script>
<style lang="scss">
.z-row-steps {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  .el-steps--horizontal {
    padding: 0px;
    background-color: transparent;
  }
  .el-step__title {
    font-size: 14px !important;
    font-weight: 600;
    &.is-error {
      color: rgba(212, 48, 48, 1);
      font-weight: 600;
    }
    &.is-process {
      color: rgba(255, 87, 51, 1);
    }
    &.is-finish {
      color: var(--theme-color);
    }
  }

  .el-step__head {
    // 非错误状态的节点
    height: 20px;
    line-height: 20px;
    position: relative !important;
    font-size: 14px;
    .el-step__line {
      top: 13px !important;
      height: 1px !important;
    }
    &:not(.is-error) {
      .el-step__icon {
        top: 2px;
        width: 9px;
        height: 9px;
        border: 1px solid rgba(130, 130, 130, 1);
        .el-step__icon-inner {
          display: none;
        }
      }
    }

    // 错误状态节点
    &.is-error {
      .el-step__icon {
        display: inline-block;
        border-radius: 50%;
        width: 15px !important;
        height: 15px !important;
        line-height: 7px;
        background: rgba(212, 48, 48, 1);
        border: 1px solid rgba(212, 48, 48, 1);
        text-align: center;
        color: #fff;
        .el-step__icon-inner {
          font-size: 8px;
          color: #fff;
          font-weight: normal;
        }
      }
    }
    // 已完成的节点
    &.is-finish {
      .el-step__icon {
        border: 1px solid var(--theme-color);
        background: var(--theme-color);
      }
      .el-step__line {
        background-color: var(--theme-color);
      }
      .el-step__line-inner {
        display: none;
      }
    }
    // 进行中的节点
    &.is-process {
      .el-step__icon {
        border: 1px solid rgba(255, 87, 51, 1);
        background: rgba(255, 87, 51, 1);
      }
    }
    &.is-wait,
    &.is-error {
      .el-step__line {
        background-color: transparent !important;
        height: 0px !important;
        border-top: 1px dashed rgba(151, 151, 151, 1) !important;
      }
    }
  }
  // 下个节点是错误节点
  .next-error {
    .el-step__icon {
      background: #ffffff !important;
      border: 1px solid rgba(130, 130, 130, 1) !important;
    }
    .el-step__line {
      background-color: transparent !important;
      height: 0px !important;
      border-top: 1px dashed rgba(151, 151, 151, 1) !important;
    }
    .el-step__title {
      color: rgba(166, 166, 166, 1) !important;
    }
  }
  // 下个节点是进行中
  .next-process {
    .el-step__line {
      background-color: rgba(255, 87, 51, 1) !important;
    }
  }
  // 下个节点是未开始
  .next-wait {
    .el-step__line {
      background-color: transparent !important;
      height: 0px !important;
      border-top: 1px dashed rgba(151, 151, 151, 1) !important;
    }
  }
  // .error-node {
  //   display: inline-block;
  //   border-radius: 50%;
  //   width: 12.5px;
  //   height: 12.5px;
  //   background: rgba(212, 48, 48, 1);
  //   border: 1px solid rgba(212, 48, 48, 1);
  //   color:#fff;
  // }
}
</style>
