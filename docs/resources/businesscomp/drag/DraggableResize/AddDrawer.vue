<template>
  <div v-show="dialogVisible" class="add-drawer-wrap">
    <div class="drawer-header">
      <span>元素增加</span>
      <el-button type="text" @click="dialogVisible = false" class="close-btn">
        <el-icon size="18" color="#5f6167">
          <Expand />
        </el-icon>
      </el-button>
    </div>
    <div class="drawer-main">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="moduleItem in filterModuleList"
          :key="moduleItem.moduleId"
          :name="moduleItem.moduleId"
          :title="moduleItem.title"
        >
          <template #title="{ isActive }">
            <div class="drawer-main_title">
              {{ moduleItem.title || moduleItem.moduleId }}
              <span class="collapse-count">{{ getHiddenCount(moduleItem) }}/{{ getCount(moduleItem) }}</span>
            </div>
          </template>
          <div class="drawer-main_content">
            <AddDrawerDrag :config="config" :moduleItem="moduleItem" :moduleId="moduleItem.moduleId" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" @click="saveElConfig">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddDrawerDrag from './AddDrawerDrag.vue'
import { ref, defineEmits, defineProps, defineExpose, computed, onMounted, watch, getCurrentInstance } from 'vue'
import type { DragConfigPrivate, ModuleIFPrivate } from './type/index'

const props = defineProps<{
  modelValue: boolean
  config: DragConfigPrivate
}>()

const { proxy } = getCurrentInstance()

// Emits接口
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', moduleList: ModuleIFPrivate[]): void
}

const emits = defineEmits<Emits>()

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emits('update:modelValue', val)
  }
})

// ==================== 列表信息 Start ====================
const moduleList = ref<ModuleIFPrivate[]>([])
const activeNames = computed<string[]>(() => {
  return moduleList.value.map((it) => it.moduleId)
})

const filterModuleList = computed<ModuleIFPrivate[]>(() => {
  return moduleList.value.filter((it) => {
    const { elementLists, showElementLists, hiddenElementLists } = it
    return elementLists?.length !== 0 || (hiddenElementLists?.length || 0) + (showElementLists?.length || 0) !== 0
  })
})

// 获取隐藏元素数量
function getHiddenCount(moduleItem: ModuleIFPrivate): number {
  let hiddenCount = 0
  moduleItem.hiddenElementLists?.forEach((it) => {
    if (it?.hiddenElementLists?.length) {
      hiddenCount += it.hiddenElementLists?.length
    } else {
      hiddenCount++
    }
  })
  moduleItem?.showElementLists?.forEach((it) => {
    if (it?.hiddenElementLists?.length) {
      hiddenCount += it.hiddenElementLists?.length
    }
  })
  return hiddenCount
}

// 获取总元素数量
function getCount(moduleItem: ModuleIFPrivate): number {
  let showCount = 0
  moduleItem.showElementLists?.forEach((it) => {
    if (it?.showElementLists?.length) {
      showCount += it.showElementLists?.length
    } else {
      showCount++
    }
  })
  const hiddenCount = getHiddenCount(moduleItem)
  return hiddenCount + showCount
}

// 保存元素配置
function saveElConfig(): void {
  emits('save')
}

// 初始化模块列表
function initModuleList() {
  const activeGroupName = props.config.activeGroupName
  moduleList.value = props.config.currentGroupInfo?.[activeGroupName]?.moduleList || []
}

// 监听当前分组信息变化
watch(
  () => props.config.currentGroupInfo,
  (val: ModuleIFPrivate[] | undefined) => {
    if (!moduleList.value.length) {
      initModuleList()
    }
  },
  { deep: true }
)

// 监听活动分组名称变化
watch(
  () => props.config.activeGroupName,
  () => {
    initModuleList()
  },
  { deep: true }
)

onMounted(() => {
  initModuleList()
})

defineExpose({})
</script>

<style lang="scss" scoped>
* {
  -webkit-user-select: none;
  /* WebKit浏览器 */
  -moz-user-select: none;
  /* Firefox浏览器 */
  -ms-user-select: none;
  /* IE/Edge浏览器 */
  user-select: none;
  /* 标准语法 */
}

.add-drawer-wrap {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.close-btn {
  padding: 4px;
  margin-left: 8px;
}

.drawer-footer {
  padding: 16px 20px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto; //自动推到底部
}

.drawer-main {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  // .drawer-main_content {
  // }
}

.drawer-main_title {
  .collapse-count {
    color: #909399;
    font-size: 12px;
  }

  &:before {
    margin-right: 8px;
    content: '';
    display: inline-block;
    width: 4px;
    height: 11px;
    background-color: var(--el-color-primary) !important;
  }
}
</style>
