<template>
  <el-form-item
    class="drag-form-item"
    for="none"
    :label="colEl.showLabel === false ? '' : colEl.label"
    :prop="colEl.prop"
    :required="required"
    :rules="colEl.rules"
    :max="colEl.max || colEl.fieldLength"
    :min="colEl.min"
    :class="colEl.formItemClass"
    :style="colEl.formItemStyle"
  >
    <template #label v-if="hasCustomLabel">
      <div class="custom-label flex-sc">
        <template v-for="(labelItem, labelIdx) in customLabelItems" :key="labelItem.text">
          <!-- 文本标签 -->
          <span
            v-if="labelItem.type === 'text'"
            :key="labelItem.text"
            :class="labelItem.class"
            :style="labelItem.style"
            @click="handleLabelClick(labelItem)"
          >
            {{ labelItem.text }}
          </span>
          <!-- 链接按钮 -->
          <el-button
            v-else-if="labelItem.type === 'link'"
            :key="labelItem.text"
            :disabled="labelItem.disabled"
            :class="labelItem.class"
            :style="labelItem.style"
            :type="labelItem.linkType || 'primary'"
            class="underline"
            tabindex="-1"
            link
            @click="handleLabelClick(labelItem)"
          >
            {{ labelItem.text }}
          </el-button>
          <!-- 普通按钮 -->
          <el-button
            v-else-if="labelItem.type === 'button'"
            :key="labelItem.text"
            tabindex="-1"
            :disabled="labelItem.disabled"
            :type="labelItem.buttonType"
            :class="labelItem.class"
            :circle="labelItem.circle"
            :style="labelItem.style"
            @click="handleLabelClick(labelItem)"
          >
            {{ labelItem.text }}
          </el-button>
          <!-- 复选框 -->
          <FormItem
            v-else-if="labelItem.type == 'checkbox'"
            :key="labelItem.text"
            :formValue="getFormValueByProp(labelItem.prop)"
            :config="getLabelConfig(labelItem)"
            :element="getLabelConfig(labelItem)"
            :class="labelItem.class"
            :style="labelItem.style"
          />
          <!-- SVG图标 -->
          <svg-icon
            v-else-if="labelItem.type === 'svgIcon'"
            :key="labelItem.text"
            :icon-class="labelItem.iconName"
            class="label-item"
            :class="labelItem.class"
            :style="labelItem.style"
            size="2em"
            @click="handleLabelClick(labelItem)"
          />
        </template>
      </div>
    </template>
    <FormItem :formValue="getFormValueByProp(colEl.prop)" :config="curEl" :element="curEl" />
  </el-form-item>
</template>

<script setup lang="ts">
import { defineProps, computed, inject } from 'vue'
import { EL_ENUM } from './type/elementEnum'
import type {
  ProvideDragConfig,
  DragConfigPrivate,
  ElementConfig,
  CustomLabelItem
} from './type/index'
import FormItem from './FormItem.vue'

const provideInfo = inject<ProvideDragConfig>('provideInfo', {} as ProvideDragConfig)

// Props接口
const props = defineProps<{
  groupName: string
  formValue: Record<string, any>
  config: DragConfigPrivate
  colEl: ElementConfig
}>()

const required = computed(() => {
  return props.colEl.required
})

const customLabelItems = computed(() => {
  return props.colEl?.customLabel?.items?.filter((it) => it.visible !== false)
})

//计算属性:是否有自定义标签
const hasCustomLabel = computed(() => {
  return props.colEl.customLabel?.items?.length
})

// 处理标签点击事件
const handleLabelClick = (labelItem: CustomLabelItem) => {
  if (labelItem.click) {
    labelItem.click(labelItem, props.colEl)
  }
}

// 更新复选框值
function onLabelCheckboxChange(val: any, labelItem: CustomLabelItem, colEl: ElementConfig) {
  const formObj = getFormValueByProp(labelItem.prop)
  const fieldProp = getFieldProp(labelItem.prop)
  formObj[fieldProp] = val // 更新对象值
  labelItem.change && labelItem.change(val, labelItem, colEl)
}

// 获取fieldProp对应层级的对象
function getFormValueByProp(prop: string): Record<string, any> {
  const keys = prop.split('.')
  if (keys.length <= 1) {
    return props.formValue
  }
  let obj = props.formValue
  for (let key of keys) {
    if (obj[key] && typeof obj[key] === 'object') {
      obj = obj[key]
    } else {
      return obj
    }
  }
  return obj
}

//获取最后一级的字段
function getFieldProp(prop: string): string {
  const keys = prop.split('.')
  return keys.length > 1 ? keys[keys.length - 1] : keys[0]
}

function getLabelConfig(labelItem: CustomLabelItem) {
  const objEl = {
    ...labelItem,
    uiType: EL_ENUM.CHECKBOX,
    checkboxLabel: labelItem.text
  }
  const { fieldProp, prop } = objEl
  objEl.fieldProp = fieldProp || getFieldProp(prop)
  return objEl
}

//计算当前元素配置
const curEl = computed<ElementConfig>(() => {
  const groupInfoEl = provideInfo.allLocalElementsMap[props.groupName] || {}
  // console.log(' 【groupInfoEl】 -169', groupInfoEl)
  const newShowItem = groupInfoEl[props.colEl.elementId]
  const objEl = JSON.parse(JSON.stringify(newShowItem || props.colEl))
  const { prop, fieldProp, nameProp, uiType } = objEl
  if (uiType === EL_ENUM.DICT_SELECT) {
    // console.log(' 【provideInfo.allElementsMap】 -169', provideInfo.allLocalElementsMap)
    // objEl. = newShowItem[key]
    // console.log(' showIt】-322', objEl.label, objEl, newShowItem)
  }
  objEl.fieldProp = fieldProp || getFieldProp(prop)
  if (nameProp) {
    objEl.fieldPropName = getFieldProp(nameProp)
  }
  // 复选框组
  if (uiType === EL_ENUM.CHECKBOX_GROUP) {
    const obj = getFormValueByProp(prop)
    if (!obj[objEl.fieldProp]) {
      obj[objEl.fieldProp] = []
    }
  }
  // 获取最新的函数方法
  for (let key in newShowItem) {
    if (typeof newShowItem[key] === 'function') {
      objEl[key] = newShowItem[key]
    }
  }
  return objEl
})
</script>

<style lang="scss" scoped>
.drag-form-item {
  & > .el-form-item_label {
    overflow: hidden;
    // text-overflow: ellipsis;
    white-space: nowrap;
    // width: fit-content;
    width: 100% !important;
  }
}

.custom-label {
  display: inline-flex !important;
  line-height: 22px;
  height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // width: fit-content;
  width: 100%;

  .label-item {
    display: inline-block;
    // background-color: #bfc;
  }
}
</style>

