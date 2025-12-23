<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form
      ref="dragFormRef"
      :model="formData"
      :rules="formDataRules"
      :disabled="dragConfig.isEditing"
      label-position="top"
    >
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="配置1" :name="GROUPNAME.MAIN" />
        <el-tab-pane label="配置2" :name="GROUPNAME.SECOND" />
      </el-tabs>
      <!-- 拖拽组1 -->
      <div v-show="activeTab === GROUPNAME.MAIN">
        <z-info-card :header="'基本信息'" class="mt-10">
          <DragElement
            :groupName="GROUPNAME.MAIN"
            moduleId="basicInfoCard"
            :config="dragConfig"
            :formRef="dragFormRef"
            :formValue="formData"
            :formRules="formDataRules"
            :componentParams="componentParams"
          >
            <template #aforder_mawbNo="{ element }">主单号插槽</template>
          </DragElement>
        </z-info-card>
        <!--:disabled="dragConfig.isEditing" 编辑状态禁用表单操作 -->
        <DragModule :groupName="GROUPNAME.MAIN" :config="dragConfig">
          <!-- #cargoInfoId:插槽名称对应moduleId -->
          <template #cargoInfoId="{ element: moduleEl }">
            <z-info-card :header="moduleEl.title" class="mt-10">
              <DragElement
                :groupName="GROUPNAME.MAIN"
                moduleId="cargoInfoId"
                :config="dragConfig"
                :formRef="dragFormRef"
                :formValue="formData"
                :formRules="formDataRules"
              >
                <!-- 嵌套的插槽內容 -->
                <template #cargoInfo_right="{ element }">
                  <!-- 自定义右侧信息内容 -->
                  插槽-自定义右侧信息内容
                </template>
              </DragElement>
            </z-info-card>
          </template>
          <!-- 航班信息模块 -->
          <template #flightInfoId="{ element: moduleEl }">
            <z-info-card :header="moduleEl.title" class="mt-10">
              <DragElement
                :groupName="GROUPNAME.MAIN"
                moduleId="flightInfoId"
                :config="dragConfig"
                :formRef="dragFormRef"
                :formValue="formData"
                :formRules="formDataRules"
                :componentParams="componentParams"
              />
            </z-info-card>
          </template>
          <template #shippingInfoId="{ element: moduleEl }">
            <z-info-card :header="moduleEl.title" class="mt-10">
              <DragElement
                :groupName="GROUPNAME.MAIN"
                moduleId="shippingInfoId"
                :config="dragConfig"
                :formRef="dragFormRef"
                :formValue="formData"
                :formRules="formDataRules"
              />
            </z-info-card>
          </template>
          <template #remarkInfoId="{ element: moduleEl }">
            <z-info-card :header="moduleEl.title" class="mt-10">
              <DragElement
                :groupName="GROUPNAME.MAIN"
                moduleId="remarkInfoId"
                :config="dragConfig"
                :formRef="dragFormRef"
                :formValue="formData"
                :formRules="formDataRules"
              />
            </z-info-card>
          </template>
        </DragModule>
      </div>
      <!-- 拖拽组2 -->
      <DragModule v-show="activeTab === GROUPNAME.SECOND" :groupName="GROUPNAME.SECOND" :config="dragConfig">
        <template #baseInfoCard="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement
              :groupName="GROUPNAME.SECOND"
              moduleId="baseInfoCard"
              :config="dragConfig"
              :formRef="dragFormRef"
              :formValue="formData"
              :formRules="formDataRules"
            ></DragElement>
          </z-info-card>
        </template>
      </DragModule>
    </el-form>
  </DraggableResizeControl>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick, getCurrentInstance, watch } from 'vue'
import DraggableResizeControl from '../index.vue'
import DragModule from '../DragModule.vue'
import DragElement from '../DragElement.vue'
import { getModuleList } from './mainConfig.ts'
import { getModuleList as getModuleListSecond } from './secondConfig.ts'

const GROUPNAME = {
  MAIN: 'mainGroupName',
  SECOND: 'secondGroupName'
}

const { proxy } = getCurrentInstance()

// 表单数据(支持嵌套对象结构)
const formData = reactive({})

// 表单验证规则
const formDataRules = ref({})
const dragFormRef = ref(null)
const activeTab = ref(GROUPNAME.MAIN)
// 组件参数:传递给自定义组件和配置函数的公共参数
const componentParams = reactive({
  GROUPNAME,
  formData,
  readOnlyPage: false,
  openMawbDialog: () => {
    console.log('%c [ openMawbDialog ]-72', 'font-size:13px; background:pink; color:#bf2c9f;')
  },
  selectCarrier: (val) => {
    /* 航司选择回调 */
  }
})

// 拖拽配置
const dragConfig = reactive({
  activeGroupName: GROUPNAME.MAIN, //当前活动的拖拽组名称
  groupInfo: {} // 所有拖拽组的配置信息
})

// 主单Tab配置
const mainGroupNameConfig = reactive({
  groupName: GROUPNAME.MAIN,
  moduleList: computed(() => getModuleList(componentParams))
})
dragConfig.groupInfo[GROUPNAME.MAIN] = mainGroupNameConfig
// 分单Tab配置
const secondGroupNameConfig = reactive({
  groupName: GROUPNAME.SECOND,
  moduleList: computed(() => getModuleListSecond(componentParams))
})
dragConfig.groupInfo[GROUPNAME.SECOND] = secondGroupNameConfig

// 监听activeTab变化,同步更新dragConfig的activeGroupName
watch(activeTab, (val) => {
  dragConfig.activeGroupName = val
})

onMounted(async () => {
  // 初始化moduleList
  await nextTick(() => {
    mainGroupNameConfig.moduleList = computed(() => getModuleList(componentParams))
    secondGroupNameConfig.moduleList = computed(() => getModuleListSecond(componentParams))
    // proxy?.setFormRules(dragFormRef.value, formDataRules, formData)
  })
})
</script>

<style lang="scss" scoped></style>
