<!--
 * @Description: 加减按钮组
 * @Date: 2024-04-28 11:41:46
 * @LastEditTime: 2025-05-15 15:06:41
-->

<template>
  <div class="z-plusminus-button">
    <el-button
      v-show="index == list.length - 1 || bothShow"
      type="primary"
      class="add-btn"
      @click="add(index)"
      :style="{ marginTop: list.length == 1 ? firstMarginTop : '' }"
      :disabled="disabled"
    >
      +
    </el-button>

    <el-button
      v-show="list.length > 1 || bothShow"
      type="danger"
      class="minus-btn"
      :style="{ marginTop: index == 0 ? firstMarginTop : '' }"
      @click="remove(item, index)"
      :disabled="disabled"
    >
      -
    </el-button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ZPlusminusButton'
})
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  },
  firstMarginTop: {
    type: String,
    default: '22px' // 首行距离顶部的距离，默认22px，
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bothShow: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits('add', 'remove')

const add = () => {
  emits('add', props.index)
}
const remove = () => {
  emits('remove', props.index)
}
</script>

<style scoped lang="scss">
.z-plusminus-button {
  min-height: 23px;
  // background-color: #bcf;
  width: 60px;
  display: flex;
  align-items: center;
  .add-btn,
  .minus-btn {
    $len: 22px;
    box-sizing: border-box;
    width: $len !important;
    height: $len !important;
    line-height: $len !important;
    padding: 0 !important;
    margin-left: 4px !important;
    margin-right: 5px !important;
  }
  .minus-btn {
    margin-left: auto !important;
  }
}
</style>
