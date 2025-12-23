<!--
 * @Description: 表单控件
 * @Date: 2024-07-22 09:29:49
 * @LastEditTime: 2024-07-29 13:26:41
-->
<template>
  <div :style="config.style || 'width: 100%'">
    <!-- 文本框: input type: text | textarea | password-->
    <!-- -->
    <el-input
      v-if="[EL_ENUM.INPUT, EL_ENUM.TEXTAREA].includes(elementType)"
      v-model="formValue[fieldProp]"
      v-bind="config"
      :placeholder="config.placeholder"
      :maxlength="config.fieldLength"
      :clearable="true"
      :disabled="curDisabled"
      :style="{ width: config.width || '100%' }"
      :type="INPUT_TYPE[elementType] || 'input'"
      @blur="handleInputBlur"
      @input="handleInput"
      @change="config.change"
      :rows="config.rows || 1"
      :uppercase="config.uppercase ?? true"
    />
    <number-input
      v-if="[EL_ENUM.NUMBER_INPUT].includes(elementType)"
      v-model="formValue[fieldProp]"
      :min="config.min"
      :max="config.max"
      :maxlength="config.fieldLength"
      :precision="config.precision"
      :append="config.append"
      :suffix="config.suffix"
      :slotAppend="!!config.appendSelect"
      clearable
      :placeholder="config.placeholder"
      :disabled="curDisabled"
      :style="{ width: config.width || '100%' }"
      @blur="handleInputBlur"
      @input="handleInput"
    >
      <template v-if="config.appendSelect" #slotAppend>
        <el-select
          v-model="formValue[config.appendSelectProp]"
          :disabled="curDisabled"
          :style="{ width: config.appendSelectWidth || '80px' }"
          size="small"
        >
          <el-option
            v-for="option in config.appendSelectOptions"
            :key="option.dictCode || option.key"
            :label="option.dictTableName || option.value"
            :value="option.dictCode || option.key"
          />
        </el-select>
      </template>
    </number-input>
    <!-- 35字符分割线输入框 -->
    <divider-input
      ref="dividerRef"
      v-if="[EL_ENUM.DIVIDER_INPUT].includes(elementType)"
      v-model="formValue[fieldProp]"
      v-bind="config"
      :placeholder="config.placeholder"
      :maxlength="config.fieldLength"
      :clearable="true"
      :disabled="curDisabled"
      :style="{ width: config.width || '100%' }"
      :type="'textarea'"
      @input="config.input"
      @change="config.change"
      :rows="config.rows || 1"
      :uppercase="config.uppercase ?? true"
    />
    <!-- 下拉 -->
    <el-select
      v-if="[EL_ENUM.SELECT].includes(elementType)"
      v-model="formValue[fieldProp]"
      :disabled="curDisabled"
      :clearable="true"
      :placeholder="config.placeholder"
      :style="{ width: config.width || '100%' }"
    >
      <el-option
        v-for="option in getOptions(config)"
        :key="option[config.dictCode]"
        :label="option[config.dictTableName]"
        :value="option[config.dictCode]"
      />
    </el-select>
    <!-- 字典 -->
    <Dictionary
      v-if="[EL_ENUM.DICT_SELECT].includes(elementType)"
      v-model="formValue[fieldProp]"
      :disabled="curDisabled"
      :code="config.dictName"
      :multiple="config.multiple"
      :isEdit="false"
      :placeholder="config.placeholder"
      :style="{ width: config.width || '100%' }"
      :options="dictOptions"
      @change="handleChange"
    />
    <!-- 日期、时间日期 - 使用g-date-picker 统一处理 UTC 时区 -->
    <el-date-picker
      v-if="[EL_ENUM.DATE, EL_ENUM.DATETIME].includes(elementType)"
      v-model="formValue[fieldProp]"
      :disabled="curDisabled"
      :type="DATE_TYPE[elementType] || 'date'"
      :value-format="dateFormatValue"
      :format="dateFormat"
      :style="{ width: config.width || '100%' }"
      @change="changeDate"
    />
    <el-date-picker
      v-if="[EL_ENUM.DATETIMERANGE].includes(elementType)"
      v-bind="config"
      v-model="dateRange"
      :disabled="curDisabled"
      :type="DATE_TYPE[elementType] || 'date'"
      :start-placeholder="'form'"
      :end-placeholder="'to'"
      :value-format="config.valueFormat || 'YYYY-MM-DD hh:mm:ss'"
      :clearable="true"
      :style="{ width: config.width || '100%' }"
      @change="changeDateRange"
    />
    <!-- 复选框 -->
    <el-checkbox
      v-if="[EL_ENUM.CHECKBOX].includes(elementType)"
      v-bind="latestConfig"
      v-model="formValue[fieldProp]"
      :label="latestConfig.checkboxLabel"
      :true-value="latestConfig.trueValue ?? true"
      :false-value="latestConfig.falseValue ?? false"
      :disabled="curDisabled"
      @change="config.change"
      @click="config.click"
    />
    <!-- 复选框组 -->
    <el-checkbox-group
      v-if="[EL_ENUM.CHECKBOX_GROUP].includes(elementType)"
      v-model="formValue[fieldProp]"
      @change="config.change"
      :disabled="curDisabled"
    >
      <el-checkbox v-for="item in config.checkboxOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-checkbox-group>
    <!-- 联想控件:动态组件 -->
    <component
      v-if="elementType === EL_ENUM.ASSOCIATE && associateComponent"
      v-bind="autoConfig"
      :is="associateComponent"
      ref="associateRef"
      v-model="formValue[fieldProp]"
      v-model:def-value="formValue[fieldPropName]"
      :disabled="curDisabled"
      v-on="getAllEventListeners()"
    />
    <!-- AutoComplete 组件 -->
    <!-- <AutoComplete
      v-if="[EL_ENUM.AUTOCOMPLETE].includes(elementType)"
      v-model="formValue[fieldProp]"
      v-model:def-value="formValue[fieldPropName]"
      :disabled="curDisabled"
      :configs="config.autoCompleteConfig || {}"
      :params="config.autoCompleteParams || {}"
      :placeholder="config.placeholder"
      :style="{ width: config.width || '100%' }"
      @select="handleAutoCompleteSelect"
    /> -->
    <!-- 自定义插槽 -->
    <slot
      v-if="[EL_ENUM.CUSTOM].includes(elementType) || config.slot"
      :name="config.slot"
      :formValue="formValue"
      :config="config"
    ></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { EL_ENUM, RANGE_TYPE } from './type/elementEnum'
