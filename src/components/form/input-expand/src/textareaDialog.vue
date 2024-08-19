<template>
  <el-dialog
    v-model="dialogVisible"
    v-bind="$attrs"
    :title="title"
    width="500"
    align-center
    append-to-body
    class="z-textarea-dialog"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <el-form
        :model="formData"
        ref="formRef"
        label-position="top"
        :rules="rules"
      >
        <el-form-item :label="label" prop="textareaVal">
          <el-input
            v-model="formData.textareaVal"
            @input="formatVal"
            clearable
            type="textarea"
            :rows="8"
            placeholder=""
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="showManifestButton"
          type="primary"
          @click="getManifest"
        >
          获取舱单
        </el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive ,watch,computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  textarea: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '标题',
  },
  label: {
    type: String,
    default: '标签',
  },
  showManifestButton: {
    type: Boolean,
    default: false,
  },
})
// / 表单数据
let formData = reactive({
  textareaVal: '',
})
watch(
  () => props.textarea,
  (val) => {
    formData.textareaVal = val
  },
  {
    immediate: true,
  }
)
const formRef = ref()
const validateVal = (rule, value, callback) => {
  const regex = /^[0-9-,\n\s+\n+]+$/ // 正则表达式，只允许字母和数字和_
  if (value && !regex.test(value)) {
    callback(new Error('只允许数字和- ,'))
  } else {
    callback()
  }
}
const emits = defineEmits('update:modelValue')
const rules = reactive({
  // textareaVal: [{ validator: validateVal, trigger: 'change' }]
})
const dialogVisible = computed({
  get() {
    return props.modelValue //同步外部v-model的值
  },
  set(val) {
    emits('update:modelValue', val)
  },
})

// 组装数据格式
const formatVal = (value) => {
  // const regex = /^[0-9-,\n\s+\n+]+$/ // 正则表达式，只允许字母和数字和_
  // if (!regex.test(value)) {
  //   formData.textareaVal = value.replace(/[^0-9-,\n\s+\n+]+/g, '') // 去除非法字符
  // }
}

// 确认弹窗
const handleConfirm = () => {
  dialogVisible.value = false
  // formRef.value.validate((valid) => {
  //   if (valid) {
  //   } else {
  //     console.log('error submit!')
  //     return false
  //   }
  // })
  emits('confirm', formData) // 确认之后触发的事件
}
const getManifest = () => {
  dialogVisible.value = false
  emits('getManifest', formData) // 确认之后触发的事件
}
// 取消弹窗
const handleCancel = () => {
  dialogVisible.value = false
  emits('cancel', formData) // 关闭之后触发的事件
}
</script>
<style lang="scss" scoped>
.z-textarea-dialog {
  .el-dialog__header {
    padding: 10px 20px !important;
    border-bottom: 1px solid #d5d5d8 !important; //标题下划线
    margin-right: 0px;

    .el-dialog__headerbtn {
      top: 0px;
    }
  }

  .el-dialog__footer {
    display: flex;
    justify-content: center;
  }
}
.dialog-content {
  // min-height: 200px;
}
</style>
