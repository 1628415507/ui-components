<template>
  <el-dialog title="new" append-to-body v-model="dialogVisible" width="350" draggable align-center>
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      :inline-message="true"
      class="show-message-default"
      @submit.prevent
    >
      <el-row :gutter="15" style="height: 100px">
        <el-col :span="22">
          <el-form-item label="labelName">
            <el-input
              ref="labelNameRef"
              v-model="formData.layoutName"
              v-uppercase
              placeholder=""
              clearable
              @keyup.enter="handleConfirm"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex-c">
      <el-button type="primary" @click="handleConfirm" style="width: 50px" :disabled="loading">OK</el-button>
      <el-button type="primary" @click="handleCancel">cancel</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, getCurrentInstance } from 'vue'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogVisible = computed({
  get(): boolean {
    return props.modelValue
  },
  set(val: boolean): void {
    emit('update:modelValue', val)
  }
})

const { proxy } = getCurrentInstance()

const formRef = ref()

const formData = reactive({
  layoutName: ''
})

const rules = computed(() => ({
  layoutName: [
    {
      required: true,
      message: proxy.$t('vxeTable.labelNameRequired'),
      trigger: ['blur', 'change']
    },
    {
      max: 200,
      message: proxy.$t('rules.richLength', {
        label: proxy.$t('vxeTable.labelName'),
        maxLength: 200
      }),
      trigger: ['blur', 'change']
    }
  ]
}))

function handleConfirm() {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', formData.layoutName)
    }
  })
}

function handleCancel() {
  dialogVisible.value = false
  emit('cancel')
}

const labelNameRef = ref()

onMounted(() => {
  setTimeout(() => {
    labelNameRef.value?.focus()
  }, 0)
})
</script>

<style lang="scss" scoped>
.flex-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