// import { useDictStore } from '@/store'
// import AutoComplete from '@/components/AutoComplete/index.vue'

const props = defineProps({
  formValue: {
    type: Object,
    default: () => {}
  },
  // 表单项配置
  config: {
    type: Object,
    required: true
  },
  element: {
    type: Object,
    required: true
  }
})

let dictOptions = ref(null)
const associateComponent = ref(null)

const emit = defineEmits(['sendDate', 'associateEvent'])
// 处理联想控件的所有事件
const handleAssociateEvent = (eventName: string, ...args: any[]) => {
  // 将事件向上传递给父组件
  emit('associateEvent', { eventName, args, config: props.config, fieldProp: config.fieldProp })
  // 可以在这里添加通用的事件处理逻辑
  // console.log(`联想控件事件:${eventName}`, args)
  // 如果需要针对特定事件做处理,可以在这里添加
  switch (eventName) {
    case 'select':
      props.config?.select?.(args[0], args[1])
      //选择事件的特殊处理
      break
    case 'getCreateVal':
      props.config?.getCreateVal(args[0], args[1])
      //获取创建值的特殊处理
      break
    // 可以根据需要添加更多事件处理
  }
}

// 动态生成所有事件监听器 - 使用 Proxy 捕获所有可能的事件
const getAllEventListeners = () => {
  const knownEvents = ['select', 'getCreateVal', 'get-create-val', 'change', 'input']
  const listeners: Record<string, (...args: any[]) => void> = {}
  // 为已知事件创建监听器
  knownEvents.forEach((eventName) => {
    listeners[eventName] = (...args: any[]) => handleAssociateEvent(eventName, ...args)
  })
  // 使用 Proxy 捕获未知事件(可选,用于调试)
  return new Proxy(listeners, {
    get(target, prop) {
      const eventName = String(prop)
      if (target[eventName]) {
        return target[eventName]
      }
      // 为未知事件动态创建监听器
      if (eventName.startsWith('on') || eventName.includes('-') || eventName.includes(':')) {
        console.log(`动态创建事件监听器: ${eventName}`)
        target[eventName] = (...args: any[]) => handleAssociateEvent(eventName, ...args)
        return target[eventName]
      }
      return undefined
    }
  })
}

const { config } = props
const fieldProp = config.fieldProp
const fieldPropName = config.fieldPropName

const elementType = computed(() => config.uiType)
const dateRange = ref([])

const INPUT_TYPE = {
  [EL_ENUM.TEXTAREA]: 'textarea',
  [EL_ENUM.INPUT]: 'input'
}

const DATE_TYPE = {
  [EL_ENUM.DATE]: 'date',
  [EL_ENUM.DATETIME]: 'datetime',
  [EL_ENUM.DATETIMERANGE]: 'datetimerange'
}

