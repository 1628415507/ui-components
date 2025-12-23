<!-- 模版授权 -->
<template>
  <el-dialog
    v-model="visible"
    title="模版授权"
    width="460px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="template-authorization-dialog"
  >
    <el-form ref="formRef" :model="formData" label-width="120px" label-position="top">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="选择模版" prop="template">
            <el-select
              v-model="formData.template"
              value-key="mdInterfaceTemplateId"
              placeholder="请选择模版"
              class="template-select"
              @change="changeTemplate"
            >
              <el-option
                v-for="temp in curLayoutTemplatesList"
                :key="temp.mdInterfaceTemplateId"
                :label="temp.templateName"
                :value="temp"
              >
                <div class="flex-sc custom-option">
                  <span v-if="temp.level == TEMP_TYPE.TENANT" class="template-type tenant">租户</span>
                  <span v-else class="template-type user">用户</span>
                  <EditLabel
                    v-model.trim="temp.templateName"
                    trigger="icon"
                    class="option-label"
                    :readonly="tempDisabled(temp)"
                    @change.self="(editing) => handleEdit(temp)"
                  />
                  <el-icon v-if="!tempDisabled(temp)" @click.stop="handleDelete(temp)">
                    <Delete />
                  </el-icon>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 租户显示 -->
        <el-col :span="24" class="authorization-content">
          <el-form-item label="选择授权层级" prop="authorizationLevels">
            <!-- 租户显示 -->
            <SearchTree
              v-show="formData.template.level == TEMP_TYPE.USER"
              ref="treeRef"
              :data="treeDataList"
              :check-strictly="true"
              :default-expand-all="false"
              :show-checkbox="true"
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="defaultExpandedKeys"
            />
            <!-- 系统显示 -->
            <div v-show="formData.template.level == TEMP_TYPE.TENANT">
              <vxe-table-pro
                id="templateAuthorizationTable"
                ref="tableRef"
                :data="tableData"
                :loading="loading"
                :height="245"
                :checkbox-config="{ checkRowKeys: checkedRowKeys }"
                :row-config="{ keyField: 'tenantCode' }"
              >
                <!-- <vxe-column field="tenantCode" title="tenantCode" /> -->
                <vxe-column field="companyName" title="公司名称" />
              </vxe-table-pro>
              <div class="page-pagination" style="margin-top: 8px">
                <GPagination
                  :total="pageInfo.totalNum"
                  v-model:page="pageInfo.currentPage"
                  v-model:limit="pageInfo.pageSize"
                  @pagination="getTableData"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider class="divider" />
    <template #footer>
      <div class="dialog-buttons">
        <el-button type="primary" @click="handleApply">应用</el-button>
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
import SearchTree from '../../tree/searchTree.vue'
// import { getSysCorpTree } from '@/api/system/organize-manage/corp.ts'
// import { arrToTree } from '@/utils/format'
// import EditLabel from '@/components/EditLabel/EditLabel.vue'
import useTemplate from './utils/useTemplate'
const templateUtils = new useTemplate({} as any, '')
const { proxy } = getCurrentInstance()

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
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'apply', 'cancel', 'edit', 'delete'])

const tempDisabled = (temp) => {
  const { roleType } = props
  return !(roleType === ROLE_TYPE.SYSTEM || (roleType === ROLE_TYPE.TENANT && temp.level === TEMP_TYPE.USER))
}

const curLayoutTemplatesList = computed(() => {
  const { roleType, layoutTemplatesList } = props
  if (roleType === ROLE_TYPE.TENANT) {
    return layoutTemplatesList.filter((it) => it.level !== TEMP_TYPE.TENANT)
  }
  return props.layoutTemplatesList
})

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref()
const formData = reactive({
  template: {},
  authorizationLevels: []
})

const keyProp = computed(() => {
  return formData.template.level === TEMP_TYPE.TENANT ? 'tenantCode' : 'id'
})

const nameProp = computed(() => {
  return formData.template.level === TEMP_TYPE.TENANT ? 'companyName' : 'name'
})

// ----- 树 Start
const rootPid = -1
const treeRef = ref()
const defaultCheckedKeys = ref([])
const defaultExpandedKeys = ref([])
const treeDataList = ref([])

