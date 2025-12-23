<!-- 模版切换 -->
<template>
  <el-dialog
    v-model="visible"
    title="切换模板"
    width="300px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="switch-template-dialog"
  >
    <el-form ref="formRef" :model="formData" label-width="120px" label-position="top">
      <el-form-item label="选择模版" prop="template">
        <el-select
          v-model="formData.template"
          value-key="mdInterfaceTemplateId"
          placeholder="请选择模版"
          class="template-select"
        >
          <el-option
            v-for="temp in layoutTemplatesList"
            :key="temp.mdInterfaceTemplateId"
            :label="temp.templateName"
            :value="temp"
          >
            <div class="flex-sc custom-option">
              <span v-if="temp.level == TEMP_TYPE.SYSTEM" class="template-type tenant">系统</span>
              <span v-else-if="temp.level == TEMP_TYPE.TENANT" class="template-type tenant">租户</span>
              <span v-else class="template-type user">用户</span>
              <ZEditLabel
                v-model.trim="temp.templateName"
                trigger="icon"
                class="option-label"
                :readonly="tempDisabled(temp)"
                @change.self="handleEdit(temp)"
              />
              <el-icon v-if="!tempDisabled(temp)" @click.stop="handleDelete(temp)">
                <Delete />
              </el-icon>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-buttons">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ROLE_TYPE, TEMP_TYPE } from './type/SystemEnum.ts'
import { ref, reactive, computed, watch, nextTick, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
// import EditLabel from '@/components/EditLabel/EditLabel.vue'

const { proxy } = getCurrentInstance()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  roleType: {
    type: String,
    default: ''
  },
  layoutTemplatesList: {
    type: Array,
    default: () => []
  },
  activeTemplate: {
    type: Object,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'edit', 'delete'])

const tempDisabled = (temp) => {
  const { roleType } = props
  return !(roleType === ROLE_TYPE.SYSTEM || (roleType === ROLE_TYPE.TENANT && temp.level === TEMP_TYPE.USER))
}

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref()
const formData = reactive({
  template: {},
  authorizationLevels: []
})

// 处理编辑模版
const handleEdit = (template) => {
  // 关闭弹框
  emit('edit', template)
}

const handleConfirm = () => {
  if (!formData.template) {
    ElMessage.warning('请选择模板')
    return
  }
  emit('confirm', formData.template)
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// 处理删除模版
const handleDelete = async (template) => {
  emit('delete', template)
}

watch(
  () => props.activeTemplate,
  (newVal) => {
    console.log('newVal', newVal)
    if (newVal) {
      formData.template = newVal
    }
  },
  { deep: true }
)

onMounted(async () => {
  console.log('props.activeTemplate', props.activeTemplate)
  if (props.activeTemplate) {
    formData.template = props.activeTemplate
  }
  // 直接获取已经扩展的表格实例
})
</script>

<style lang="scss" scoped>
.switch-template-dialog {
  .dialog-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

.custom-option {
  width: 100%;
}

.option-label {
  flex: 1;
  // max-width: 100px; //大约10个汉字的宽度
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
  max-width: calc(100% - 20px);
}

.option-actions {
  display: flex;
}

.template-type {
  padding: 0 4px;
  line-height: 20px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 20;
  margin-right: 4px;
  box-sizing: border-box;

  &.user {
    background-color: #eff8f8;
    color: #3fa9a8;
    border: 1px solid #b1dbda;
  }

  &.tenant {
    background-color: #eef7ff;
    color: #2a82e4;
    border: 1px solid #beddff;
  }
}
</style>