watch(
  () => props.formValue,
  (newVal) => {
    if (Array.isArray(fieldProp) && fieldProp.length > 0) {
      if (!newVal[fieldProp[0]]) {
        dateRange.value = []
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  () => props.config.dictOption,
  (newVal) => {
    dictOptions.value = newVal
  },
  {
    immediate: true,
    deep: true
  }
)
const latestConfig = computed(() => {
  return props.config
})
const autoConfig = computed(() => {
  const config = props.config
  // 展开 componentProps,使其属性能直接传递给联想组件
  if (config.componentProps && typeof config.componentProps === 'object') {
    return { ...config, ...config.componentProps }
  }
  const obj = {}
  const onEvents = ['select', 'getCreateVal', 'get-create-val', 'change', 'input']
  // 联想控件去除事件类型,避免和v-on冲突
  for (const key in config) {
    if (typeof config[key] === 'function' && onEvents.includes(key)) {
      // console.log('【key】-327', fieldProp, key)
    } else {
      obj[key] = config[key]
    }
  }
  return obj
})
const curDisabled = computed(() => {
  return props.config.disabled
})
const dateFormat = computed(() => {
  const { format, uiType } = config
  // 自定义格式
  if (format) {
    return format
  }
  // 日期控件选中结束需要当天最后
  if (uiType === EL_ENUM.DATE) {
    return 'YYYY-MM-DD'
  }
  // 日期控件选中结束需要当天最后
  if (uiType === EL_ENUM.DATETIME) {
    return 'YYYY-MM-DD hh:mm:ss'
  }
  return 'YYYY-MM-DD'
})
const dateFormatValue = computed(() => {
  const { valueFormat, uiType, rangeType } = config
  // ISO格式
  if (valueFormat === 'ISO') {
    return 'ISO'
  }
  // 自定义格式
  if (valueFormat) {
    // 日期控件选中结束需要当天最后
    if (uiType === EL_ENUM.DATE && rangeType === RANGE_TYPE.End) {
      return 'YYYY-MM-DD 23:59:59'
    }
    // 月份控件选中结束需要当月最初
    if (uiType === EL_ENUM.MONTH && rangeType === RANGE_TYPE.Start) {
      return 'YYYY-MM-01 00:00:00'
    }
    return config.valueFormat
  }
  // 默认格式
  if (elementType.value === EL_ENUM.DATE) {
    return 'YYYY-MM-DD'
  } else if (elementType.value === EL_ENUM.DATETIME) {
    return 'YYYY-MM-DD HH:mm:ss'
  }
  return 'YYYY-MM-DD'
})

function getOptions(item: any) {
  return typeof item.options === 'function' ? item.options() : item.options
}

function changeDate(val: string) {
  if (config.rangeType) {
    const startItem = props.element?.elementLists?.find((item) => item.rangeType === RANGE_TYPE.Start)
    const endItem = props.element?.elementLists?.find((item) => item.rangeType === RANGE_TYPE.End)
    const startTime = props.formValue[startItem.fieldProp]
    const endTime = props.formValue[endItem?.fieldProp]
    if (startTime && endTime && startTime > endTime) {
      ElMessage.error('开始时间不能大于结束时间')
      props.formValue[config.fieldProp] = null
    }
  }
  config.change && config.change(props.formValue[config.fieldProp])
}

function removeItemsWithComma(arr) {
  if (!Array.isArray(arr)) {
    return arr
  }
  return arr.filter((item) => !String(item).includes(','))
}

function changeDateRange(val: string) {
  if (!config.rangeType) {
    return
  }
  if (Array.isArray(fieldProp) && fieldProp.length > 0) {
    props.formValue[fieldProp[0]] = val[0]
    props.formValue[fieldProp[1]] = val[1]
    emit('sendDate', removeItemsWithComma(props.formValue))
  }
}

const handleInputBlur = (val) => {
  // 只有字符串类型才调用 trim(),数字类型不处理
  const currentValue = props.formValue[fieldProp]
  if (typeof currentValue === 'string') {
    props.formValue[fieldProp] = currentValue.trim()
  }
  latestConfig.value.blur?.(props.formValue[config.fieldProp])
  latestConfig.value.change?.(props.formValue[config.fieldProp])
}

const handleInput = () => {
  if (config.onInput) {
    const { proxy } = getCurrentInstance()
    if (proxy && typeof proxy[config.onInput] === 'function') {
      proxy[config.onInput]()
    }
  }
}

const handleChange = (val) => {
  if (config.change && typeof config.change === 'function') {
    config.change(val)
  }
  if (config.onChange) {
    const { proxy } = getCurrentInstance()
    if (proxy && typeof proxy[config.onChange] === 'function') {
      proxy[config.onChange]()
    }
  }
}

const loadAssociateComponent = async (componentName) => {
  // if (!componentName) {
  //   associateComponent.value = null
  //   return
  // }
  // try {
  //   const associateModule = await import('@/views/component/associate-input/index')
  //   const component = associateModule[componentName]
  //   if (component) {
  //     associateComponent.value = component
  //   } else {
  //     associateComponent.value = null
  //   }
  // } catch (error) {
  //   console.warn(`加载联想组件失败:${componentName}`, error)
  //   associateComponent.value = null
  // }
}

watch(
  () => config.componentName,
  (newComponentName) => {
    if (elementType.value === EL_ENUM.ASSOCIATE && newComponentName) {
      loadAssociateComponent(newComponentName)
    }
  },
  { immediate: true }
)

// 处理 AutoComplete 选择
const handleAutoCompleteSelect = (selectedItem, { modelValue, defValue }) => {
  if (selectedItem && typeof selectedItem === 'object') {
    // 更新表单值
    props.formValue[fieldProp] = modelValue
    if (fieldPropName) {
      props.formValue[fieldPropName] = defValue
    }
    // 触发变化事件
    emit('sendDate', selectedItem)
  }
}
</script>

<style lang="scss" scoped></style>
