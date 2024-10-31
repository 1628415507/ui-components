<!--
 * @Description: 拖拽项组件
 * @Date: 2024-07-22 11:32:07
 * @LastEditTime: 2024-07-26 14:49:37
-->
<template>
  <div class="drag-item">
    <el-form-item :label="getLabel(formItemList)" style="width: 100%">
      <el-row style="width: 100%">
        <el-col v-for="el in formItemList" :span="24 / formItemList.length" :key="el.rtmDynaLoElementId">
          <el-form-item :label="formItemList.length == 1 ? el.fieldText : ''" :prop="getPropertyName(el)">
            <FormItem :formValue="formValue" :config="el" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits, defineProps, computed, onMounted } from 'vue'
import FormItem from './FormItem.vue'
const props = defineProps({
  formValue: {
    type: Object,
    required: true,
    default: () => {}
  },
  // 拖拽项配置
  element: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const formItemList = ref([]) // 表单项配置
watch(
  () => props.element,
  (newVal) => {
    formItemList.value = newVal?.rtmDynamicLayoutElementLists || []
    // console.log('【 formItemList.value 】-39', formItemList.value)
  },
  {
    immediate: true,
    deep: true
  }
)

function getPropertyName(config) {
  const RANGE_TYPE = {
    start: 'Start',
    end: 'End'
  }
  return `${config.propertyName}${RANGE_TYPE[config.rangeType] || ''}`
}
function getLabel(list) {
  if (list.length > 1) {
    return `${list[0].fieldText}/${list[1].fieldText}`
  }
  return ''
}
</script>
