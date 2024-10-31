<!--
 * @Description: 表单控件
 * @Date: 2024-07-22 09:29:49
 * @LastEditTime: 2024-07-29 13:26:41
-->

<template>
  <div style="width: 100%">
    <!-- 文本框：input type: text | textarea | password-->
    <el-input
      v-if="[EL_TYPE.INPUT, EL_TYPE.TEXTAREA].includes(elementType)"
      v-model="formValue[fieldProp]"
      :placeholder="config.placeholder || ''"
      :maxlength="config.fieldLength"
      :clearable="true"
      :style="{ width: config.width || '100%' }"
      :type="INPUT_TYPE[elementType] || 'input'"
      rows="1"
    />

    <!-- 下拉 -->
    <el-select
      v-if="[EL_TYPE.SELECT, EL_TYPE.DICT_SELECT].includes(elementType)"
      v-model="formValue[fieldProp]"
      :disabled="config.disabled"
      :clearable="true"
      :placeholder="config.placeholder || ''"
      :style="{ width: config.width || '100%' }"
    >
      <el-option
        v-for="option in getOptions(config)"
        :key="option[config.dictCode]"
        :label="option[config.dictTableName]"
        :value="option[config.dictCode]"
      />
    </el-select>
    <!-- 日期、时间日期 -->
    <el-date-picker
      v-if="[EL_TYPE.DATE, EL_TYPE.DATETIME].includes(elementType)"
      v-model="formValue[fieldProp]"
      :type="DATE_TYPE[elementType] || 'date'"
      :placeholder="config.placeholder || ' '"
      :value-format="config.valueFormat || 'YYYY-MM-DD hh:mm:ss'"
      :clearable="true"
      :style="{ width: config.width || '100%' }"
    />
    <!-- 联想控件 -->
    <AutoComplete
      v-if="elementType == EL_TYPE.ASSOCIATE"
      ref="associateRef"
      v-model="formValue[fieldProp]"
      :defValue="formValue[config.shlpDisplayField]"
      :configs="associateConfig"
      :searchColumns="associateSearchColumns"
      @handleAutoSelect="getSelectItem"
    ></AutoComplete>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  formValue: {
    type: Object,
    default: () => {}
  },
  // 表单项配置
  config: {
    type: Object,
    required: true
  }
})

const { config } = props //控件配置信息
const fieldProp = config.fieldProp //绑定的字段
const elementType = config.uiType //控件类型值

// 控件类型枚举
const EL_TYPE = {
  INPUT: '01', // 输入框
  TEXTAREA: '12', // 文本域
  DATE: '04', // 日期
  DATETIME: '05', // 日期时间
  ASSOCIATE: '11', // 联想控件
  SELECT: '06', //普通下拉
  DICT_SELECT: '15' //字典下拉
}
// 输入框类型枚举
const INPUT_TYPE: any = {}
INPUT_TYPE[EL_TYPE.TEXTAREA] = 'textarea'
INPUT_TYPE[EL_TYPE.INPUT] = 'input'
// 时间控件类型枚举
const DATE_TYPE: any = {}
DATE_TYPE[EL_TYPE.DATE] = 'date'
DATE_TYPE[EL_TYPE.DATETIME] = 'datetime'
// 返回下拉数据
function getOptions(item: any) {
  if (typeof item.options === 'function') {
    return item.options()
  } else {
    return item.options
  }
}

// 联想控件配置
const associateSearchColumns = ref({
  keyword: null
  // isActive: config.isEdit === true ? 1 : null
})
// 联想控件-获取值
function getSelectItem(item = {}) {
  if (props.formValue && item) {
    props.formValue[fieldProp] = item[fieldProp]
    props.formValue[config.shlpDisplayField] = item[config.shlpDisplayField]
  }
}
// TODO:待联调
const associateConfig = ref({
  url: '/standard-basedata/uiComponent/query/location', // 后台请求接口
  multiple: false, // 是否多选
  codeKey: fieldProp,
  nameKey: config.shlpDisplayField, // input显示填充字段值设置
  // 显示列配置
  showColumn:
    config?.shlpInputColumns?.map((item) => {
      return {
        label: item.ddText,
        prop: item.fieldName,
        minWidth: item.minWidth || item?.ddText?.length * 30 + 'px'
      }
    }) || []
  // [// 数据格式
  //   {
  //     label: '仓位编码',
  //     prop: 'locationCode',
  //     minWidth: 150
  //   },
  // ],
})

// console.log('【 associateConfig 】-83', associateConfig)
</script>
<style lang="scss" scoped></style>
