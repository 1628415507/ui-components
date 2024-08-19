<!--
 * @Description: 展开更多
 * @Date: 2024-04-09 13:01:16
 * @LastEditTime: 2024-07-31 15:33:06
-->
<template>
  <div class="z-expand-more">
    <!-- 默认展示 -->
    <slot></slot>
    <!-- 更多部分 -->
    <div class="expand-wrap">
      <el-icon
        :size="23"
        @click="showMore = !showMore"
        class="expand-icon"
        :title="showMore ? '收缩' : '展开'"
      >
        <!-- <el-image v-show="showMore" :src="dArrowTop" fit="contain" />
        <el-image v-show="!showMore" :src="dArrowBottom" fit="contain" /> -->
        <DArrowRight v-show="!showMore" class="rotate" />
        <DArrowLeft v-show="showMore" class="rotate" />
      </el-icon>
      <!-- <transition name="el-zoom-in-top"> -->
      <div
        v-show="showMore"
        class="expand-content"
        :class="{ active: showMore }"
      >
        <slot name="expand"></slot>
      </div>
      <!-- </transition> -->
    </div>
    <!-- 更多部分 -->
    <!-- <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <slot name="expand"></slot>
      </el-collapse-item>
    </el-collapse> -->
  </div>
</template>
<script>
export default {
  name: 'ZExpandMore'
}
</script>
<script setup>
import { ref } from 'vue'
let showMore = ref(false)
// import dArrowTop from './dArrowTop.svg'
// import dArrowBottom from './dArrowBottom.svg'

// const activeNames = ref(['1'])
</script>

<style lang="scss" scoped>
.z-expand-more {
  .expand-wrap {
    position: relative;
    .expand-icon {
      cursor: pointer;
      position: absolute;
      top: -25px;
      right: -10px;
      color: #797979;
      .rotate {
        transform: rotate(90deg);
      }
      &:hover {
        // color: #409eff;
      }
    }
  }
}
</style>