// 获取树的数据
const getTreeData = async () => {
  // getSysCorpTree().then((res) => {
  //   // 将扁平化数据转换为树形结构
  //   const data = res.result
  //   const mapData = data.map((item) => {
  //     if (!item.pid) {
  //       item.pid = rootPid
  //     }
  //     return item
  //   })
  //   treeDataList.value = arrToTree(mapData, rootPid)
  // })
}

// 表格 Start
const tableRef = ref()
const tableData = ref([])
const loading = ref(false)
let $table
const pageInfo = ref({
  totalNum: 50,
  currentPage: 1,
  pageSize: 20
})

// 获取树的数据
const getTableData = () => {
  loading.value = true
  templateUtils
    .getTenant()
    .then((res) => {
      const _res = res.pageResult
      tableData.value = _res.records || []
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const subscribeOfficeItems = ref([])
const subscribeOffices = ref([])
const checkedRowKeys = ref([])

const changeTemplate = (temp) => {
  templateUtils.getSubscribesByTemplateId(temp.mdInterfaceTemplateId).then((res) => {
    subscribeOfficeItems.value = res
    subscribeOffices.value = res.map((it) => it.subscribeOffice)
    // console.log('subscribeOffices:', subscribeOffices.value)
    checkedRowKeys.value = []
    if (temp.level === TEMP_TYPE.TENANT) {
      checkedRowKeys.value = subscribeOffices.value
      nextTick(() => {
        $table?.clearCheckboxRow() // 清空所有勾选
        if (subscribeOffices.value.length > 0) {
          $table.setCheckboxRowKey(subscribeOffices.value, true) // 重新设置勾选状态
        }
      })
    } else {
      treeRef.value?.resetTreeState()
      treeRef.value.setCheckedKeys(subscribeOffices.value)
    }
  })
}

const curCheckedItems = computed(() => {
  if (formData.template.level === TEMP_TYPE.TENANT) {
    return $table.getCheckedRows()
  } else {
    return treeRef.value?.getCheckedNodes()
  }
})

// 删除的授权ID
const deletedIds = computed(() => {
  const curCheckedKeys = curCheckedItems.value.map((it) => it[keyProp.value])
  // 获取subscribeOfficeItems中在curCheckedKeys中不存在的数据
  const delIds = subscribeOfficeItems.value
    .filter((it) => !curCheckedKeys.includes(it.subscribeOffice))
    .map((it) => it.mdInterfaceTemplateSubscribeId)
  return delIds
})

// 新增的授权ID
const addList = computed(() => {
  const checkedNodes = curCheckedItems.value
  // 获取checkedNodes中在subscribeOffices中不存在的数据
  const newCheckedKeys = checkedNodes
    .filter((node) => !subscribeOffices.value.includes(node[keyProp.value]))
    .map((it) => {
      return {
        mdInterfaceTemplateId: formData.template.mdInterfaceTemplateId, // 模板 ID
        subscribeOffice: it[keyProp.value], // 授权 ID (租户编码或公司 ID)
        subscribeOfficeName: it[nameProp.value], // 授权名称
        templateType: formData.template.templateType, // 模板类型
        level: formData.template.level // 授权级别
      }
    })
  return newCheckedKeys
})

const handleApply = () => {
  // 获取树的勾选数据
  if (!curCheckedItems.value.length) {
    ElMessage.warning('请选择授权层级')
    return
  }
  templateUtils
    .saveSubscribes({
      deletedIds: deletedIds.value, // 要删除的授权关系ID列表
      addList: addList.value
    })
    .then((res) => {
      ElMessage.success('授权成功')
      changeTemplate(formData.template)
    })
}

// 处理编辑模版
const handleEdit = (template) => {
  // 关闭弹框
  visible.value = false
  emit('edit', template)
}

// 处理删除模版
const handleDelete = async (template) => {
  emit('delete', template)
}

watch(
  () => props.activeTemplate,
  (newVal) => {
    if (newVal) {
      formData.template = newVal
    }
  },
  {
    deep: true
  }
)

onMounted(async () => {
  getTreeData()
  getTableData()
  if (props.activeTemplate) {
    formData.template = props.activeTemplate
    changeTemplate(props.activeTemplate)
  }
  await nextTick()
  // 直接获取已经扩展的表格实例
  $table = tableRef.value.getTable()
})
</script>

<style lang="scss" scoped>
.template-authorization-dialog {
  .dialog-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

.divider {
  margin: 5px 0;
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

::v-deep .el-tree_empty-text {
  position: unset;
}

.authorization-content {
  height: 310px;
  overflow-y: auto;
}
</style>
