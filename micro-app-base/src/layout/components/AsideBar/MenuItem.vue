<!--
 * @Description: 侧边栏/菜单栏-菜单项
 * @Author: Hongzf
 * @Date: 2022-11-23 18:17:12
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:12:47
-->
<template>
  <div :class="[isCollapse ? 'collapse-mode' : 'expand-mode', { 'first-level': isFirstLevel }]">
    <!-- 无下级菜单或只有一个子菜单，则将子菜单作为当前级菜单 -->
    <template v-if="!item.children || item.children.length === 1">
      <el-menu-item :index="item.path" @click="handleRouter(item.path)">
        <!-- 一级菜单显示菜单图标 -->
        <el-icon v-if="isFirstLevel"><IconMenu /></el-icon>
        <span>{{ title }}</span>
      </el-menu-item>
    </template>

    <!-- 有下级菜单 -->
    <el-sub-menu v-else :index="item.path">
      <!-- 菜单标题 -->
      <template #title>
        <!-- 一级菜单显示图标 -->
        <el-icon v-if="isFirstLevel"><IconMenu /></el-icon>
        <span>{{ title }}</span>
      </template>

      <!-- 下级菜单（递归） -->
      <template v-if="item.children">
        <MenuItem
          v-for="(subItem, subIndex) in item.children"
          :key="subIndex"
          :item="subItem"
          :isCollapse="isCollapse"
          :isFirstLevel="false"
        ></MenuItem>
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu as IconMenu } from '@element-plus/icons-vue'
import { ref, reactive, defineProps } from 'vue'
import { useRouter } from 'vue-router'

// props
const props = defineProps({
  item: {
    type: Object, // as PropType<RouteRecordRaw>,
    require: true,
    default: () => {}
  },
  // 是否收缩
  isCollapse: {
    type: Boolean,
    require: true,
    default: false
  },
  // 是否是一级菜单
  isFirstLevel: {
    type: Boolean,
    default: false
  }
})
const isCollapse = ref(props.isCollapse)
const item = reactive(props.item)
const title = item.meta?.title || ''
// 页面跳转
const router = useRouter() // useRoute相当于以前的this.$route
function handleRouter(path: string) {
  router.push(path).catch((err) => {
    console.log('MenuItem.vue-跳转失败', path, err)
  })
}
</script>

<style lang="scss" scoped>
.el-icon {
  width: unset !important;
}
// 收缩模式
.collapse-mode {
  // 一级菜单有效
  &.first-level {
    .el-menu-item {
      & > span {
        visibility: hidden !important;
      }
    }
    .el-sub-menu {
      overflow: hidden;

      // 隐藏箭头 TODO：无效？？
      .el-sub-menu__icon-arrow {
        display: none !important;
      }
      .el-sub-menu__title {
        // 隐藏菜单名称
        & > span {
          visibility: hidden !important;
        }
      }
    }
  }
}
</style>
