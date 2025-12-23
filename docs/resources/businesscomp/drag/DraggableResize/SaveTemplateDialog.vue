<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="保存模板"
      width="300px"
      align-center
      :close-on-click-modal="false"
      :show-close="false"
      @close="handleClose"
      center
    >
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSave" :disabled="saveDisabled">保存</el-button>
          <el-button @click="handleSaveAs">另存为</el-button>
          <el-button @click="handleCancel">退出</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 另存模版 -->
    <SaveTemplateAsDialog v-if="saveAsDialogVisible" v-model="saveAsDialogVisible" @save="onSaveAs" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ROLE_TYPE, TEMP_TYPE } from './type/SystemEnum.ts'
import SaveTemplateAsDialog from './SaveTemplateAsDialog.vue'

const props = defineProps<{
  modelValue: boolean
  roleType: String
  layoutTemplates: object
  activeTemplate: Object
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  save: []
  saveAs: [name: string]
}>()

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emits('update:modelValue', val)
  }
})

const saveAsDialogVisible = ref(false)

const saveDisabled = computed(() => {
  if (props.activeTemplate.level === TEMP_TYPE.SYSTEM) {
    return true
  }
  const { userLevelTemplates, tenantLevelTemplates } = props.layoutTemplates as any
  if (props.roleType === ROLE_TYPE.SYSTEM) {
    return !tenantLevelTemplates.length
  } else if (props.roleType === ROLE_TYPE.TENANT && props.activeTemplate.level === TEMP_TYPE.TENANT) {
    return true
  } else {
    return !userLevelTemplates.length
  }
})

// 保存按钮
const handleSave = () => {
  emits('save')
}

// 另存为按钮
const handleSaveAs = () => {
  saveAsDialogVisible.value = true
}

// 退出按钮
const handleCancel = () => {
  dialogVisible.value = false
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
}

// 弹窗2保存按钮回调
const onSaveAs = (data: { templateName: string }) => {
  emits('saveAs', data.templateName)
  saveAsDialogVisible.value = false
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>

