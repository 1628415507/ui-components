<template>
  <div class="setting-icon">
    <el-form :disabled="false">
      <!-- 防止外部el-form影响 -->
      <el-popover placement="bottom" :teleported="false">
        <template #reference>
          <div v-if="settingable" class="setting">
            <el-icon size="10" color="#a8a8a8">
              <MoreFilled />
            </el-icon>
          </div>
        </template>
        <div v-if="requiredable">
          必填项
          <el-switch v-model="colEl.required" />
        </div>
      </el-popover>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, inject, watch, onMounted, nextTick } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import type { ProvideDragConfig, ElementConfig } from './type/index'
import type { FormInstance, FormRules } from 'element-plus'
import { setErrorPosition } from '../../../methods/rules/setFormRules.ts'
import { TEMP_TYPE } from './type/SystemEnum.ts'
const provideInfo = inject<ProvideDragConfig>('provideInfo', {} as ProvideDragConfig)

const props = defineProps<{
  formRef: FormInstance
  formRules: FormRules
  colEl: ElementConfig
  groupName: string
}>()

// 是否可配置必填
const requiredable = computed((): boolean => {
  const { activeTemplate, allSystemElementsMap, allTenantElementsMap } = provideInfo
  const systemCol = allSystemElementsMap[props.groupName]?.[props.colEl.elementId]
  const tenantCol = allTenantElementsMap[props.groupName]?.[props.colEl.elementId]
  const localAllow = props.colEl?.requiredable
  const systemAllow = systemCol?.required
  const tenantAllow = tenantCol?.required
  if (activeTemplate?.level === TEMP_TYPE.SYSTEM) {
    return localAllow
  } else if (activeTemplate?.level === TEMP_TYPE.TENANT) {
    return systemAllow && localAllow
  } else {
    return tenantAllow && systemAllow && localAllow
  }
})

// 是否显示配置
const settingable = computed(() => {
  return !!requiredable.value
})

// 切换必填状态
function changeRequired(val: boolean) {
  const { prop, label } = props.colEl
  if (!props.formRules[prop]) {
    props.formRules[prop] = []
  }
  const rules = props.formRules[prop]
  const findIndex = rules.findIndex((it) => it.required === true)
  if (val) {
    // 添加必填规则
    if (findIndex < 0) {
      props.formRules[prop].unshift({
        required: true,
        message: '必填',
        trigger: ['blur', 'change']
      })
    }
    addHoverListener()
  } else {
    // 移除必填规则
    if (findIndex >= 0) {
      props.formRules[prop].splice(findIndex, 1)
    }
  }
}

function addHoverListener() {
  const { prop, label } = props.colEl
  const formItem = props.formRef.fields?.find((it) => it.prop === prop)
  const hoverListener = formItem?.$el?.getAttribute('hover-listener')
  if (!hoverListener && formItem) {
    setErrorPosition(formItem)
  }
}

watch(
  () => props.colEl.required,
  (newVal) => {
    // nextTick(() => {
    changeRequired(newVal)
    // })
  }
)

onMounted(() => {
  nextTick(() => {
    if (props.colEl.required === true) {
      changeRequired(true)
      addHoverListener()
    }
  })
})
</script>

<style lang="scss" scoped>
.setting-icon {
  display: none;
  position: absolute;
  top: -24px;
  left: 0px;
  padding-bottom: 5px;
  z-index: 999;
  // background-color: red;
  &:hover {
    display: block !important;
  }
}

.setting {
  z-index: 999;
  cursor: pointer;
  background-color: red;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(213, 217, 229, 1);
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px 4px 8px;
}
</style>

