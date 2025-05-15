<!--
 * @Description: 点击展开弹窗输入框
 * @Date: 2024-04-25 11:42:44
 * @LastEditTime: 2025-05-15 14:50:03
-->
<template>
  <div class="z-input-expand" :class="{ expand: showIcon }">
    <el-input
      v-bind="$attrs"
      v-model.trim="inputVal"
      clearable
      :placeholder="placeholder"
      :maxlength="isOrderType ? 13 : maxlength"
      :disabled="disabled"
      @input="formatVal"
      @change="handleChange"
      @clear="handleClear"
    >
      <template #suffix v-if="showIcon">
        <el-button icon="MoreFilled" size="small" type="primary" @click="dialogVisible = true" :disabled="disabled" />
      </template>
    </el-input>
    <TextareaDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      @confirm="(val) => handleConfirm(val, 'confirm')"
      @getManifest="(val) => handleConfirm(val, 'manifest')"
      :showManifestButton="showManifestButton"
      :textarea="textareaVal"
      :title="title"
      :label="label"
      :type="type"
    ></TextareaDialog>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ZInputExpand'
})
import { ref, watch ,computed} from 'vue'
import TextareaDialog from './textareaDialog.vue'
const props = defineProps({
  type: {
    type: String, // 输入框类型
    default: ''
  },
  modelValue: {
    type: [String, Number] //输入框的值
  },
  textarea: {
    type: String, // 文本域的值
    default: ''
  },
  // validate: {
  //   type: Boolean, // 是否符合要求
  //   default: false
  // },
  disabled: {
    type: Boolean, // 是否符合要求
    default: false
  },
  placeholder: {
    type: String,
    default: ' '
  },
  maxlength: {
    type: [String, Number], //最大长度
    default: ''
  },
  label: {
    type: String,
    default: '标签' // 文本域标签
  },
  title: {
    type: String,
    default: '标题' // 弹窗标题
  },
  showIcon: {
    type: Boolean, // 是否展示右侧按钮
    default: true
  },
  showManifestButton: {
    type: Boolean, // 是否展示获取舱单按钮
    default: false
  },
  independent: {
    type: Boolean, // 输入框和弹窗的值是否分开绑定，默认不分开
    default: false
  }
})
const isOrderType = computed(() => {
  return props.type == 'order'
})
// 值是否分开绑定
const isDividedBind = computed(() => {
  const { type, independent } = props
  let val = type == 'order' || (type != 'order' && independent)
  return val
})

// 弹窗
function handleConfirm(obj, type) {
  // console.log('【 obj 】-101', type, obj, obj.textareaVal)
  let splitArr = obj.textareaVal
    ?.split(/[\t\n,;]/) // 根据换行符、分号和逗号分割字符串
    .filter((item) => !!item) //去除空值
    .map((item) => item.trim()) //去除左右空格
  const str = splitArr.join(',')
  if (isDividedBind.value) {
    emits('update:textarea', str)
  } else {
    emits('update:modelValue', str)
  }
  if (type == 'manifest') {
    emits('getManifest', str)
  } else {
    // console.log('【 主单号类型取第一个赋值 】-119', splitArr)
    // 主单号类型取第一个赋值
    if (props.type == 'order') {
      emits('update:modelValue', splitArr[0] || '')
    }
    emits('confirm', str)
  }
}
const dialogVisible = ref(false)
const inputVal = ref('')
const textareaVal = ref('')

const isError = ref(false)

const emits = defineEmits(['validate', 'change', 'update:modelValue'])
const handleValid = (val) => {
  if (val && val.length < 13) {
    isError.value = true
    return true
  }
  isError.value = false
  return false
}

// 组装数据格式
const formatVal = (value) => {
  // 非单号类型
  if (!isOrderType.value) {
    inputVal.value = value
    return
  }
  // 单号类型
  if (value && typeof value === 'string') {
    value = value.replace(/\D/g, '') // 只能输入数字
    // 前3位后补上-
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3)
    }
    // 第8位补上空格
    if (value.length > 8) {
      value = value.slice(0, 8) + ' ' + value.slice(8)
    }
    inputVal.value = value.slice(0, 13)
  } else {
    inputVal.value = ''
  }
  const isValid = !handleValid(inputVal.value)
  emits('update:validate', isValid)
}

watch(
  () => props.modelValue,
  (val) => {
    // console.log('【 watch-modelValue 】-113', val)
    formatVal(val)
    // 绑定同一个值
    if (!isDividedBind.value) {
      textareaVal.value = val
    }
  },
  {
    immediate: true
  }
)
watch(
  () => props.textarea,
  (val) => {
    // 不绑定同一个值
    if (isDividedBind.value) {
      textareaVal.value = val
    }
  },
  {
    immediate: true
  }
)

const handleChange = (val) => {
  // 非单号类型
  if (!isDividedBind.value) {
    textareaVal.value = val
  }
  inputVal.value = val
  emits('update:modelValue', inputVal.value)
  emits('change', inputVal.value)
}

// 清空
const handleClear = () => {
  inputVal.value = ''
  emits('update:modelValue', '')
}
const init = () => {
  formatVal(props.modelValue)
}
init()
</script>
<style lang="scss" scoped>
.z-input-expand {
  width: 100%;
  &.expand {
    :deep(.el-input__suffix) {
      position: relative;
      width: 45px;
    }

    :deep(.el-input__suffix-inner) {
      position: relative;
      width: 100%;

      .el-button {
        position: absolute;
        right: 0px;
        height: 20px;
        width: 25px;
      }

      .el-input__clear {
        position: absolute;
        right: 30px;
      }
    }
  }
}
</style>
