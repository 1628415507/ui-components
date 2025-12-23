<template>
  <el-dialog
    v-model="dialogVisible"
    title="另存模版"
    align-center
    width="350px"
    :close-on-click-modal="false"
    @close="handleClose"
    append-to-body
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
      <el-form-item label="模版名称" prop="templateName" required>
        <el-input v-model="formData.templateName" />
      </el-form-item>
      <!-- <el-form-item label="选择类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
          <el-option label="系统级" value="SYSTEM" />
          <el-option label="租户级" value="TENANT" />
          <el-option label="用户级" value="USER" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <!-- <el-button @click="handleOverwrite">覆盖原模版</el-button> -->
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { templateName: string }]
}>()

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emits('update:modelValue', val)
  }
})

const formRef = ref({})
const formRules = ref({})
const formData = reactive({ templateName: '' })

// 保存按钮
const handleSave = () => {
  formRef.value.validate().then((valid) => {
    if (valid) {
      emits('save', { templateName: formData.templateName })
    }
  })
}

// 取消按钮
const handleCancel = () => {
  dialogVisible.value = false
}

// 关闭弹窗
const handleClose = () => {
  formData.templateName = ''
  dialogVisible.value = false
}

onMounted(() => {
  nextTick(() => {
    proxy.setFormRules(formRef.value, formRules, formData)
  })
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>

