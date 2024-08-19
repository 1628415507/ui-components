<template>
  <ClientOnly>
    <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
    <!-- <p text="sm" v-html="decodedDescription" /> -->
    <div class="example">
      <!-- 组件示例 -->
      <div class="example-showcase">
        <Example :path="path" />
      </div>
      <!-- 分割线 -->
      <el-divider class="m-0" />
      <!-- 复制/查看源码 -->
      <div class="op-btns">
        <ElTooltip content="复制代码" :show-arrow="false">
          <ElIcon :size="16" class="op-btn" @click="copyCode">
            <CopyDocument />
          </ElIcon>
        </ElTooltip>
        <ElTooltip content="查看源代码" :show-arrow="false">
          <ElIcon :size="16" class="op-btn" @click="toggleSourceVisible()">
            <View />
          </ElIcon>
        </ElTooltip>
      </div>
      <!-- 展示源码 -->
      <ElCollapseTransition>
        <SourceCode v-show="sourceVisible" :source="source" />
      </ElCollapseTransition>
      <!-- 隐藏按钮 -->
      <Transition name="el-fade-in-linear">
        <div v-show="sourceVisible" class="example-float-control" @click="toggleSourceVisible(false)">
          <ElIcon :size="16">
            <CaretTop />
          </ElIcon>
          <span>隐藏源代码</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
// useclipboard是vueuse库提供的一个用于操作剪贴板的钩子
// 它允许你在 Vue 应用程序中轻松地访问剪贴板。
// 使用useclipboard,你可以将数据复制到剪贴板或将剪贴板中的数据粘贴到应用程序中
import { useClipboard, useToggle } from '@vueuse/core'
import Example from './example.vue' // 组件
import SourceCode from './sourceCode.vue' // 源码

const props = defineProps<{
  rawSource: string //源码
  source: string
  path: string //组件路径
  description?: string
}>()
// console.log('【 props  】-61', props)

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false
})

const [sourceVisible, toggleSourceVisible] = useToggle(false)

// const decodedDescription = computed(() => decodeURIComponent(props.description!))
// console.log('【 decodedDescription 】-64', decodedDescription)

// 赋值代码
const copyCode = async () => {
  if (!isSupported) {
    ElMessage.error('复制失败')
  }
  try {
    await copy()
    ElMessage.success('已复制')
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}
</script>
<style lang="scss" scoped>
.m-0 {
  margin: 0;
}
.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);
  // 组件
  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    background-color: var(--bg-color);
  }
  // 操作按钮
  .op-btns {
    // background-color: red;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }
  // .隐藏源代码按钮样式
  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
