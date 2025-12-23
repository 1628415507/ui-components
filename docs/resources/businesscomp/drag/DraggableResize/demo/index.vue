<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form ref="mainOrderTabRef" :model="orderData" :rules="orderDataRules" :disabled="dragConfig.isEditing"
      label-position="top">
      <z-info-card :header="'基本信息'" class="mt-10">
        <DragElement groupName="mainOrderTab" moduleId="basicInfoCard" :config="dragConfig" :formRef="mainOrderTabRef"
          :formValue="orderData" :formRules="orderDataRules" :componentParams="componentParams">
          <template #aforder_mawbNo="{ element }">
            主单号插槽
          </template>
        </DragElement>
      </z-info-card>
      <!--:disabled="dragConfig.isEditing" 编辑状态禁用表单操作 -->
      <DragModule groupName="mainOrderTab" :config="dragConfig">
        <!-- #cargoInfoId:插槽名称对应moduleId -->
        <template #cargoInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement groupName="mainOrderTab" moduleId="cargoInfoId" :config="dragConfig" :formRef="mainOrderTabRef"
              :formValue="orderData" :formRules="orderDataRules">
              <!-- 嵌套的插槽內容 -->
              <template #cargoInfo_right="{ element }">
                <!-- 自定义右侧货物信息内容 -->
                自定义右侧货物信息内容
              </template>
            </DragElement>
          </z-info-card>
        </template>
        <!-- 航班信息模块 -->
        <template #flightInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement groupName="mainOrderTab" moduleId="flightInfoId" :config="dragConfig"
              :formRef="mainOrderTabRef" :formValue="orderData" :formRules="orderDataRules"
              :componentParams="componentParams" />
          </z-info-card>
        </template>
        <template #shippingInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement groupName="mainOrderTab" moduleId="shippingInfoId" :config="dragConfig"
              :formRef="mainOrderTabRef" :formValue="orderData" :formRules="orderDataRules" />
          </z-info-card>
        </template>
        <template #remarkInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement groupName="mainOrderTab" moduleId="remarkInfoId" :config="dragConfig"
              :formRef="mainOrderTabRef" :formValue="orderData" :formRules="orderDataRules" />
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
// import GInfoCard from '@/components/GInfoCard/index.vue'
import { getModuleList } from './moduleListConfig.ts'

const { proxy } = getCurrentInstance()

// 表单数据(支持嵌套对象结构)
const orderData = reactive({
  afOrder: {
    mawbNo: '',
    isUseMawbList: false,
    custBizNo: ''
  },
  airCargoPreM: {
    packs: 0,
    weight: 0
  }
})

// 表单验证规则
const orderDataRules = ref({})
const mainOrderTabRef = ref(null)
const activeTab = ref('mainOrderTab')
// 组件参数:传递给自定义组件和配置函数的公共参数
const componentParams = reactive({
  orderData,
  readOnlyPage: false,
  openMawbDialog: () => {
    console.log('%c [ openMawbDialog ]-72', 'font-size:13px; background:pink; color:#bf2c9f;',)
    /*打开主单号选择弹窗 */
  },
  selectCarrier: (val) => {
    /* 航司选择回调 */
  }
})

// 拖拽配置
const dragConfig = reactive({
  activeGroupName: 'mainOrderTab', //当前活动的拖拽组名称
  groupInfo: {} // 所有拖拽组的配置信息
})

// 主单Tab配置
const mainOrderTabConfig = reactive({
  groupName: 'mainOrderTab',
  moduleList: computed(() => getModuleList(componentParams))
})

dragConfig.groupInfo.mainOrderTab = mainOrderTabConfig
console.log('%c [ mainOrderTabConfig ]-86', 'font-size:13px; background:pink; color:#bf2c9f;', mainOrderTabConfig)

// Tab切换时更新activeGroupName
function handleTabChange(val) {
  dragConfig.activeGroupName = val
}

// 监听activeTab变化,同步更新dragConfig
watch(activeTab, (val) => {
  dragConfig.activeGroupName = val
})

onMounted(async () => {
  // 初始化moduleList
  mainOrderTabConfig.moduleList = computed(() => getModuleList(componentParams))
  await nextTick(() => {
    // proxy?.setFormRules(mainOrderTabRef.value, orderDataRules, orderData)
  })
})
</script>

<style lang="scss" scoped></style>
